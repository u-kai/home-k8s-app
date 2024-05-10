import React, { createRef, useEffect, useRef, useState } from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { Box } from "@mui/system";

export type SearchBarProps = {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  search: (value: string) => void;
  keyDown?: (event: React.KeyboardEvent) => void;
};

export const SearchBar = (props: SearchBarProps) => {
  const placeholder = props.placeholder || "Search word...";
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        height: 50,
        paddingY: 2,
      }}
    >
      <Paper
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          height: 50,
          position: "relative",
          flexGrow: 1,
          flexShrink: 1,
        }}
      >
        <InputBase
          sx={{
            ml: 1,
            height: 50,
            zIndex: 2,
            flexGrow: 1,
            flexShrink: 1,
          }}
          placeholder={placeholder}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          onKeyDown={props.keyDown}
          type="text"
        />
        <IconButton aria-label="search">
          <SearchIcon />
        </IconButton>
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      </Paper>
    </Box>
  );
};
