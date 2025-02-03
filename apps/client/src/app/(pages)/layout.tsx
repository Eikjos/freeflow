import Footer from "@components/templates/footer";
import Header from "@components/templates/header";
import "../globals.css";

export default async function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="min-h-[calc(100vh-170px)]">{children}</div>
      <Footer className="mt-20" />
    </>
  );
}
