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
  const [questions, setQuestions] = useState([]); // Initialize empty
  const [answers, setAnswers] = useState(props.socialDesirability || {}); // Initialize with props answers
  const [isLoading, setIsLoading] = useState(false); // Renamed for consistency
  const [isSubmitting, setIsSubmitting] = useState(false); // For submission process
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(props.submissionStatus.desirability || false); // <<< Tracks submission status

  // API endpoint URL for Social Desirability
  const apiUrl = 'http://localhost:5000/get_assessment_questions?assessment_type=SOCIAL_DESIRABILITY';

  // useEffect hook for fetching data
  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true); // Use consistent state name
      setError(null);
      setQuestions([]);
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success && Array.isArray(data.assessment_questions)) {
          setQuestions(data.assessment_questions);
        } else {
          throw new Error(data.message || 'Failed to fetch questions or invalid data format.');
        }
      } catch (err) {
        console.error("Failed to fetch assessment questions:", err);
        setError(err.message || "An unknown error occurred while fetching questions.");
      } finally {
        setIsLoading(false); // Use consistent state name
      }
    };

    fetchQuestions();
  }, [apiUrl]); // Dependency array includes apiUrl

  // handleAnswerChange: converts string "true"/"false" to boolean
  const handleAnswerChange = (questionId, value) => {
    // Prevent changes if already submitted
    if (isSubmitted) return;

    const booleanValue = value === 'true';
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: booleanValue
    }));
  };

  // Calculate the number of YES_OR_NO questions that are displayed
  const applicableQuestions = questions.filter(q => q.answer_type === 'YES_OR_NO');
  const applicableQuestionsCount = applicableQuestions.length;

  // Check if all applicable questions have been answered
  const allQuestionsAnswered = applicableQuestionsCount > 0 && Object.keys(answers).length === applicableQuestionsCount;


  // handleSubmit: prevents default, logs state, handles submission process
  const handleSubmit = (event) => {
    event.preventDefault();
    if (isSubmitted || isSubmitting) {
      props.updateStep(props.step + 1);
      return;
    }

    // Use the calculated count for validation
    if (!allQuestionsAnswered) {
        setError("Please answer all questions before submitting."); // Use state for error
        return;
    }

    setIsSubmitting(true); // Indicate submission start
    setError(null); // Clear previous errors
    props.updateError(null); // Clear parent error state

    console.log("Submitting Answers:", answers);

    // Simulate async submission or call parent update functions
    try {
        // Update parent state
        props.updateSocialDesirability(answers);
        props.updateStep(props.step + 1);
        props.updateSubmissionStatus({
          ...props.submissionStatus,
          desirability: true // Update submission status in parent
        });

        // *** Set submitted state to true on success ***
        setIsSubmitted(true);
        console.log("Assessment submitted successfully.");

    } catch (submitError) {
        console.error("Error during submission process:", submitError);
        const message = submitError.message || "An error occurred during submission.";
        setError(message); // Show error locally
        props.updateError(message); // Show error in parent if needed
    } finally {
        setIsSubmitting(false); // Submission attempt finished
        props.updateSubmissionStatus({
          ...props.submissionStatus,
          desirability: true // Update submission status in parent
        });
    }
  };


  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Social Desirability
      </Typography>
      <Typography variant="body1" paragraph>
        Social desirability is a bias that occurs when respondents provide answers that they believe are more socially acceptable or favorable, rather than their true feelings or beliefs. This can lead to inaccurate data and misinterpretation of results.
      </Typography>
      <Typography variant="body1" paragraph>
        Please answer the following questions honestly (Yes or No). Your responses help in understanding potential biases. (Required for all questions)
      </Typography>
      <Divider sx={{ my: 3 }} />

      {/* Loading Indicator */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Fetching/Validation Error Display */}
      {error && !isSubmitting && ( // Show fetch/validation errors when not submitting
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

      {/* Questions Form */}
      {/* Render only if not loading, no fetch error, and there are applicable questions */}
      {!isLoading && applicableQuestionsCount > 0 && (
        <form onSubmit={handleSubmit}>
          {/* Use the filtered list for rendering */}
          {applicableQuestions.map((question) => (
              <FormControl
                key={question.assessment_question_id}
                component="fieldset"
                variant="standard"
                required
                fullWidth
                sx={{ my: 3, border: '1px solid #eee', p: 2, borderRadius: 1, opacity: isSubmitted ? 0.7 : 1 }} // Visual cue
                disabled={isSubmitted || isSubmitting} // <<< Disable if submitted or submitting
              >
                <FormLabel component="legend" sx={{ mb: 1.5, fontWeight: 'bold', fontSize: '1.1rem', color: 'text.primary' }}>
                  {question.assessment_question}
                </FormLabel>
                <RadioGroup
                  row
                  name={`question_${question.assessment_question_id}`}
                  value={answers[question.assessment_question_id]?.toString() || ''}
                  onChange={(event) => handleAnswerChange(question.assessment_question_id, event.target.value)}
                  sx={{ justifyContent: 'flex-start', gap: 4, pl: 1 }}
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio required disabled={isSubmitted || isSubmitting}/>} // Explicitly disable radio
                    label="Yes"
                    disabled={isSubmitted || isSubmitting} // Disable label interaction
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio required disabled={isSubmitted || isSubmitting}/>} // Explicitly disable radio
                    label="No"
                    disabled={isSubmitted || isSubmitting} // Disable label interaction
                  />
                </RadioGroup>
              </FormControl>
          ))}

          {/* Submit Button Area */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              // <<< Disable if not all answered OR already submitted OR currently submitting
              disabled={!allQuestionsAnswered}
              size="large"
            >
              {isSubmitting ? "Submitting..." : (isSubmitted ? "Next" : "Submit Assessment")} {/* Button text changes */}
            </Button>
            {/* Helper text */}
            {!isSubmitted && !allQuestionsAnswered && applicableQuestionsCount > 0 && (
              <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                Please answer all questions to enable submission.
              </Typography>
            )}
          </Box>
        </form>
      )}

      {/* No Questions Available Message */}
      {/* Show if not loading, no error, and no *applicable* questions found */}
      {!isLoading && !error && applicableQuestionsCount === 0 && (
         <Alert severity="info" sx={{ my: 2 }}>
             No assessment questions available at this time or suitable questions found.
         </Alert>
      )}
    </Container>
  );
}

export default SocialDesirability;