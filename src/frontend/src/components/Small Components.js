import React from "react";
import { Fab } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Stepper, Step, StepLabel, Box } from "@mui/material";

const steps = [
  "Select Question, Stance & Strength",
  "Instructions",
  "Generate & Review Arguments",
  "Categorization",
  "Rate Implications",
  "Final Evaluation",
];

export const Instructions = (props) => {
  props.updateLoading(false);
  return (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-4">Instructions</h2>
      <p className="mb-4">
        Before proceeding, please read the following instructions carefully:
      </p>
      <ul className="text-left list-disc list-inside mb-4">
        <li>
          This exercise is designed to improve your critical-thinking skills,
          your judgments & decisions, and the related outcomes in your life.
        </li>
        <li>
          It involves a simple step-by-step method aimed at enabling you to more
          effectively address any issue.
        </li>
        <li>
          The method works by increasing the amount and quality of information
          you consider.
        </li>
        <li>
          It's important to acknowledge that everyone forms opinions (ranging
          from very negative to very positive) about encountered issues.
        </li>
        <li>
          Opinions are not only inevitable but also essential, motivating people
          to make improvements.
        </li>
        <li>
          However, our ability to solve problems and improve outcomes hinges on
          how well we identify and process relevant information.
        </li>
        <li>
          Therefore, success in this exercise requires you to put aside your
          prior opinions, at least temporarily.
        </li>
        <li>
          You should consider arguments and implications from all sides of the
          issue presented.
        </li>
        <li>
          The purpose of this exercise is NOT to convince you to change your
          current views.
        </li>
        <li>
          Instead, the goal is to make your opinions as reasoned and
          well-informed as possible.
        </li>
        <li>
          The underlying principle is: a more-informed decision is a better
          decision, even if it doesn’t ultimately change your stance.
        </li>
      </ul>
      <button
        onClick={() => props.updateStep(props.step + 1)}
        className="bg-blue-500 text-white px-6 py-2 rounded"
      >
        Next
      </button>
    </div>
  );
};
export const FloatingNavButtons = ({
  onBack,
  onNext,
  disableBack,
  disableNext,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        maxWidth: "600px",
      }}
    >
      <Fab
        color="secondary"
        onClick={onBack}
        disabled={disableBack}
        size="medium"
      >
        <ArrowBackIcon />
      </Fab>
      <Fab
        color="primary"
        onClick={onNext}
        disabled={disableNext}
        size="medium"
      >
        <ArrowForwardIcon />
      </Fab>
    </div>
  );
};

export const StepperComponent = ({ step }) => {
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

export const StanceSelection = ({ setStance, setStep }) => {
  return (
    <div>
      <h2>What is your stance?</h2>
      <button
        onClick={() => {
          setStance("Yes");
          setStep(3);
        }}
        className="mr-4 p-2 border"
      >
        Yes
      </button>
      <button
        onClick={() => {
          setStance("No");
          setStep(3);
        }}
        className="p-2 border"
      >
        No
      </button>
    </div>
  );
};
