import React, { useContext } from "react";
import { styled } from "styled-components";
import { DeleteIcon } from "./DeleteIcon";
import { EditIcon } from "./EditIcon";
import { PlayAudioButton } from "./PlayAudioButton";
import { Rates } from "./Rates";

import { WordProfile } from "../../../contexts/wordbook";
import {
  DeleteWordProfile,
  fromLikeRates,
  toLikeRates,
  UpdateWordProfile,
  useWordBook,
} from "../../../hooks/useWordBooks";
import { UserContext } from "../../../contexts/user";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { ModalContext } from "../../../contexts/modalWord";

export type WordSummaryProps = {
  profile: WordProfile;
  playAudio: () => void;
  updateWordProfile: UpdateWordProfile;
  deleteWordProfile: DeleteWordProfile;
};

export const WordSummary = (props: WordSummaryProps) => {
  const { profile } = props;
  const { updateWordProfile, deleteWordProfile } = useWordBook();
  const { user } = useContext(UserContext);
  const { modalWordDispatch } = useContext(ModalContext);

  const onRateChange = async (rate: number) => {
    const newProfile = { ...profile, likeRates: toLikeRates(rate) };
    await updateWordProfile(props.updateWordProfile, newProfile);
  };
  const handleDelete = async () => {
    await deleteWordProfile(props.deleteWordProfile, {
      userId: user.id,
      wordId: profile.wordId,
    });
  };
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <HorizontalContainer>
        <WordContainer>{profile.word.value}</WordContainer>
        <PlayAudioButtonContainer>
          <PlayAudioButton onClick={props.playAudio}></PlayAudioButton>
        </PlayAudioButtonContainer>
        <RatesContainer>
          <Rates
            initRate={fromLikeRates(profile.likeRates)}
            onChange={onRateChange}
          />
        </RatesContainer>
        <EditIconContainer>
          <EditIcon
            handleEdit={() =>
              modalWordDispatch({
                type: "update",
                payload: {
                  updateTarget: profile,
                },
              })
            }
          />
        </EditIconContainer>
        <DeleteIconContainer>
          <DeleteIcon handleDelete={async () => setOpen(true)} />
        </DeleteIconContainer>
      </HorizontalContainer>
      {open && (
        <DeleteConfirmModal
          open={open}
          setOpen={setOpen}
          word={profile.word.value}
          deleteHandler={async () => handleDelete()}
        />
      )}
    </>
  );
};

const HorizontalContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: flex-start;
`;

const WordContainer = styled.div`
  font-size: 20px;
  overflow: hidden;
  width: 55%;
  @media (max-width: 960px) {
    width: 40%;
  }
  @media (max-width: 800px) {
    width: 30%;
  }
  @media (max-width: 520px) {
    width: 50%;
    font-size: 14px;
  }
`;
const PlayAudioButtonContainer = styled.div``;
const RatesContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  align-items: center;
  @media (max-width: 520px) {
    display: none;
  }
`;
const EditIconContainer = styled.div``;
const DeleteIconContainer = styled.div``;
