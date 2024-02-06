import { Box } from "@mui/system";
import React from "react";
import { styled } from "styled-components";
import "./App.css";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { List } from "./components/List";
import { Registers } from "./components/Registers";
import { Search } from "./components/Search";

function App() {
  return (
    <Wrapper>
      <Header />
      <Search />
      <List></List>
      <Registers></Registers>
      <Footer />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-x: hidden;
`;

export default App;
