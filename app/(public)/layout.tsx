import Footer from "@/components/layout/footer";
import NavBar from "@/components/layout/nav-bar";
import React, { PropsWithChildren } from "react";

const PublicLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="w-full h-screen overflow-y-auto">
      <NavBar />
      <main className="w-full pt-16 lg:pt-32">{children}</main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
