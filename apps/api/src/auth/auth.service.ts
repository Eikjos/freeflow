import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { AuthResponseData } from '@repo/shared-types';
import * as bcrypt from 'bcrypt';
import CustomerService from 'customers/customer.service';
import { CustomerDto } from 'dtos/customers/customer.dto';
import EnterpriseDto from 'dtos/enterprises/enterprise.dto';
import EnterpriseService from 'enterprises/enterprise.service';
import SalesService from 'sales/sales.service';
import UserService from 'users/user.service';

@Injectable()
export default class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => EnterpriseService))
    private readonly enterpriseService: EnterpriseService,
    private readonly customerService: CustomerService,
    private readonly jwtService: JwtService,
    private readonly salesService: SalesService,
  ) {}

  // --

  public async signIn(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException('credentials.invalid', {
        description: 'credentials.invalid',
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('credentials.invalid', {
        description: 'credentials.invalid',
      });
    }
    return this.generateToken(user);
  }

  public async logout(userId: number) {
    return this.userService.udpateRefreshToken(userId, null);
  }

  public async refresh(userId: number, refreshToken: string) {
    const user = await this.userService.findUserById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('access.denied');
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('access.denied');

    return this.generateToken(user);
  }

  public async generateToken(user: User): Promise<AuthResponseData> {
    const payload = {
      sub: user.id,
      enterpriseId: user.enterpriseId,
      isEnterprise: user.isEnterprise,
      isCustomer: user.isCustomer,
      customerId: user.customerId,
    };

    const access_token = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    this.userService.udpateRefreshToken(user.id, refreshToken);

    let sales: number;
    let enterprise: EnterpriseDto;
    let customer: CustomerDto;

    if (user.isEnterprise && user.enterpriseId) {
      enterprise = await this.enterpriseService.findById(user.enterpriseId);
      sales = (await this.salesService.getCurrentSales(user.enterpriseId)) ?? 0;
    } else if (user.isCustomer) {
      customer = await this.customerService.findById(user.customerId);
    }

    return {
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.isEnterprise ? 'enterprise' : 'customer',
      enterpriseId: enterprise?.id,
      enterpriseName: enterprise?.name,
      customerId: customer?.id,
      customerName: customer?.name,
      sales: sales,
      access_token,
      refreshToken,
    };
  }
}
