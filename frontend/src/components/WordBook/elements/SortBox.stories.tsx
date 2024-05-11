import React from "react";
import { StoryFn } from "@storybook/react";
import { SortBox } from "./SortBox";
import { SortBoxProps } from "./SortBox";
export default {
  title: "WordBook/SortBox",
  component: SortBox,
};

const Template: StoryFn<SortBoxProps> = (args) => <SortBox {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  Crated: (tb) => {
    console.log(tb);
  },
  Updated: (tb) => {
    console.log(tb);
  },
  Word: (tb) => {
    console.log(tb);
  },
  Like: (tb) => {
    console.log(tb);
  },
};
