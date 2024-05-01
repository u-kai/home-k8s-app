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

type SSEProps<T> = {
  url: string;
  method: Method;
  body?: T;
  headers?: { [key: string]: string };
  f: (data: string) => void;
};

export const sseWithCors = async <P>(props: SSEProps<P>) => {
  const reader = await fetch(props.url, {
    mode: "cors",
    method: props.method,
    body: JSON.stringify(props.body),
    headers: props.headers,
  }).then((response) => response.body?.getReader());
  if (!reader) {
    return;
  }

  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    const lines = decoder.decode(value);
    const sseData = lines.split("data: ").reduce((acc, line) => {
      return (acc += line.substring(0, line.length - 2));
    }, "");
    props.f(sseData);
  }
};
export const authorizationHeader = (
  token: string
): { [key: string]: string } => {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const backendUrl = (path: string) => {
  if (location.host === "www.kaiandkai.com") {
    return `https://api.kaiandkai.com${path}`;
  }
  return `http://dev.kaiandkai.com${path}`;
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
