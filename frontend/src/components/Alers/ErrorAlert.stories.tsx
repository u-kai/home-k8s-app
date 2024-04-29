import React from "react";
import { ErrorAlert } from "./ErrorAlert";

export default {
  title: "Example/ErrorAlert",
  component: ErrorAlert,
};

const Template = (args: { timeOut: number; errorMessage: string }) => (
  <ErrorAlert {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  timeOut: 3000,
  errorMessage: "This is an error message",
};
