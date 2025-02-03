import Logo from "@components/molecules/logo";

export default function Header() {
  return (
    <div className="pl-3 bg-card border-b-2 border-secondary">
      <div className="w-52">
        <Logo />
      </div>
    </div>
  );
}
