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

export const wordbookUrl = (path: string) => {
  if (import.meta.env.PROD) {
    import.meta.env.API_SERVER_URL + "/wordbook" + path;
  }
  return `http://test.kaiandkai.com/wordbook${path}`;
};

export const translateUrl = () => {
  if (import.meta.env.PROD) {
    import.meta.env.API_SERVER_URL + "/translate";
  }
  return `http://test.kaiandkai.com/translate`;
};

export const createSentenceUrl = () => {
  if (import.meta.env.PROD) {
    import.meta.env.API_SERVER_URL + "/translate/createSentence";
  }
  return `http://test.kaiandkai.com/createSentence`;
};
