import React from "react";
import { Button, Box } from "@mui/material";

const NavigationButtons = ({ step, setStep }) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
      <Button variant="contained" disabled={step === 0} onClick={() => setStep(step - 1)}>
        Back
      </Button>
      <Button variant="contained" color="primary" onClick={() => setStep(step + 1)}>
        Next
      </Button>
    </Box>
  );
};

export default NavigationButtons;
