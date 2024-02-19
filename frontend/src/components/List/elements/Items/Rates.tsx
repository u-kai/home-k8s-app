import * as React from "react";
import Rating, { IconContainerProps } from "@mui/material/Rating";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import {
  fromLikeRates,
  LikeRates,
  toLikeRates,
  toLikeRatesFromStr,
} from "../../../../hooks/useWordBooks";

const customIcons: {
  [index: string]: {
    icon: React.ReactElement;
    label: string;
  };
} = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon />,
    label: "Very Dissatisfied",
  },
  2: {
    icon: <SentimentDissatisfiedIcon />,
    label: "Dissatisfied",
  },
  3: {
    icon: <SentimentSatisfiedIcon />,
    label: "Neutral",
  },
  4: {
    icon: <SentimentSatisfiedAltIcon />,
    label: "Satisfied",
  },
  5: {
    icon: <SentimentVerySatisfiedIcon />,
    label: "Very Satisfied",
  },
};

function IconContainer(props: IconContainerProps) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

type RatesProps = {
  rate: string;
  onChange: (rate: LikeRates) => Promise<void>;
};

export const Rates = (props: RatesProps) => {
  return (
    <Rating
      name="highlight-selected-only"
      value={fromLikeRates(toLikeRatesFromStr(props.rate))}
      IconContainerComponent={IconContainer}
      highlightSelectedOnly
      onChange={(_, newValue) => {
        if (newValue === null) {
          return;
        }
        props.onChange(toLikeRates(newValue));
      }}
    />
  );
};
