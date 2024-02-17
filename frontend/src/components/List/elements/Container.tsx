import { List } from "@mui/material";
import { Box, Container } from "@mui/system";
import React, { useContext, useEffect } from "react";
import { AppErrorContext } from "../../../contexts/error";
import { isSuccessful, useWordBook } from "../../../hooks/useWordBooks";
import { WordAndSentences } from "./Items/WordAndSentences";

export const ListContainer = () => {
  const userId = "test-user";
  const { wordbook, fetchAll, deleteWordProfile } = useWordBook();
  const { setAppError } = useContext(AppErrorContext);
  useEffect(() => {
    (async () => {
      const result = await fetchAll(userId).catch((e) => {
        console.error(e);
      });
      if (isSuccessful(result)) {
        console.log("success", result);
        console.log("wordbook", wordbook);
        return;
      }
      setAppError({
        id: "fetchAll",
        name: "fetchAll",
        message: "error in fetchAll" + result.message,
      });
    })();
  }, []);

  return (
    <Container
      sx={{
        padding: 5,
      }}
    >
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
                <WordAndSentences
                  key={i}
                  wordProfile={wordProfile}
                  updateWordProfile={async () => {}}
                  deleteWord={async () => {
                    const result = await deleteWordProfile({
                      userId,
                      wordId: wordProfile.wordId,
                    });
                    if (isSuccessful(result)) {
                      console.log("success", result);
                      return;
                    }
                    console.error("error", result);
                  }}
                />
              ))}
            </>
          ) : null}
        </List>
      </Box>
    </Container>
  );
};
