import React from "react";
import { StoryFn } from "@storybook/react";
import { InputFieldWithButton } from "./InputFieldWithButton";
import { InputFieldWithButtonProps } from "./InputFieldWithButton";
export default {
  title: "Example/InputFieldWithButton",
  component: InputFieldWithButton,
};

const Template: StoryFn<InputFieldWithButtonProps> = (args) => (
  <InputFieldWithButton {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  button: <button>test</button>,
  width: "300px",
  value: "test",
  handleWordChange: (word: string) => {
    console.log(word);
  },
  label: "test-label",
  variant: "standard",
};
