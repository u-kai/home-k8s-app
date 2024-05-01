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
  const heightTextFiled = document.getElementById("outlined-multiline-static")
    ?.style.height;
  return (
    <div
      onClick={handleClick}
      style={{
        position: "absolute",
        top: "100px",
        minWidth: "300px",
        height: heightTextFiled,
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
          width: "100%",
          color: "transparent",
        }}
      />
      <div
        style={{
          position: "absolute",
          zIndex: 1,
          left: 0,
          top: 0,
          //width: "100%",
          //height: "100%",
          whiteSpace: "pre",
          overflow: "hidden",
        }}
      >
        {words.map((word, index) => (
          <span
            key={index}
            style={{
              margin: "0 4px",
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
