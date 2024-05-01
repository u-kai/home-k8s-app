import React from "react";
import { StoryFn } from "@storybook/react";
import { Accordion } from "./Accordion";
import { AccordionProps } from "./Accordion";
export default {
  title: "Example/Accordion",
  component: Accordion,
};

const Template: StoryFn<AccordionProps> = (args) => <Accordion {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  title: <div>"Accordion Title"</div>,
  isOpen: true,
  toggleAccordion: () => {},
  children: "Accordion Content",
};
