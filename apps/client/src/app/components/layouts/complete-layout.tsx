import Footer from "@components/templates/footer";
import Header from "@components/templates/header";
import { ReactNode } from "react";

const CompleteLayoutWithoutSideBar = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <>
      <Header />
      <div className="min-h-[calc(100vh-135px)]">{children}</div>
      <Footer />
    </>
  );
};

export default CompleteLayoutWithoutSideBar;
