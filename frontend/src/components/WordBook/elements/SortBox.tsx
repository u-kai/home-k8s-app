import React from "react";
import { MenuItem } from "@mui/material";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import { styled } from "styled-components";

export type TopOrBottom = "top" | "bottom";
const reverse = (topOrBottom: TopOrBottom) =>
  topOrBottom === "top" ? "bottom" : "top";

export type SortButtonProps = {
  sortTypeToSortFn: { [key: string]: (topOrBottom: TopOrBottom) => void };
};

export const SortButton = (props: SortButtonProps) => {
  return (
    <SortMenuContainer>
      {Object.keys(props.sortTypeToSortFn).map((key, index) => (
        <SortItem
          name={key}
          key={index}
          onClick={(topOrBottom) => {
            props.sortTypeToSortFn[key](topOrBottom);
          }}
        />
      ))}
    </SortMenuContainer>
  );
};

const SortItem = (props: {
  name: string;
  onClick: (topOrBottom: TopOrBottom) => void;
}) => {
  const [topOrBottom, setTopOrBottom] = React.useState<TopOrBottom>("top");
  return (
    <MenuItem
      onClick={() => {
        setTopOrBottom((v) => reverse(v));
        props.onClick(topOrBottom);
      }}
      style={{ display: "flex", justifyContent: "space-between" }}
    >
      {props.name}
      <div>
        {topOrBottom === "top" ? (
          <VerticalAlignTopIcon></VerticalAlignTopIcon>
        ) : (
          <VerticalAlignBottomIcon></VerticalAlignBottomIcon>
        )}
      </div>
    </MenuItem>
  );
};

const SortMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 5px;
  padding: 5px;
`;
