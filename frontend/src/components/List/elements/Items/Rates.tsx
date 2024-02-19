import * as React from "react";
import Rating, { IconContainerProps } from "@mui/material/Rating";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";

type LikeRates = "veryGood" | "good" | "normal" | "bad" | "veryBad";
const DEFAULT_RATE = "normal";

const toLikeRates = (rate: number): LikeRates => {
  if (rate === 1) {
    return "veryBad";
  }
  if (rate === 2) {
    return "bad";
  }
  if (rate === 3) {
    return "normal";
  }
  if (rate === 4) {
    return "good";
  }
  if (rate === 5) {
    return "veryGood";
  }
  return DEFAULT_RATE;
};
const fromLikeRates = (rate: LikeRates): number => {
  if (rate === "veryBad") {
    return 1;
  }
  if (rate === "bad") {
    return 2;
  }
  if (rate === "normal") {
    return 3;
  }
  if (rate === "good") {
    return 4;
  }
  if (rate === "veryGood") {
    return 5;
  }
  return 3;
};

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
      defaultValue={fromLikeRates(props.rate as LikeRates)}
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
