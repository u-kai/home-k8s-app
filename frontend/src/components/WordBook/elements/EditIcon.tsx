import React from "react";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";

export type EditIconProps = {
  handleEdit: () => void;
};

export const EditIcon = (props: EditIconProps) => {
  return (
    <ModeEditOutlineIcon
      fontSize="large"
      sx={{
        cursor: "pointer",
        marginLeft: "20px",
        ":hover": {
          opacity: 0.5,
        },
      }}
      onClick={async () => {
        props.handleEdit();
      }}
    />
  );
};
