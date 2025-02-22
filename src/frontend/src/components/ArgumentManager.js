import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Grid, Paper, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";

const ArgumentManager = ({ question, setAllArguments, setStep }) => {
  const [proArguments, setProArguments] = useState([]);
  const [conArguments, setConArguments] = useState([]);
  const [currentProArg, setCurrentProArg] = useState("");
  const [currentConArg, setCurrentConArg] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [allArguments, setArguments] = useState([]);

  // Handle adding new arguments
  const handleAddProArgument = () => {
    if (currentProArg.trim()) {
      setProArguments((prev) => [...prev, currentProArg]);
      setCurrentProArg("");
    }
  };

  const handleAddConArgument = () => {
    if (currentConArg.trim()) {
      setConArguments((prev) => [...prev, currentConArg]);
      setCurrentConArg("");
    }
  };

  const handleSubmitArguments = () => {
    const combinedArguments = [...proArguments, ...conArguments];

    if (combinedArguments.length === 0) {
      console.warn("No arguments entered. Cannot proceed.");
      return;
    }

    setArguments(combinedArguments);
    setAllArguments(combinedArguments); // Pass to parent
  };

  // Handle editing arguments
  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleChange = (event, index) => {
    const updatedArguments = [...allArguments];
    updatedArguments[index] = event.target.value;
    setArguments(updatedArguments);
  };

  const handleSave = (index) => {
    if (index !== null) {
      setAllArguments(allArguments);
      setEditingIndex(null);
    }
  };

  const handleDelete = (index) => {
    const updatedArguments = allArguments.filter((_, i) => i !== index);
    setArguments(updatedArguments);
    setAllArguments(updatedArguments);
    setEditingIndex(null);
  };

  const handleAddArgument = () => {
    setArguments([...allArguments, ""]);
    setEditingIndex(allArguments.length);
  };

  useEffect(() => {
    setArguments([...proArguments, ...conArguments]);
  }, [proArguments, conArguments]);

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", padding: 3 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center">
        Argument Generation & Review
      </Typography>
      <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
        Question: {question}
      </Typography>

      {/* Argument Generation */}
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

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3, width: "100%" }}
        onClick={handleSubmitArguments}
        disabled={proArguments.length === 0 && conArguments.length === 0}
      >
        Submit Arguments
      </Button>

      {/* Argument Review Section */}
      {allArguments.length > 0 && (
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            Review Your Arguments
          </Typography>
          {allArguments.map((arg, index) => (
            <Paper
              key={index}
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
              {editingIndex === index ? (
                <TextField
                  fullWidth
                  value={arg}
                  onChange={(event) => handleChange(event, index)}
                  variant="outlined"
                  size="small"
                  autoFocus
                />
              ) : (
                <Typography>{arg}</Typography>
              )}

              <div>
                <IconButton onClick={() => (editingIndex === index ? handleSave(index) : handleEdit(index))}>
                  {editingIndex === index ? <SaveIcon color="primary" /> : <EditIcon color="primary" />}
                </IconButton>
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

      {/* Proceed Button */}
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3, width: "100%" }}
        onClick={() => setStep(4)}
        disabled={allArguments.length === 0}
      >
        Proceed
      </Button>
    </Box>
  );
};

export default ArgumentManager;