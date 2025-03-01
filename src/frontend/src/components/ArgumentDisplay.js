import React, { useState, useEffect } from "react";
import { TextField, IconButton, Paper, Box, Typography, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete"; // Import DeleteIcon

const ArgumentDisplay = ({ userArguments, setAllArguments, setStep }) => {
  const [editedArguments, setEditedArguments] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    if (userArguments.length > 0) {
      setEditedArguments([...userArguments]);
    } else {
      setEditedArguments([]); // Ensure it's always an array
    }
  }, [userArguments]);

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleChange = (event, index) => {
    const updatedArguments = [...editedArguments];
    updatedArguments[index] = event.target.value;
    setEditedArguments(updatedArguments);
  };

  const handleSave = (index) => { // Pass index to handleSave
    if (index !== null) {  // Use the passed index
      const updatedArguments = [...editedArguments];
      setAllArguments(updatedArguments);
      setEditingIndex(null);
    }
  };

  const handleDelete = (index) => {
    const updatedArguments = editedArguments.filter((_, i) => i !== index);
    setEditedArguments(updatedArguments);
    setAllArguments(updatedArguments); // Update parent state after deletion.
    setEditingIndex(null); // Ensure we exit edit mode if deleting the edited item
  };

  const handleAddArgument = () => {
    setEditedArguments([...editedArguments, ""]); // Add a new empty argument
    setEditingIndex(editedArguments.length);  // Immediately enter edit mode for the new argument
  };


  return (
    <Box sx={{ width: "100%", textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Review the Arguments
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
        {editedArguments.map((arg, index) => (
          <Paper
            key={index}
            sx={{
              width: "60%",
              padding: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#f5f5f5",
            }}
          >
            {editingIndex === index ? (
              <TextField
                fullWidth
                value={arg}
                onChange={(event) => handleChange(event, index)}
                variant="outlined"
                size="small"
                autoFocus // Add autofocus to the TextField when editing
              />
            ) : (
              <Typography>{arg}</Typography>
            )}

            <div>
              <IconButton onClick={() => (editingIndex === index ? handleSave(index) : handleEdit(index))}>
                {editingIndex === index ? <SaveIcon color="primary" /> : <EditIcon color="primary" />}
              </IconButton>
              <IconButton onClick={() => handleDelete(index)}>
                <DeleteIcon color="error" /> {/* Use DeleteIcon with error color */}
              </IconButton>
            </div>
          </Paper>
        ))}

        {/* Button to Add New Argument */}
        <Button variant="contained" color="primary" onClick={handleAddArgument}>
          Add Argument
        </Button>

        {editedArguments.length === 0 && (
          <Typography color="error">No arguments found. Please add some arguments.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default ArgumentDisplay;

