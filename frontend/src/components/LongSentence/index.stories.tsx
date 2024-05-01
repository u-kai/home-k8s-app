import React from "react";
import { StoryFn } from "@storybook/react";
import { LongSentenceBoxes } from "./index";

export default {
    title: "Example/LongSentenceBoxes",
    component: LongSentenceBoxes,
};

const Template: StoryFn<{  }> = (args) => (
  <LongSentenceBoxes {...args} />
);

export const Primary = Template.bind({});

Primary.args = {  };
