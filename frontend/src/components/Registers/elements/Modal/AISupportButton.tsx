import { CircularProgress } from "@mui/material";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import React from "react";

export type AISupportButtonProps = {
  handleClick: () => Promise<void>;
};
export const AISupportButton = (props: AISupportButtonProps) => {
  const [aiProgress, setAiProgress] = React.useState(false);
  return (
    <>
      {aiProgress ? (
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
            setAiProgress(true);
            props.handleClick().then(() => setAiProgress(false));
          }}
        />
      )}
    </>
  );
};
