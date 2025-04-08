import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Container,
  Box,
  Typography,
  Divider,
  Paper,
  Button } from '@mui/material';

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
export const BackButton = ({
  onBack,        
  disableBack,   
  sx,           
}) => {
  return (
    <Box sx={{ mb: 2,textAlign: 'left', ...sx }}>
      
      <Button
        variant="outlined" 
        color="secondary"    
        onClick={onBack}
        disabled={disableBack}
        startIcon={<ArrowBackIcon />} 
      >
        Back 
      </Button>
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
export const Feedback = () => {
  return (
    <Container maxWidth="sm" sx={{ my: 4 }}> {/* sm is suitable for summary views */}
            <Paper elevation={3} sx={{ padding: { xs: 2, sm: 4 } }}> {/* Use Paper for visual grouping */}
                <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                    Feedback
                </Typography>

                <div>
                  Leave your Feedback here: Google Form link
                </div>

            </Paper>
        </Container>
  );
};