import React from "react";
import { Stepper, Step, StepLabel, Box } from "@mui/material";

const steps = [
  "Select Topic & Question",
  "Choose Stance",
  "Rate Strength",
  "Instructions",
  "Generate Arguments",
  "Review & Sort Arguments",
  "Rate Implications",
  "Final Evaluation"
];

const StepperComponent = ({ step }) => {
  return (
    <Box sx={{ width: "100%", marginBottom: 4 }}>
      <Stepper activeStep={step - 1} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default StepperComponent;
