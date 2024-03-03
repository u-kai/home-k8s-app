import { List } from "@mui/material";
import { Box, Container } from "@mui/system";
import React, { useContext, useEffect } from "react";
import { AppErrorContext } from "../../../contexts/error";
import { isFailed } from "../../../fetch";
import { useWordBook } from "../../../hooks/useWordBooks";
import { WordAndSentences } from "./Items/WordAndSentences";

export const ListContainer = () => {
  const { wordbook, fetchAll } = useWordBook();
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

  return (
    <Container>
      <Box
        sx={{
          height: 500,
          overflowY: "scroll",
        }}
      >
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {wordbook !== undefined ? (
            <>
              {wordbook.map((wordProfile, i) => (
                <WordAndSentences key={i} wordProfile={wordProfile} />
              ))}
            </>
          ) : null}
        </List>
      </Box>
    </Container>
  );
};
