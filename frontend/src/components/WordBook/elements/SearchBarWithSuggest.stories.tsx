import React from "react";
import { StoryFn } from "@storybook/react";
import { SearchBarWithSuggest } from "./SearchBarWithSuggest";
import { SearchBarWithSuggestProps } from "./SearchBarWithSuggest";
export default {
  title: "WordBook/SearchBarWithSuggest",
  component: SearchBarWithSuggest,
};

const Template: StoryFn<SearchBarWithSuggestProps> = (args) => (
  <div>
    <div>hello</div>
    <SearchBarWithSuggest {...args} />
  </div>
);

export const Primary = Template.bind({});

Primary.args = {
  allWords: ["test", "hello", "tennis", "hr", "test2", "test3"],
  decideWord: (word: string) => {
    console.log(word);
  },
};
