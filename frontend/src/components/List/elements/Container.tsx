import { List } from "@mui/material";
import { Box, Container } from "@mui/system";
import React, { useEffect } from "react";
import { isSuccessful, useWordBook } from "../../../hooks/useWordBooks";
import { WordAndSentences } from "./Items/WordAndSentences";

export const ListContainer = () => {
  const userId = "test-user";
  const { wordbook, fetchAll } = useWordBook();
  useEffect(() => {
    (async () => {
      const result = await fetchAll(userId);
      if (isSuccessful(result)) {
        console.log("success", result);
        return;
      }
      console.error("error", result);
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
                  word={wordProfile.word.value}
                  pronunciation={wordProfile.word.pronunciation}
                  sentences={wordProfile.sentences.map(
                    (sentence) => sentence.sentence.value
                  )}
                  meaning={wordProfile.word.meaning}
                />
              ))}
            </>
          ) : null}
        </List>
      </Box>
    </Container>
  );
};
