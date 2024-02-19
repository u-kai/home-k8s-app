import { List } from "@mui/material";
import { Box, Container } from "@mui/system";
import React, { useContext, useEffect } from "react";
import { styled } from "styled-components";
import { AppErrorContext } from "../../../contexts/error";
import { isFailed } from "../../../fetch";
import { TopOrBottom, useWordBook, reverse } from "../../../hooks/useWordBooks";
import { WordAndSentences } from "./Items/WordAndSentences";
import SortIcon from "@mui/icons-material/Sort";
import { MenuItem } from "@mui/material";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";

export const ListContainer = () => {
  const {
    wordbook,
    fetchAll,
    sortByWord,
    sortByCreatedAt,
    sortByLikeRates,
    sortByUpdatedAt,
  } = useWordBook();
  const [sortHide, setSortHide] = React.useState(true);
  const [wordTopOrBottom, setWordTopOrBottom] =
    React.useState<TopOrBottom>("top");
  const [ratesTopOrBottom, setRatesTopOrBottom] =
    React.useState<TopOrBottom>("top");
  const [createdTopOrBottom, setCreatedTopOrBottom] =
    React.useState<TopOrBottom>("top");
  const [updatedTopOrBottom, setUpdatedTopOrBottom] =
    React.useState<TopOrBottom>("top");
  const { setAppError } = useContext(AppErrorContext);
  useEffect(() => {
    (async () => {
      const result = await fetchAll();
      if (isFailed(result)) {
        setAppError({
          id: "fetchAll",
          name: "fetchAll",
          message: "error in fetchAll" + result.message,
        });
        return;
      }
    })();
  }, []);

  return (
    <Container
      sx={{
        padding: 5,
      }}
    >
      <Box
        sx={{
          height: 500,
          overflowY: "scroll",
        }}
      >
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
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {wordbook !== undefined ? (
            <>
              {wordbook.map((wordProfile, i) => (
                <WordAndSentences key={i} wordProfile={wordProfile} />
              ))}
            </>
          ) : null}
        </List>
      </Box>
    </Container>
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
