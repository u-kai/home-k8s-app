import { useAuthenticator } from "@aws-amplify/ui-react";
import React, { useEffect } from "react";
import { styled } from "styled-components";
import { ErrorAlert } from "./components/Alers/ErrorAlert";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { List } from "./components/List";
import { Registers } from "./components/Registers";
import { Search } from "./components/Search";
import { fetchJsonWithCors } from "./fetch";

type Props = {
  logout: () => Promise<void>;
};

export const Home = (props: Props) => {
  //
  return (
    <Wrapper>
      <Header logout={props.logout} />
      <ErrorAlert timeOut={1000} />
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
