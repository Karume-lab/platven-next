import React, { PropsWithChildren } from "react";
interface Props extends PropsWithChildren {
  sideBar: React.ReactNode;
  reverse?: boolean;
}

const ListLayoutWithSideBar: React.FC<Props> = ({
  children,
  sideBar,
  reverse = false,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 m-2 lg:mx-10 lg:my-5 gap-2">
      {reverse ? (
        <>
          <div className="lg:col-span-3">{children}</div>
          <div className="lg:col-span-1 lg:mr-10 ">{sideBar}</div>
        </>
      ) : (
        <>
          <div className="lg:col-span-1 lg:mr-10 ">{sideBar}</div>
          <div className="lg:col-span-3">{children}</div>
        </>
      )}
    </div>
  );
};

export default ListLayoutWithSideBar;
