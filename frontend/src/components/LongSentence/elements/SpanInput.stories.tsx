import React from "react";
import { StoryFn } from "@storybook/react";
import { SpanInput } from "./SpanInput";

export default {
  title: "Example/SpanInput",
  component: SpanInput,
};

const Template: StoryFn<{
  handleWordClick: (word: string) => Promise<void>;
  width?: string;
  height?: string;
}> = (args) => {
  const [text, setText] = React.useState("");
  return <SpanInput {...args} value={text} handleChange={(v) => setText(v)} />;
};

export const Primary = Template.bind({});

Primary.args = {
  handleWordClick: async (word: string) => {
    console.log(word);
  },
  width: "300px",
  height: "200px",
};
