import process from "process";

type Method = "GET" | "POST" | "PUT" | "DELETE";
type FetchProps<T> = {
  url: string;
  method: Method;
  body?: T;
};

export const fetchJsonWithCors = async <T>(props: FetchProps<T>) => {
  const { url, method, body } = props;
  const response = await fetch(url, {
    mode: "cors",
    method,
    body: JSON.stringify(body),
  });
  const json = await response.json();
  return json;
};

export const wordbookUrl = (path: string) => {
  if (import.meta.env.PROD) {
    return "TODO";
  }
  return `http://localhost:8080${path}`;
};

export const translateUrl = () => {
  if (import.meta.env.PROD) {
    return "TODO";
  }
  return `http://localhost:8080/translate`;
};
