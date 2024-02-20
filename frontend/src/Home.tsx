import { useAuthenticator } from "@aws-amplify/ui-react";
import React, { useEffect } from "react";
import { styled } from "styled-components";
import { ErrorAlert } from "./components/Alers/ErrorAlert";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { List } from "./components/List";
import { TableList } from "./components/List/elements/TableContainer";
import { PlayAudios } from "./components/PlayAudios";
import { Registers } from "./components/Registers";
import { Search } from "./components/Search";

type Props = {
  logout: () => Promise<void>;
};

export const Home = (props: Props) => {
  const { signOut } = useAuthenticator();
  //
  return (
    <Wrapper>
      <HeaderAndAlertContainer>
        <AlertContainer>
          <ErrorAlert timeOut={10000} />
        </AlertContainer>
        <HeaderContainer>
          <Header logout={async () => signOut()} />
        </HeaderContainer>
      </HeaderAndAlertContainer>
      <UpperContainer>
        <Search />
        <RegisterButtonContainer>
          <Registers />
        </RegisterButtonContainer>
      </UpperContainer>
      <ListContainer>
        <PlayAudiosContainer>
          <PlayAudios />
        </PlayAudiosContainer>
        <List />
      </ListContainer>
      <Footer />
    </Wrapper>
  );
};

const HeaderAndAlertContainer = styled.div`
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: column;
`;
const AlertContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
`;

const HeaderContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;
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
  top: 70px;
  left: 32%;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
`;
const PlayAudiosContainer = styled.div`
  position: relative;
  top: 30px;
  z-index: 100;
  left: 49%;
`;
//const PlayAudiosContainer = styled.div`
//  position: absolute;
//  top: 40px;
//  right: 250px;
//`;
const ListContainer = styled.div`
  position: absolute;
  top: 120px;
  width: 100%;
  height: 100%;
`;
