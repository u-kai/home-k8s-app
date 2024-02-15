import React from "react";
import { ButtonAppBar } from "./elements/Header";

type Props = {
  logout: () => Promise<void>;
  children?: React.ReactNode;
};

export const Header = (props: Props) => {
  return <ButtonAppBar logout={props.logout}>{props.children}</ButtonAppBar>;
};
