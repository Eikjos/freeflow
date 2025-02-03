import "../../globals.css";

export default async function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="min-h-[calc(100vh-170px)]">{children}</div>
    </>
  );
}
