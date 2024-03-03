import React, { createRef, useEffect, useRef, useState } from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { useWordBook } from "../../../hooks/useWordBooks";
import { styled } from "styled-components";
import { Box } from "@mui/system";

export const SearchBar = () => {
  const [value, setValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [focusIndex, setFocusIndex] = React.useState(0);
  const { getSuggestions, wordToTop } = useWordBook();
  const suggestions = getSuggestions(value);
  useEffect(() => {
    if (suggestions.length > 0) {
      setOpen(true);
    }
  }, [value]);

  const decideSuggestion = (index: number) => {
    wordToTop(suggestions[index].wordId);
    setValue("");
    setOpen(false);
  };
  const keyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      setFocusIndex((prev) => (prev + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      setFocusIndex(
        (prev) => (prev - 1 + suggestions.length) % suggestions.length
      );
    } else if (event.key === "Enter") {
      decideSuggestion(focusIndex);
    }
    return false;
  };
  // TODO : Fix use CSS
  const BASE_WIDTH = 500;
  const [width, setWidth] = useState(BASE_WIDTH);
  useEffect(() => {
    const willShrink0 = (): boolean => {
      return window.innerWidth < 250;
    };
    const willShrink1 = (): boolean => {
      return window.innerWidth < 320;
    };
    const willShrink2 = (): boolean => {
      return window.innerWidth < 600;
    };
    const willShrink3 = (): boolean => {
      return window.innerWidth < 800;
    };
    const changeWidth = () => {
      if (willShrink0()) {
        setWidth(50);
        return;
      }
      if (willShrink1()) {
        setWidth(150);
        return;
      }
      if (willShrink2()) {
        setWidth(200);
        return;
      }
      if (willShrink3()) {
        setWidth(300);
        return;
      }
      setWidth(BASE_WIDTH);
    };
    window.addEventListener("resize", () => {
      changeWidth();
    });
    changeWidth();
  }, []);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        height: 50,
        padding: 2,
        width: width,
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
          placeholder="Search Words"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={keyDown}
          type="text"
        />
        <IconButton aria-label="search">
          <SearchIcon />
        </IconButton>
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      </Paper>
      {open ? (
        <SuggestionContainer width={width}>
          {suggestions.map((suggestion, index) => (
            <Suggestion
              focused={focusIndex === index}
              key={suggestion.wordId}
              onClick={() => decideSuggestion(index)}
            >
              {suggestion.value}
            </Suggestion>
          ))}
        </SuggestionContainer>
      ) : null}
    </Box>
  );
};

const Suggestion = styled.div<{ focused: boolean }>`
  padding: 10px;
  &:hover {
    background-color: #f0f0f0;
  }
  ${(props) => props.focused && "background-color: #f0f0f0;"}
  border-bottom: 1px solid black;
`;

const SuggestionContainer = styled.div<{ width: number }>`
  position: absolute;
  top: 60px;
  width: ${(props) => props.width}px;
  background-color: white;
  z-index: 100;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
`;
