// Categorization.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Categorization = ({
    setCategories,
    setStep,
    categories,  // Existing categories (if any)
    questionId,
    allArguments, // Use allArguments
    setAllArguments,
}) => {
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tempCategories, setTempCategories] = useState([]); // Local, editable categories
    const [categorizedArguments, setCategorizedArguments] = useState({});


    // Initialize tempCategories from props.categories
    useEffect(() => {
        setTempCategories(categories || []);
    }, [categories]);


    // Fetch arguments on component mount AND when questionId changes
    useEffect(() => {
        const fetchArguments = async () => {
            if (questionId) {
                setIsLoading(true);
                try {
                    const response = await axios.get(`http://localhost:5000/get_arguments?topic_id=${questionId}`);
                    if (response.data.success) {
                        const transformedArguments = response.data.arguments.map(arg => ({
                            id: arg.argument_id,
                            text: arg.argument,
                            pro: arg.yes_or_no === "YES",
                            categoryId: arg.category_id || null // Include existing categoryId, if any
                        }));
                        setAllArguments(transformedArguments); // Update global state.  VERY IMPORTANT
                        setError(null);
                    } else {
                        setError(response.data.message || "Failed to fetch arguments.");
                    }
                } catch (error) {
                    setError(error.response?.data?.message || "Failed to fetch arguments.");
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchArguments();
    }, [questionId, setAllArguments]); // Add setAllArguments to dependency array

    // Initialize/update categorizedArguments when tempCategories or allArguments change
       useEffect(() => {
        const initialCategorizedArguments = {};
        tempCategories.forEach((cat) => {
            initialCategorizedArguments[cat.id] = []; // Initialize arrays for *each* category
        });

        // Populate with existing categorizations
        if (allArguments) { // Check if allArguments is populated.
            allArguments.forEach(arg => {
                if (arg.categoryId && tempCategories.find(cat => cat.id === arg.categoryId)) { // Ensure category exists
                    initialCategorizedArguments[arg.categoryId].push(arg.id);
                }
            });
        }
        setCategorizedArguments(initialCategorizedArguments);

    }, [tempCategories, allArguments]);



    const handleAddCategory = () => {
        if (input.trim() !== "") {
            const newCategoryId = uuidv4(); // Generate a UUID
            setTempCategories([...tempCategories, { id: newCategoryId, argument_category: input }]);
            setCategorizedArguments({ ...categorizedArguments, [newCategoryId]: [] }); // Add to categorizedArguments
            setInput("");
        }
    };


    const handleEditCategory = (id, newValue) => {
      const newName = prompt("Enter new category name:", newValue);
      if(newName !== null && newName.trim() !== ""){
        setTempCategories(tempCategories.map(category => category.id === id ? { ...category, argument_category: newName } : category));
      }
    };


   const handleDeleteCategory = (categoryId) => {
        const updatedCategories = tempCategories.filter(category => category.id !== categoryId);
        setTempCategories(updatedCategories);

        // Remove the category from categorizedArguments
        setCategorizedArguments(prevCategorizedArguments => {
            const { [categoryId]: _, ...rest } = prevCategorizedArguments; // Destructure and remove
            return { ...rest };
        });
    };

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        setCategorizedArguments(prevCategorizedArguments => {
            const updatedCategorizedArguments = { ...prevCategorizedArguments };

            // Remove from source
            const sourceCategoryArguments = [...(updatedCategorizedArguments[source.droppableId] || [])];
            sourceCategoryArguments.splice(source.index, 1);
            updatedCategorizedArguments[source.droppableId] = sourceCategoryArguments;

            // Add to destination
            const destinationCategoryArguments = [...(updatedCategorizedArguments[destination.droppableId] || [])];
            destinationCategoryArguments.splice(destination.index, 0, draggableId); //draggableId is the argument ID
            updatedCategorizedArguments[destination.droppableId] = destinationCategoryArguments;

            return updatedCategorizedArguments;
        });
    };



    const handleProceed = async () => {
        setIsLoading(true);
        setError(null);

        // 1. Create new categories (if any)
        const newCategories = tempCategories.filter(tempCat => !categories.some(cat => cat.id === tempCat.id));
        const newCategoriesPayload = {
            topic_id: questionId,
            argument_categories: newCategories.map(cat => ({ argument_category: cat.argument_category }))
        };

        try {
             if (newCategories.length > 0) {
                const createCategoryResponse = await axios.post("http://localhost:5000/read_user_argument_categories", newCategoriesPayload);
                if (!createCategoryResponse.data.success) {
                    setError("Failed to create new categories.");
                     setIsLoading(false); // Important: Stop loading
                    return; // Stop if category creation fails
                }
            //Update the categories with the new categories created.
             const categoryResponse = await axios.get(`http://localhost:5000/get_argument_categories?topic_id=${questionId}`);
                if (categoryResponse?.data?.success === true) {
                    const fetchedCategories = categoryResponse.data.argument_categories.map((category) => ({
                        id: category.category_id,
                        argument_category: category.argument_category,
                    }));
                    setCategories(fetchedCategories) // Update main categories
                }
             }

           // 2. Update argument categorizations (send *all* categorizations)

            const updateArgumentCategoryPayload = {
                topic_id: questionId,
                argument_updates: []  // Build this array
            };

            // Iterate through categorizedArguments
            for (const categoryId in categorizedArguments) {
                if (categorizedArguments.hasOwnProperty(categoryId)) {
                    const argumentIds = categorizedArguments[categoryId];
                    argumentIds.forEach(argumentId => {
                        updateArgumentCategoryPayload.argument_updates.push({
                            argument_id: argumentId, // Argument ID
                            category_id: categoryId    // Category ID
                        });
                    });
                }
            }

            // Send the update request.
            if(updateArgumentCategoryPayload.argument_updates.length > 0){
              const updateArgResponse = await axios.post("http://localhost:5000/update_argument_category", updateArgumentCategoryPayload);
                if (!updateArgResponse.data.success) {
                    setError("Failed to update argument categorizations.");
                    setIsLoading(false);
                    return;
                }
            }



            // Fetch the arguments after updating categories and arguments
            const argumentResponse = await axios.get(`http://localhost:5000/get_arguments?topic_id=${questionId}`);
            if (argumentResponse?.data?.success === true) {
                const newArguments = argumentResponse.data['arguments'].map((argument_dict) => ({
                    id: argument_dict['argument_id'],
                    text: argument_dict['argument'],
                    pro: argument_dict['yes_or_no'] === "YES",
                    categoryId: argument_dict['category_id'] //KEEP CATEGORY
                }));
                setAllArguments(newArguments);
                setStep(5);
            } else {
                setError("Failed to get arguments after categorization");
            }


        } catch (error) {
            setError(error.response?.data?.message || "An unexpected error occurred.");

        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Categorize Arguments</h2>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter new category name"
                className="w-full p-3 border rounded mb-4 text-lg"
            />
            <button onClick={handleAddCategory} className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600" disabled={!input.trim()}>Add Category</button>

            {isLoading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tempCategories.map(category => (
                        <Droppable droppableId={category.id} key={category.id}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`mb-4 ${snapshot.isDraggingOver ? 'bg-gray-100' : ''}`}
                                >
                                    <div className="border rounded">
                                       <div className="p-2 border-b font-bold flex items-center justify-between" style={{display: "flex", gap: "10px", padding: "10px"}}>
                                            <div style={{flex: 1, padding: "10px"}}>
                                                <span>{category.argument_category}</span>
                                            </div>
                                          <div className="flex items-center" style={{padding: "10px"}}>
                                            <IconButton onClick={() => handleEditCategory(category.id, category.argument_category)} aria-label="edit category" size="small">
                                                <EditIcon />
                                            </IconButton>
                                          </div>
                                          <div className="flex items-center" style={{padding: "10px"}}>
                                            <IconButton onClick={() => handleDeleteCategory(category.id)} aria-label="delete category" size="small">
                                                <DeleteIcon />
                                            </IconButton>
                                         </div>
                                        </div>

                                        {/* Display arguments within the category */}
                                        {categorizedArguments[category.id]?.map((argumentId, index) => {
                                            const argument = allArguments.find(arg => arg.id === argumentId);
                                            return argument ? (
                                                <Draggable key={argument.id} draggableId={argument.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`p-2 border-b  flex items-center justify-between ${snapshot.isDragging ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                                                        >
                                                            <span>{argument.text}</span>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ) : null;
                                        })}
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>

            <button onClick={handleProceed} className="mt-4 p-3 bg-green-500 text-white rounded hover:bg-green-600" disabled={isLoading}>Proceed</button>
        </div>
    );
};

export default Categorization;