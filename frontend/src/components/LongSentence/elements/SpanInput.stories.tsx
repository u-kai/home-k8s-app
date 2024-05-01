import React from "react";
import { StoryFn } from "@storybook/react";
import { SpanInput } from "./SpanInput";

export default {
  title: "Example/SpanInput",
  component: SpanInput,
};

const Template: StoryFn<{
  border?: string;
  height?: string;
  width?: string;
}> = (args) => <SpanInput {...args} />;

export const Primary = Template.bind({});

Primary.args = {};
