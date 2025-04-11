import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs for user-added categories
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    IconButton,
    CircularProgress,
    Alert,
    Divider,
} from "@mui/material";
import {baseUrl} from "../config";

const Categorization = (props) => {
    // State for UI control
    const [isSubmitting, setIsSubmitting] = useState(false); // For proceed action
    const [input, setInput] = useState(""); // For new category input field
    const [isFetching, setIsFetching] = useState(false); // For initial data fetch
    const [fetchError, setFetchError] = useState(null); // For initial data fetch error

    // State for data
    const [localCategory, setLocalCategory] = useState([]); // Holds categories (API + user-added) and their arguments
    const [uncategorizedArguments, setUncategorizedArguments] = useState([]); // Holds arguments needing categorization

    // Effect Hook to fetch initial categories and arguments
    useEffect(() => {
        const fetchArgumentsAndCategories = async () => {
            if (!props.topic) {
                setFetchError("Topic ID is missing.");
                return; // Exit if no questionId
            }
            setIsFetching(true);
            setFetchError(null);
            setLocalCategory([]); // Reset state on new fetch
            setUncategorizedArguments([]); // Reset state on new fetch

            try {
                const response = await axios.get(`${baseUrl}/get_arguments_for_categorization?topic_id=${props.topic?.topic_id}`);

                if (response.data.success && response.data.arguments_by_category) {
                    const fetchedCategories = [];
                    const fetchedUncategorizedArgs = [];

                    response.data.arguments_by_category.forEach(cat => {
                        const formattedArguments = cat.arguments.map(arg => ({
                            text: arg.argument,
                            id: arg.argument_id,
                        }));

                        if (cat.category_id === 0) {
                            fetchedUncategorizedArgs.push(...formattedArguments);
                        } else {
                            fetchedCategories.push({
                                id: cat.category_id,
                                argument_category: cat.argument_category,
                                arguments: formattedArguments,
                            });
                        }
                    });

                    setLocalCategory(fetchedCategories);
                    setUncategorizedArguments(fetchedUncategorizedArgs);

                } else {
                     setFetchError(response.data.message || "Failed to fetch data: API request not successful.");
                }
            } catch (error) {
                console.error("Error fetching arguments and categories:", error);
                 setFetchError(error.response?.data?.message || error.message || "An error occurred while fetching data.");
            } finally {
                 setIsFetching(false);
            }
        };
        fetchArgumentsAndCategories();

    }, [props.topic]);

    // Handler to add a new category locally
    const handleAddCategory = () => {
        if (input.trim() !== "") {
            const categoryId = uuidv4();
            setLocalCategory([
                ...localCategory,
                { id: categoryId, argument_category: input, arguments: [] },
            ]);
            setInput("");
        }
    };

    // Handler to edit a category name locally (uses prompt)
    const handleEditCategory = (id, currentValue) => {
        const name = prompt("Enter new category name:", currentValue);
        if (name !== null && name.trim() !== "") {
            setLocalCategory(
                localCategory.map((c) =>
                    c.id === id ? { ...c, argument_category: name } : c
                )
            );
        }
    };

    // Handler to delete a category locally
    const handleDeleteCategory = (categoryId) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
             setLocalCategory(localCategory.filter((c) => c.id !== categoryId));
        }
    };

    // Handler for the 'Proceed' button
    const handleProceed = async () => {
        setIsSubmitting(true);
        props.updateLoading(true);
        props.updateError(null);
        props.updateCategories(localCategory);
        // console.log("Proceeding with categories:", localCategory);

        const categoriesPayload = {
            topic_id: props.topic?.topic_id,
            argument_categories: localCategory.map((c) => ({
                argument_category: c.argument_category,
            })),
        };

        try {
            if (localCategory.length > 0) { // Or adjust logic if submission always needed
                const response = await axios.post(
                    `${baseUrl}/read_user_argument_categories`,
                    categoriesPayload
                );
                if (response?.data?.success === true) {
                    props.updateCategoriesId(response.data.category_ids || []);
                    props.updateStep(props.step + 1);
                } else {
                    props.updateError(response?.data?.message || "Failed to process categories.");
                    props.updateLoading(false); // Stop loading on failure
                }
            } else {
                 // console.log("No categories defined, proceeding to next step.");
                 props.updateStep(props.step + 1); // Proceed even if no categories?
                 props.updateLoading(false); // Ensure loading stops
            }
        } catch (error) {
            console.error("Error proceeding:", error)
            props.updateError(error.response?.data?.message || error.message || "An unexpected error occurred during submission.");
            props.updateLoading(false); // Stop loading on failure
        } finally {
            setIsSubmitting(false);
            // props.updateLoading(false); // Handled above or by parent
        }
    };

    // --- JSX Rendering ---
    return (
        <Box sx={{ p: { xs: 1, sm: 2 } }}>
            <Typography variant="h5" component="h2" gutterBottom>
                Categorize Your Arguments
            </Typography>

            {/* --- SECTION: Your Categories (Moved to Top) --- */}
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Your Categories</Typography>
            {isFetching ? (
                // Show loading indicator while fetching categories
                 <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><CircularProgress /></Box>
            ) : localCategory.length === 0 && !fetchError ? (
                // Show message if no categories exist (and not due to error)
                <Typography variant="body2" sx={{mb: 2, color: 'text.secondary'}}>No categories defined yet.</Typography>
            ) : (
                // Display the list of categories
                localCategory.map((category) => (
                    <Paper
                        key={category.id}
                        elevation={2}
                        sx={{ width: "100%", padding: "12px 16px", mb: 1.5 }}
                    >
                        {/* Category Header */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: (category.arguments && category.arguments.length > 0) ? 1 : 0 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', flexGrow: 1, overflow: "hidden", textOverflow: "ellipsis", mr: 1 }}>
                                {category.argument_category}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
                                <IconButton color="primary" size="small" onClick={() => handleEditCategory(category.id, category.argument_category)}>
                                    <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton color="error" size="small" onClick={() => handleDeleteCategory(category.id)}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </Box>
                        {/* Divider */}
                        {category.arguments && category.arguments.length > 0 && <Divider />}
                        {/* Arguments List */}
                        {category.arguments && category.arguments.length > 0 && (
                            <List dense sx={{ width: '100%', bgcolor: 'background.paper', pl: 1, mt: 1 }}>
                                {category.arguments.map((arg) => (
                                    <ListItem key={arg.id} disablePadding sx={{ pl: 1 }}>
                                        <ListItemText
                                            primary={arg.text}
                                            primaryTypographyProps={{ variant: 'body2', sx: { fontStyle: 'italic', color: 'text.secondary' } }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                        {/* Placeholder for Empty Categories */}
                        {(!category.arguments || category.arguments.length === 0) && (
                            <Typography variant="caption" sx={{ pl: 2, mt: 1, display: 'block', color: 'text.secondary' }}>
                                (No arguments assigned)
                            </Typography>
                        )}
                    </Paper>
                ))
            )}
             {/* Display fetch error specific to categories/arguments loading */}
             {fetchError && (
                 <Alert severity="error" sx={{ mt: 2 }}>{fetchError}</Alert>
             )}

            {/* --- SECTION: Prompting Message (Added) --- */}
            <Typography variant="body2" sx={{ mt: 4, mb: 2, fontStyle: 'italic', color: 'text.secondary', textAlign: 'center' }}>
                Do the current categories fully capture the essence of your arguments?<br />
                If any of your points feel left out or miscategorized, please share a new category that you believe better represents them. Your perspective helps refine this dialogue.
            </Typography>

            {/* --- SECTION: Add New Category Input --- */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}> {/* Added more margin bottom */}
                <TextField
                    label="Define a New Category" // Changed label slightly
                    variant="outlined"
                    size="small"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                    fullWidth
                    />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddCategory}
                    size="medium"
                    disabled={input.trim() === ""}
                >
                    Add
                </Button>
            </Box>

            {/* --- SECTION: Uncategorized Arguments (Moved to Bottom) --- */}
            <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>Arguments to Categorize</Typography>
            <Paper sx={{ padding: 2, mb: 3, flex: 1, border: '1px dashed grey' /* Visual cue */ }}>
                 {/* Show loading indicator only if specifically fetching */}
                 {isFetching ? (
                     <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><CircularProgress /></Box>
                 ) : uncategorizedArguments.length === 0 && !fetchError ? (
                     // Message if no arguments need categorization (and no fetch error)
                     <Typography variant="body2" align="center" sx={{ mt: 2, color: 'text.secondary' }}>
                         All arguments are currently categorized.
                     </Typography>
                 ) : !fetchError ? (
                    // Display list if arguments exist and no fetch error
                    <List dense>
                        {uncategorizedArguments.map((item) => (
                            <ListItem key={item.id} divider>
                                <ListItemText primary={item.text} primaryTypographyProps={{variant: 'body2'}}/>
                                {/* Add Drag handle or interaction here */}
                            </ListItem>
                        ))}
                    </List>
                 ) : null /* Don't show list if there was a fetch error (already shown above) */}
            </Paper>


            {/* --- SECTION: Loading/Error (from props, e.g., submission) --- */}
             {props.isLoading && !isFetching && (
                 <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, my: 2 }}>
                     <CircularProgress size={20} />
                     <Typography variant="body2">Processing...</Typography>
                 </Box>
             )}
             {props.error && (
                <Alert severity="warning" sx={{ my: 2 }}>{props.error}</Alert>
             )}

            {/* --- SECTION: Proceed Button --- */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
                 <Button
                     variant="contained"
                     color="success"
                     onClick={handleProceed}
                     disabled={isSubmitting || props.isLoading || isFetching}
                     size="large"
                 >
                     {isSubmitting ? "Processing..." : "Proceed"}
                 </Button>
             </Box>
        </Box>
    );
};

export default Categorization;