import React from "react";
import { TopOrBottom, useWordBook, reverse } from "../../hooks/useWordBooks";
import { MenuItem } from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import { styled } from "styled-components";

export const SortButton = () => {
  const [sortHide, setSortHide] = React.useState(true);
  const [wordTopOrBottom, setWordTopOrBottom] =
    React.useState<TopOrBottom>("top");
  const [ratesTopOrBottom, setRatesTopOrBottom] =
    React.useState<TopOrBottom>("top");
  const [createdTopOrBottom, setCreatedTopOrBottom] =
    React.useState<TopOrBottom>("top");
  const [updatedTopOrBottom, setUpdatedTopOrBottom] =
    React.useState<TopOrBottom>("top");

  const { sortByWord, sortByCreatedAt, sortByLikeRates, sortByUpdatedAt } =
    useWordBook();
  return (
    <SortIconContainer>
      <SortIcon
        fontSize="large"
        cursor="pointer"
        onClick={() => setSortHide((v) => !v)}
      />
      {sortHide ? null : (
        <SortMenuContainer>
          <SortItem
            sortPriority={1}
            name="Words"
            topOrBottom={wordTopOrBottom}
            setTopOrBottom={() => setWordTopOrBottom((v) => reverse(v))}
            onClick={() => {
              sortByWord(wordTopOrBottom);
              setSortHide(true);
            }}
          />
          <SortItem
            sortPriority={10}
            name="Rates"
            topOrBottom={ratesTopOrBottom}
            setTopOrBottom={() => setRatesTopOrBottom((v) => reverse(v))}
            onClick={() => {
              sortByLikeRates(ratesTopOrBottom);
              setSortHide(true);
            }}
          />
          <SortItem
            sortPriority={20}
            name="Created at"
            topOrBottom={createdTopOrBottom}
            setTopOrBottom={() => setCreatedTopOrBottom((v) => reverse(v))}
            onClick={() => {
              sortByCreatedAt(createdTopOrBottom);
              setSortHide(true);
            }}
          />
          <SortItem
            sortPriority={30}
            name="Updated at"
            topOrBottom={updatedTopOrBottom}
            setTopOrBottom={() => setUpdatedTopOrBottom((v) => reverse(v))}
            onClick={() => {
              sortByUpdatedAt(updatedTopOrBottom);
              setSortHide(true);
            }}
          />
        </SortMenuContainer>
      )}
    </SortIconContainer>
  );
};

const SortItem = (props: {
  sortPriority: number;
  name: string;
  topOrBottom: TopOrBottom;
  setTopOrBottom: () => void;
  onClick: () => void;
}) => {
  return (
    <MenuItem
      value={props.sortPriority}
      onClick={() => {
        props.setTopOrBottom();
        props.onClick();
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

const SortIconContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  position: relative;
`;
const SortMenuContainer = styled.div`
  position: absolute;
  top: 30px;
  right: 0;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 5px;
  padding: 5px;
  z-index: 100;
`;
