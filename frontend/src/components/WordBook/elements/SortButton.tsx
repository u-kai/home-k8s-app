import React from "react";
import SortIcon from "@mui/icons-material/Sort";

export type SortButtonProps = {
  onClick: () => void;
};

export const SortButton = (props: SortButtonProps) => {
  return (
    <SortIcon
      fontSize="large"
      cursor="pointer"
      onClick={() => props.onClick()}
    />
  );
};
