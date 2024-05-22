import React from "react";
import { StoryFn } from "@storybook/react";
import { Rates } from "./Rates";
import { RatesProps } from "./Rates";
export default {
  title: "WordBook/Rates",
  component: Rates,
};

const Template: StoryFn<RatesProps> = (args) => <Rates {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  rate: 4,
  onChange: async (rate: number) => {
    console.log(rate);
  },
};
