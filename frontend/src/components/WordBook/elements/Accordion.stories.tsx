import React from "react";
import { StoryFn } from "@storybook/react";
import { Accordion } from "./Accordion";
import { AccordionProps } from "./Accordion";
import { WordSummary } from "./WordSummary";
import { WordDetail } from "./WordDetail";
export default {
  title: "Example/Accordions",
  component: Accordion,
};

const Template: StoryFn<AccordionProps> = (args) => <Accordion {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  summary: (
    <WordSummary
      word="test"
      playAudio={() => {
        console.log("play audio");
      }}
      handleDelete={async () => console.log("delete")}
      handleEdit={async () => console.log("edit")}
      handleRateChange={async (rate: number) => console.log(rate)}
    />
  ),
  detail: (
    <WordDetail
      playAudio={() => {}}
      wordMeaning="テスト"
      sentences={[
        {
          sentence: "This is a test sentence.",
          meaning: "これはテスト文です。",
        },
        {
          sentence: "This is another test sentence.",
          meaning: "これは別のテスト文です。",
        },
      ]}
    />
  ),
};
