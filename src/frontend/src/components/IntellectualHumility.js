import React, { useState, useEffect } from "react";
import {
  Container, // Main layout container
  Box, // Generic layout box
  Typography, // For text elements
  Divider, // Horizontal line
  CircularProgress, // Loading indicator
  Alert, // Error/info messages
  FormControl, // Form group wrapper
  FormLabel, // Label for form group (question text)
  RadioGroup, // Groups radio buttons
  FormControlLabel, // Wrapper for individual radio + label
  Radio, // Radio button input
  Button, // Submit button
} from "@mui/material";

// Define labels for the 5-point scale (can be outside the component)
const scaleLabels = {
  1: "Strongly Disagree",
  2: "Disagree",
  3: "Neutral",
  4: "Agree",
  5: "Strongly Agree",
};

const IntellectualHumility = (props) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState(props.intellectualHumility || {}); // Initialize with props answers
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(
    props.submissionStatus.humility || false
  );
  console.log("Intellectual Humility Props", props);

  const apiUrl =
    "http://localhost:5000/get_assessment_questions?assessment_type=INTELLECTUAL_HUMILITY";

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      setError(null);
      setQuestions([]); // Clear previous questions
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success && Array.isArray(data.assessment_questions)) {
          setQuestions(data.assessment_questions);
        } else {
          throw new Error(
            data.message || "Failed to fetch questions or invalid data format."
          );
        }
      } catch (err) {
        console.error("Failed to fetch assessment questions:", err);
        setError(
          err.message || "An unknown error occurred while fetching questions."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [apiUrl]); // Dependency array includes apiUrl

  const handleAnswerChange = (questionId, value) => {
    // Prevent changes if already submitted
    if (isSubmitted) return;

    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: parseInt(value, 10), // Ensure value is stored as a number
    }));
  };

  // Handler for form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    if (isSubmitted || isSubmitting) {
      props.updateStep(props.step + 1);
      return;
    }

    const numAnswers = Object.keys(answers).length;
    const numQuestions = questions.length;

    // Validation check
    if (numAnswers !== numQuestions) {
      setError("Please answer all questions before submitting."); // Use state for error message
      return;
    }

    setIsSubmitting(true); // Indicate submission is in progress
    setError(null); // Clear previous errors
    props.updateError(null); // Clear parent error state

    console.log("Submitting Answers:", answers);

    // Simulate async submission or call parent update functions
    try {
      console.log("props Submission Status", props.submissionStatus);
      props.updateIntellectualHumility(answers);
      props.updateStep(props.step + 1);
      props.updateSubmissionStatus({
        ...props.submissionStatus,
        humility: true, // Update submission status in parent
      });

      // *** Set submitted state to true on success ***
      setIsSubmitted(true);
      console.log("Assessment submitted successfully.");
    } catch (submitError) {
      console.error("Error during submission process:", submitError);
      const message =
        submitError.message || "An error occurred during submission.";
      setError(message); // Show error locally
      props.updateError(message); // Show error in parent if needed
      // Keep form enabled if submission itself failed
    } finally {
      setIsSubmitting(false);
      props.updateSubmissionStatus({
        ...props.submissionStatus,
        humility: true, // Update submission status in parent
      });
    }
  };

  const allQuestionsAnswered =
    questions.length > 0 && Object.keys(answers).length === questions.length;

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Initial Assessment - Section 1
      </Typography>
      {/* Intro text */}
      <Typography variant="body1" paragraph>
        Please rate your agreement with the following statements. (Required for
        all questions)
      </Typography>
      <Divider sx={{ my: 3 }} />

      {/* Loading Indicator */}
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Fetching Error Display */}
      {error &&
        !isSubmitting && ( // Show fetch/validation errors when not in submitting process
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        )}

      {/* Submission Success Message */}
      {isSubmitted && (
        <Alert severity="success" sx={{ my: 2 }}>
          Assessment submitted successfully. You cannot change your answers now.
        </Alert>
      )}

      {/* Form Area - Render only if not loading, no fetch error, and questions exist */}
      {!isLoading && questions.length > 0 && (
        <form onSubmit={handleSubmit}>
          {questions.map((question) => (
            <FormControl
              key={question.assessment_question_id}
              component="fieldset"
              variant="standard"
              required
              fullWidth
              sx={{
                my: 3,
                border: "1px solid #eee",
                p: 2,
                borderRadius: 1,
                opacity: isSubmitted ? 0.7 : 1,
              }} // Visual cue for disabled
              disabled={isSubmitted || isSubmitting} // <<< Disable entire control if submitted or submitting
            >
              <FormLabel
                component="legend"
                sx={{
                  mb: 1.5,
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  color: "text.primary",
                }}
              >
                {question.assessment_question}
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby={`question-label-${question.assessment_question_id}`}
                name={`question_${question.assessment_question_id}`}
                value={
                  answers[question.assessment_question_id]?.toString() || ""
                }
                onChange={(event) =>
                  handleAnswerChange(
                    question.assessment_question_id,
                    event.target.value
                  )
                }
                sx={{ justifyContent: "space-around", flexWrap: "wrap" }}
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <FormControlLabel
                    key={value}
                    value={value.toString()}
                    // The FormControl 'disabled' prop should handle disabling the Radio
                    control={
                      <Radio required disabled={isSubmitted || isSubmitting} />
                    } // Can explicitly disable radio too
                    label={scaleLabels[value]}
                    labelPlacement="bottom"
                    sx={{ minWidth: "80px", textAlign: "center", mx: 0.5 }}
                    // Disable the label interaction as well
                    disabled={isSubmitted || isSubmitting}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          ))}

          {/* Submit Button Area */}
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              // <<< Disable if not all answered OR already submitted OR currently submitting
              disabled={!allQuestionsAnswered}
              size="large"
            >
              {isSubmitting
                ? "Submitting..."
                : isSubmitted
                ? "Next"
                : "Submit Assessment"}{" "}
              {/* Button text changes */}
            </Button>
            {/* Helper text for enabling submit */}
            {!isSubmitted && !allQuestionsAnswered && questions.length > 0 && (
              <Typography
                variant="caption"
                display="block"
                sx={{ mt: 1, color: "text.secondary" }}
              >
                Please answer all questions to enable submission.
              </Typography>
            )}
          </Box>
        </form>
      )}

      {/* No Questions Available Message */}
      {!isLoading && !error && questions.length === 0 && (
        <Alert severity="info" sx={{ my: 2 }}>
          No assessment questions available at this time.
        </Alert>
      )}
    </Container>
  );
};

export default IntellectualHumility;
