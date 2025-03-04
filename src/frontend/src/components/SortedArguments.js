import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./SortedArguments.css"; // Make sure this import is correct
import axios from "axios";

const SortedArguments = ({ allArguments, categories, setStep, token, questionId }) => {
  // --- State Variables ---
  const [sortedArguments, setSortedArguments] = useState({}); // Holds the sorted arguments.
  const [isLoading, setIsLoading] = useState(false);        // Tracks API loading state.
  const [error, setError] = useState(null);              // Tracks API errors.

  // --- Initialization (useEffect) ---
  useEffect(() => {
    const initialSorted = {};

    // 1. Create an empty array for *each* category.  Use category.id as the key.
    categories.forEach(category => {
      initialSorted[category.id] = [];
    });

    // 2. Create an empty array for *uncategorized* arguments.  Use null as the key.
    initialSorted[null] = [];

    // 3. Iterate through *all* arguments and place them into the correct array.
    allArguments.forEach(arg => {
      if (arg.categoryId && initialSorted[arg.categoryId]) {
        // If the argument HAS a category, AND that category exists, add it.
        initialSorted[arg.categoryId].push(arg);
      } else {
        // If the argument does NOT have a category, add it to the "uncategorized" array.
        initialSorted[null].push(arg);
      }
    });

    // 4. Set the state.  This triggers a re-render.
    setSortedArguments(initialSorted);
  }, [categories, allArguments]); // Re-run this effect when categories or allArguments change.


  // --- Drag End Handler ---
  const handleDragEnd = async (result) => {
    // 1. If there's no destination, do nothing (dropped outside a droppable).
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    // 2. Find the argument that was moved.  Must use .toString() for comparison.
    const movedArgument = allArguments.find(arg => arg.id.toString() === draggableId);
    if (!movedArgument) {
      console.error("Could not find moved argument"); // Log an error if not found.
      return;
    }

    // 3. Get the source and destination category IDs.  Handle the "arguments-list" case (uncategorized).
    const sourceCategoryId = source.droppableId === "arguments-list" ? null : parseInt(source.droppableId);
    const destCategoryId = destination.droppableId === "arguments-list" ? null : parseInt(destination.droppableId);

    // 4. Optimistic UI Update: Update the state *before* the API call.
    setSortedArguments(prevSorted => {
      const newSorted = { ...prevSorted }; // Create a *copy* of the previous state.

      // 4a. Remove the argument from its source category.
      if (sourceCategoryId !== null) {
        // If it came from a category, filter it out.
        newSorted[sourceCategoryId] = newSorted[sourceCategoryId].filter(arg => arg.id !== movedArgument.id);
      } else {
        // If it came from "arguments-list" (uncategorized), filter from the 'null' key.
        newSorted[null] = newSorted[null].filter(arg => arg.id !== movedArgument.id);
      }

      // 4b. Add the argument to its destination category.
      if (destCategoryId !== null) {
        // If dropping into a category, add it and update categoryId.
        newSorted[destCategoryId] = [...newSorted[destCategoryId], { ...movedArgument, categoryId: destCategoryId }];
      } else {
        // If dropping into "arguments-list" (uncategorized), add to 'null' and set categoryId to null.
        newSorted[null] = [...newSorted[null], { ...movedArgument, categoryId: null }];
      }

      return newSorted; // Return the *new* state.
    });

    // 5. API Call (to persist the change on the server).
    try {
      setIsLoading(true); // Set loading state.
      await axios.put(`http://localhost:5000/arguments/${movedArgument.id}`, {
        categoryId: destCategoryId // Send the new categoryId.
      }, {
        headers: { Authorization: `Bearer ${token}` } // Include the auth token.
      });

    } catch (error) {
      setError(error.response?.data?.message || "Failed to update argument category.");
      // 6. Rollback: If the API call fails, revert the UI to its previous state.
      setSortedArguments(prevSorted => prevSorted);
    } finally {
      setIsLoading(false); // Clear loading state.
    }
  };

  // --- Helper Function to Render a Category ---
  const renderCategory = (category) => (
    <Droppable key={category ? category.id : "null"} droppableId={String(category ? category.id : null)}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="category-box"
        >
          <h3>{category ? category.name : "Uncategorized"}</h3> {/* Display category name or "Uncategorized" */}
          {sortedArguments[category ? category.id : null]?.map((arg) => (
            <div key={arg.id} className="sorted-argument">
              {arg.text}
            </div>
          ))}
          {provided.placeholder} {/* Required by react-beautiful-dnd */}
        </div>
      )}
    </Droppable>
  );


  // --- Main Render Method ---
  return (
    <div className="sorted-arguments-container">
      <h2 className="header">Sort Arguments into Categories</h2>
      {isLoading && <p>Loading...</p>} {/* Display loading indicator */}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="categories-container">
          {/* Render categorized arguments */}
          {categories.length > 0 ? (
            categories.map(category => renderCategory(category))
          ) : (
            <p>No categories available. Please add categories before sorting.</p>
          )}
          {/* Render uncategorized arguments (always rendered) */}
          {renderCategory(null)}
        </div>

        {/* --- Droppable Area for Uncategorized Arguments --- */}
        <Droppable droppableId="arguments-list">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="arguments-list">
              {/* Only show arguments that are *not* already categorized */}
              {allArguments.filter(arg => !arg.categoryId).length > 0 ? (
                allArguments.filter(arg => !arg.categoryId).map((arg) => (
                  <Draggable key={arg.id} draggableId={String(arg.id)} index={allArguments.indexOf(arg)}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="draggable-argument"
                      >
                        {arg.text}
                      </div>
                    )}
                  </Draggable>
                ))
              ) : (
                <p>No arguments to sort.</p> // Message when all arguments are categorized.
              )}
              {provided.placeholder} {/* Required by react-beautiful-dnd */}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <button className="proceed-btn" onClick={() => setStep(6)}>
        Proceed
      </button>
    </div>
  );
};

export default SortedArguments;