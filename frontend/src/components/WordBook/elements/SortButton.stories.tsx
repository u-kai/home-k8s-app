import React from "react";
import { StoryFn } from "@storybook/react";
import { SortButton } from "./SortButton";
import { SortButtonProps } from "./SortButton";
export default {
  title: "WordBook/SortButton",
  component: SortButton,
};

const Template: StoryFn<SortButtonProps> = (args) => <SortButton {...args} />;

export const Primary = Template.bind({});

Primary.args = {};
