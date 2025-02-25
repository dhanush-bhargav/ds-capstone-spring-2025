import React, { useState } from "react";
import { Box, Typography, Button, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import axios from "axios";

const FinalEvaluation = ({ question, stance, strength, setFinalStance, setFinalStrength, token, conversationId }) => {
  const [userFinalStance, setUserFinalStance] = useState("");
  const [userFinalStrength, setUserFinalStrength] = useState(null);
  const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
      setIsLoading(true);
      setError(null)
    try {
      // Call create_conversation with collected_at = 'END'
      await axios.post('http://localhost:5000/create_conversation', {
        topic_id: question, // Assuming 'question' holds the topic ID
        user_id: localStorage.getItem('token'), // Or however you get the user ID
        stance: userFinalStance,
        stance_rating: parseInt(userFinalStrength),
        collected_at: "END"
      }, {
          headers: { Authorization: `Bearer ${token}` }
      });


      setFinalStance(userFinalStance);
      setFinalStrength(userFinalStrength);
      setSubmitted(true);

    } catch (error) {
        setError(error.response?.data?.message || 'Failed to submit Final Evaluation.');
    }
    finally{
        setIsLoading(false)
    }
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", padding: 3, border: "1px solid #ddd", borderRadius: 2 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center">Final Evaluation</Typography>

      <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>Question:</Typography>
       {/* Need to fetch and display the actual question text here */}
      <Typography>{question}</Typography>
        {isLoading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

      {!submitted ? (
        <>
          {/* Final Stance Selection */}
          <Typography variant="h6" fontWeight="bold" sx={{ mt: 3 }}>What is your final stance?</Typography>
          <RadioGroup row value={userFinalStance} onChange={(e) => setUserFinalStance(e.target.value)}>
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="No" control={<Radio />} label="No" />
          </RadioGroup>

          {/* Final Strength Rating */}
          <Typography variant="h6" fontWeight="bold" sx={{ mt: 3 }}>Rate how strongly you feel about your final stance</Typography>
          <RadioGroup row value={userFinalStrength} onChange={(e) => setUserFinalStrength(e.target.value)}>
            {[...Array(10)].map((_, i) => (
              <FormControlLabel key={i} value={i + 1} control={<Radio />} label={i + 1} />
            ))}
          </RadioGroup>

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3, width: "100%" }}
            onClick={handleSubmit}
            disabled={!userFinalStance || !userFinalStrength}
          >
            Submit Final Evaluation
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h5" fontWeight="bold" sx={{ mt: 3 }}>Comparison</Typography>

          <Typography><strong>Initial Stance:</strong> {stance}</Typography>
          <Typography><strong>Initial Strength:</strong> {strength}/10</Typography>
          <Typography><strong>Final Stance:</strong> {userFinalStance}</Typography>
          <Typography><strong>Final Strength:</strong> {userFinalStrength}/10</Typography>
        </>
      )}
    </Box>
  );
};

export default FinalEvaluation;