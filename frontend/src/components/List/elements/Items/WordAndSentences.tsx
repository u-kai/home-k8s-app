import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { WordLine } from "./WordLine";
import { styled } from "styled-components";
import { Rates } from "./Rates";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { Sentence } from "../../../../contexts/wordbook";
type WordAndSentencesProps = {
  word: string;
  meaning: string;
  pronunciation?: string;
  sentences: Sentence[];
};

export const WordAndSentences = (props: WordAndSentencesProps) => {
  return (
    <Accordion sx={{ zIndex: 0, position: "relative" }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        sx={{ height: 80, zIndex: 1, position: "relative" }}
      >
        <Typography
          sx={{ width: "80%", position: "absolute", top: "0", zIndex: 4 }}
        >
          <HorizontalContainer>
            <WordLine
              word={props.word}
              pronunciation={props.pronunciation}
              wordSize="large"
            />
            <Rates />
            <ModeEditOutlineIcon
              fontSize="large"
              sx={{
                cursor: "pointer",
                marginLeft: "20px",
                ":hover": {
                  opacity: 0.5,
                },
              }}
            />
            <DeleteForeverIcon
              fontSize="large"
              sx={{
                cursor: "pointer",
                marginLeft: "20px",
                ":hover": {
                  opacity: 0.5,
                },
              }}
            />
          </HorizontalContainer>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <>
          <Typography>{props.meaning}</Typography>
          {props.sentences.map((sentence, index) => {
            return (
              <li key={index}>
                <ul key={index}>
                  <Typography key={index}>
                    <WordLine
                      word={sentence.value}
                      pronunciation={sentence.pronunciation}
                      wordSize="medium"
                    />
                    <Typography>{sentence.meaning}</Typography>
                  </Typography>
                </ul>
              </li>
            );
          })}
        </>
      </AccordionDetails>
    </Accordion>
  );
};

const HorizontalContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  z-index: 4;
  position: absolute;
`;
