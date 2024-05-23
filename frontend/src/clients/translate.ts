import {
  authorizationHeader,
  fetchJsonWithCors,
  isFailed,
  sseWithCors,
  backendUrl,
} from "./fetch";

export type ToLang = "ja" | "en";
export type GeneratedSentence = {
  result: string;
  meaning: string;
  aiModel: "greater";
};

const translateUrl = (path: string) => {
  return backendUrl(`/translate/${path}`);
};

export type TranslateRequest = {
  word: string;
  toLang: ToLang;
  aiModel: "greater";
};

export const translateRequest = async (
  request: TranslateRequest,
  token: string
): Promise<string> => {
  const authHeader = authorizationHeader(token ?? "");
  const response = await fetchJsonWithCors<
    TranslateRequest,
    { result: string }
  >({
    url: translateUrl("word"),
    method: "POST",
    body: request,
    headers: authHeader,
  });
  if (isFailed(response)) {
    throw new Error("Failed to translate: " + response.message);
  }
  return response.result;
};

export type TranslateSentenceRequest = {
  sentence: string;
  toLang: ToLang;
  sseHandler: (data: string) => void;
};

export const translateSentence = async (
  request: TranslateSentenceRequest,
  token: string
): Promise<void> => {
  const authHeader = authorizationHeader(token);
  await sseWithCors<{
    sentence: string;
    toLang: ToLang;
  }>({
    url: translateUrl("sentence"),
    method: "POST",
    body: {
      sentence: request.sentence,
      toLang: request.toLang,
    },
    headers: authHeader,
    f: (data) => request.sseHandler(data),
  });
};

export type GeneratedSentenceRequest = {
  word: string;
  toLang: ToLang;
};

export type GenerateSentenceResponse = {
  sentence: string;
  meaning: string;
};
export const generateSentence = async (
  request: GeneratedSentenceRequest,
  token: string
): Promise<GenerateSentenceResponse> => {
  const authHeader = authorizationHeader(token);
  const response = await fetchJsonWithCors<
    GeneratedSentenceRequest,
    { result: string; meaning: string }
  >({
    url: translateUrl("sentence/generate"),
    method: "POST",
    body: request,
    headers: authHeader,
  });
  if (isFailed(response)) {
    throw new Error("Failed to generate sentence: " + response.message);
  }
  return {
    sentence: response.result,
    meaning: response.meaning,
  };
};

export type ReviewSentenceRequest = {
  sentence: string;
  sseHandler: (data: string) => void;
};
export const reviewSentence = async (
  request: ReviewSentenceRequest,
  token: string
): Promise<void> => {
  const authHeader = authorizationHeader(token);
  await sseWithCors<{ sentence: string }>({
    url: translateUrl("sentence/review"),
    method: "POST",
    body: {
      sentence: request.sentence,
    },
    headers: authHeader,
    f: request.sseHandler,
  });
};
