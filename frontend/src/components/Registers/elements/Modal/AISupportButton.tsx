import { CircularProgress } from "@mui/material";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import React from "react";

export type AISupportButtonProps = {
  handleClick: () => Promise<void>;
  toggleAiProgress: (to: boolean) => void;
  aiProgress: boolean;
};
export const AISupportButton = (props: AISupportButtonProps) => {
  return (
    <>
      {props.aiProgress ? (
        <CircularProgress />
      ) : (
        <SupportAgentIcon
          sx={{
            cursor: "pointer",
            ":hover": {
              opacity: 0.5,
            },
          }}
          fontSize="large"
          onClick={async () => {
            props.toggleAiProgress(true);
            props.handleClick().then(() => props.toggleAiProgress(false));
          }}
        />
      )}
    </>
  );
};
