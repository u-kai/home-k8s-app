import React from "react";
import { StoryFn } from "@storybook/react";
import { AppFooter } from "./Footer";

export default {
    title: "Example/AppFooter",
    component: AppFooter,
};

const Template: StoryFn<{  }> = (args) => (
  <AppFooter {...args} />
);

export const Primary = Template.bind({});

Primary.args = {  };
