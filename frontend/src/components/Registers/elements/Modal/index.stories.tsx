import React from "react";
import { StoryFn } from "@storybook/react";
import { RegisterModal, ModalProps } from "./index";
import { ToLang } from "../../../../clients/translate";
export default {
  title: "Example/RegisterModal",
  component: RegisterModal,
};

const Template: StoryFn<ModalProps> = (args) => <RegisterModal {...args} />;

export const Primary = Template.bind({});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

Primary.args = {
  handleClose: () => {},
  open: true,
  translateHandler: async (req: {
    word: string;
    toLang: ToLang;
  }): Promise<string> => {
    await sleep(1000);
    if (req.toLang === "ja") {
      return "犬";
    } else {
      return "dog";
    }
  },
  createSentenceHandler: async (word: string) => {
    await sleep(1000);
    return { value: "dog can run", meaning: "犬は走れる" };
  },
};
