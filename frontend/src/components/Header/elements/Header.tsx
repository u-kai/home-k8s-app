import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { styled } from "styled-components";

type Props = {
  logout: () => Promise<void>;
  children?: React.ReactNode;
};

export const ButtonAppBar = (props: Props) => {
  const [hide, setHide] = React.useState(true);
  const [hideTranslateConfig, setHideTranslateConfig] = React.useState(true);
  const [fucusIndex, setFocusIndex] = React.useState(0);
  const USER_SUGGESTIONS = ["user config", "translate config", "logout"];
  const onClicks: { [key: string]: () => void } = {
    "user config": () => {
      setHide(true);
    },
    "translate config": () => {
      setHideTranslateConfig(!hideTranslateConfig);
      setHide(true);
    },
    logout: async () => {
      await props.logout();
      setHide(true);
    },
  };
  const keyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      console.log("ArrowDown");
      setFocusIndex((prev) => (prev + 1) % USER_SUGGESTIONS.length);
    } else if (event.key === "ArrowUp") {
      setFocusIndex(
        (prev) => (prev - 1 + USER_SUGGESTIONS.length) % USER_SUGGESTIONS.length
      );
    } else if (event.key === "Enter") {
    }
    return false;
  };
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              ELE
            </Typography>
            <AccountCircleIcon
              onClick={() => setHide(!hide)}
              fontSize="large"
              sx={{ cursor: "pointer", flexGrow: 0.1 }}
            />
          </Toolbar>
        </AppBar>
      </Box>
      {!hide ? (
        <SuggestionContainer width={150} onKeyDown={keyDown}>
          {USER_SUGGESTIONS.map((s, index) => (
            <Suggestion key={index} focused={false} onClick={onClicks[s]}>
              {s}
            </Suggestion>
          ))}
        </SuggestionContainer>
      ) : null}
      {!hideTranslateConfig ? <div>modal</div> : null}
    </>
  );
};

const Suggestion = styled.div<{ focused: boolean }>`
  padding: 5px;
  &:hover {
    background-color: #f0f0f0;
  }
  ${(props) => props.focused && "background-color: #f0f0f0;"}
  border-bottom: 1px solid black;
  text-align: center;
  border-radius: 2px;
  cursor: pointer;
  height: 40px;
`;

const SuggestionContainer = styled.div<{ width: number }>`
  position: absolute;
  top: 65px;
  right: 25px;
  width: ${(props) => props.width}px;
  height: 120x;
  background-color: white;
  z-index: 100;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
`;
