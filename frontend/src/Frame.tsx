import { styled } from "styled-components";

export type FrameProps = {
  header: React.ReactNode;
  footer: React.ReactNode;
  wordbook: React.ReactNode;
  translateSentence: React.ReactNode;
};

export const Frame = (props: FrameProps) => {
  return (
    <Container>
      <HeaderContainer>{props.header}</HeaderContainer>
      <WordbookContainer>{props.wordbook}</WordbookContainer>
      <TranslateSentenceContainer>
        {props.translateSentence}
      </TranslateSentenceContainer>
      <FooterContainer>{props.footer}</FooterContainer>
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  display: grid;
  grid-template-rows: 10% 60% 17% 3%;
  width: 100%;
  height: 100%;
  z-index: -99;
`;

const HeaderContainer = styled.div`
  z-index: -3;
  width: 100%;
  margin-bottom: 10px;
`;
const WordbookContainer = styled.div`
  width: 70%;
  margin: 0 auto;
`;

const TranslateSentenceContainer = styled.div`
  position: relative;
  width: 70%;
  height: 100%;
  margin: 0 auto;
  z-index: -3;
`;
const FooterContainer = styled.div`
  margin-top: 2px;
  width: 100%;
`;
