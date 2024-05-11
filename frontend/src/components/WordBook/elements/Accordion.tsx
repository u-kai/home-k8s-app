import React from "react";
import MUIAccordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { WordDetail } from "./WordDetail";
import { WordSummary } from "./WordSummary";

export type WordAccordionProps = {
  word: string;
  rate: number;
  playAudio: () => void;
  handleRateChange: (rate: number) => Promise<void>;
  handleEdit: () => Promise<void>;
  handleDelete: () => Promise<void>;
  wordMeaning: string;
  sentences: {
    sentence: string;
    meaning: string;
  }[];
};

export const WordAccordion = (props: WordAccordionProps) => {
  return (
    <Accordion
      summary={
        <WordSummary
          word={props.word}
          rate={props.rate}
          playAudio={props.playAudio}
          handleRateChange={props.handleRateChange}
          handleEdit={props.handleEdit}
          handleDelete={props.handleDelete}
        />
      }
      detail={
        <WordDetail
          wordMeaning={props.wordMeaning}
          sentences={props.sentences}
          playAudio={props.playAudio}
        />
      }
    />
  );
};

type AccordionProps = {
  summary: React.ReactNode;
  detail: React.ReactNode;
};

const Accordion = (props: AccordionProps) => {
  const [expanded, setExpanded] = React.useState<boolean>(false);
  return (
    <MUIAccordion sx={{ zIndex: 0, position: "relative" }} expanded={expanded}>
      <AccordionSummary
        expandIcon={
          <div onClick={() => setExpanded(!expanded)}>
            <ExpandMoreIcon />
          </div>
        }
        aria-controls="panel1a-content"
        id="panel1a-header"
        sx={{ height: 50, zIndex: 1, position: "relative" }}
      >
        {props.summary}
      </AccordionSummary>

      <AccordionDetails>{props.detail}</AccordionDetails>
    </MUIAccordion>
  );
};
