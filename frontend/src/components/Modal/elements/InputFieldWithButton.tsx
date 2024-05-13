import React from "react";
import { InputField, InputFieldProps } from "./InputField";
import { styled } from "styled-components";

export type InputFieldWithButtonProps = {
  button: React.ReactNode;
} & InputFieldProps;

export const InputFieldWithButton = (props: InputFieldWithButtonProps) => {
  return (
    <Container>
      <InputField {...props} />
      <ButtonContainer left={props.width}>{props.button}</ButtonContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
`;

const ButtonContainer = styled.div<{ left?: string }>`
  position: absolute;
  top: 50%;
  left: ${(props) => props.left ?? "100%"};
`;
