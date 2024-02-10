import React, { useEffect } from "react";
import { styled } from "styled-components";
import "./App.css";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { List } from "./components/List";
import { Registers } from "./components/Registers";
import { Search } from "./components/Search";
import { fetchJsonWithCors } from "./fetch";

export const Home = () => {
  useEffect(() => {
    fetchJsonWithCors({
      url: "https://api.kaiandkai.com/translate/translate",
      body: {
        target: "test",
      },
      method: "POST",
    })
      .then((res) => res.json())
      .catch((err) => {
        console.log(err);
        return { json: async () => err };
      })
      .then((data) => {
        console.log(data);
      });
  }, []);
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
};

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  position: relative;
`;

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
