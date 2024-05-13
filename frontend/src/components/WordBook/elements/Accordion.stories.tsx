import React from "react";
import { StoryFn } from "@storybook/react";
import { WordAccordion, WordAccordionProps } from "./Accordion";
import {
  mockDeleteWordProfile,
  mockUpdateWordProfile,
  mockWord,
  MockWordBookContextProvider,
} from "../../../contexts/mock";
import { ModalContextProvider } from "../../../contexts/modalWord";
export default {
  title: "WordBook/WordAccordion",
  component: WordAccordion,
};

const Template: StoryFn<WordAccordionProps> = (args) => (
  <MockWordBookContextProvider>
    <ModalContextProvider>
      <WordAccordion {...args} />
    </ModalContextProvider>
  </MockWordBookContextProvider>
);

export const Primary = Template.bind({});

const args: WordAccordionProps = {
  profile: mockWord,
  updateWordProfile: mockUpdateWordProfile,
  deleteWordProfile: mockDeleteWordProfile,
  playAudio: () => {},
};

Primary.args = args;
