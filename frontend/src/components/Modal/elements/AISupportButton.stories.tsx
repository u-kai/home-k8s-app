import React from "react";
import { StoryFn } from "@storybook/react";
import { AISupportButton } from "./AISupportButton";
import { AISupportButtonProps } from "./AISupportButton";
export default {
  title: "Example/AISupportButton",
  component: AISupportButton,
};

const Template: StoryFn<AISupportButtonProps> = (
  args: Omit<AISupportButtonProps, "toggleAiProgress" | "aiProgress">
) => {
  const [aiProgress, setAiProgress] = React.useState(false);

  return (
    <AISupportButton
      {...args}
      toggleAiProgress={(to: boolean) => setAiProgress(to)}
      aiProgress={aiProgress}
    />
  );
};

export const Primary = Template.bind({});
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

Primary.args = {
  handleClick: async () => {
    await sleep(1000);
  },
};
