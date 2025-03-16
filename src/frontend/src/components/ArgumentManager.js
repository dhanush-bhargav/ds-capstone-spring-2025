// ArgumentManager.js
import React, { useState } from "react";
import { Box, Typography, TextField, Button, Grid, Paper, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

const ArgumentManager = ({ question, questionId, setAllArguments, allArguments, setStep, token }) => {
    const [currentProArg, setCurrentProArg] = useState("");
    const [currentConArg, setCurrentConArg] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingArgument, setEditingArgument] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [localProArguments, setLocalProArguments] = useState([]); // Local state for pro arguments
    const [localConArguments, setLocalConArguments] = useState([]); // Local state for con arguments


    // --- Add Pro Argument (Local) ---
    const handleAddProArgument = () => {
        if (currentProArg.trim()) {
            //No longer adding ID
            setLocalProArguments([...localProArguments, {  text: currentProArg }]);
            setCurrentProArg("");
        }
    };

    // --- Add Con Argument (Local) ---
    const handleAddConArgument = () => {
        if (currentConArg.trim()) {
            setLocalConArguments([...localConArguments, {  text: currentConArg }]);
            setCurrentConArg("");
        }
    };
  const handleEdit = (index, isPro) => {
    const args = isPro ? localProArguments : localConArguments;
    const argToEdit = args[index];

    // Use findIndex for consistency
    const globalIndex = allArguments.findIndex(arg =>
        arg.text === argToEdit.text && arg.pro === isPro
    );

    setEditingArgument({
        text: argToEdit.text,
        index: index,  // Local index
        isPro: isPro,
        id: argToEdit.id // Store ID if available
    });
    setEditingIndex(index); // Local index is sufficient
};
    const handleChange = (event) => {
        if (editingArgument) {
            setEditingArgument({ ...editingArgument, text: event.target.value });
        }
    };
const handleSave = () => {
    if (editingArgument) {
        const updatedArgs = [...(editingArgument.isPro ? localProArguments : localConArguments)];
        const indexToUpdate = editingArgument.index; // Use local index

        if (indexToUpdate !== -1) {
            // Create a new object with updated text, preserving the ID if it exists.
            updatedArgs[indexToUpdate] = {
                ...updatedArgs[indexToUpdate], // Copy existing properties (like ID)
                text: editingArgument.text,     // Update the text
            };


            if (editingArgument.isPro) {
                setLocalProArguments(updatedArgs);
            } else {
                setLocalConArguments(updatedArgs);
            }

            setEditingArgument(null);
            setEditingIndex(null);
        }
    }
};


  const handleDelete = (index, isPro) => {
    const args = [...(isPro ? localProArguments : localConArguments)];
    const argToDelete = args[index];

    // Filter by comparing the object.
    const filteredArgs = args.filter(arg => arg !== argToDelete);

    if (isPro) {
      setLocalProArguments(filteredArgs);
    } else {
      setLocalConArguments(filteredArgs);
    }

     // Adjust editingIndex *after* filtering.
        if (editingArgument && editingArgument.index === index && editingArgument.isPro === isPro) {
            setEditingIndex(null);
            setEditingArgument(null);
        } else if (editingArgument && editingArgument.isPro === isPro) {
             // Find the new index of the editing argument.
            const newEditingIndex = filteredArgs.findIndex(arg => arg.text === editingArgument.text); // Find by text
            if(newEditingIndex !== -1){
                setEditingIndex(newEditingIndex);
            } else { // If not found, clear editing state
                setEditingIndex(null);
                setEditingArgument(null);
            }
        }
  };

    const handleProceed = async () => {
    setIsLoading(true);
    setError(null);

    try {
        const argumentsPayload = [
            ...localProArguments.map(arg => ({ yes_or_no: "YES", argument: arg.text })),
            ...localConArguments.map(arg => ({ yes_or_no: "NO", argument: arg.text }))
        ];

        const response = await axios.post('http://localhost:5000/read_user_arguments', {
            topic_id: questionId,
            arguments: argumentsPayload
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response?.data?.success === true) {
            // Get the argument IDs from the response
            const returnedArguments = response.data.arguments;

            // Update the local state with arguments AND IDs.  This is the key change.
            const updatedProArguments = localProArguments.map((localArg, index) => {
                const matchingReturnedArg = returnedArguments.find(
                    retArg => retArg.argument === localArg.text && retArg.yes_or_no === "YES"
                );
                return {
                    ...localArg, // Keep existing properties (like text)
                    id: matchingReturnedArg ? matchingReturnedArg.argument_id : uuidv4(), // Add the ID, or a fallback
                    pro: true,
                    categoryId: null,
                };
            });

            const updatedConArguments = localConArguments.map((localArg, index) => {
                const matchingReturnedArg = returnedArguments.find(
                    retArg => retArg.argument === localArg.text && retArg.yes_or_no === "NO"
                );
                return {
                    ...localArg,
                    id: matchingReturnedArg ? matchingReturnedArg.argument_id : uuidv4(),
                    pro: false,
                    categoryId: null,
                };
            });

            // Combine and set all arguments in App.js
            setAllArguments([...updatedProArguments, ...updatedConArguments]);
            setStep(4); // Move to the next step (Categorization)
        } else {
            setError(response.data.message || 'Failed to submit arguments.');
        }
    } catch (error) {
        setError(error.response?.data?.message || 'Failed to submit arguments.');
    } finally {
        setIsLoading(false);
    }
};


    return (
        <Box sx={{ maxWidth: 800, margin: "auto", padding: 3 }}>
            <Typography variant="h4" fontWeight="bold" textAlign="center">
                Argument Generation & Review
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                Question: {question}
            </Typography>

            {/* --- Argument Generation Section --- */}
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <Typography variant="h6" fontWeight="bold">YES Arguments</Typography>
                    <TextField
                        fullWidth
                        label="Enter a supporting argument..."
                        variant="outlined"
                        value={currentProArg}
                        onChange={(e) => setCurrentProArg(e.target.value)}
                        sx={{ mt: 1 }}
                    />
                    <Button variant="contained" color="success" sx={{ mt: 1, width: "100%" }} onClick={handleAddProArgument}>
                        Add YES Argument
                    </Button>
                   <Box sx={{ mt: 2 }}>
                        {localProArguments.map((arg, index) => (
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
                                {editingIndex === index && editingArgument?.isPro ? (
                                    <TextField
                                        fullWidth
                                        value={editingArgument ? editingArgument.text : ""}
                                        onChange={handleChange}
                                        variant="outlined"
                                        size="small"
                                        autoFocus
                                    />
                                ) : (
                                   <Typography>{arg.text} {arg.id && `(ID: ${arg.id})`}</Typography> // Display text and ID
                                )}
                                <div>
                                    {editingIndex === index && editingArgument?.isPro ? (
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
                    <Typography variant="h6" fontWeight="bold">NO Arguments</Typography>
                    <TextField
                        fullWidth
                        label="Enter an opposing argument..."
                        variant="outlined"
                        value={currentConArg}
                        onChange={(e) => setCurrentConArg(e.target.value)}
                        sx={{ mt: 1 }}
                    />
                    <Button variant="contained" color="error" sx={{ mt: 1, width: "100%" }} onClick={handleAddConArgument}>
                        Add NO Argument
                    </Button>
                    <Box sx={{ mt: 2 }}>
                        {localConArguments.map((arg, index) => (
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
                                {editingIndex === index && !editingArgument?.isPro ? (
                                    <TextField
                                        fullWidth
                                        value={editingArgument ? editingArgument.text : ""}
                                        onChange={handleChange}
                                        variant="outlined"
                                        size="small"
                                        autoFocus
                                    />
                                ) : (
                                    <Typography>{arg.text} {arg.id && `(ID: ${arg.id})`}</Typography> // Display text and ID
                                )}
                                <div>
                                    {editingIndex === index && !editingArgument?.isPro ? (
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
            {isLoading && <Typography>Loading...</Typography>}
            {error && <Typography color="error">{error}</Typography>}

            {/* --- Proceed Button --- */}
            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 3, width: "100%" }}
                onClick={handleProceed}
                disabled={isLoading || (localProArguments.length === 0 && localConArguments.length === 0)}
            >
                Proceed
            </Button>
        </Box>
    );
};

export default ArgumentManager;