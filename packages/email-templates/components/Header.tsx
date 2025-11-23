import { Img } from "@react-email/components";

export default function Header() {
  return (
    <div className="w-11/12 mx-auto px-4 py-2 bg-card flex flex-row items-center gap-4 mt-5 rounded-lg">
      <Img src="http://localhost:3000/assets/freeflow.png" width="50" height="50" />
      <span className="text-4xl font-amica font-semibold">Freeflow</span>
    </div>
  )
}