import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./SortedArguments.css"; // Ensure CSS is styled properly

const SortedArguments = ({ allArguments, categories, setStep }) => {
  const safeCategories = categories || [];

  const [sortedArguments, setSortedArguments] = useState(
    safeCategories.reduce((acc, category) => ({ ...acc, [category]: [] }), {})
  );

  useEffect(() => {
    console.log("Categories received in SortedArguments:", safeCategories);
    console.log("All Arguments received:", allArguments);
  }, [categories, allArguments]);

  const handleDragEnd = (result) => {
    if (!result.destination) return; // If dropped outside, do nothing

    const { source, destination } = result;

    // Get the argument text
    const argumentText = allArguments[source.index];

    // Remove argument from source and add to the destination category
    setSortedArguments((prev) => {
      const newSorted = { ...prev };
      newSorted[destination.droppableId] = [...(newSorted[destination.droppableId] || []), argumentText];

      return newSorted;
    });
  };

  return (
    <div className="sorted-arguments-container">
      <h2 className="header">Sort Arguments into Categories</h2>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="categories-container">
          {safeCategories.length > 0 ? (
            safeCategories.map((category, idx) => (
              <Droppable key={idx} droppableId={category}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="category-box"
                  >
                    <h3>{category}</h3>
                    {sortedArguments[category]?.map((arg, index) => (
                      <div key={index} className="sorted-argument">
                        {arg}
                      </div>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))
          ) : (
            <p>No categories available. Please add categories before sorting.</p>
          )}
        </div>

        {/* Arguments to Sort */}
        <Droppable droppableId="arguments-list">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="arguments-list">
              {allArguments.length > 0 ? (
                allArguments.map((arg, index) => (
                  <Draggable key={arg} draggableId={arg} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="draggable-argument"
                      >
                        {arg}
                      </div>
                    )}
                  </Draggable>
                ))
              ) : (
                <p>No arguments available. Go back and generate arguments.</p>
              )}
              {provided.placeholder}
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





// import React, { useState } from "react";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import "./SortedArguments.css"; // Ensure CSS is styled properly

// const SortedArguments = ({ allArguments, categories, setStep }) => {
//   const [sortedArguments, setSortedArguments] = useState(
//     categories.reduce((acc, category) => ({ ...acc, [category]: [] }), {})
//   );

//   const handleDragEnd = (result) => {
//     if (!result.destination) return; // If dropped outside, do nothing

//     const { source, destination, draggableId } = result;

//     // Get the argument text
//     const argumentText = allArguments[source.index];

//     // Remove argument from source and add to the destination category
//     setSortedArguments((prev) => {
//       const newSorted = { ...prev };
//       newSorted[destination.droppableId] = [...newSorted[destination.droppableId], argumentText];

//       return newSorted;
//     });
//   };

//   return (
//     <div className="sorted-arguments-container">
//       <h2 className="header">Sort Arguments into Categories</h2>

//       {/* Drag and Drop Context */}
//       <DragDropContext onDragEnd={handleDragEnd}>
//         <div className="categories-container">
//           {categories.map((category, idx) => (
//             <Droppable key={idx} droppableId={category}>
//               {(provided) => (
//                 <div
//                   ref={provided.innerRef}
//                   {...provided.droppableProps}
//                   className="category-box"
//                 >
//                   <h3>{category}</h3>
//                   {sortedArguments[category].map((arg, index) => (
//                     <div key={index} className="sorted-argument">
//                       {arg}
//                     </div>
//                   ))}
//                   {provided.placeholder}
//                 </div>
//               )}
//             </Droppable>
//           ))}
//         </div>

//         {/* Arguments to Sort */}
//         <Droppable droppableId="arguments-list">
//           {(provided) => (
//             <div ref={provided.innerRef} {...provided.droppableProps} className="arguments-list">
//               {allArguments.map((arg, index) => (
//                 <Draggable key={arg} draggableId={arg} index={index}>
//                   {(provided) => (
//                     <div
//                       ref={provided.innerRef}
//                       {...provided.draggableProps}
//                       {...provided.dragHandleProps}
//                       className="draggable-argument"
//                     >
//                       {arg}
//                     </div>
//                   )}
//                 </Draggable>
//               ))}
//               {provided.placeholder}
//             </div>
//           )}
//         </Droppable>
//       </DragDropContext>

//       {/* Proceed Button */}
//       <button className="proceed-btn" onClick={() => setStep(9)}>
//         Proceed
//       </button>
//     </div>
//   );
// };

// export default SortedArguments;

























