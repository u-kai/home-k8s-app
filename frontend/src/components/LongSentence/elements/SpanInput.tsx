import React, { useState, useRef } from "react";

export const SpanInput = (props: {
  width?: string;
  height?: string;
  border?: string;
}) => {
  const [inputText, setInputText] = useState("");

  const handleInputChange = (event: any) => {
    console.log("Input changed:", event.target.value);
    setInputText(event.target.value);
  };

  const handleWordClick = (word: any) => {
    console.log("Clicked word:", word);
    // ここでクリックされた単語に対する処理を行う
  };

  const handleClick = () => {};

  const words = inputText.split(/\s+/).filter(Boolean);
  const calculatePosition = (index: number) => {
    const word = words[index];
    const previousWords = words.slice(0, index);
    const previousWordsLength = previousWords.reduce(
      (acc, word) => acc + word.length,
      0
    );
    return previousWordsLength * 10;
  };
  const spans = words.map((word, index) => (
    <span
      key={index}
      onClick={() => handleWordClick(word)}
      style={{
        cursor: "pointer",
        margin: "0 5px",
        zIndex: 1,
        color: "black",
        position: "absolute",
        left: `${calculatePosition(index)}px`,
        top: index % 2 === 0 ? "0" : "20px",
      }}
    >
      {word}
    </span>
  ));

  return (
    <div
      onClick={handleClick}
      style={{
        position: "absolute",
        top: "100px",
        minWidth: "300px",
        minHeight: "20px",
        border: "1px solid black",
        zIndex: -2,
        backgroundColor: "transparent",
      }}
    >
      <input
        type="text"
        value={inputText}
        onChange={handleInputChange}
        style={{
          position: "absolute",
          border: "1px solid pink",
          zIndex: 1,
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
          color: "transparent",
        }}
      />
      <div>{spans}</div>
    </div>
  );
};
