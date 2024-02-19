import React, { createRef, useEffect, useRef } from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { MenuItem, Menu } from "@mui/material";
import { useWordBook } from "../../../hooks/useWordBooks";
import { styled } from "styled-components";

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

  const searchBarWidth = 500;
  return (
    <div>
      <Paper
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: searchBarWidth,
          height: 50,
          position: "relative",
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1, height: 50, zIndex: 2 }}
          placeholder="Search Words"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={keyDown}
          type="text"
        />
        <IconButton sx={{ p: "10px" }} aria-label="search">
          <SearchIcon />
        </IconButton>
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      </Paper>
      {open ? (
        <SuggestionContainer width={searchBarWidth}>
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
    </div>
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
