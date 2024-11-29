export type LoginData = {
  email: string;
  password: string;
};

export type AuthResponseData = {
  firstName: string;
  lastName: string;
  access_token: string;
  refreshToken: string;
};
