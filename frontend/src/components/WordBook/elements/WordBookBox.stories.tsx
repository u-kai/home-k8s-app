import React from "react";
import { StoryFn } from "@storybook/react";
import { WordBookBox } from "./WordBookBox";
import { WordBookBoxProps } from "./WordBookBox";
import { MockWordBookContextProvider } from "../../../contexts/mock";
export default {
  title: "WordBook/WordBookBox",
  component: WordBookBox,
};

const Template: StoryFn<WordBookBoxProps> = (args) => (
  <MockWordBookContextProvider>
    <WordBookBox {...args} height={"400px"} />
  </MockWordBookContextProvider>
);

export const Primary = Template.bind({});

Primary.args = {};
