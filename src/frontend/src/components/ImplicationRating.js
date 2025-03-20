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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";

const ImplicationRating = (props) => {
  const [categoryData, setCategoryData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/get_argument_categories?topic_id=${props.topicId}`
        ); // Replace with actual API URL
        const data = await response.json();

        if (data.success) {
          const categoryMap = {};
          data.argument_categories.forEach(
            ({ category_id, argument_category }) => {
              if (!categoryMap[category_id]) {
                categoryMap[category_id] = {
                  category_id,
                  argument_category,
                  argumentList: [],
                };
              }
            }
          );
          setCategoryData(categoryMap);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchArguments = async () => {
      try {
        if (Object.keys(categoryData).length === 0) return;

        const updatedCategoryData = { ...categoryData };

        for (const category_id of Object.keys(categoryData)) {
          const response = await fetch(
            `http://localhost:5000/get_arguments_by_category?topic_id=${props.topicId}&category_id=${category_id}`
          );
          const data = await response.json();

          if (data.success) {
            updatedCategoryData[category_id].argumentList =
              data.arguments_by_category.map((arg) => ({
                ...arg,
                rating: "",
              })) || [];
          }
        }

        setCategoryData(updatedCategoryData);
        props.updateLoading(false);
      } catch (error) {
        console.error("Error fetching arguments:", error);
        props.updateLoading(false);
      }
    };
    console.log(categoryData);

    fetchArguments();
  }, [Object.keys(categoryData).length]);

  const handleRatingChange = (category_id, argument_id, newRating) => {
    if (!newRating) return;

    setCategoryData((prevData) => {
      if (!prevData[category_id]) return prevData;

      const updatedData = JSON.parse(JSON.stringify(prevData));
      updatedData[category_id].argumentList = updatedData[
        category_id
      ].argumentList.map((arg) =>
        arg.argument_id === argument_id ? { ...arg, rating: newRating } : arg
      );

      return updatedData;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    props.updateLoading(true);
    props.updateError(null);

    try {
        if (Object.keys(categoryData).length === 0) {
            console.error("categoryData is empty at the time of submission!");
            props.updateError("No data to submit. Please rate at least one argument.");
            setIsSubmitting(false);
            return;
        }
        const copiedCategoryData = JSON.parse(JSON.stringify(categoryData));

        const payload = [];
        Object.values(copiedCategoryData).forEach((category) => {
            if (!category.argumentList) return;

            category.argumentList.forEach((arg) => {
                if (arg.rating) {
                    payload.push({
                        category_id: category.category_id,
                        argument_id: arg.argument_id,
                        implication: arg.rating,
                    });
                }
            });
        });
        console.log("Payload to be sent:", JSON.stringify(payload, null, 2));

        if (payload.length === 0) {
            console.error("No rated arguments found! Submitting an empty payload.");
            props.updateError("Please rate at least one argument before submitting.");
            setIsSubmitting(false);
            return;
        }

        console.log(props.conversationId)

        const response = await axios.post(
            "http://localhost:5000/read_implications",
            {
                conversation_id: props.conversationId,
                implications: payload,
            },
            {
                headers: { Authorization: `Bearer ${props.token}` },
            }
        );
        console.log(response)

        if (response?.data?.success === true) {
            props.updateImplicationIds(response.data.implication_id);
            props.updateStep(6);
        } else {
            props.updateError(response.data.message || "Failed to submit ratings.");
        }
    } catch (error) {
      console.log(error);
        props.updateError(error.response?.data?.message || "Failed to submit ratings.");
    } finally {
        props.updateLoading(false);
    }
};

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Rate the Implications of Each Argument
      </Typography>
      {props.isLoading ? (
        <CircularProgress />
      ) : (
        Object.entries(categoryData).map(
          ([category_id, { argument_category, argumentList }]) => (
            <Accordion key={category_id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{argument_category}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {argumentList?.length > 0 ? (
                  argumentList.map(({ argument_id, argument, rating }) => (
                    <div key={argument_id} style={{ marginBottom: "15px" }}>
                      <Typography key={argument_id} sx={{ marginBottom: 1 }}>
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
                        aria-label="argument rating"
                      >
                        <ToggleButton value="Positive" aria-label="positive">
                          👍 Positive
                        </ToggleButton>
                        <ToggleButton value="Neutral" aria-label="neutral">
                          😐 Neutral
                        </ToggleButton>
                        <ToggleButton value="Negative" aria-label="negative">
                          👎 Negative
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </div>
                  ))
                ) : (
                  <Typography>No arguments available</Typography>
                )}
              </AccordionDetails>
            </Accordion>
          )
        )
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ mt: 2, width: "100%" }}
        disabled={isSubmitting}
      >
        Submit Ratings
      </Button>
    </Box>
  );
};

export default ImplicationRating;
