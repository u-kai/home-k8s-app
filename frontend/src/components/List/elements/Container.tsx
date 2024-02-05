import { List } from "@mui/material";
import { Box, Container } from "@mui/system";
import React from "react";
import { Item } from "./Items/Item";

export const ListContainer = () => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        padding: 5,
      }}
    >
      <Box
        sx={{
          height: 400,
          overflowY: "scroll",
        }}
      >
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {[
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
          ].map((i) => {
            return (
              <Item
                word={`Hello World ${i}`}
                pronunciation={`こんにちは世界 ${1}`}
              />
            );
          })}

          <Item
            word={`Hello Worlddddddddddddddddddddddddddddddddddddddddddddddddd `}
            pronunciation={`こんにちは世界 `}
          />
        </List>
      </Box>
    </Container>
  );
};
