import React from "react";
import { StoryFn } from "@storybook/react";
import { Frame } from "./Frame";
import { FrameProps } from "./Frame";
import { styled } from "styled-components";
import { LongSentenceTranslateComponent } from "./components/LongSentence";
import { AppFooter } from "./components/Footer/elements/Footer";
export default {
  title: "Example/Frame",
  component: Frame,
};

const Template: StoryFn<FrameProps> = (args) => <Frame {...args} />;

export const Primary = Template.bind({});

const Header = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid black;
`;

const Footer = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid black;
`;

const Wordbook = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid black;
`;

Primary.args = {
  header: <Header>Header</Header>,
  footer: <AppFooter />,
  wordbook: <Wordbook>Wordbook</Wordbook>,
  translateSentence: (
    <LongSentenceTranslateComponent
      handleWordClick={async (word: string) => {}}
      height="100%"
    />
  ),
};
