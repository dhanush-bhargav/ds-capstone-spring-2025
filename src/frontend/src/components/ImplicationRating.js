import React, { useState, useEffect } from "react";
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, Button, Paper } from "@mui/material";
import axios from "axios";

const ImplicationRating = ({ allArguments, setRatedArguments, setStep, categories, token, questionId, conversationId }) => {
  const [ratings, setRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize ratings when allArguments or categories change
  useEffect(() => {
    if (allArguments && allArguments.length > 0) {
      setRatings(
        allArguments.map((arg) => ({
          argumentId: arg.id, // Store the argument ID, not the text
          categoryId: arg.categoryId || null, // Use existing categoryId, default to null
          implication: "Positive",  // Default
        }))
      );
    } else {
      setRatings([]);
    }
  }, [allArguments]);

  const handleRatingChange = (index, newRating) => {
    const updatedRatings = [...ratings];
    updatedRatings[index].implication = newRating;
    setRatings(updatedRatings);
  };

  const handleCategoryChange = (index, newCategory) => {
    const updatedRatings = [...ratings];
    updatedRatings[index].categoryId = newCategory;
    setRatings(updatedRatings);
  };

  const handleSubmit = async () => {
      setIsLoading(true);
      setError(null)
    try {
      // Prepare the data for the API request
        const implicationsData = ratings.map(r => ({
        argument_id: r.argumentId,
        category_id: r.categoryId,
        implication: r.implication
      }));


      // Make the API call
      const response = await axios.post('http://localhost:5000/read_implications', {
          conversation_id: conversationId,
          implications: implicationsData
      }, {
          headers: { Authorization: `Bearer ${token}` }
      });

      setRatedArguments(ratings); // Update parent state (optional, for display)
      setStep((prev) => prev + 1);

    } catch (error) {
        setError(error.response?.data?.message || 'Failed to submit ratings.');
    }
    finally{
        setIsLoading(false)
    }
  };

    const getCategoryName = (categoryId) => {
    if (!categoryId) {
      return "Uncategorized";
    }
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Rate the Implications of Each Argument
      </Typography>
      {isLoading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

      {ratings.length > 0 ? (
        ratings.map((item, index) => (
          <Paper key={item.argumentId} sx={{ p: 2, mb: 2, backgroundColor: "#f5f5f5" }}>
            <Typography variant="body1" fontWeight="bold">
              Argument:
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {allArguments.find(arg => arg.id === item.argumentId)?.text}
            </Typography>
            <FormControl fullWidth sx={{ mb: 1 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={item.categoryId || null} // Use categoryId
                onChange={(e) => handleCategoryChange(index, e.target.value)}
                label="Category"
              >
                <MenuItem value={null}>Uncategorized</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Rating</InputLabel>
              <Select
                value={item.implication}
                onChange={(e) => handleRatingChange(index, e.target.value)}
                label="Rating"
              >
                <MenuItem value="Positive">Positive</MenuItem>
                <MenuItem value="Neutral">Neutral</MenuItem>
                <MenuItem value="Negative">Negative</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        ))
      ) : (
        <Typography variant="body1">No arguments available for rating.</Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ mt: 2, width: "100%" }}
        disabled={isLoading}
      >
        Submit Ratings
      </Button>
    </Box>
  );
};

export default ImplicationRating;