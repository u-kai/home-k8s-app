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
  Crated: {
    f: (tb) => {
      console.log(tb);
    },
  },
  Updated: {
    f: (tb) => {
      console.log(tb);
    },
  },
  Word: {
    f: (tb) => {
      console.log(tb);
    },
  },
  Like: {
    f: (tb) => {
      console.log(tb);
    },
  },
};
