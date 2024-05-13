import React from "react";
import { StoryFn } from "@storybook/react";
import { WordSummary } from "./WordSummary";
import { WordSummaryProps } from "./WordSummary";
import {
  mockDeleteWordProfile,
  mockUpdateWordProfile,
  MockWordBookContextProvider,
} from "../../../contexts/mock";
import { ModalContextProvider } from "../../../contexts/modalWord";
export default {
  title: "WordBook/WordSummary",
  component: WordSummary,
};

const Template: StoryFn<WordSummaryProps> = (args) => (
  <MockWordBookContextProvider>
    <ModalContextProvider>
      <WordSummary {...args} />
    </ModalContextProvider>
  </MockWordBookContextProvider>
);

export const Primary = Template.bind({});

Primary.args = {
  updateWordProfile: mockUpdateWordProfile,
  deleteWordProfile: mockDeleteWordProfile,
  playAudio: async () => {},
};
