import React from "react";
import { StoryFn } from "@storybook/react";
import { Accordion } from "./Accordion";
import { AccordionProps } from "./Accordion";
export default {
  title: "Example/Accordions",
  component: Accordion,
};

const Template: StoryFn<AccordionProps> = (args) => <Accordion {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  detail: "detail",
  summary: "summary",
};
