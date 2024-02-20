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
import { WordProfile } from "../../../../contexts/wordbook";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { UpdateWordProfileModal } from "./UpdateWordProfileModal";
import { useWordBook } from "../../../../hooks/useWordBooks";
import { isFailed } from "../../../../fetch";
import { AppErrorContext } from "../../../../contexts/error";

type WordAndSentencesProps = {
  wordProfile: WordProfile;
};

export const WordAndSentences = (props: WordAndSentencesProps) => {
  const [deletePushed, setDeletePushed] = React.useState(false);
  const [updatePushed, setUpdatePushed] = React.useState(false);
  const [expanded, setExpanded] = React.useState<boolean>(false);
  const { value, meaning, pronunciation } = props.wordProfile.word;
  const { sentences, likeRates } = props.wordProfile;
  const { updateWordProfile, deleteWordProfile } = useWordBook();
  const { setAppError } = React.useContext(AppErrorContext);
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
        sx={{ height: 50, zIndex: 1, position: "relative" }}
      >
        <Typography
          sx={{ width: "80%", position: "absolute", top: "0", zIndex: 4 }}
        >
          <HorizontalContainer>
            <WordLine
              word={value}
              pronunciation={pronunciation}
              wordSize="1.3em"
            />
            <Rates
              rate={likeRates}
              onChange={async (rate) => {
                const newWordProfile = {
                  ...props.wordProfile,
                  likeRates: rate,
                };
                const result = await updateWordProfile(newWordProfile);
                if (isFailed(result)) {
                  setAppError({
                    id: "updateWordProfile",
                    name: "updateWordProfile",
                    message: "error in updateWordProfile" + result.message,
                  });
                  return;
                }
              }}
            />
            <div
              style={{
                padding: "10px",
              }}
            ></div>
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
              handleClose={() => {
                setUpdatePushed(false);
              }}
              open={updatePushed}
              oldWordProfile={props.wordProfile}
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
              deleteHandler={async () => {
                const result = await deleteWordProfile(props.wordProfile);
                if (isFailed(result)) {
                  setAppError({
                    id: "deleteWordProfile",
                    name: "deleteWordProfile",
                    message: "error in deleteWordProfile" + result.message,
                  });
                  return;
                }
              }}
              word={value}
              open={deletePushed}
              setOpen={setDeletePushed}
            ></DeleteConfirmModal>
          </HorizontalContainer>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <>
          <Typography sx={{ fontSize: "1em" }}>{meaning}</Typography>
          {sentences.map((sentence, index) => {
            return (
              <li key={index}>
                <ul key={index}>
                  <Typography key={index}>
                    <WordLine
                      word={sentence.sentence.value}
                      pronunciation={sentence.sentence.pronunciation}
                      wordSize="1em"
                    />
                  </Typography>
                  <Typography>{sentence.sentence.meaning}</Typography>
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
