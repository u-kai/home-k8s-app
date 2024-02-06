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
      <UpperContainer>
        <Search />
        <RegisterButtonContainer>
          <Registers />
        </RegisterButtonContainer>
      </UpperContainer>
      <ListContainer>
        <List></List>
      </ListContainer>
      <Footer />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow-x: hidden;
  position: relative;
`;

export default App;
// TODO: consider why the value
const RegisterButtonContainer = styled.div`
  position: relative;
  top: 20px;
`;
const UpperContainer = styled.div`
  position: absolute;
  top: 80px;
  left: 32%;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
`;
const ListContainer = styled.div`
  position: absolute;
  top: 120px;
  width: 100%;
  height: 100%;
`;
