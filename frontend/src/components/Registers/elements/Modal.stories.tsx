import React from "react";
import { StoryFn } from "@storybook/react";
import { WordModal } from "./Modal";
import { ModalProps } from "./Modal";
import { ToLang } from "../../../clients/translate";
export default {
  title: "Example/RegisterModal",
  component: WordModal,
};

const Template: StoryFn<ModalProps> = (args) => <WordModal {...args} />;

export const Primary = Template.bind({});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

Primary.args = {
  handleClose: () => {},
  open: true,
  translateHandler: async (req: { word: string; toLang: ToLang }) => {
    await sleep(1000);
    if (req.toLang === "ja") {
      return "犬";
    } else {
      return "dog";
    }
  },
};
