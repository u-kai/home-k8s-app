import React, { useState, ReactNode, FC } from "react";
import { styled } from "styled-components";

export type AccordionProps = {
  title: ReactNode;
  children: ReactNode;
  isOpen: boolean;
  toggleAccordion: () => void;
  size?: "small" | "medium" | "large";
};

/*
    Accordion component

    1. titleを小要素として表示する
    2. isOpenがtrueの場合、内容を表示する
    3. 内容はchildrenで受け取る
    4. サイズは任意に変更可能
    5. クリック時にtoggleAccordionを実行する
*/

export const Accordion: FC<AccordionProps> = ({
  title,
  children,
  isOpen,
  toggleAccordion,
}) => {
  return (
    <Container>
      <Header onClick={toggleAccordion}>{title}</Header>
      <Body isOpen={isOpen}>{children}</Body>
    </Container>
  );
};

const Container = styled.div``;
const Header = styled.div``;
const Body = styled.div<{ isOpen: boolean }>`{
    display: ${(props) => (props.isOpen ? "block" : "none")};
}`;
