import { styled } from "styled-components";

export const TextArea = styled.textarea<{ color: string }>`
  position: absolute;
  border: 1px solid #ccc; /* より薄いグレーの枠線 */
  border-radius: 8px; /* 角の丸みを加える */
  z-index: 1;
  color: ${(props) => props.color};
  background-color: rgba(255, 255, 255, 0.5); /* より薄い半透明の背景色 */
  resize: none; /* リサイズ不可 */
  height: 100%;
  width: 100%;
  padding: 10px; /* 内部の余白 */
  outline: none; /* アウトラインを削除 */
  &:hover,
  &:focus {
    border-color: #888; /* ホバーまたはフォーカス時の枠線の色を濃いめのグレーに */
    background-color: rgba(
      255,
      255,
      255,
      0.7
    ); /* ホバーまたはフォーカス時の背景色を少し濃く */
  }
`;
