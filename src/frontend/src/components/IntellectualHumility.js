import React, { useState, useEffect } from 'react';
import {
    Container, // Main layout container
    Box,       // Generic layout box
    Typography,// For text elements
    Divider,   // Horizontal line
    CircularProgress, // Loading indicator
    Alert,     // Error/info messages
    FormControl, // Form group wrapper
    FormLabel, // Label for form group (question text)
    RadioGroup,// Groups radio buttons
    FormControlLabel, // Wrapper for individual radio + label
    Radio,     // Radio button input
    Button     // Submit button
} from '@mui/material';

// Define labels for the 5-point scale (can be outside the component)
const scaleLabels = {
  1: "Strongly Disagree",
  2: "Disagree",
  3: "Neutral",
  4: "Agree",
  5: "Strongly Agree"
};

const IntellectualHumility = (props) => {
  const [questions, setQuestions] = useState(props.questions || []);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl = 'http://localhost:5000/get_assessment_questions?assessment_type=INTELLECTUAL_HUMILITY';

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success && Array.isArray(data.assessment_questions)) {
          setQuestions(data.assessment_questions);
          setAnswers({}); // Reset answers when questions load/reload
        } else {
          throw new Error('Failed to fetch questions or invalid data format.');
        }
      } catch (err) {
        console.error("Failed to fetch assessment questions:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [apiUrl]);
  
  const handleAnswerChange = (questionId, value) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: parseInt(value, 10)
    }));
  };

  // Handler for form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Submitted Answers (stored in state):", answers);
    if (Object.keys(answers).length !== questions.length) {
        alert("Please answer all questions before submitting.");
        return;
    }
    console.log("Submitted Answers (stored in state):", answers);
    props.updateLoading(true);
    props.updateError(null);
    props.updateIntellectualHumility(answers);
    props.updateStep(props.step+1);
  };

  // Determine if all questions have been answered to enable the submit button
  const allQuestionsAnswered = questions.length > 0 && Object.keys(answers).length === questions.length;

  return (
    // Use MUI Container for consistent padding and max-width
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Intellectual Humility Assessment
      </Typography>
      <Typography variant="body1" paragraph>
        Intellectual humility is the recognition that one's beliefs and opinions may be wrong or incomplete. It involves being open to new ideas, willing to change one's mind, and acknowledging the limits of one's knowledge.
      </Typography>
      <Typography variant="body1" paragraph>
        Please rate your agreement with the following statements. (Required for all questions)
      </Typography>
      <Divider sx={{ my: 3 }} /> {/* MUI Divider */}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          Error loading questions: {error}
        </Alert>
      )}

      {/* Questions Form */}
      {!loading && !error && questions.length > 0 && (
        <form onSubmit={handleSubmit}>
          {questions.map((question) => (
            // FormControl groups the question label and radio buttons
            <FormControl
                key={question.assessment_question_id}
                component="fieldset" // Important for accessibility with RadioGroup
                variant="standard" // Or "outlined" / "filled"
                required // Applies required visually/semantically to the group
                fullWidth // Take full width
                sx={{ my: 3, border: '1px solid #eee', p: 2, borderRadius: 1 }} // Add some styling
            >
              {/* Use FormLabel as the question text */}
              <FormLabel component="legend" sx={{ mb: 1.5, fontWeight: 'bold', fontSize: '1.1rem', color: 'text.primary' }}>
                {question.assessment_question}
              </FormLabel>
              {/* RadioGroup manages the selection */}
              <RadioGroup
                row // Arrange radio buttons horizontally
                aria-labelledby={`question-label-${question.assessment_question_id}`}
                name={`question_${question.assessment_question_id}`}
                // Value needs to be a string, get it from state or default to ''
                value={answers[question.assessment_question_id]?.toString() || ''}
                // Update the 'answers' state when a radio button is selected
                onChange={(event) => handleAnswerChange(question.assessment_question_id, event.target.value)}
                sx={{ justifyContent: 'space-around', flexWrap: 'wrap' }} // Adjust spacing as needed
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  // FormControlLabel pairs a Radio button with its label
                  <FormControlLabel
                    key={value}
                    // Value here MUST be a string to match RadioGroup's value/onChange
                    value={value.toString()}
                    // The actual Radio component
                    control={<Radio required />} // 'required' on Radio enforces selection within group
                    // The descriptive label text
                    label={scaleLabels[value]}
                    // Place label below the radio button
                    labelPlacement="bottom"
                    sx={{ minWidth: '80px', textAlign: 'center', mx: 0.5 }} // Basic styling
                  />
                ))}
              </RadioGroup>
            </FormControl>
          ))}

          {/* Submit Button Area */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              type="submit"
              variant="contained" // MUI button style
              disabled={!allQuestionsAnswered} // Disable if not all answered
              size="large"
            >
              Submit Assessment
            </Button>
            {/* Helper text shown when button is disabled */}
            {!allQuestionsAnswered && questions.length > 0 && (
              <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                Please answer all questions to enable submission.
              </Typography>
            )}
          </Box>
        </form>
      )}

      {/* No Questions Loaded Message */}
      {!loading && !error && questions.length === 0 && (
         <Alert severity="info" sx={{ my: 2 }}>
             No assessment questions available at this time.
         </Alert>
      )}
    </Container>
  );
}

export default IntellectualHumility;