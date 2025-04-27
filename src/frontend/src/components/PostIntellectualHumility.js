import React, { useState, useEffect } from 'react';
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
    Button,
    Paper // Keep Paper if desired for sections
} from '@mui/material';
import {baseUrl} from "../config";

// Mapping from numeric answers (1-5) to required string format
const answerMapping = {
    1: "STRONGLY_DISAGREE",
    2: "DISAGREE",
    3: "NEITHER",
    4: "AGREE",
    5: "STRONGLY_AGREE",
};

// Labels for the IH radio buttons (visual only)
const scaleLabels = {
  1: "Strongly Disagree",
  2: "Disagree",
  3: "Neutral",
  4: "Agree",
  5: "Strongly Agree"
};

/**
 * Transforms an object of intellectual humility responses, converting numeric
 * scores (1-5) to their corresponding string descriptors.
 *
 * @param {object} ihResponses - The object containing question IDs as keys and numeric answers (1-5) as values.
 * @returns {object | null} A new object with the same keys but string descriptor values, or null if input is invalid.
 */
function transformHumilityResponses(ihResponses) {
  // Basic input validation
  if (typeof ihResponses !== 'object' || ihResponses === null) {
    console.error("Invalid input for transformHumilityResponses: Expected an object, received:", ihResponses);
    return null; // Or return {}, or throw Error
  }

  // Define the mapping for intellectual humility scores
  const humilityMapping = {
    1: "STRONGLY_DISAGREE",
    2: "DISAGREE",
    3: "NEITHER",
    4: "AGREE",
    5: "STRONGLY_AGREE",
  };

  const transformedResponses = {};

  // Iterate over the keys of the input object
  for (const questionId in ihResponses) {
    // Ensure the property belongs to the object itself
    if (Object.hasOwnProperty.call(ihResponses, questionId)) {
      const numericValue = ihResponses[questionId];
      // Map the numeric value, provide a fallback/warning for unexpected values
      transformedResponses[questionId] = humilityMapping[numericValue] || `UNKNOWN_VALUE_${numericValue}`;
      if (!humilityMapping[numericValue]) {
          console.warn(`Unmapped intellectual humility value: ${numericValue} for question ID ${questionId}`);
      }
    }
  }

  return transformedResponses;
}

