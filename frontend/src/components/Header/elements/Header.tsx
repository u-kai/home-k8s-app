import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";

type Props = {
  logout: () => Promise<void>;
  children?: React.ReactNode;
};

export const ButtonAppBar = (props: Props) => {
  return (
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
          <Button
            color="inherit"
            onClick={async () => props.logout().catch((e) => console.error(e))}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
