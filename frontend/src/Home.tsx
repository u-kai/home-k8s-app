import { useAuthenticator } from "@aws-amplify/ui-react";
import React, { useEffect } from "react";
import { AppFooter } from "./components/Footer/elements/Footer";
import { Header } from "./components/Header";
import { LongSentenceTranslate } from "./components/LongSentence/elements";
import { WordBook } from "./components/WordBook";
import { Frame } from "./Frame";
import { useWordBook } from "./hooks/useWordBooks";

export const Home = () => {
  const { signOut } = useAuthenticator();
  const {
    wordbook,
    sortByWord,
    sortByCreatedAt,
    sortByLikeRates,
    sortByUpdatedAt,
  } = useWordBook();
  return (
    <Frame
      header={<Header logout={async () => console.log("logout")} />}
      wordbook={
        <WordBook
          wordBooks={[]}
          sort={{
            CreatedAt: sortByCreatedAt,
            UpdatedAt: sortByUpdatedAt,
            Word: sortByWord,
            LikeRates: sortByLikeRates,
          }}
        />
      }
      translateSentence={
        <LongSentenceTranslate
          sseTranslateSentence={async (
            sentence: string,
            setFn: (chunk: string) => void
          ) => {}}
          handleWordClick={async (word: string) => {}}
          height="100%"
        />
      }
      footer={<AppFooter />}
    />
  );
};