const PostIntellectualHumility = (props) => {
  // State for IH Assessment Part
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loadingIH, setLoadingIH] = useState(false); // Loading state for IH fetch
  const [errorIH, setErrorIH] = useState(null);     // Error state for IH fetch

  // State for Final Evaluation Part
  const [userFinalStance, setUserFinalStance] = useState(""); // User's selection for final stance
  const [userFinalStrength, setUserFinalStrength] = useState(null); // User's selection for final strength

  // State for Submission Process
  const [isSubmitting, setIsSubmitting] = useState(false); // Single submitting flag

  // API endpoint for fetching questions
  const apiUrl = `${baseUrl}/get_assessment_questions?assessment_type=INTELLECTUAL_HUMILITY`;

  // Effect for fetching IH questions
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoadingIH(true);
      setErrorIH(null);
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.success && Array.isArray(data.assessment_questions)) {
          setQuestions(data.assessment_questions);
          setAnswers({}); // Reset answers on load
        } else {
          throw new Error(data.message || 'Failed to fetch questions or invalid data format.');
        }
      } catch (err) {
        console.error("Failed to fetch assessment questions:", err);
        setErrorIH(err.message);
      } finally {
        setLoadingIH(false);
      }
    };
    fetchQuestions();
  }, [apiUrl]);

  // Handler for IH answer changes
  const handleAnswerChange = (questionId, value) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: parseInt(value, 10)
    }));
  };

  // Single Submit Handler for ALL data
  const handleSubmit = async (event) => {
    event.preventDefault();
    props.updateFinalStance(userFinalStance);
    props.updateFinalStrength(userFinalStrength);

    // Combined Validation
    const allIHAnswered = props.questionNumber === 2 ? (questions.length > 0 && Object.keys(answers).length === questions.length) : true;
    if (!allIHAnswered || !userFinalStance || !userFinalStrength) {
        alert("Please answer all Intellectual Humility questions AND select your final stance and strength before submitting.");
        return;
    }

    // console.log("Attempting Combined Submission:", { answers, userFinalStance, userFinalStrength });

    // Check for required props
    const { topic, conversationId, userId, token, step, updateStep, updateLoading, updateError, updateSubmissionResponse } = props;
    if (typeof topic === 'undefined' || typeof conversationId === 'undefined' || !userId) {
        const errorMsg = "Missing required information (topic, conversation, user details) to submit.";
        console.error(errorMsg, { topic, conversationId, userId });
        if (updateError) updateError(errorMsg);
        else alert(errorMsg);
        return;
    }

    setIsSubmitting(true);
    if (updateLoading) updateLoading(true);
    if (updateError) updateError(null);

    try {
        // Construct the Payload with FINAL stance/rating
        const intellectual_humility_responses = Object.entries(answers).map(([questionIdStr, numericAnswer]) => {
            const questionId = parseInt(questionIdStr, 10);
            const answerString = answerMapping[numericAnswer];
            if (!answerString) console.warn(`Could not map numeric answer ${numericAnswer} for question ${questionId}`);
            return {
                assessment_question_id: questionId,
                answer: answerString || "UNKNOWN_MAPPING",
            };
        });

        const payload = {
            topic_id: props.topic?.topic_id,
            conversation_id: conversationId,
            user_id: userId,
            stance: userFinalStance, // Use FINAL stance from state
            stance_rating: parseInt(userFinalStrength, 10), // Use FINAL strength from state
            collected_at: "END",
            sequence_number: props.questionNumber,
            intellectual_humility_responses: intellectual_humility_responses,
        };

        const submitApiUrl = `${baseUrl}/record_post_intervention_assessments`;

        // console.log(`Performing POST to ${submitApiUrl}`);
        // console.log("Payload:", JSON.stringify(payload, null, 2));

        const postResponse = await fetch(submitApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify(payload)
        });

        if (!postResponse.ok) {
            let errorMsg = `HTTP error! Status: ${postResponse.status}`;
            try { const errorData = await postResponse.json(); errorMsg = errorData.message || JSON.stringify(errorData); }
            catch (e) { console.warn("Could not parse error response body:", e); }
            throw new Error(`Submission failed: ${errorMsg}`);
        }

        const postResult = await postResponse.json();
        // console.log("POST request successful:", postResult);

        // Handle Success
        if (updateSubmissionResponse) {
             updateSubmissionResponse(postResult); // Pass stance_id etc. back if needed
        }
        if (updateStep) updateStep(step + 1); // Proceed to next step

    } catch (error) {
        console.error("Error during submission process:", error);
        if (updateError) updateError(error.message || "An unexpected error occurred during submission.");
    } finally {
        setIsSubmitting(false);
        if (updateLoading) updateLoading(false);
    }
  };

  // Combined check for enabling submit button
  const canSubmit = props.questionNumber === 2 ? (!loadingIH && questions.length > 0 && Object.keys(answers).length === questions.length && !!userFinalStance && !!userFinalStrength) : (!!userFinalStance && !!userFinalStrength);

  // --- JSX Rendering (Combined View) ---
  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Post-Intervention Assessment
      </Typography>

      {/* Loading State for initial question fetch */}
      {loadingIH && (<Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>)}
      {/* Error State for initial question fetch */}
      {errorIH && (<Alert severity="error" sx={{ my: 2 }}>Error loading assessment questions: {errorIH}</Alert>)}
      {/* No Questions Message */}
      {!loadingIH && !errorIH && questions.length === 0 && (<Alert severity="info" sx={{ my: 2 }}>No assessment questions available.</Alert>)}


      {/* Render form only when questions are loaded and no error */}
      {!loadingIH && !errorIH && questions.length > 0 && (
        // Use a single form for everything
        <form onSubmit={handleSubmit}>

            {/* --- Section 1: Intellectual Humility --- */}
            {props.questionNumber === 2 && (
                <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Intellectual Humility
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Please rate your agreement with the following statements.
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    {questions.map((question) => (
                        <FormControl
                        key={question.assessment_question_id} component="fieldset" variant="standard" required fullWidth
                        sx={{ my: 3, border: '1px solid #eee', p: 2, borderRadius: 1 }}
                        >
                        <FormLabel component="legend" sx={{ mb: 1.5, fontWeight: 'bold', fontSize: '1.1rem', color: 'text.primary' }}>
                            {question.assessment_question}
                        </FormLabel>
                        <RadioGroup row
                            aria-labelledby={`question-label-${question.assessment_question_id}`}
                            name={`question_${question.assessment_question_id}`}
                            value={answers[question.assessment_question_id]?.toString() || ''}
                            onChange={(event) => handleAnswerChange(question.assessment_question_id, event.target.value)}
                            sx={{ justifyContent: 'space-around', flexWrap: 'wrap' }}
                        >
                            {[1, 2, 3, 4, 5].map((value) => (
                            <FormControlLabel
                                key={value} value={value.toString()}
                                control={<Radio required />} label={scaleLabels[value]} labelPlacement="bottom"
                                sx={{ minWidth: '80px', textAlign: 'center', mx: 0.5 }}
                            />
                            ))}
                        </RadioGroup>
                        </FormControl>
                    ))}
                </Paper>
            )}
            {/* --- Section 2: Final Evaluation --- */}
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Final Evaluation
                </Typography>
                <Typography variant="body1" paragraph>
                     Considering the topic: <strong>{props.topic?.topic_name || 'N/A'}</strong>
                </Typography>
                <Divider sx={{ my: 2 }} />

                {/* Final Stance Selection */}
                <FormControl component="fieldset" required fullWidth sx={{mt: 2}}>
                    <FormLabel component="legend" sx={{fontWeight: 'bold', fontSize: '1.1rem', color: 'text.primary', mb: 1}}>What is your final stance?</FormLabel>
                    <RadioGroup
                    row
                    name="finalStance"
                    value={userFinalStance}
                    onChange={(e) => setUserFinalStance(e.target.value)}
                    >
                    <FormControlLabel value="YES" control={<Radio required />} label="Yes" />
                    <FormControlLabel value="NO" control={<Radio required />} label="No" />
                    </RadioGroup>
                </FormControl>

                {/* Final Strength Rating */}
                <FormControl component="fieldset" required fullWidth sx={{mt: 3}}>
                    <FormLabel component="legend" sx={{fontWeight: 'bold', fontSize: '1.1rem', color: 'text.primary', mb: 1}}>Rate how strongly you feel about your final stance (1=Weak, 10=Strong)</FormLabel>
                    <RadioGroup
                    row
                    name="finalStrength"
                    value={userFinalStrength}
                    onChange={(e) => setUserFinalStrength(e.target.value)}
                    sx={{ justifyContent: 'space-between', flexWrap: 'wrap', mt: 1 }} // Changed justify
                    >
                    {[...Array(10)].map((_, i) => (
                        <FormControlLabel
                        key={i + 1}
                        value={(i + 1).toString()}
                        control={<Radio required size="small"/>}
                        label={i + 1}
                        labelPlacement="top"
                        sx={{m: 0.2, flexBasis: 'calc(10% - 4px)'}} // Adjust basis for layout
                        />
                    ))}
                    </RadioGroup>
                </FormControl>
            </Paper>

            {/* --- Section 3: Submit Area --- */}
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary" // Changed back to primary, or use 'success'
                    // Update disabled state to check all conditions
                    disabled={!canSubmit || isSubmitting}
                    size="large"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Final Assessment'}
                </Button>
                {/* Helper text shown when button is disabled */}
                {!canSubmit && !loadingIH && ( // Show hint only if questions loaded
                    <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                        Please answer all questions and select final stance/strength.
                    </Typography>
                )}
            </Box>
            {/* Display submission errors from parent */}
            {props.error && (
               <Alert severity="error" sx={{ mt: 2 }}>{props.error}</Alert>
            )}
        </form>
      )}
    </Container>
  );
}

export default PostIntellectualHumility;