import React from "react";
import { StoryFn } from "@storybook/react";
import { ExampleSentenceField } from "./ExampleSentenceField";
import { ExampleSentenceFieldProps } from "./ExampleSentenceField";
export default {
  title: "Example/ExampleSentenceField",
  component: ExampleSentenceField,
};

const Template: StoryFn<
  Omit<ExampleSentenceFieldProps, "aiProgress" | "toggleAiProgress">
> = (args) => {
  const [aiProgress, setAiProgress] = React.useState(false);
  return (
    <ExampleSentenceField
      {...args}
      aiProgress={aiProgress}
      toggleAiProgress={(to) => setAiProgress(to)}
    />
  );
};

export const Primary = Template.bind({});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
Primary.args = {
  width: "300px",
  onAssistantPress: async () => {
    await sleep(1000);
  },
};
