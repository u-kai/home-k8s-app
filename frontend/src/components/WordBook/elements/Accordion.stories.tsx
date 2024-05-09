import React from "react";
import { StoryFn } from "@storybook/react";
import { Accordion } from "./Accordion";
import { AccordionProps } from "./Accordion";
import { Sentence } from "./Sentence";
export default {
  title: "Example/Accordions",
  component: Accordion,
};

const Template: StoryFn<AccordionProps> = (args) => <Accordion {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  detail: (
    <Sentence
      sentence="This is a test sentence."
      meaning="これはテスト文です。"
      playAudio={(sentence: string) => {
        console.log(sentence);
      }}
    />
  ),
  summary: "summary",
};
