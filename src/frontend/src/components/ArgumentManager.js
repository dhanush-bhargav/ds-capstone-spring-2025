// ArgumentManager.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const ArgumentManager = (props) => {
  props.updateLoading(false);

  const [editingIndex, setEditingIndex] = useState(null);
  const [editingArgument, setEditingArgument] = useState(null);
  const [localArguments, setLocalArguments] = useState(
    props.yesArguments || []
  );
  const [inputYesValue, setInputYesValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setLocalArguments(props.yesArguments || []);
    setEditingIndex(null);
    setEditingArgument(null);
  }, [props.yesArguments]);

  const addProArgument = () => {
    setLocalArguments([...localArguments, { text: inputYesValue }]);
    setInputYesValue("");
  };

  const handleEdit = (index) => {
    const args = localArguments;
    const argToEdit = args[index];

    setEditingArgument({
      text: argToEdit.text,
      index: index,
      id: argToEdit.id,
    });
    setEditingIndex(index);
  };

  const handleChange = (event) => {
    if (editingArgument) {
      setEditingArgument({ ...editingArgument, text: event.target.value });
    }
  };

  const handleSave = () => {
    if (editingArgument) {
      const updatedArgs = [...localArguments];
      const indexToUpdate = editingArgument.index;
      if (indexToUpdate !== -1) {
        updatedArgs[indexToUpdate] = {
          ...updatedArgs[indexToUpdate],
          text: editingArgument.text,
          id: editingArgument.id,
        };

        setLocalArguments(updatedArgs);
        setEditingArgument(null);
        setEditingIndex(null);
      }
    }
  };

  const handleDelete = (index) => {
    const args = [...localArguments];
    const argToDelete = args[index];
    const filteredArgs = args.filter((arg) => arg !== argToDelete);

    setLocalArguments(filteredArgs);

    // Adjust editingIndex *after* filtering.
    if (editingArgument && editingArgument.index === index) {
      setEditingIndex(null);
      setEditingArgument(null);
    }
  };

  const handleProceed = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    props.updateLoading(true);
    props.updateError(null);
    props.updateYesArguments(localArguments);

    try {
      const argumentsPayload = [
        ...localArguments.map((arg) => ({
          argument: arg.text,
        })),
      ];

      const response = await axios.post(
        "http://localhost:5000/read_user_arguments",
        {
          topic_id: props.topicId,
          arguments: argumentsPayload,
        },
        {
          headers: { Authorization: `Bearer ${props.token}` },
        }
      );

      if (response?.data?.success === true) {
        props.updateArgumentIds(response.data.argument_ids);
        props.updateLoading(true);
        props.updateStep(4);
      } else {
        props.updateError(
          response.data.message || "Failed to submit arguments."
        );
      }
    } catch (error) {
      props.updateError(
        error.response?.data?.message || "Failed to submit arguments."
      );
    } finally {
      setIsSubmitting(false);
      props.updateLoading(false);
      props.updateError(null);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", padding: 3 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center">
        Argument Generation & Review
      </Typography>
      <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
        Question: {props.question}
      </Typography>

      {/* --- Argument Generation Section --- */}
      <Typography variant="h6" fontWeight="bold">
        Arguments
      </Typography>
      <TextField
        fullWidth
        label="Enter a supporting argument..."
        variant="outlined"
        value={inputYesValue}
        onChange={(e) => setInputYesValue(e.target.value)}
        sx={{ mt: 1 }}
      />
      <Button
        variant="contained"
        color="success"
        sx={{ mt: 1, width: "100%" }}
        onClick={addProArgument}
        disabled={inputYesValue.trim() === "" || isSubmitting}
      >
        Add Argument
      </Button>
      <Box sx={{ mt: 2 }}>
        {localArguments.map((arg, index) => (
          <Paper
            key={arg.id || index} // Use ID if available, otherwise index
            sx={{
              width: "100%",
              padding: "10px",
              margin: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#f5f5f5",
              mt: 1,
            }}
          >
            {editingIndex === index && editingArgument ? (
              <TextField
                fullWidth
                value={editingArgument ? editingArgument.text : ""}
                onChange={handleChange}
                variant="outlined"
                size="small"
                autoFocus
              />
            ) : (
              <Typography>
                {arg.text} {arg.id && `(ID: ${arg.id})`}
              </Typography> // Display text and ID
            )}
            <div>
              {editingIndex === index && editingArgument ? (
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
      </Box>

      {/* --- Loading and Error Messages --- */}
      {props.isLoading && <Typography>Loading...</Typography>}
      {props.error && <Typography color="error">{props.error}</Typography>}

      {/* --- Proceed Button --- */}
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3, width: "100%" }}
        onClick={handleProceed}
        disabled={isSubmitting || localArguments.length === 0}
      >
        Proceed
      </Button>
    </Box>
  );
};

export default ArgumentManager;
