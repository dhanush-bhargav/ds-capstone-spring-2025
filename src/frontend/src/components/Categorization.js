import React, { useState, useEffect } from "react";

const Categorization = ({ setCategories, setStep }) => {
  const [input, setInput] = useState("");
  const [categoriesList, setCategoriesList] = useState([]);

  // Log categories when they change
  useEffect(() => {
    console.log("Categories updated in Categorization.js:", categoriesList);
  }, [categoriesList]);

  const handleAddCategory = () => {
    if (input.trim() !== "") {
      const updatedCategories = [...categoriesList, input];
      setCategoriesList(updatedCategories);
      setCategories(updatedCategories); // Lift state to App.js
      console.log("Updated categories in App state:", updatedCategories); // Debugging
      setInput("");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Define Categories</h2>

      {/* Input Box for Category Name */}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter category name"
        className="w-full p-3 border rounded mb-4 text-lg"
        style={{ height: "50px" }} 
      />

      {/* Add Category Button */}
      <button
        onClick={handleAddCategory}
        className="w-full p-3 bg-blue-500 text-white rounded mb-4 text-lg hover:bg-blue-600 transition"
        disabled={!input.trim()}
      >
        Add Category
      </button>

      {/* Display Categories */}
      {categoriesList.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2">Your Categories:</h3>
          {categoriesList.map((category, index) => (
            <div 
              key={index} 
              className="p-3 my-2 bg-gray-200 rounded text-xl font-semibold text-center"
            >
              {category}
            </div>
          ))}
        </div>
      )}

      {/* Proceed Button */}
      <button
        onClick={() => {
          console.log("Proceeding with categories:", categoriesList);
          setStep(prev => prev + 1);
        }}
        className={`w-full p-3 rounded text-lg transition duration-200 ${
          categoriesList.length > 0
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }`}
        disabled={categoriesList.length === 0}
      >
        Proceed
      </button>
    </div>
  );
};

export default Categorization;












// import React, { useState } from "react";

// const Categorization = ({ setCategories, setStep }) => {
//   const [input, setInput] = useState("");
//   const [categoriesList, setCategoriesList] = useState([]);

//   const handleAddCategory = () => {
//     if (input.trim() !== "") {
//       const updatedCategories = [...categoriesList, input];
//       setCategoriesList(updatedCategories);
//       setCategories(updatedCategories);
//       setInput("");
//     }
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Define Categories</h2>

//       {/* Input Box for Category Name */}
//       <input
//         type="text"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         placeholder="Enter category name"
//         className="w-full p-3 border rounded mb-4 text-lg"
//         style={{ height: "50px" }} 
//       />

//       {/* Add Category Button */}
//       <button
//         onClick={handleAddCategory}
//         className="w-full p-3 bg-blue-500 text-white rounded mb-4 text-lg hover:bg-blue-600 transition"
//         disabled={!input.trim()}
//       >
//         Add Category
//       </button>

//       {/* Display Categories */}
//       {categoriesList.length > 0 && (
//         <div className="mb-4">
//           <h3 className="text-xl font-bold mb-2">Your Categories:</h3>
//           {categoriesList.map((category, index) => (
//             <div 
//               key={index} 
//               className="p-3 my-2 bg-gray-200 rounded text-xl font-semibold text-center"
//             >
//               {category}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Proceed Button */}
//       <button
//         onClick={() => setStep(prev => prev + 1)}
//         className={`w-full p-3 rounded text-lg transition duration-200 ${
//           categoriesList.length > 0
//             ? "bg-blue-500 text-white hover:bg-blue-600"
//             : "bg-gray-300 text-gray-600 cursor-not-allowed"
//         }`}
//         disabled={categoriesList.length === 0}
//       >
//         Proceed
//       </button>
//     </div>
//   );
// };

// export default Categorization;







