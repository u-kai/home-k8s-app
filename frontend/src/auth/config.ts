import { Auth } from "@aws-amplify/auth";

Auth.configure({
  region: "ap-northeast-1",
  userPoolId: "ap-northeast-1_OlP3TVnbI",
  userPoolWebClientId: "1nb57e3qmve0arjs6bqbmfngcr",
  mandatorySignIn: true,
});
