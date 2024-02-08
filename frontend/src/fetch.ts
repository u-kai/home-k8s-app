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
  return response.json();
};
