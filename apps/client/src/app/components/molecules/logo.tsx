import { Url } from 'next/dist/shared/lib/router/router'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '../../../lib/utils'

type LogoProps = {
  className?: string
  href?: Url
}

export default function Logo({ className, href }: LogoProps) {
  return (
    <Link
      href={href ?? '/'}
      className={cn(
        'flex flew-row gap-4 justify-center items-center',
        className,
      )}
    >
      <Image
        src="/assets/freeflow.png"
        width={55}
        height={55}
        alt="freeflow logo"
      />
      <span className="font-amica text-5xl">Freeflow</span>
    </Link>
  )
}
