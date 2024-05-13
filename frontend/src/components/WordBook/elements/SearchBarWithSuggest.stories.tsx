import React from "react";
import { StoryFn } from "@storybook/react";
import { SearchBarWithSuggest } from "./SearchBarWithSuggest";
import { SearchBarWithSuggestProps } from "./SearchBarWithSuggest";
import { MockWordBookContextProvider } from "../../../contexts/mock";
export default {
  title: "WordBook/SearchBarWithSuggest",
  component: SearchBarWithSuggest,
};

const Template: StoryFn<SearchBarWithSuggestProps> = (args) => (
  <MockWordBookContextProvider>
    <SearchBarWithSuggest {...args} />
  </MockWordBookContextProvider>
);

export const Primary = Template.bind({});

Primary.args = {};
