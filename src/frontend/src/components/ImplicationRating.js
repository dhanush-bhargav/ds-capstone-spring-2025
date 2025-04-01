import React, { useState, useEffect } from "react";
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
  Alert, // Added for displaying errors
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios"; // Using axios consistent with previous examples

const ImplicationRating = (props) => {
  const [categoryData, setCategoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    // Function to fetch data
    const fetchArgumentsAndCategories = async () => {
      if (!props.topicId) {
        setError("Topic ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        // Call the single new API endpoint
        const response = await axios.get(
          `http://localhost:5000/get_arguments_for_categorization?topic_id=${props.topicId}`
        );

        console.log("API Response:", response.data); // Log the response for debugging

        if (response.data.success && response.data.arguments_by_category) {
          const processedData = response.data.arguments_by_category
            .filter((cat) => cat.category_id !== 0)
            .map((category) => ({
              category_id: category.category_id,
              argument_category: category.argument_category,
              argumentList: category.arguments.map((arg) => ({
                ...arg,
                rating: "",
              })),
            }));

          setCategoryData(processedData); // Set the processed array to state
        } else {
          throw new Error(
            response.data.message || "API request failed to return success."
          );
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "An error occurred while fetching data."
        );
        setCategoryData([]); // Clear data on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchArgumentsAndCategories();
  }, [props.topicId]); // Re-run if topicId changes

  // Handler for changing an argument's rating
  const handleRatingChange = (category_id, argument_id, newRating) => {
    setCategoryData((prevData) =>
      prevData.map((category) => {
        if (category.category_id !== category_id) {
          return category;
        }
        return {
          ...category,
          argumentList: category.argumentList.map((arg) =>
            arg.argument_id === argument_id
              ? {
                  ...arg,
                  rating: newRating === arg.rating ? "" : newRating || "",
                } // Toggle or set, default to "" if null/undefined
              : arg
          ),
        };
      })
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true); // Indicate submission start
    props.updateLoading(true); // Notify parent if needed
    props.updateError(null); // Clear parent error state

    try {
      if (!categoryData || categoryData.length === 0) {
        // Handle case where data wasn't loaded or is empty
        throw new Error("No category data available to submit.");
      }

      // Build the payload from the current state
      const payload = [];
      categoryData.forEach((category) => {
        // Iterate directly over the array
        if (!category.argumentList) return; // Skip if no arguments

        category.argumentList.forEach((arg) => {
          if (arg.rating) {
            // Only include arguments that have been rated
            payload.push({
              category_id: category.category_id,
              argument_id: arg.argument_id,
              implication: arg.rating, // Field name as per original code
            });
          }
        });
      });

      console.log("Payload to be sent:", JSON.stringify(payload, null, 2));

      if (payload.length === 0) {
        // Handle case where nothing was rated
        throw new Error("Please rate at least one argument before submitting.");
      }

      // Make the API call to submit ratings
      const response = await axios.post(
        "http://localhost:5000/read_implications",
        {
          conversation_id: props.conversationId, // Ensure conversationId is passed correctly
          implications: payload,
        },
        {
          // Include headers if needed, e.g., Authorization
          headers: props.token
            ? { Authorization: `Bearer ${props.token}` }
            : {},
        }
      );

      console.log("Submission Response:", response);

      if (response?.data?.success === true) {
        props.updateImplicationIds(response.data.implication_id || []); // Pass IDs if returned
        props.updateStep(props.step + 1); // Move to next step on success
      } else {
        throw new Error(response?.data?.message || "Failed to submit ratings.");
      }
    } catch (err) {
      console.error("Error submitting ratings:", err);
      props.updateError(
        err.message || "An unexpected error occurred during submission."
      );
      setIsSubmitting(false); // Ensure submitting state is reset on error
      props.updateLoading(false); // Ensure parent loading state is reset on error
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render Logic ---
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Rate the Implications of Each Argument
      </Typography>

      {/* Loading State */}
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            my: 4,
          }}
        >
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading Arguments...</Typography>
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          Error: {error}
        </Alert>
      )}

      {/* Content Area: Display Accordions only if not loading and no error */}
      {!isLoading && !error && (
        <>
          {categoryData.length === 0 ? (
            <Typography
              sx={{ my: 3, textAlign: "center", color: "text.secondary" }}
            >
              No categories or arguments found for rating.
            </Typography>
          ) : (
            // **** ADDED DEFENSIVE CHECKING ****
            categoryData.map((category, index) => {
              // Get category object first
              // Check if category object and its ID are valid before rendering Accordion
              if (!category || typeof category.category_id === "undefined") {
                console.error(
                  `Invalid category data at index ${index}:`,
                  category
                );
                return null; // Skip rendering this item
              }

              // Destructure properties *after* validation
              const { category_id, argument_category, argumentList } = category;

              return (
                <Accordion key={category_id} defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">{argument_category}</Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
                  >
                    {/* Check argumentList validity */}
                    {argumentList && argumentList.length > 0 ? (
                      argumentList.map((arg, argIndex) => {
                        // Get arg object first
                        // Check if arg object and its ID are valid
                        if (!arg || typeof arg.argument_id === "undefined") {
                          console.error(
                            `Invalid argument data at index ${argIndex} in category ${category_id}:`,
                            arg
                          );
                          return null; // Skip rendering this item
                        }

                        // Destructure *after* validation
                        const { argument_id, argument, rating } = arg;

                        return (
                          <Box key={argument_id}>
                            <Typography sx={{ marginBottom: 1 }}>
                              • {argument}
                            </Typography>
                            <ToggleButtonGroup
                              value={rating}
                              exclusive
                              onChange={(event, newRating) =>
                                handleRatingChange(
                                  category_id,
                                  argument_id,
                                  newRating
                                )
                              }
                              size="small"
                              aria-label={`Rating for argument ${argument_id}`}
                            >
                              <ToggleButton
                                value="MORE_LIKELY"
                                aria-label="More Likely"
                                color="success"
                              >
                                Likely
                              </ToggleButton>
                              <ToggleButton
                                value="NO_EFFECT"
                                aria-label="No Effect"
                              >
                                NO Effect
                              </ToggleButton>
                              <ToggleButton
                                value="LESS_LIKELY"
                                aria-label="Less Likely"
                                color="error"
                              >
                                Less Likely
                              </ToggleButton>
                            </ToggleButtonGroup>
                          </Box>
                        );
                      })
                    ) : (
                      <Typography sx={{ color: "text.secondary" }}>
                        No arguments found in this category.
                      </Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              );
            })
          )}

          {/* Submit Button - Only show if data loaded successfully */}
          {categoryData.length > 0 &&
            !isLoading &&
            !error && ( // Added checks
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{ mt: 3, width: "100%" }}
                disabled={isSubmitting}
                size="large"
              >
                {isSubmitting
                  ? "Submitting..."
                  : "Submit Ratings"}
              </Button>
            )}
          {/* Display submission error from props */}
          {props.error && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              {props.error}
            </Alert>
          )}
        </>
      )}
    </Box>
  );
};

export default ImplicationRating;
