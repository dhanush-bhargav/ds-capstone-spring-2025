import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";

// Define constants for rating values for clarity and consistency
const RATING_VALUES = {
  IMPACT: {
    POSITIVE: "POSITIVE",
    NEGATIVE: "NEGATIVE",
    NEUTRAL: "NEUTRAL",
  },
  LIKELIHOOD: {
    MORE_LIKELY: "MORE_LIKELY",
    LESS_LIKELY: "LESS_LIKELY",
    NO_EFFECT: "NO_EFFECT",
  },
};

const ImplicationRating = (props) => {
  // State to hold the final structured data: Category Name + Implication Questions
  const [categoryQuestionData, setCategoryQuestionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use useCallback to memoize the fetch function
  const fetchImplicationData = useCallback(async () => {
    if (!props.topicId) {
      setError("Topic ID is missing.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null); // Clear previous errors
    setCategoryQuestionData([]); // Clear previous data

    try {
      // Step 1: Fetch Category IDs and Names
      console.log("Fetching categories for topic:", props.topicId);
      const categoryResponse = await axios.get(
        `http://localhost:5000/get_arguments_for_categorization?topic_id=${props.topicId}`
      );

      console.log("Category API Response:", categoryResponse.data);

      if (!categoryResponse.data.success || !categoryResponse.data.arguments_by_category) {
        throw new Error(
          categoryResponse.data.message || "Failed to fetch category data."
        );
      }

      const categories = categoryResponse.data.arguments_by_category
        .filter((cat) => cat.category_id !== 0) // Filter out category 0 if necessary
        .map((cat) => ({
          category_id: cat.category_id,
          argument_category: cat.argument_category,
        }));

      const categoryIds = categories.map((cat) => cat.category_id);

      if (categoryIds.length === 0) {
        console.log("No valid category IDs found.");
        setCategoryQuestionData([]); // Set empty if no categories
        setIsLoading(false);
        return; // Stop if no categories to fetch questions for
      }

      // Step 2: Fetch Implication Questions using the obtained Category IDs
      console.log("Fetching implication questions for category IDs:", categoryIds);
      const questionsResponse = await axios.post(
        `http://localhost:5000/get_implication_questions`,
        {
          topic_id: props.topicId,
          category_ids: categoryIds,
        }
      );

      console.log("Implication Questions API Response:", questionsResponse.data);

      if (!questionsResponse.data.success || !questionsResponse.data.implication_questions_data) {
        throw new Error(
          questionsResponse.data.message || "Failed to fetch implication questions."
        );
      }

      const questionsDataByCategory = questionsResponse.data.implication_questions_data;

      // Step 3: Merge Category Names with their Questions and initialize ratings
      const mergedData = categories.map((category) => {
        // Find the corresponding questions data for this category
        const categoryQuestions = questionsDataByCategory.find(
          (qData) => qData.category_id === category.category_id
        );

        // Process questions: add the 'rating' field to each implication
        const processedQuestions = categoryQuestions?.implication_questions?.map((argGroup) => ({
          ...argGroup,
          implications: argGroup.implications.map((imp) => ({
            ...imp,
            rating: "", // Initialize rating state for each question
          })),
        })) || []; // Default to empty array if no questions found for the category

        return {
          ...category, // category_id, argument_category
          questionsData: processedQuestions, // Array of argument_id groups, each with implications array
        };
      });

      console.log("Final Merged Data:", mergedData);
      setCategoryQuestionData(mergedData);

    } catch (err) {
      console.error("Error fetching implication data:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "An error occurred while fetching data."
      );
      setCategoryQuestionData([]); // Clear data on error
    } finally {
      setIsLoading(false);
    }
  }, [props.topicId]); // Dependency: re-run if topicId changes

  // useEffect to trigger the fetch function
  useEffect(() => {
    fetchImplicationData();
  }, [fetchImplicationData]); // Now depends on the memoized function

  // Handler for changing an implication question's rating
  const handleRatingChange = (
    category_id,
    argument_id, // Keep argument_id to locate the group
    implication_question_id,
    newRating
  ) => {
    setCategoryQuestionData((prevData) =>
      prevData.map((category) => {
        if (category.category_id !== category_id) {
          return category;
        }
        // Found the right category, now map through its question groups
        return {
          ...category,
          questionsData: category.questionsData.map((argGroup) => {
            if (argGroup.argument_id !== argument_id) {
              return argGroup;
            }
            // Found the right argument group, now map through its implications
            return {
              ...argGroup,
              implications: argGroup.implications.map((imp) =>
                imp.implication_question_id === implication_question_id
                  ? {
                      ...imp,
                      // Toggle behavior: if clicking the same rating, clear it; otherwise, set new rating
                      rating: newRating === imp.rating ? "" : newRating || "",
                    }
                  : imp
              ),
            };
          }),
        };
      })
    );
  };

  // Handler for submitting the ratings
  const handleSubmit = async () => {
    setIsSubmitting(true);
    props.updateLoading(true); // Notify parent if needed
    props.updateError(null); // Clear parent error state

    try {
      if (!categoryQuestionData || categoryQuestionData.length === 0) {
        throw new Error("No data available to submit.");
      }

      // Build the payload from the current state
      const payload = [];
      categoryQuestionData.forEach((category) => {
        category.questionsData.forEach((argGroup) => {
          argGroup.implications.forEach((imp) => {
            // Only include questions that have been rated
            if (imp.rating && imp.rating !== "") {
              payload.push({
                implication_question_id: imp.implication_question_id,
                implication: imp.rating, // Send the selected rating value
              });
            }
          });
        });
      });

      console.log("Payload to be sent:", JSON.stringify(payload, null, 2));

      if (payload.length === 0) {
        throw new Error("Please rate at least one implication question before submitting.");
      }

      // Make the API call to submit ratings
      const response = await axios.post(
        "http://localhost:5000/read_implications",
        {
          conversation_id: props.conversationId, // Pass conversationId
          implications: payload, // The new payload structure
        },
        {
          headers: props.token ? { Authorization: `Bearer ${props.token}` } : {},
        }
      );

      console.log("Submission Response:", response);

      if (response?.data?.success === true) {
         // Assuming the API might still return some IDs, pass them up if available
        props.updateImplicationIds(response.data.implication_ids || response.data.ids || []);
        props.updateStep(props.step + 1); // Move to next step
      } else {
        throw new Error(response?.data?.message || "Failed to submit ratings.");
      }
    } catch (err) {
      console.error("Error submitting ratings:", err);
      // Display error within this component or pass up
      const errorMessage = err.message || "An unexpected error occurred during submission.";
      setError(errorMessage); // Show error locally
      props.updateError(errorMessage); // Also update parent if needed
      // Don't reset isSubmitting here, let finally handle it
    } finally {
      setIsSubmitting(false);
      props.updateLoading(false); // Ensure parent loading state is reset
    }
  };

  // --- Render Logic ---
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Rate the Implications
      </Typography>

      {/* Loading State */}
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", my: 4 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading Questions...</Typography>
        </Box>
      )}

      {/* Error State */}
      {error && !isSubmitting && ( // Don't show fetch error during submit
        <Alert severity="error" sx={{ my: 2 }}>
          Error: {error}
        </Alert>
      )}

      {/* Content Area: Display Accordions only if not loading and no fetch error */}
      {!isLoading && !error && (
        <>
          {categoryQuestionData.length === 0 ? (
            <Typography sx={{ my: 3, textAlign: "center", color: "text.secondary" }}>
              No implication questions found for this topic's categories.
            </Typography>
          ) : (
            categoryQuestionData.map((category) => {
              // Basic validation for category structure
              if (!category || typeof category.category_id === "undefined") {
                console.error("Invalid category structure:", category);
                return null;
              }

              return (
                <Accordion key={category.category_id} defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">{category.argument_category}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ display: "flex", flexDirection: "column", gap: 3 }}> {/* Increased gap */}
                    {/* Check if questionsData exists and has content */}
                    {category.questionsData && category.questionsData.length > 0 ? (
                      category.questionsData.map((argGroup) => (
                        // Optional: Add a small header or divider if grouping by argument_id visually matters
                        // <Box key={argGroup.argument_id}>
                        // <Divider sx={{ my: 1 }} /> {/* Example divider */}
                         <React.Fragment key={argGroup.argument_id}> {/* Use Fragment if no visual group needed */}
                          {argGroup.implications && argGroup.implications.length > 0 ? (
                            argGroup.implications.map((imp) => {
                              // Basic validation for implication structure
                              if (!imp || typeof imp.implication_question_id === "undefined") {
                                console.error("Invalid implication structure:", imp);
                                return null;
                              }

                              const isImpact = imp.implication_type === "IMPACT_QUESTION";
                              const isLikelihood = imp.implication_type === "LIKELIHOOD_QUESTION";

                              return (
                                <Box key={imp.implication_question_id} sx={{ mb: 2 }}> {/* Margin bottom for spacing */}
                                  <Typography sx={{ marginBottom: 1 }}>
                                    {imp.implication_question}
                                  </Typography>
                                  <ToggleButtonGroup
                                    value={imp.rating}
                                    exclusive
                                    onChange={(event, newRating) =>
                                      handleRatingChange(
                                        category.category_id,
                                        argGroup.argument_id,
                                        imp.implication_question_id,
                                        newRating
                                      )
                                    }
                                    size="small"
                                    aria-label={`Rating for implication ${imp.implication_question_id}`}
                                  >
                                    {/* Conditional Rendering based on Type */}
                                    {isImpact && (
                                      <>
                                        <ToggleButton value={RATING_VALUES.IMPACT.POSITIVE} aria-label="Positive" color="success">Positive</ToggleButton>
                                        <ToggleButton value={RATING_VALUES.IMPACT.NEUTRAL} aria-label="Neutral">Neutral</ToggleButton>
                                        <ToggleButton value={RATING_VALUES.IMPACT.NEGATIVE} aria-label="Negative" color="error">Negative</ToggleButton>
                                      </>
                                    )}
                                    {isLikelihood && (
                                      <>
                                        <ToggleButton value={RATING_VALUES.LIKELIHOOD.MORE_LIKELY} aria-label="More Likely" color="success">More Likely</ToggleButton>
                                        <ToggleButton value={RATING_VALUES.LIKELIHOOD.NO_EFFECT} aria-label="No Effect">No Effect</ToggleButton>
                                        <ToggleButton value={RATING_VALUES.LIKELIHOOD.LESS_LIKELY} aria-label="Less Likely" color="error">Less Likely</ToggleButton>
                                      </>
                                    )}
                                    {/* Fallback or error if type is unknown */}
                                    {!isImpact && !isLikelihood && (
                                       <Typography color="error" variant="caption">Unknown Question Type</Typography>
                                    )}
                                  </ToggleButtonGroup>
                                </Box>
                              );
                            })
                          ) : (
                             <Typography sx={{ color: "text.secondary", fontStyle: 'italic' }}>No specific implications listed for this group.</Typography>
                          )}
                        </React.Fragment> // </Box> if using visual group
                      ))
                    ) : (
                      <Typography sx={{ color: "text.secondary" }}>
                        No implication questions found for this category.
                      </Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              );
            })
          )}

          {/* Submit Button - Only show if data loaded successfully */}
          {categoryQuestionData.length > 0 && !isLoading && !error && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ mt: 3, width: "100%" }}
              disabled={isSubmitting || isLoading} // Disable if loading or submitting
              size="large"
            >
              {isSubmitting ? "Submitting..." : "Submit Ratings"}
            </Button>
          )}

          {/* Display submission error from props OR local state */}
          {(props.error || (error && isSubmitting)) && ( // Show submission error
            <Alert severity="warning" sx={{ mt: 2 }}>
              {props.error || error}
            </Alert>
          )}
        </>
      )}
    </Box>
  );
};

export default ImplicationRating;