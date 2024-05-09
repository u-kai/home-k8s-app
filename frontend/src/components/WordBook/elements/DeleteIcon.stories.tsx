import React from "react";
import { StoryFn } from "@storybook/react";
import { DeleteIcon } from "./DeleteIcon";
import { DeleteIconProps } from "./DeleteIcon";
export default {
  title: "WordBook/DeleteIcon",
  component: DeleteIcon,
};

const Template: StoryFn<DeleteIconProps> = (args) => <DeleteIcon {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  handleDelete: async () => {
    console.log("delete");
  },
};
