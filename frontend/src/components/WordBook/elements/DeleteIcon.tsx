import React from "react";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export type DeleteIconProps = {
  handleDelete: () => void;
};

export const DeleteIcon = (props: DeleteIconProps) => {
  return (
    <DeleteForeverIcon
      fontSize="large"
      sx={{
        cursor: "pointer",
        marginLeft: "20px",
        ":hover": {
          opacity: 0.5,
        },
      }}
      onClick={() => {
        props.handleDelete();
      }}
    />
  );
};
