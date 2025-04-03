import React, { useState, useEffect } from 'react';
// Import necessary MUI components
import {
    Container,
    Box,
    Typography,
    Divider,
    CircularProgress,
    Alert,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button
} from '@mui/material';

const SocialDesirability = (props) => {
  const [questions, setQuestions] = useState(props.questions || []);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API endpoint URL for Social Desirability
  const apiUrl = 'http://localhost:5000/get_assessment_questions?assessment_type=SOCIAL_DESIRABILITY';

  // useEffect hook for fetching data - logic remains the same
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
          setAnswers({}); // Reset answers on load/reload
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

  // handleAnswerChange remains the same: converts string "true"/"false" to boolean
  const handleAnswerChange = (questionId, value) => {
    const booleanValue = value === 'true';
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: booleanValue
    }));
  };

  // handleSubmit remains the same: prevents default, logs state, shows alert
  const handleSubmit = (event) => {
    event.preventDefault();
    if (Object.keys(answers).length !== questions.length) {
        alert("Please answer all questions before submitting.");
        return;
    }
    // console.log("Submitted Answers (Social Desirability):", answers);
    // alert('Social Desirability assessment submitted! Check the console for answers.');
    // Add API call to submit answers here if needed
    props.updateLoading(true);
    props.updateError(null);
    props.updateSocialDesirability(answers);
    props.updateStep(props.step+1);
  };

  // allQuestionsAnswered logic remains the same
  const allQuestionsAnswered = questions.length > 0 && Object.keys(answers).length === questions.length;

  return (
    // Use MUI Container for layout
    <Container maxWidth="md" sx={{ my: 4 }}>
      {/* Use MUI Typography for headings and paragraphs */}
      <Typography variant="h4" component="h1" gutterBottom>
        Social Desirability
      </Typography>
      <Typography variant="body1" paragraph>
        Social desirability is a bias that occurs when respondents provide answers that they believe are more socially acceptable or favorable, rather than their true feelings or beliefs. This can lead to inaccurate data and misinterpretation of results.
      </Typography>
      <Typography variant="body1" paragraph>
        Please answer the following questions honestly (Yes or No). Your responses help in understanding potential biases. (Required for all questions)
      </Typography>
      {/* Use MUI Divider */}
      <Divider sx={{ my: 3 }} />

      {/* Loading State using CircularProgress */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State using Alert */}
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          Error loading questions: {error}
        </Alert>
      )}

      {/* Questions Form using MUI components */}
      {!loading && !error && questions.length > 0 && (
        <form onSubmit={handleSubmit}>
          {questions.map((question) => (
            // Render only if the question type is YES_OR_NO
            question.answer_type === 'YES_OR_NO' && (
              <FormControl
                key={question.assessment_question_id}
                component="fieldset" // Important for grouping
                variant="standard"
                required // Mark the group as required
                fullWidth
                sx={{ my: 3, border: '1px solid #eee', p: 2, borderRadius: 1 }} // Styling
              >
                {/* Question Text using FormLabel */}
                <FormLabel component="legend" sx={{ mb: 1.5, fontWeight: 'bold', fontSize: '1.1rem', color: 'text.primary' }}>
                  {question.assessment_question}
                </FormLabel>
                {/* RadioGroup for Yes/No options */}
                <RadioGroup
                  row // Display Yes/No side-by-side
                  name={`question_${question.assessment_question_id}`}
                  // Bind value: Convert boolean state (true/false) to string ("true"/"false")
                  value={answers[question.assessment_question_id]?.toString() || ''}
                  // Update state via handleAnswerChange, passing string value "true" or "false"
                  onChange={(event) => handleAnswerChange(question.assessment_question_id, event.target.value)}
                  sx={{ justifyContent: 'flex-start', gap: 4, pl: 1 }} // Align left with some space
                >
                  {/* Yes Option */}
                  <FormControlLabel
                    value="true" // The string value for this option
                    control={<Radio required />} // The radio button itself, marked required
                    label="Yes" // The visible label
                  />
                  {/* No Option */}
                  <FormControlLabel
                    value="false" // The string value for this option
                    control={<Radio required />} // Radio button (required needed on at least one)
                    label="No" // The visible label
                  />
                </RadioGroup>
              </FormControl>
            )
          ))}

          {/* Submit Button Area */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            {/* MUI Button */}
            <Button
              type="submit"
              variant="contained"
              disabled={!allQuestionsAnswered} // Use state to control disabled status
              size="large"
            >
              Submit Assessment
            </Button>
            {/* Helper text */}
            {!allQuestionsAnswered && questions.length > 0 && (
              <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                Please answer all questions to enable submission.
              </Typography>
            )}
          </Box>
        </form>
      )}

      {/* No Questions Loaded Message using Alert */}
      {!loading && !error && questions.length === 0 && (
         <Alert severity="info" sx={{ my: 2 }}>
             No assessment questions available at this time.
         </Alert>
      )}
    </Container>
  );
}

export default SocialDesirability;