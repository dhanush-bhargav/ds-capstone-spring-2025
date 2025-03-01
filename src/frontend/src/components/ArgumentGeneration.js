import React, { useState } from "react";
import { Box, Typography, TextField, Button, Grid } from "@mui/material";

const ArgumentGeneration = ({ question, setUserArguments, setStep }) => {
  const [proArguments, setProArguments] = useState([]);
  const [conArguments, setConArguments] = useState([]);
  const [currentProArg, setCurrentProArg] = useState("");
  const [currentConArg, setCurrentConArg] = useState("");

  const handleAddProArgument = () => {
    if (currentProArg.trim()) {
      setProArguments((prev) => [...prev, currentProArg]);
      setCurrentProArg("");
    }
  };

  const handleAddConArgument = () => {
    if (currentConArg.trim()) {
      setConArguments((prev) => [...prev, currentConArg]);
      setCurrentConArg("");
    }
  };

  const handleSubmit = () => {
    const combinedArguments = [...proArguments, ...conArguments];

    if (combinedArguments.length === 0) {
      console.warn("No arguments entered. Cannot proceed.");
      return;
    }

    console.log("Saving arguments:", combinedArguments);

    setUserArguments(combinedArguments);

    // ✅ Correct Step Transition: Move to Argument Display (step 4)
    setStep(4);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", padding: 3 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center">
        Generate Arguments
      </Typography>
      <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
        Question: {question}
      </Typography>
      <Typography sx={{ mb: 3 }}>
        Enter arguments <strong>for</strong> and <strong>against</strong> the topic.
      </Typography>

      {/* Two-Column Layout for Arguments */}
      <Grid container spacing={3}>
        {/* Pro Arguments Column */}
        <Grid item xs={6}>
          <Typography variant="h6" fontWeight="bold">Yes Arguments</Typography>
          <TextField
            fullWidth
            label="Enter a supporting argument..."
            variant="outlined"
            value={currentProArg}
            onChange={(e) => setCurrentProArg(e.target.value)}
            sx={{ mt: 1 }}
          />
          <Button
            variant="contained"
            color="success"
            sx={{ mt: 1, width: "100%" }}
            onClick={handleAddProArgument}
          >
            Add Yes Argument
          </Button>

          <Box sx={{ mt: 2 }}>
            {proArguments.map((arg, index) => (
              <Typography key={index} sx={{ backgroundColor: "#e3fcef", padding: 1, borderRadius: 1, mt: 1 }}>
                {arg}
              </Typography>
            ))}
          </Box>
        </Grid>

        {/* Con Arguments Column */}
        <Grid item xs={6}>
          <Typography variant="h6" fontWeight="bold">No Arguments</Typography>
          <TextField
            fullWidth
            label="Enter an opposing argument..."
            variant="outlined"
            value={currentConArg}
            onChange={(e) => setCurrentConArg(e.target.value)}
            sx={{ mt: 1 }}
          />
          <Button
            variant="contained"
            color="error"
            sx={{ mt: 1, width: "100%" }}
            onClick={handleAddConArgument}
          >
            Add No Argument
          </Button>

          <Box sx={{ mt: 2 }}>
            {conArguments.map((arg, index) => (
              <Typography key={index} sx={{ backgroundColor: "#fde2e2", padding: 1, borderRadius: 1, mt: 1 }}>
                {arg}
              </Typography>
            ))}
          </Box>
        </Grid>
      </Grid>

      {/* Submit Button */}
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3, width: "100%" }}
        onClick={handleSubmit}
        disabled={proArguments.length === 0 && conArguments.length === 0}
      >
        Submit Arguments
      </Button>
    </Box>
  );
};

export default ArgumentGeneration;

