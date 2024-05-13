import React from "react";
import { StoryFn } from "@storybook/react";
import { Frame } from "./Frame";
import { FrameProps } from "./Frame";
import { styled } from "styled-components";
import { LongSentenceTranslate } from "./components/LongSentence/elements/index";
import { AppFooter } from "./components/Footer/elements/Footer";
import { Header } from "./components/Header";
import { WordBook } from "./components/WordBook";
import { mockDeleteWordProfile, mockUpdateWordProfile } from "./contexts/mock";
export default {
  title: "Example/Frame",
  component: Frame,
};

const Template: StoryFn<FrameProps> = (args) => (
  <div style={{ height: "100vh" }}>
    <Frame {...args} />
  </div>
);

export const Primary = Template.bind({});

const Wordbook = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid black;
`;
const testWord = {
  word: "test",
  wordMeaning: "testMeaning",
  sentences: [
    {
      sentence: "this is a test sentence",
      meaning: "これはテストの文です",
    },
    {
      sentence: "this is a test sentence",
      meaning: "これはテストの文です",
    },
  ],
  rate: 3,
  handleDelete: async () => {},
  handleEdit: async () => {},
  handleRateChange: async (rate: number) => {},
  playAudio: async () => {},
};

const tests = Array(100).fill(testWord);

Primary.args = {
  header: <Header logout={async () => console.log("logout")} />,
  footer: <AppFooter />,
  wordbook: (
    <WordBook
      updateWordProfile={mockUpdateWordProfile}
      deleteWordProfile={mockDeleteWordProfile}
    />
  ),
  translateSentence: (
    <LongSentenceTranslate
      sseTranslateSentence={async (
        sentence: string,
        setFn: (chunk: string) => void
      ) => {}}
      handleWordClick={async (word: string) => {}}
      height="100%"
    />
  ),
};
