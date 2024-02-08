import { List } from "@mui/material";
import { Box, Container } from "@mui/system";
import React from "react";
import { WordAndSentences } from "./Items/WordAndSentences";

export const ListContainer = () => {
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
          {[
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
          ].map((i) => {
            return (
              <WordAndSentences
                key={i}
                word={`Hello World ${i}`}
                pronunciation={`ハローワールド ${1}`}
                sentences={["Hi Hello World", "Humm Hello World"]}
                meaning={"こんにちは世界"}
              />
            );
          })}

          <WordAndSentences
            word={`Hello Worldddddddddddddd `}
            pronunciation={`ハローワールドドドドドドドドドドドドドドドドドドド`}
            sentences={["Hi Hello World", "Humm Hello World"]}
            meaning={`こんにちは世界 `}
          />
        </List>
      </Box>
    </Container>
  );
};
