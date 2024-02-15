import React from "react";
import "@aws-amplify/ui-react/styles.css"; // base styling needed for Amplify UI
//import "@aws-amplify/ui-react/styles/reset.layer.css"; // global CSS reset
//import "@aws-amplify/ui-react/styles/base.layer.css"; // base styling needed for Amplify UI
//import "@aws-amplify/ui-react/styles/button.layer.css"; // component specific styles
import "./App.css";
import {
  Authenticator,
  ThemeProvider,
  Theme,
  useTheme,
  View,
} from "@aws-amplify/ui-react";

export const AuthenticatorWrapper = () => {
  const { tokens } = useTheme();
  const theme: Theme = {
    name: "Auth Example Theme",
    tokens: {
      components: {
        authenticator: {
          router: {
            boxShadow: `0 0 16px ${tokens.colors.overlay["10"]}`,
            borderWidth: "0",
          },
          form: {
            padding: `${tokens.space.medium} ${tokens.space.xl} ${tokens.space.medium}`,
          },
        },
        button: {
          primary: {
            backgroundColor: tokens.colors.neutral["100"],
          },
          link: {
            color: tokens.colors.purple["80"],
          },
        },
        fieldcontrol: {
          _focus: {
            boxShadow: `0 0 0 2px ${tokens.colors.purple["60"]}`,
          },
        },
        tabs: {
          item: {
            color: tokens.colors.neutral["80"],
            _active: {
              borderColor: tokens.colors.neutral["100"],
              color: tokens.colors.purple["100"],
            },
          },
        },
      },
    },
  };
  const components = {
    Header() {
      const { tokens } = useTheme();
      return (
        <View textAlign="center" padding={tokens.space.large}>
          <h1>Enjoy Learn English Sign In</h1>
        </View>
      );
    },
  };
  return (
    <ThemeProvider theme={theme}>
      <View padding="xxl">
        <Authenticator components={components}></Authenticator>
      </View>
    </ThemeProvider>
  );
};
