// Categorization.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
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
} from "@mui/material";

const Categorization = (props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [input, setInput] = useState("");
  const [localCategory, setLocalCategory] = useState([]);
  const [yesArguments, setYesArguments] = useState([]);
  const [noArguments, setNoArguments] = useState([]);

  useEffect(() => {
    const fetchArguments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/get_arguments?topic_id=${props.topicId}`);
        if (response.data.success) {
          const existingYes = response.data.arguments.filter(arg => arg.yes_or_no==="YES").map(arg => {
            return {text: arg.argument, id: arg.argument_id}
          });
          const existingNo = response.data.arguments.filter(arg => arg.yes_or_no==="NO").map(arg => {
            return {text: arg.argument, id: arg.argument_id}
          });
  
          // response.data.arguments.forEach((arg) => {
          //   if (arg.yes_or_no === "YES") {
          //     existingYes.set(arg.argument, { text: arg.argument, id: arg.argument_id });
          //   } else {
          //     existingNo.set(arg.argument, { text: arg.argument, id: arg.argument_id });
          //   }
          // });
  
          setYesArguments(Array.from(existingYes.values()));
          setNoArguments(Array.from(existingNo.values()));
        }
      } catch (error) {
        console.error("Error fetching arguments:", error);
      }
    };
    fetchArguments();
    
  }, [props.yesArguments, props.noArguments]);
  

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

  const handleEditCategory = (id, value) => {
    const name = prompt("Enter new category name:", value);
    if (name !== null && name.trim() !== "") {
      setLocalCategory(
        localCategory.map((c) =>
          c.id === id ? { ...c, argument_category: name } : c
        )
      );
    }
  };

  const handleDeleteCategory = (categoryId) => {
    let updatedCategories = [...localCategory];
    updatedCategories = updatedCategories.filter((c) => c.id !== categoryId);
    setLocalCategory(updatedCategories);
  };

  const handleProceed = async () => {
    setIsSubmitting(true);
    props.updateLoading(true);
    props.updateError(null);
    props.updateCategories(localCategory);
    props.updateStep(5);

    const categoriesPayload = {
      topic_id: props.topicId,
      argument_categories: localCategory.map((c) => ({
        argument_category: c.argument_category,
      })),
    };
    console.log(categoriesPayload);

    try {
      if (localCategory.length > 0) {
        const response = await axios.post(
          "http://localhost:5000/read_user_argument_categories",
          categoriesPayload
        );
        if (response?.data?.success === true) {
          props.updateCategoriesId(response.data.category_ids);
          props.updateLoading(true);
          props.updateStep(5);
        } else {
          props.updateError("Failed to create new categories.");
          props.updateLoading(false);
          return;
        }
      }
    } catch (error) {
      props.updateError(error.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
      props.updateLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Category Creation</h2>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 4,
          padding: 4,
          backgroundColor: "#f5f5f5",
        }}
      >
        {/* First List */}
        <Paper sx={{ padding: 2, minWidth: 200 }}>
          <Typography variant="h6" align="center" gutterBottom>
            Yes Arguments
          </Typography>
          <List>
            {yesArguments.map((item, index) => (
              <ListItem key={index} divider>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Second List */}
        <Paper sx={{ padding: 2, minWidth: 200 }}>
          <Typography variant="h6" align="center" gutterBottom>
            No Arguments
          </Typography>
          <List>
            {noArguments.map((item, index) => (
              <ListItem key={index} divider>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Enter new category name"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          fullWidth
          sx={{
            "& .MuiInputBase-root": {
              height: "30px", // Ensures same height as button
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddCategory}
          sx={{
            height: "30px",
            minWidth: "50px",
          }}
        >
          Add Category
        </Button>
      </Box>

      {props.isLoading && <p>Loading...</p>}
      {props.error && <p className="text-red-500">{props.error}</p>}
      {localCategory.map((category) => (
        <Box
          className="category"
          sx={{
            alignItems: "center",
            gap: 2,
            border: "2px solid #ccc",
            borderRadius: "8px",
            width: "100%",
            padding: "8px",
            overflow: "hidden",
          }}
        >
          <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                margin: 0,
                flexGrow: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {category.argument_category}
            </Typography>
            <IconButton
              color="primary"
              size="small"
              sx={{ width: "30px", height: "30px", padding: "4px" }}
              onClick={() =>
                handleEditCategory(category.id, category.argument_category)
              }
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              color="error"
              size="small"
              sx={{ width: "30px", height: "30px", padding: "4px" }}
              onClick={() => handleDeleteCategory(category.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      ))}

      <button
        onClick={handleProceed}
        className="mt-4 p-3 bg-green-500 text-white rounded hover:bg-green-600"
        disabled={isSubmitting}
      >
        Proceed
      </button>
    </div>
  );
};

export default Categorization;