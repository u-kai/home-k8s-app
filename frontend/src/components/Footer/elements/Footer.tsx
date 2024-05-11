import React from "react";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "styled-components";

export type AppFooterProps = {
  logo?: string;
  height?: string;
};

export const AppFooter = (props?: AppFooterProps) => {
  const logo = props?.logo ?? "©2024 u-kai";
  const height = props?.height ?? "100%";
  const centerFlex = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <AppBar component="footer" position="sticky" sx={{ height, ...centerFlex }}>
      <Container
        maxWidth="md"
        sx={{
          position: "relative",
          textAlign: "center",
          height: "100%",
          ...centerFlex,
        }}
      >
        <Box sx={{ position: "relative", textAlign: "center", width: "100%" }}>
          <Typography variant="caption">{logo}</Typography>
        </Box>
      </Container>
    </AppBar>
  );
};
