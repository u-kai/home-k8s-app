import { useAuthenticator } from "@aws-amplify/ui-react";
import React, { useEffect } from "react";
import { styled } from "styled-components";
import { ErrorAlert } from "./components/Alers/ErrorAlert";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { List } from "./components/List";
import { PlayAudios } from "./components/PlayAudios";
import { Registers } from "./components/Registers";
import { Search } from "./components/Search";
import { SortButton } from "./components/SortButton";

type Props = {
  logout: () => Promise<void>;
};

export const Home = (props: Props) => {
  const { signOut } = useAuthenticator();
  const BUTTON_TOP_POSITION = "150px";
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
        <SearchContainer>
          <Search />
        </SearchContainer>
        <RegisterButtonContainer>
          <Registers />
        </RegisterButtonContainer>
      </UpperContainer>
      <SortButtonContainer top={BUTTON_TOP_POSITION}>
        <SortButton />
      </SortButtonContainer>
      <PlayAudiosContainer top={BUTTON_TOP_POSITION}>
        <PlayAudios />
      </PlayAudiosContainer>
      <ListContainer>
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
  height: 10px;
  display: flex;
  flex-direction: column;
  z-index: 100;
`;
const AlertContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
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

const UpperContainer = styled.div`
  position: absolute;
  top: 70px;
  left: 32%;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
`;
const SearchContainer = styled.div`
    flex-grow:1,
    flex-shrink:1,
    min-width:0px,
`;
const RegisterButtonContainer = styled.div`
  position: relative;
  top: 20px;
  flex-shrink: 0;
  left: 1%;
`;
const PlayAudiosContainer = styled.div<{ top: string }>`
  position: absolute;
  z-index: 100;
  top: ${(props) => props.top};
  left: 50%;
`;
const ListContainer = styled.div`
  position: absolute;
  top: 200px;
  width: 100%;
`;

const SortButtonContainer = styled.div<{ top: string }>`
  position: absolute;
  left: 87%;
  top: ${(props) => props.top};
`;
