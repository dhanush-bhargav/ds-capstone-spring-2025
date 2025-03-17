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
  Chip,
  IconButton,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Categorization = (props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [input, setInput] = useState("");
  const [localCategory, setLocalCategory] = useState([]);

  const inputStyle = {
    height: "40px", // Set a fixed height
    fontSize: "16px", // Ensure text size is consistent
    padding: "8px 12px", // Add padding for better appearance
    border: "1px solid #ccc", // Add border to match styling
    borderRadius: "5px", // Rounded corners for consistency
  };

  const fetchArguments = async () => {
    if (props.topicId) {
      props.updateLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/get_arguments?topic_id=${props.topicId}`
        );
        if (response.data.success) {
          const Arguments = response.data.arguments.map((arg) => ({
            argument_id: arg.argument_id,
            argument: arg.argument,
            yes_or_no: arg.yes_or_no === "YES",
            category_id: arg.category_id,
          }));

          const updatedCategories = [...localCategory];

          let defaultCategory = updatedCategories.find(
            (cat) => cat.argument_category === "Default"
          );
          if (!defaultCategory) {
            const defaultCategoryId = uuidv4();
            defaultCategory = {
              id: defaultCategoryId,
              argument_category: "Default",
              arguments: [],
            };
            updatedCategories.push(defaultCategory);
          }
          const categorized = {};
          Arguments.forEach((arg) => {
            const catId = arg.category_id || defaultCategory.id;
            if (!categorized[catId]) {
              categorized[catId] = [];
            }
            categorized[catId].push(arg);
          });

          const finalCategories = updatedCategories.map((category) => {
            return {
              ...category,
              arguments: categorized[category.id] || [],
            };
          });
          setLocalCategory(finalCategories);
          console.log(localCategory);
        } else {
          props.updateError(
            response.data.message || "Failed to fetch arguments."
          );
        }
      } catch (error) {
        props.updateError(
          error.response?.data?.message || "Failed to fetch arguments."
        );
      } finally {
        props.updateLoading(false);
      }
    }
  };

  //   const fetchCategories = async () => {
  //     props.updateLoading(true);
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:5000/get_argument_categories?topic_id=${props.topicId}`
  //       );
  //       if (response.data.success) {
  //         const categories = response.data.argument_categories.map((cat) => ({
  //           id: cat.category_id,
  //           argument_category: cat.argument_category,
  //           arguments: [],
  //         }));
  //         const updatedCategories = [...localCategory];

  //         let defaultCategory = updatedCategories.find(
  //           (cat) => cat.argument_category === "Default"
  //         );
  //         if (!defaultCategory) {
  //           const defaultCategoryId = uuidv4();
  //           defaultCategory = {
  //             id: defaultCategoryId,
  //             argument_category: "Default",
  //             arguments: [],
  //           };
  //           categories.push(defaultCategory);
  //         }
  //         setLocalCategory(categories);
  //       } else {
  //         props.updateError(
  //           response.data.message || "Failed to fetch categories."
  //         );
  //       }
  //     } catch (error) {
  //       props.updateError(
  //         error.response?.data?.message || "Failed to fetch categories."
  //       );
  //     } finally {
  //       props.updateLoading(false);
  //     }
  //   };

  useEffect(() => {
    // fetchCategories();
    fetchArguments();
  }, [props.topicId]);

  const handleAddCategory = () => {
    if (input.trim().toLowerCase() === "default") {
      alert("You cannot name a category 'Default'.");
      return;
    }
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
      if (name.trim().toLowerCase() === "default") {
        alert("You cannot rename a category to 'Default'.");
        return;
      }

      setLocalCategory(
        localCategory.map((c) =>
          c.id === id ? { ...c, argument_category: name } : c
        )
      );
    }
  };

  const handleDeleteCategory = (categoryId) => {
    let updatedCategories = [...localCategory];
    let defaultArgument = [];

    let categoryToDelete = updatedCategories.find((c) => c.id === categoryId);

    if (categoryToDelete && categoryToDelete.argument_category === "Default") {
      alert("You cannot delete the Default category.");
      return;
    }

    if (categoryToDelete) {
      defaultArgument = categoryToDelete.arguments || [];
    }
    updatedCategories = updatedCategories.filter((c) => c.id !== categoryId);

    let defaultCategory = updatedCategories.find(
      (cat) => cat.argument_category === "Default"
    );
    if (!defaultCategory) {
      const defaultCategoryId = uuidv4();
      defaultCategory = {
        id: defaultCategoryId,
        argument_category: "Default",
        arguments: defaultArgument,
      };
      updatedCategories.push(defaultCategory);
    } else {
      defaultCategory.arguments = [
        ...defaultCategory.arguments,
        ...defaultArgument,
      ];
    }
    setLocalCategory(updatedCategories);
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    setLocalCategory((prevCategories) => {
      let draggedArgument;
      for (const category of prevCategories) {
        draggedArgument = category.arguments.find(
          (arg) => String(arg.argument_id) === draggableId
        );
        if (draggedArgument) break;
      }

      if (!draggedArgument) return;

      // 2. Create a *copy* (no need for a deep copy here).
      const updatedCategories = [...prevCategories];

      // 3. Remove from source.
      const sourceCategoryIndex = updatedCategories.findIndex(
        (cat) => String(cat.id) === source.droppableId
      );
      if (sourceCategoryIndex === -1) return; // Source category not found (shouldn't happen).

      updatedCategories[sourceCategoryIndex] = {
        ...updatedCategories[sourceCategoryIndex],
        arguments: updatedCategories[sourceCategoryIndex].arguments.filter(
          (arg) => String(arg.argument_id) !== draggableId
        ),
      };

      // 4. Add to destination.
      const destinationCategoryIndex = updatedCategories.findIndex(
        (cat) => String(cat.id) === destination.droppableId
      );
      if (destinationCategoryIndex === -1) return; // Destination category not found (shouldn't happen).

      updatedCategories[destinationCategoryIndex] = {
        ...updatedCategories[destinationCategoryIndex],
        arguments: [
          ...updatedCategories[destinationCategoryIndex].arguments.slice(
            0,
            destination.index
          ),
          { ...draggedArgument }, // Add the dragged argument. No need to change category_id here.
          ...updatedCategories[destinationCategoryIndex].arguments.slice(
            destination.index
          ),
        ],
      };

      return updatedCategories; // Return the *new* state.
    });
  };

  const handleProceed = async () => {
    setIsSubmitting(true);
    props.updateLoading(true);
    props.updateError(null);
    props.updateCategories(localCategory);
    props.updateStep(5);

    const categoriesPayload = {
      topic_id: props.topicId,
      argument_categories: localCategory
        .filter((c) => c.argument_category !== "Default") // Skip Default
        .map((c) => ({
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
      props.updateError(
        error.message || "An unexpected error occurred."
      );
    } finally {
      props.updateLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Categorize Arguments</h2>
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

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="categories-container">
          {localCategory.map((category) => (
            <Droppable
              droppableId={String(category.id)}
              key={String(category.id)}
            >
              {(provided) => (
                <Box
                  className="category"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
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
                        handleEditCategory(
                          category.id,
                          category.argument_category
                        )
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

                  <div className="arguments-list">
                    {category.arguments.map((argument, index) => (
                      <Draggable
                        key={argument.argument_id}
                        draggableId={String(argument.argument_id)}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className="argument-item"
                            style={{ padding: "10px" }}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Chip label={argument.argument} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </Box>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

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
