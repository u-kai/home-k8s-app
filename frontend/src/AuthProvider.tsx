import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import { Home } from "./Home";
import React from "react";
import "@aws-amplify/ui-react/styles.css"; // base styling needed for Amplify UI
import "./App.css";
import { ThemeProvider, Theme, useTheme, View } from "@aws-amplify/ui-react";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "ap-northeast-1_OlP3TVnbI",
      userPoolClientId: "1nb57e3qmve0arjs6bqbmfngcr",
    },
  },
});

const AuthenticatorWrapper = () => {
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
      <View>
        <Authenticator components={components}></Authenticator>
      </View>
    </ThemeProvider>
  );
};

export const AuthProvider = () => {
  const AuthCheck = () => {
    const { route } = useAuthenticator((context) => [context.user]);
    const { user, signOut } = useAuthenticator();
    return route === "authenticated" ? (
      <Home logout={async () => signOut()} />
    ) : (
      <AuthenticatorWrapper />
    );
  };

  return (
    <Home logout={async () => {}} />
    // <Authenticator.Provider>
    //   <AuthCheck />
    // </Authenticator.Provider>
  );
};
