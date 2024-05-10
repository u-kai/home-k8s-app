import React from "react";
import { StoryFn } from "@storybook/react";
import { Suggestions } from "./Suggests";
import { SuggestionsProps } from "./Suggests";
export default {
  title: "WordBook/Suggestions",
  component: Suggestions,
};

const Template: StoryFn<SuggestionsProps> = (args) => <Suggestions {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  suggestions: ["test", "test2"],
  focusIndex: 0,
};
