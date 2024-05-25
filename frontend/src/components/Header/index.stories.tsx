import React, { useContext } from "react";
import { StoryFn } from "@storybook/react";
import { Header } from "./index";
import { HeaderProps } from "./index";
import { AppErrorContext, AppErrorContextProvider } from "../../contexts/error";
export default {
  title: "Header/Header",
  component: Header,
};

const Template: StoryFn<HeaderProps & { error?: Error }> = (args) => {
  const { error } = args;
  const { setAppError } = useContext(AppErrorContext);
  if (error) {
    setAppError({ message: error.message, id: "Header", name: "Template" });
  }
  return <Header {...args} />;
};

export const Primary = Template.bind({});

//Primary.args = {};

<AppErrorContextProvider>
  <Header logout={async () => console.log("")}></Header>;
</AppErrorContextProvider>;

export const ErrorCase = Template.bind({});

<AppErrorContextProvider>
  <ErrorCase
    logout={async () => console.log("")}
    error={new Error("This is an error")}
  ></ErrorCase>
</AppErrorContextProvider>;

//ErrorCase.args = {
//  error: new Error("This is an error"),
//};
