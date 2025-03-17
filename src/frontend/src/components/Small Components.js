import React from 'react';
import { Fab } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Stepper, Step, StepLabel, Box } from "@mui/material";

const steps = [
  "Select Question, Stance & Strength",
  "Instructions",
  "Generate & Review Arguments",
  "Categorization",
  "Rate Implications",
  "Final Evaluation"
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
        <li>You will now generate arguments for and against your stance.</li>
        <li>Try to be as detailed as possible.</li>
        <li>Consider perspectives from different viewpoints.</li>
        <li>You will later categorize and evaluate these arguments.</li>
      </ul>
      <button 
        onClick={() => props.updateStep(3)} 
        className="bg-blue-500 text-white px-6 py-2 rounded"
      >
        Next
      </button>
    </div>
  );
};
export const FloatingNavButtons = ({ onBack, onNext, disableBack, disableNext }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '600px',
    }}>
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
      <button onClick={() => { setStance("Yes"); setStep(3); }} className="mr-4 p-2 border">Yes</button>
      <button onClick={() => { setStance("No"); setStep(3); }} className="p-2 border">No</button>
    </div>
  );
};
