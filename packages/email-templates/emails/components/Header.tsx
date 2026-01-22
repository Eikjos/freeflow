import { Img } from "@react-email/components";

type HeaderProps = {
  clientUrl: string;
}

export default function Header({ clientUrl } : HeaderProps) {
  return (
    <div className="w-11/12 mx-auto px-4 py-2 bg-card flex flex-row items-center mt-5 rounded-lg">
      <Img src={`${clientUrl}/assets/freeflow.png`} width="50" height="50" />
      <span className="text-4xl font-amica font-semibold ml-4">Freeflow</span>
    </div>
  )
}