import React from "react";
import { StoryFn } from "@storybook/react";
import { SendButton } from "./SendButton";
import { SendButtonProps } from "./SendButton";
export default {
  title: "Example/SendButton",
  component: SendButton,
};

const Template: StoryFn<SendButtonProps> = (args) => <SendButton {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  handleClick: async () => {},
  height: "100%",
  text: "send",
  width: "200px",
};
