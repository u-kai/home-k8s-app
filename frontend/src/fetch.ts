import process from "process";

type Method = "GET" | "POST" | "PUT" | "DELETE";
type FetchProps<T> = {
  url: string;
  method: Method;
  body?: T;
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
  })
    .then((response) => response.json() as T)
    .catch((e) => {
      return new Error(e.toString());
    });
};

const backendUrl = (path: string) => {
  if (import.meta.env.PROD) {
    if (import.meta.env.VITE_API_SERVER_URL) {
      return import.meta.env.VITE_API_SERVER_URL + path;
    }
    return "http://dev.kaiandkai.com" + path;
  }
  return `http://test.kaiandkai.com${path}`;
};
export const wordbookUrl = (path: string) => {
  return backendUrl(`/wordbook${path}`);
};

export const translateUrl = () => {
  return backendUrl(`/translate`);
};

export const createSentenceUrl = () => {
  return backendUrl(`/translate/createSentence`);
};
