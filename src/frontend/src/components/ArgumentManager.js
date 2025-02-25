import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Grid, Paper, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const ArgumentManager = ({ question, setAllArguments, allArguments, setStep, token }) => {
  // State variables
  const [currentProArg, setCurrentProArg] = useState("");
  const [currentConArg, setCurrentConArg] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingArgument, setEditingArgument] = useState(null); // Store the *entire* argument object.
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Add Pro Argument ---
  const handleAddProArgument = async () => {
    if (currentProArg.trim()) {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.post('http://localhost:5000/read_user_arguments', {
          topic_id: question,  // Use the question ID (passed as a prop).
          arguments: [{
            yes_or_no: "YES",
            argument: currentProArg
          }]
        }, {
          headers: { Authorization: `Bearer ${token}` } // Use the token.
        });

        // Create a new argument object *using the ID from the response*.
        const newArgument = {
          id: response.data.argument_ids[0], // Get the ID from the API response.
          text: currentProArg,
          pro: true, // Set 'pro' based on which button was clicked.
          categoryId: null // Initially, no category is assigned.
        };

        setAllArguments([...allArguments, newArgument]); // Add to the *local* state.
        setCurrentProArg(""); // Clear the input field.

      } catch (error) {
        setError(error.response?.data?.message || 'Failed to add pro argument.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // --- Add Con Argument --- (Very similar to Add Pro)
  const handleAddConArgument = async () => {
    if (currentConArg.trim()) {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.post('http://localhost:5000/read_user_arguments', {
          topic_id: question,
          arguments: [{
            yes_or_no: "NO", // Set to "NO" for con arguments.
            argument: currentConArg
          }]
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const newArgument = {
          id: response.data.argument_ids[0],
          text: currentConArg,
          pro: false, // Set 'pro' to false.
          categoryId: null
        };
        setAllArguments([...allArguments, newArgument]);
        setCurrentConArg("");

      } catch (error) {
        setError(error.response?.data?.message || 'Failed to add con argument.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // --- Edit ---
  const handleEdit = (index) => {
    const argumentToEdit = allArguments[index];
    setEditingIndex(index);
    setEditingArgument(argumentToEdit); // Store the *entire* object, not just the index.
  };

  // --- Change (while editing) ---
  const handleChange = (event) => {
    // Update the 'text' property of the *editingArgument* object.  This is reactive.
    setEditingArgument({ ...editingArgument, text: event.target.value });
  };

  // --- Save ---
  const handleSave = async () => {
    if (editingArgument) { // Make sure there's something to save.
      setIsLoading(true);
      setError(null);
      try {
        // Use a PUT request to update the existing argument.  The URL includes the argument ID.
        await axios.put(`http://localhost:5000/arguments/${editingArgument.id}`, {
          text: editingArgument.text, // Send the updated text.
          // Add other fields here if needed (e.g., categoryId)
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Update the argument in the *local* allArguments array.
        const updatedArguments = allArguments.map((arg) =>
          arg.id === editingArgument.id ? editingArgument : arg // Replace the old object with the updated one.
        );
        setAllArguments(updatedArguments);

        // Clear editing state.
        setEditingIndex(null);
        setEditingArgument(null);

      } catch (error) {
        setError(error.response?.data?.message || 'Failed to save argument.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // --- Delete ---
  const handleDelete = async (index) => {
    const argumentToDelete = allArguments[index];
    if (!argumentToDelete || !argumentToDelete.id) {
        console.error("Invalid argument or argument ID for deletion");
        return
    }

    setIsLoading(true);
    setError(null);
    try {
      // Send a DELETE request to the API.
      await axios.delete(`http://localhost:5000/arguments/${argumentToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Remove the argument from the local state.
      const updatedArguments = allArguments.filter((arg) => arg.id !== argumentToDelete.id);
      setAllArguments(updatedArguments);

      // Clear editing state if the deleted item was being edited.
      if (editingIndex === index) {
        setEditingIndex(null);
        setEditingArgument(null);
      }

    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete argument.');
    } finally {
      setIsLoading(false);
    }
  };
    // --- Add New Argument (while in edit mode)
    const handleAddArgument = () => {
        //Set to edit mode with a blank argument
        setEditingArgument({id: null, text: "", pro: true, categoryId: null})
        setEditingIndex(allArguments.length) //New index
    }

  // --- Render ---
  return (
    <Box sx={{ maxWidth: 800, margin: "auto", padding: 3 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center">
        Argument Generation & Review
      </Typography>
      <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
        Question ID: {question} {/* Display the question ID */}
      </Typography>

      {/* --- Argument Generation Section --- */}
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Typography variant="h6" fontWeight="bold">Pro Arguments</Typography>
          <TextField
            fullWidth
            label="Enter a supporting argument..."
            variant="outlined"
            value={currentProArg}
            onChange={(e) => setCurrentProArg(e.target.value)}
            sx={{ mt: 1 }}
          />
          <Button variant="contained" color="success" sx={{ mt: 1, width: "100%" }} onClick={handleAddProArgument}>
            Add Pro Argument
          </Button>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="h6" fontWeight="bold">Con Arguments</Typography>
          <TextField
            fullWidth
            label="Enter an opposing argument..."
            variant="outlined"
            value={currentConArg}
            onChange={(e) => setCurrentConArg(e.target.value)}
            sx={{ mt: 1 }}
          />
          <Button variant="contained" color="error" sx={{ mt: 1, width: "100%" }} onClick={handleAddConArgument}>
            Add Con Argument
          </Button>
        </Grid>
      </Grid>

      {/* --- Loading and Error Messages --- */}
      {isLoading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      {/* --- Argument Review Section --- */}
      {allArguments.length > 0 && (
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            Review Your Arguments
          </Typography>
          {allArguments.map((arg, index) => (
            <Paper
              key={arg.id || index}  // Use arg.id if available, otherwise index (for new, unsaved arguments)
              sx={{
                width: "60%",
                padding: "10px",
                margin: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#f5f5f5",
                mt: 1,
              }}
            >
              {/* --- Display or Edit Field --- */}
              {editingIndex === index ? (
                <TextField
                  fullWidth
                  value={editingArgument ? editingArgument.text : ""} // Use editingArgument.text
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  autoFocus
                />
              ) : (
                <Typography>{arg.text}</Typography>
              )}

              {/* --- Edit/Save/Delete Buttons --- */}
              <div>
                {editingIndex === index ? (
                  <IconButton onClick={handleSave}>
                    <SaveIcon color="primary" />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => handleEdit(index)}>
                    <EditIcon color="primary" />
                  </IconButton>
                )}
                <IconButton onClick={() => handleDelete(index)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </div>
            </Paper>
          ))}
            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleAddArgument}>
                Add Argument
            </Button>
        </Box>
      )}

      {/* --- Proceed Button --- */}
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3, width: "100%" }}
        onClick={() => setStep(4)}  // Move to the next step.
        disabled={allArguments.length === 0} // Disable if no arguments.
      >
        Proceed
      </Button>
    </Box>
  );
};

export default ArgumentManager;