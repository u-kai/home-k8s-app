import React from "react";
import MUIAccordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export type AccordionProps = {
  summary: React.ReactNode;
  detail: React.ReactNode;
};

export const Accordion = (props: AccordionProps) => {
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
