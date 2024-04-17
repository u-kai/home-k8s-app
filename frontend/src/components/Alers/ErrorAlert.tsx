import { Alert, AlertTitle } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { AppErrorContext } from "../../contexts/error";

type Props = {
  timeOut: number;
  errorMessage?: string;
};

export const ErrorAlert = (props: Props) => {
  const { appError, setAppError } = useContext(AppErrorContext);
  useEffect(() => {
    if (appError !== undefined) {
      setTimeout(() => {
        setAppError(undefined);
      }, props.timeOut);
    }
  }, [appError, setAppError]);

  return (
    <>
      {appError !== undefined ? (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {props.errorMessage ?? appError.message}
        </Alert>
      ) : null}
    </>
  );
};
