import React from "react";
import { ErrorAlert } from "./ErrorAlert";
import { StoryFn } from "@storybook/react";

export default {
  title: "Example/ErrorAlert",
  component: ErrorAlert,
};

const Template = (args: { timeOut: number; errorMessage: string }) => (
  <ErrorAlert {...args} />
);

export const Primary: StoryFn<{ timeOut: number; errorMessage: string }> =
  Template.bind({});

Primary.args = {
  timeOut: 3000,
  errorMessage: "This is an error message",
};
