import React, { useState } from "react";
import { Box, Typography, TextField, Button, Grid, Paper, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const ArgumentManager = ({ question, setAllArguments, allArguments, setStep, token }) => {
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
      setLocalProArguments([...localProArguments, currentProArg]); // Add to local array
      setCurrentProArg(""); // Clear input
    }
    };

    // --- Add Con Argument (Local) ---
    const handleAddConArgument = () => {
    if (currentConArg.trim()) {
      setLocalConArguments([...localConArguments, currentConArg]); // Add to local array
      setCurrentConArg(""); // Clear input
    }
    };

    const handleEdit = (index, isPro) => {
        const args = isPro ? localProArguments : localConArguments;
        const argToEdit = args[index]
        setEditingArgument({text: argToEdit, index: index, isPro: isPro})
        setEditingIndex(index);
    }

    const handleChange = (event) => {
        // Update the 'text' property of the *editingArgument* object.  This is reactive.
         if (editingArgument) {
            setEditingArgument({ ...editingArgument, text: event.target.value });
        }
    };
    const handleSave = () => {
        if(editingArgument) {
            const updatedArgs = [...(editingArgument.isPro ? localProArguments : localConArguments)];
            updatedArgs[editingArgument.index] = editingArgument.text;

            if(editingArgument.isPro){
                setLocalProArguments(updatedArgs)
            }
            else{
                setLocalConArguments(updatedArgs)
            }

            setEditingArgument(null);
            setEditingIndex(null)
        }
    }

    const handleDelete = (index, isPro) => {
        const args = [...(isPro ? localProArguments : localConArguments)];
        args.splice(index, 1);

        if(isPro){
            setLocalProArguments(args)
        } else {
            setLocalConArguments(args)
        }

        if (editingIndex === index) { //If the delete one is being edited
            setEditingIndex(null);
            setEditingArgument(null);
        } else if (editingIndex > index && editingIndex !== null ) { //If above one is deleted.
            setEditingIndex(editingIndex - 1)
        }
    }


    // --- Proceed (Submit to API) ---
    const handleProceed = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const argumentsPayload = [
                ...localProArguments.map(arg => ({ yes_or_no: "YES", argument: arg })),
                ...localConArguments.map(arg => ({ yes_or_no: "NO", argument: arg }))
            ];

            const response = await axios.post('http://localhost:5000/read_user_arguments', {
                topic_id: question,
                arguments: argumentsPayload
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response?.data?.success === true){
                setIsLoading(true)
                setError(null)
                try {
                    const argumentResponse = await axios.get(`http://localhost:5000/get_arguments?topic_id=${question}`);
                    // Transform the API response into the format expected by `allArguments`
                    if (argumentResponse?.data?.success === true) {
                        const newArguments = argumentResponse.data['arguments'].map((argument_dict) => ({
                            id: argument_dict['argument_id'],
                            text: argument_dict['argument'],
                            pro: argument_dict['yes_or_no'] === "YES",
                            categoryId: null
                        }));
                        // Update the global state with the *new* arguments from the API.
                        setAllArguments([...allArguments, ...newArguments]);
                        setStep(4);
                    }
                }
                catch (error) {
                    setError(error.response?.data?.message || 'Failed to get arguments')
                }
            }

        } catch (error) {
            setError(error.response?.data?.message || 'Failed to submit arguments.');
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <Box sx={{ maxWidth: 800, margin: "auto", padding: 3 }}>
            <Typography variant="h4" fontWeight="bold" textAlign="center">
            Argument Generation & Review
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
            Question ID: {question}
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
                    <Box sx={{ mt: 2 }}>
                        {localProArguments.map((arg, index) => (
                        <Paper
                            key={index}
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
                            <Typography>{arg}</Typography>
                        )}
                        <div>
                            {editingIndex === index && editingArgument?.isPro? (
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
                    <Box sx={{ mt: 2 }}>
                        {localConArguments.map((arg, index) => (
                        <Paper
                            key={index}
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
                        {editingIndex === index && !editingArgument?.isPro? (
                            <TextField
                                fullWidth
                                value={editingArgument ? editingArgument.text: ""}
                                onChange={handleChange}
                                variant="outlined"
                                size="small"
                                autoFocus
                            />
                        ) : (
                            <Typography>{arg}</Typography>
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