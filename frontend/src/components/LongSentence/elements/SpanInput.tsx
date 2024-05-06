import { TextField } from "@mui/material";
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

  const words = inputText.split(" ").filter(Boolean);
  return (
    <div
      onClick={handleClick}
      style={{
        position: "absolute",
        top: "100px",
        minWidth: "300px",
        height: "200px",
        zIndex: -2,
        backgroundColor: "transparent",
      }}
    >
      <textarea
        id="outlined-multiline-static"
        value={inputText}
        onChange={handleInputChange}
        style={{
          position: "absolute",
          border: "1px solid black",
          zIndex: 1,
          height: "200px",
          width: "100%",
          color: "transparent",
          resize: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          zIndex: 1,
          left: 0,
          top: 0,
          maxWidth: "100%",
          whiteSpace: "pre-wrap",
          overflow: "hidden",
        }}
      >
        {words.map((word, index) => (
          <span
            key={index}
            style={{
              margin: "0 4px",
              cursor: "pointer",
              display: "inline-block",
            }}
            onClick={() => handleWordClick(word)}
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
};
