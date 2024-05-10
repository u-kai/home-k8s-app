import React from "react";
import { StoryFn } from "@storybook/react";
import { SearchBar } from "./SearchBar";
import { SearchBarProps } from "./SearchBar";
export default {
  title: "WordBook/SearchBar",
  component: SearchBar,
};

const Template: StoryFn<SearchBarProps> = (args) => <SearchBar {...args} />;

export const Primary = Template.bind({});

Primary.args = {};
