import React from "react";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "styled-components";

export const AppFooter = () => {
  return (
    <Footer>
      <AppBar component="footer" position="sticky">
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="caption">©2024 u-kai</Typography>
          </Box>
        </Container>
      </AppBar>
    </Footer>
  );
};

const Footer = styled.footer`
  margin-top: auto;
`;
