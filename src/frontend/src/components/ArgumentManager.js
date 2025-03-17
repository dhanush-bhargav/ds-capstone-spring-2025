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
  const [localYesArguments, setLocalYesArguments] = useState(
    props.yesArguments || []
  );
  const [localNoArguments, setLocalNoArguments] = useState(
    props.noArguments || []
  );
  const [inputYesValue, setInputYesValue] = useState("");
  const [inputNoValue, setInputNoValue] = useState("");

  useEffect(() => {
    setLocalYesArguments(props.yesArguments || []);
    setLocalNoArguments(props.noArguments || []);
    setEditingIndex(null);
    setEditingArgument(null);
  }, [props.yesArguments, props.noArguments]);

  const addProArgument = () => {
    setLocalYesArguments([...localYesArguments, { text: inputYesValue }]);
    setInputYesValue("");
  };
  const addConArgument = () => {
    setLocalNoArguments([...localNoArguments, { text: inputNoValue }]);
    setInputNoValue("");
  };

  const handleEdit = (index, yes_or_no) => {
    const args = yes_or_no ? localYesArguments : localNoArguments;
    const argToEdit = args[index];

    setEditingArgument({
      text: argToEdit.text,
      index: index,
      yes_or_no: yes_or_no,
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
      const updatedArgs = [
        ...(editingArgument.yes_or_no ? localYesArguments : localNoArguments),
      ];
      const indexToUpdate = editingArgument.index;
      if (indexToUpdate !== -1) {
        updatedArgs[indexToUpdate] = {
          ...updatedArgs[indexToUpdate],
          text: editingArgument.text,
          id: editingArgument.id,
        };

        if (editingArgument.yes_or_no) {
          setLocalYesArguments(updatedArgs);
        } else {
          setLocalNoArguments(updatedArgs);
        }

        setEditingArgument(null);
        setEditingIndex(null);
      }
    }
  };

  const handleDelete = (index, yes_or_no) => {
    const args = [...(yes_or_no ? localYesArguments : localNoArguments)];
    const argToDelete = args[index];
    const filteredArgs = args.filter((arg) => arg !== argToDelete);

    if (yes_or_no) {
      setLocalYesArguments(filteredArgs);
    } else {
      setLocalNoArguments(filteredArgs);
    }

    // Adjust editingIndex *after* filtering.
    if (
      editingArgument &&
      editingArgument.index === index &&
      editingArgument.yes_or_no === yes_or_no
    ) {
      setEditingIndex(null);
      setEditingArgument(null);
    }
    // else if (editingArgument && editingArgument.yes_or_no === yes_or_no) {
    //   const newEditingIndex = filteredArgs.findIndex(
    //     (arg) => arg.text === editingArgument.text
    //   );
    //   if (newEditingIndex !== -1) {
    //     setEditingIndex(newEditingIndex);
    //   } else {
    //     setEditingIndex(null);
    //     setEditingArgument(null);
    //   }
    // }
  };

  const handleProceed = async () => {
    props.updateLoading(true);
    props.updateError(null);
    props.updateYesArguments(localYesArguments);
    props.updateNoArguments(localNoArguments);

    try {
      const argumentsPayload = [
        ...localYesArguments.map((arg) => ({
          yes_or_no: "YES",
          argument: arg.text,
        })),
        ...localNoArguments.map((arg) => ({
          yes_or_no: "NO",
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
      props.updateLoading(false);
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
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Typography variant="h6" fontWeight="bold">
            YES Arguments
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
          >
            Add YES Argument
          </Button>
          <Box sx={{ mt: 2 }}>
            {localYesArguments.map((arg, index) => (
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
                {editingIndex === index && editingArgument?.yes_or_no ? (
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
                  {editingIndex === index && editingArgument?.yes_or_no ? (
                    <IconButton onClick={handleSave}>
                      <SaveIcon color="primary" />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => handleEdit(index, true)}>
                      <EditIcon color="primary" />
                    </IconButton>
                  )}
                  <IconButton onClick={() => handleDelete(index, true)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </div>
              </Paper>
            ))}
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="h6" fontWeight="bold">
            NO Arguments
          </Typography>
          <TextField
            fullWidth
            label="Enter an opposing argument..."
            variant="outlined"
            value={inputNoValue}
            onChange={(e) => setInputNoValue(e.target.value)}
            sx={{ mt: 1 }}
          />
          <Button
            variant="contained"
            color="error"
            sx={{ mt: 1, width: "100%" }}
            onClick={addConArgument}
          >
            Add NO Argument
          </Button>
          <Box sx={{ mt: 2 }}>
            {localNoArguments.map((arg, index) => (
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
                {editingIndex === index && !editingArgument?.yes_or_no ? (
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
                  {editingIndex === index && !editingArgument?.yes_or_no ? (
                    <IconButton onClick={handleSave}>
                      <SaveIcon color="primary" />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => handleEdit(index, false)}>
                      <EditIcon color="primary" />
                    </IconButton>
                  )}
                  <IconButton onClick={() => handleDelete(index, false)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </div>
              </Paper>
            ))}
          </Box>
        </Grid>
      </Grid>

      {/* --- Loading and Error Messages --- */}
      {props.isLoading && <Typography>Loading...</Typography>}
      {props.error && <Typography color="error">{props.error}</Typography>}

      {/* --- Proceed Button --- */}
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3, width: "100%" }}
        onClick={handleProceed}
        disabled={
          props.isLoading ||
          (localYesArguments.length === 0 && localNoArguments.length === 0)
        }
      >
        Proceed
      </Button>
    </Box>
  );
};

export default ArgumentManager;
