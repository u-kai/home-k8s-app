import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import { AuthenticatorWrapper } from "./AuthenticatorWrapper";
import { Home } from "./Home";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "ap-northeast-1_OlP3TVnbI",
      userPoolClientId: "1nb57e3qmve0arjs6bqbmfngcr",
    },
  },
});

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
    <Authenticator.Provider>
      <AuthCheck />
    </Authenticator.Provider>
  );
};
