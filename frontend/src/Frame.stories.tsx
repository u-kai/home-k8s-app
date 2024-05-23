import React from "react";
import { StoryFn } from "@storybook/react";
import { Frame } from "./Frame";
import { FrameProps } from "./Frame";
import { styled } from "styled-components";
import { LongSentenceTranslate } from "./components/LongSentence/elements/index";
import { AppFooter } from "./components/Footer/elements/Footer";
import { Header } from "./components/Header";
import { WordBook } from "./components/WordBook";
import {
  mockDeleteWordProfile,
  mockUpdateWordProfile,
  MockWordBookContextProvider,
} from "./contexts/mock";
export default {
  title: "Example/Frame",
  component: Frame,
};

const Template: StoryFn<FrameProps> = (args) => (
  <div style={{ height: "100vh" }}>
    <MockWordBookContextProvider>
      <Frame {...args} />
    </MockWordBookContextProvider>
  </div>
);

export const Primary = Template.bind({});

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
