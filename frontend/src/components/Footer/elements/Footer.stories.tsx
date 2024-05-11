import React from "react";
import { StoryFn } from "@storybook/react";
import { AppFooter } from "./Footer";

export default {
  title: "Footer/AppFooter",
  component: AppFooter,
};

const Template: StoryFn<{}> = (args) => (
  <div style={{ height: 50 }}>
    <AppFooter {...args} />
  </div>
);

export const Primary = Template.bind({});

Primary.args = {};
