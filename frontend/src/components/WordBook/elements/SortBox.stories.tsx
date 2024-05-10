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
  sortTypeToSortFn: {
    Created: (t) => console.log("Created", t),
    Updated: (t) => console.log("Updated", t),
    Name: (t) => console.log("Name", t),
    Type: (t) => console.log("Type", t),
  },
};
