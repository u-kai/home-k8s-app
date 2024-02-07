import React from "react";
import { styled } from "styled-components";
import { RegisterModal } from "./elements/Modal";
import { RegisterButtons } from "./elements/RegisterButton";

export const Registers = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <Container>
      <RegisterButtons handler={() => setOpen((prev) => !prev)} />
      <RegisterModal open={open} handleClose={() => setOpen(false)} />
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
`;
