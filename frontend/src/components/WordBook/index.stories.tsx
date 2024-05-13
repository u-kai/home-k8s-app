import React from "react";
import { StoryFn } from "@storybook/react";
import { WordBook } from "./index";
import { WordBookProps } from "./index";
import {
  mockDeleteWordProfile,
  mockUpdateWordProfile,
  MockWordBookContextProvider,
} from "../../contexts/mock";
import { ModalContextProvider } from "../../contexts/modalWord";

export default {
  title: "WordBook/WordBook",
  component: WordBook,
};

const Template: StoryFn<WordBookProps> = (args) => (
  <ModalContextProvider>
    <MockWordBookContextProvider>
      <WordBook {...args} />
    </MockWordBookContextProvider>
  </ModalContextProvider>
);

export const Primary = Template.bind({});

Primary.args = {
  height: "400px",
  updateWordProfile: mockUpdateWordProfile,
  deleteWordProfile: mockDeleteWordProfile,
};
