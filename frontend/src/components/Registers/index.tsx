import React from "react";
import { styled } from "styled-components";
import { RegisterButtons } from "./elements/RegisterButton";

export const Registers = () => {
  return (
    <Container>
      <RegisterButtons />
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
`;
