import React from "react";
import { StoryFn } from "@storybook/react";
import { SpanInput } from "./SpanInput";

export default {
  title: "LongSentence/SpanInput",
  component: SpanInput,
};

const Template: StoryFn<{
  handleWordClick: (word: string) => Promise<void>;
  width?: string;
  height?: string;
}> = (args) => {
  const [text, setText] = React.useState(overflowData());
  return (
    <div style={{ position: "absolute", zIndex: -100 }}>
      <SpanInput {...args} value={text} handleChange={(v) => setText(v)} />
    </div>
  );
};

const overflowData = (): string => {
  return [
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
  ].reduce((acc, cur) => acc + " " + cur.repeat(10), "a".repeat(100));
};

export const Primary = Template.bind({});

Primary.args = {
  handleWordClick: async (word: string) => {
    console.log(word);
  },
  width: "300px",
  height: "200px",
};
