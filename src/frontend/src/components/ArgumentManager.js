// ArgumentManager.js (Previous Page) -  Modified with UUIDs
import React, { useState } from "react";
import { Box, Typography, TextField, Button, Grid, Paper, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid'; // Import UUID

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
            setLocalProArguments([...localProArguments, { id: uuidv4(), text: currentProArg }]); // Add with UUID
            setCurrentProArg(""); // Clear input
        }
    };

    // --- Add Con Argument (Local) ---
    const handleAddConArgument = () => {
        if (currentConArg.trim()) {
            setLocalConArguments([...localConArguments, { id: uuidv4(), text: currentConArg }]); //Add with UUID
            setCurrentConArg(""); // Clear input
        }
    };

    const handleEdit = (index, isPro) => {
        const args = isPro ? localProArguments : localConArguments;
        const argToEdit = args[index]
        setEditingArgument({ text: argToEdit.text, index: index, isPro: isPro, id: argToEdit.id }) // Store the ID
        setEditingIndex(index);
    }

    const handleChange = (event) => {
        // Update the 'text' property of the *editingArgument* object.  This is reactive.
        if (editingArgument) {
            setEditingArgument({ ...editingArgument, text: event.target.value });
        }
    };
    const handleSave = () => {
        if (editingArgument) {
            const updatedArgs = [...(editingArgument.isPro ? localProArguments : localConArguments)];
            // Use the id to find and update the argument
            const indexToUpdate = updatedArgs.findIndex(arg => arg.id === editingArgument.id);
            if (indexToUpdate !== -1) {
              updatedArgs[indexToUpdate] = { ...updatedArgs[indexToUpdate], text: editingArgument.text }; //Update
            }


            if (editingArgument.isPro) {
                setLocalProArguments(updatedArgs)
            }
            else {
                setLocalConArguments(updatedArgs)
            }

            setEditingArgument(null);
            setEditingIndex(null)
        }
    }

    const handleDelete = (index, isPro) => {
        const args = [...(isPro ? localProArguments : localConArguments)];
        //Get the id of the argument to delete
        const idToDelete = args[index].id;

        //Filter by ID
        const filteredArgs = args.filter(arg => arg.id !== idToDelete);

        if (isPro) {
            setLocalProArguments(filteredArgs)
        } else {
            setLocalConArguments(filteredArgs)
        }

         // Adjust editingIndex *after* filtering.
         if (editingArgument && editingArgument.id === idToDelete) {
            setEditingIndex(null);
            setEditingArgument(null);
        } else if (editingArgument && editingArgument.isPro === isPro) {
            // Find the new index of the editing argument.
            const newEditingIndex = filteredArgs.findIndex(arg => arg.id === editingArgument.id);
             if(newEditingIndex !== -1){
                setEditingIndex(newEditingIndex);
             } else { // If not found, clear editing state
                setEditingIndex(null);
                setEditingArgument(null);
            }

        }
    }


    // --- Proceed (Submit to API) ---
    const handleProceed = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const argumentsPayload = [
                ...localProArguments.map(arg => ({ yes_or_no: "YES", argument: arg.text })), // Use arg.text
                ...localConArguments.map(arg => ({ yes_or_no: "NO", argument: arg.text }))  // Use arg.text
            ];

            const response = await axios.post('http://localhost:5000/read_user_arguments', {
                topic_id: questionId,
                arguments: argumentsPayload
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response?.data?.success === true) {
                // setIsLoading(true) // Keep loading true if fetching again
                setError(null)
                try {
                    const argumentResponse = await axios.get(`http://localhost:5000/get_arguments?topic_id=${questionId}`);
                    // Transform the API response into the format expected by `allArguments`
                    if (argumentResponse?.data?.success === true) {
                        const newArguments = argumentResponse.data['arguments'].map((argument_dict) => ({
                            id: argument_dict['argument_id'],
                            text: argument_dict['argument'],
                            pro: argument_dict['yes_or_no'] === "YES",
                            categoryId: null  // Initialize categoryId to null
                        }));
                        // Update the global state with the *new* arguments from the API.
                        setAllArguments(newArguments); // Replace, don't add, for consistency with categories
                        setStep(4);
                    }
                }
                catch (error) {
                    setError(error.response?.data?.message || 'Failed to get arguments')
                } finally {
                    setIsLoading(false); //Set loading to false here.
                }
            }

        } catch (error) {
            setError(error.response?.data?.message || 'Failed to submit arguments.');
        } finally {
            setIsLoading(false); // Make SURE isLoading is set to false
        }
    }


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
                                key={arg.id} // Use the UUID as the key
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
                                    <Typography>{arg.text}</Typography> // Display arg.text
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
                                key={arg.id} // Use the UUID as the key
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
                                    <Typography>{arg.text}</Typography> // Display arg.text
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
                onClick={handleProceed}  // Call handleProceed
                disabled={isLoading || (localProArguments.length === 0 && localConArguments.length === 0)} // Disable if loading or no arguments
            >
                Proceed
            </Button>
        </Box>
    );
};

export default ArgumentManager;