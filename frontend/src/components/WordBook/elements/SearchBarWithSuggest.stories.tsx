import React from "react";
import { StoryFn } from "@storybook/react";
import { SearchBarWithSuggest } from "./SearchBarWithSuggest";
import { SearchBarWithSuggestProps } from "./SearchBarWithSuggest";
export default {
  title: "WordBook/SearchBarWithSuggest",
  component: SearchBarWithSuggest,
};

const Template: StoryFn<SearchBarWithSuggestProps> = (args) => (
  <SearchBarWithSuggest {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  allWords: ["test", "hello", "tennis", "hr"],
  decideWord: (word: string) => {
    console.log(word);
  },
};
