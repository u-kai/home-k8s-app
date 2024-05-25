import React from "react";
import { styled } from "styled-components";
import { ErrorAlert } from "./elements/ErrorAlert";
import { ButtonAppBar } from "./elements/Header";

export type HeaderProps = {
  logout: () => Promise<void>;
  children?: React.ReactNode;
};

export const Header = (props: HeaderProps) => {
  return (
    <Container>
      <ErrorAlertContainer>
        <ErrorAlert timeOut={3000} />
      </ErrorAlertContainer>
      <ButtonAppBarContainer>
        <ButtonAppBar logout={props.logout}>{props.children}</ButtonAppBar>
      </ButtonAppBarContainer>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
`;
const ErrorAlertContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
`;
const ButtonAppBarContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`;
