import React from "react";
import { MenuItem } from "@mui/material";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import { styled } from "styled-components";
import { SortButton } from "./SortButton";

export type TopOrBottom = "top" | "bottom";
const reverse = (topOrBottom: TopOrBottom) =>
  topOrBottom === "top" ? "bottom" : "top";

export type SortBoxProps = {
  [key: string]: {
    f: (topOrBottom: TopOrBottom) => void;
  };
};

export const SortBox = (props: SortBoxProps) => {
  const [open, setOpen] = React.useState(false);
  const initState = Object.keys(props)
    .map((key) => ({
      [key]: "top" as TopOrBottom,
    }))
    .reduce((acc, cur) => ({ ...acc, ...cur }), {});

  const [sortTypesState, setSortTypesState] = React.useState<{
    [key: string]: TopOrBottom;
  }>(initState);

  const newF = (key: string) => (topOrBottom: TopOrBottom) => {
    setOpen(false);
    setSortTypesState((prev) => ({ ...prev, [key]: topOrBottom }));
    props[key].f(topOrBottom);
  };

  const childProps = Object.keys(props)
    .map((key) => ({
      [key]: {
        state: sortTypesState[key],
        f: newF(key),
      },
    }))
    .reduce((acc, cur) => ({ ...acc, ...cur }), {});

  return (
    <Container>
      <SortButton onClick={() => setOpen((prev) => !prev)} />
      {open ? <SortMenu {...childProps} /> : null}
    </Container>
  );
};

const Container = styled.div`
  width: 200px;
`;

type SortMenuProps = {
  [key: string]: {
    state: TopOrBottom;
    f: (topOrBottom: TopOrBottom) => void;
  };
};

const SortMenu = (props: SortMenuProps) => {
  return (
    <SortMenuContainer>
      {Object.keys(props).map((key, index) => (
        <SortItem
          name={key}
          key={index}
          onClick={props[key].f}
          topOrBottom={props[key].state}
        />
      ))}
    </SortMenuContainer>
  );
};

const SortItem = (props: {
  name: string;
  topOrBottom: TopOrBottom;
  onClick: (topOrBottom: TopOrBottom) => void;
}) => {
  return (
    <MenuItem
      onClick={() => {
        props.onClick(reverse(props.topOrBottom));
      }}
      style={{ display: "flex", justifyContent: "space-between" }}
    >
      {props.name}
      <div>
        {props.topOrBottom === "top" ? (
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
