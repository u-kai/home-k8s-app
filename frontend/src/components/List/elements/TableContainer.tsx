import {
  List,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Box, Container } from "@mui/system";
import React, { useContext, useEffect } from "react";
import { AppErrorContext } from "../../../contexts/error";
import { isFailed } from "../../../fetch";
import { useWordBook } from "../../../hooks/useWordBooks";
import { WordAndSentences } from "./Items/WordAndSentences";
import Table from "@mui/material/Table";
import { Grid } from "@aws-amplify/ui-react";
import { Rates } from "./Items/Rates";

export const TableList = () => {
  const { wordbook, fetchAll, deleteWordProfile } = useWordBook();
  const { setAppError } = useContext(AppErrorContext);
  useEffect(() => {
    (async () => {
      const result = await fetchAll();
      if (isFailed(result)) {
        setAppError({
          id: "fetchAll",
          name: "fetchAll",
          message: "error in fetchAll" + result.message,
        });
        return;
      }
    })();
  }, []);

  const columns = [
    { field: "word", headerName: "Word", width: 300 },
    { field: "meaning", headerName: "Meaning", width: 300 },
    {
      field: "rates",
      headerName: "Rates",
      width: 100,
      renderCell: () => (
        <Grid justifyContent="center" alignItems="center">
          <Rates onChange={async () => console.log("")} rate="normal"></Rates>;
        </Grid>
      ),
    },
  ];
  //const rows

  return <></>;
};
