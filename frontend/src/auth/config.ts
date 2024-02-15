//import { Auth } from "@aws-amplify/auth";
import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "ap-northeast-1_OlP3TVnbI",
      userPoolClientId: "1nb57e3qmve0arjs6bqbmfngcr",
    },
  },
});
