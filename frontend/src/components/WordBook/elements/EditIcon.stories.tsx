import React from "react";
import { StoryFn } from "@storybook/react";
import { EditIcon } from "./EditIcon";
import { EditIconProps } from "./EditIcon";
export default {
  title: "WordBook/EditIcon",
  component: EditIcon,
};

const Template: StoryFn<EditIconProps> = (args) => <EditIcon {...args} />;

export const Primary = Template.bind({});

Primary.args = {};
