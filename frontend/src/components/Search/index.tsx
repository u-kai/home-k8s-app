import { Box } from "@mui/system";
import React from "react";
import { SearchBar } from "./elements/Search";

export const Search = () => {
  return (
    // component want to center position
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        height: 50,
        padding: 2,
      }}
    >
      <SearchBar></SearchBar>
    </Box>
  );
};
