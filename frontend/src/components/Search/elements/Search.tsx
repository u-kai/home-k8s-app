import React, { useEffect } from "react";
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
  const { getSuggestions } = useWordBook();
  const suggestions = getSuggestions(value);
  useEffect(() => {
    if (suggestions.length > 0) {
      setOpen(true);
    }
  }, [value]);

  const searchBarWidth = 500;
  return (
    <div>
      <Paper
        component="form"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: searchBarWidth,
          height: 50,
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1, height: 100 }}
          placeholder="Search Words"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
          <SearchIcon />
        </IconButton>
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      </Paper>
      <SuggestionContainer width={searchBarWidth}>
        {suggestions.map((suggestion) => (
          <Suggestion>{suggestion.value}</Suggestion>
        ))}
      </SuggestionContainer>
    </div>
  );
};

const Suggestion = styled.div`
  padding: 10px;
  &:hover {
    background-color: #f0f0f0;
  }
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
