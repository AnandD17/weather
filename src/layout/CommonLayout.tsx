import React from "react";

type Props = {
  children: React.ReactNode;
};

const CommonLayout = (props: Props) => {
  return <div>{props.children}</div>;
};

export default CommonLayout;
