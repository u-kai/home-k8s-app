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
import { Sentence, WordProfile } from "../../../../contexts/wordbook";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { UpdateWordProfileModal } from "./UpdateWordProfileModal";
type WordAndSentencesProps = {
  wordProfile: WordProfile;
  deleteWord: () => Promise<void>;
  updateWordProfile: () => Promise<void>;
};

export const WordAndSentences = (props: WordAndSentencesProps) => {
  const [deletePushed, setDeletePushed] = React.useState(false);
  const [updatePushed, setUpdatePushed] = React.useState(false);
  const [expanded, setExpanded] = React.useState<boolean>(false);
  const { value, meaning, pronunciation } = props.wordProfile.word;
  const { sentences } = props.wordProfile;
  return (
    <Accordion sx={{ zIndex: 0, position: "relative" }} expanded={expanded}>
      <AccordionSummary
        expandIcon={
          <div onClick={() => setExpanded(!expanded)}>
            <ExpandMoreIcon />
          </div>
        }
        aria-controls="panel1a-content"
        id="panel1a-header"
        sx={{ height: 80, zIndex: 1, position: "relative" }}
      >
        <Typography
          sx={{ width: "80%", position: "absolute", top: "0", zIndex: 4 }}
        >
          <HorizontalContainer>
            <WordLine
              word={value}
              pronunciation={pronunciation}
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
              onClick={async () => {
                setUpdatePushed(true);
              }}
            />
            <UpdateWordProfileModal
              updateHandler={props.updateWordProfile}
              open={updatePushed}
              setOpen={setUpdatePushed}
              wordProfile={props.wordProfile}
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
              onClick={() => {
                setDeletePushed(true);
              }}
            />
            <DeleteConfirmModal
              deleteHandler={props.deleteWord}
              word={value}
              open={deletePushed}
              setOpen={setDeletePushed}
            ></DeleteConfirmModal>
          </HorizontalContainer>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <>
          <Typography>{meaning}</Typography>
          {sentences.map((sentence, index) => {
            return (
              <li key={index}>
                <ul key={index}>
                  <Typography key={index}>
                    <WordLine
                      word={sentence.sentence.value}
                      pronunciation={sentence.sentence.pronunciation}
                      wordSize="medium"
                    />
                    <Typography>{sentence.sentence.meaning}</Typography>
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
