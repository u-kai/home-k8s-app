import { TextField } from "@mui/material";
import React from "react";
import { styled } from "styled-components";

const DEFAULT_WIDTH = "200px";
const DEFAULT_HEIGHT = "100px";

export const LongSentenceArea = (props: {
  width?: string;
  height?: string;
  value: string;
  placeholder?: string;
  handleChange: (value: string) => void;
  handleWordClick: (word: string) => Promise<void>;
  handleEnter?: () => void;
}) => {
  // splitは空文字に対しては第一要素が空文字の配列を返すため、配列の長さは常に1以上
  const width = props.width || DEFAULT_WIDTH;
  const height = props.height || DEFAULT_HEIGHT;
  const placeholder = props.placeholder || "Type here";

  return (
    <Container width={width} height={height}>
      <TextField
        id="outlined-multiline-static"
        label={placeholder}
        multiline
        sx={{ width: "100%", height: "100%" }}
        rows={5}
        onChange={(e) => props.handleChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && props.handleEnter) {
            props.handleEnter();
          }
        }}
        value={props.value}
        onSelectCapture={(e) => {
          const input = e.target as HTMLTextAreaElement;
          if (input.selectionStart === input.selectionEnd) {
            return;
          }
          const selectedText = input.value.substring(
            input.selectionStart,
            input.selectionEnd
          );
          // ユーザーのミスで空白を選択してしまう場合がある
          if (selectedText.trim().length > 0) {
            props.handleWordClick(selectedText);
          }
          // この実行をしないと再度このハンドラーが呼ばれて、無限ループになる
          input.setSelectionRange(0, 0);
        }}
      />
    </Container>
  );
};

const Container = styled.div<{ width: string; height: string }>`
  position: relative;
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;
