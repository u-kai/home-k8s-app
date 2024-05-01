import React, { useState, useRef } from "react";

export const WordProcessor = (props: {
  width?: string;
  height?: string;
  border?: string;
}) => {
  const [inputText, setInputText] = useState("");
  const inputRef = useRef<any>(null);

  const handleInputChange = (event: any) => {
    console.log("Input changed:", event.target.value);
    setInputText(event.target.value);
  };

  const handleWordClick = (word: any) => {
    console.log("Clicked word:", word);
    // ここでクリックされた単語に対する処理を行う
  };

  const handleClick = () => {
    inputRef.current.focus(); // `input`要素にフォーカスを当てる
  };

  const words = inputText
    .split(/\s+/)
    .filter(Boolean)
    .map((word, index) => (
      <span
        key={index}
        onClick={() => handleWordClick(word)}
        style={{
          cursor: "pointer",
          margin: "0 5px",
          zIndex: 1,
          position: "relative",
        }}
      >
        {word}
      </span>
    ));

  return (
    <div
      onClick={handleClick}
      style={{
        position: "relative",
        minWidth: "200px",
        minHeight: "20px",
        border: "1px solid black",
      }}
    >
      <input
        ref={inputRef}
        type="text"
        value={inputText}
        onChange={handleInputChange}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          opacity: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
        placeholder="英文を入力してください"
      />
      <div style={{ pointerEvents: "none" }}>{words}</div>
    </div>
  );
};
