import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { WordLine } from "./WordLine";
import { styled } from "styled-components";
import { Rates } from "./Rates";

type WordAndSentencesProps = {
  word: string;
  meaning: string;
  pronunciation?: string;
  sentences: string[];
};

export const WordAndSentences = (props: WordAndSentencesProps) => {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        sx={{ height: 80, zIndex: 1 }}
      >
        <Typography sx={{ width: "80%" }}>
          <HorizontalContainer>
            <WordLine
              word={props.word}
              pronunciation={props.pronunciation}
              wordSize="large"
            />
            <Rates />
          </HorizontalContainer>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <>
          <Typography>{props.meaning}</Typography>
          {props.sentences.map((sentence, index) => {
            return (
              <li>
                <ul>
                  <Typography key={index}>
                    <WordLine word={sentence} wordSize="medium" />
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
`;
