import React from "react";
import { StoryFn } from "@storybook/react";
import { Frame } from "./Frame";
import { FrameProps } from "./Frame";
import { styled } from "styled-components";
import { LongSentenceTranslateComponent } from "./components/LongSentence";
import { AppFooter } from "./components/Footer/elements/Footer";
import { Header } from "./components/Header";
import { WordBook } from "./components/WordBook";
export default {
  title: "Example/Frame",
  component: Frame,
};

const Template: StoryFn<FrameProps> = (args) => <Frame {...args} />;

export const Primary = Template.bind({});

const Wordbook = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid black;
`;

Primary.args = {
  header: <Header logout={async () => console.log("logout")} />,
  footer: <AppFooter />,
  wordbook: <WordBook />,
  translateSentence: (
    <LongSentenceTranslateComponent
      handleWordClick={async (word: string) => {}}
      height="100%"
    />
  ),
};
