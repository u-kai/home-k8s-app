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
import { speech } from "../../../clients/speech";
import { AppErrorContext } from "../../../contexts/error";

export type WordSummaryProps = {
  profile: WordProfile;
  updateWordProfile: UpdateWordProfile;
  deleteWordProfile: DeleteWordProfile;
};

export const WordSummary = (props: WordSummaryProps) => {
  const { profile } = props;
  const { updateWordProfile, deleteWordProfile } = useWordBook();
  const { user } = useContext(UserContext);
  const { modalWordDispatch } = useContext(ModalContext);
  const { setAppError } = useContext(AppErrorContext);

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
          <PlayAudioButton
            onClick={() => speech(profile.word.value)}
          ></PlayAudioButton>
        </PlayAudioButtonContainer>
        <RatesContainer>
          <Rates
            rate={fromLikeRates(profile.likeRates)}
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
          deleteHandler={async () =>
            handleDelete().catch((e) => {
              console.error(e);
              setAppError({
                message: "削除に失敗しました",
                id: "deleteWordProfile",
                name: "handleDelete",
              });
            })
          }
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
    min-width: 50%;
    font-size: 14px;
  }
`;
const PlayAudioButtonContainer = styled.div`
  @media (max-width: 520px) {
    transform: scale(0.8);
    width: 30px;
  }
`;
const RatesContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  align-items: center;
  @media (max-width: 520px) {
    display: none;
  }
`;
const EditIconContainer = styled.div`
  @media (max-width: 520px) {
    transform: scale(0.8);
    width: 30px;
  }
`;
const DeleteIconContainer = styled.div`
  @media (max-width: 520px) {
    transform: scale(0.8);
    width: 30px;
  }
`;
