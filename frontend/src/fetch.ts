import process from "process";

type Method = "GET" | "POST" | "PUT" | "DELETE";
type FetchProps<T> = {
  url: string;
  method: Method;
  body?: T;
  headers?: { [key: string]: string };
};

export type Result<T> = T | Error;
export const isSuccessful = <T>(result: Result<T>): result is T => {
  return !(result instanceof Error);
};
export const isFailed = <T>(result: Result<T>): result is Error => {
  return result instanceof Error;
};

export const fetchJsonWithCors = async <P, T>(
  props: FetchProps<P>
): Promise<Result<T>> => {
  const { url, method, body } = props;
  return fetch(url, {
    mode: "cors",
    method,
    body: JSON.stringify(body),
    headers: props.headers,
  })
    .then((response) => response.json() as T)
    .catch((e) => {
      return new Error(e.toString());
    });
};

export const authorizationHeader = (
  token: string
): { [key: string]: string } => {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const backendUrl = (path: string) => {
  if (location.host === "www.kaiandkai.com") {
    return `https://api.kaiandkai.com${path}`;
  }
  return `http://dev.kaiandkai.com${path}`;
};
export const wordbookUrl = (path: string) => {
  return backendUrl(`/wordbook${path}`);
};

export const translateUrl = () => {
  return backendUrl(`/translate/`);
};

export const createSentenceUrl = () => {
  return backendUrl(`/translate/createSentence`);
};

export const speak = (word: string) => {
  const synth = window.speechSynthesis;
  const voices = synth
    .getVoices()
    .filter((v) => v.lang !== undefined && v.lang === "en-US");
  if (voices.length === 0) {
    console.log("No voices found");
    return;
  }
  const voice = voices[0];
  if (voice.lang !== "en-US") {
    console.log("No en-US voice found");
    return;
  }
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.voice = voice;
  synth.speak(utterance);
};
