//Categorization.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const Categorization = ({ setCategories, setStep, categories, token, questionId }) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  const handleAddCategory = async () => {
    if (input.trim() !== "") {
        setIsLoading(true)
        setError(null)
      try {
        const response = await axios.post('http://localhost:5000/read_user_argument_categories', {
          topic_id: questionId, // Use the questionId
          argument_categories: [{ argument_category: input }]
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Assuming the API returns the new category's ID
         const newCategory = {
            id: response.data.category_ids[0], // Adapt based on actual API response
            name: input
          };
        setCategories([...categories, newCategory]); // Update the categories in App.js
        setInput("");
      } catch (error) {
          setError(error.response?.data?.message || "Failed to add category.");
      }
      finally {
        setIsLoading(false);
      }
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

        {isLoading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Add Category Button */}
      <button
        onClick={handleAddCategory}
        className="w-full p-3 bg-blue-500 text-white rounded mb-4 text-lg hover:bg-blue-600 transition"
        disabled={!input.trim() || isLoading}
      >
        Add Category
      </button>

      {/* Display Categories */}
      {categories.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2">Your Categories:</h3>
          {categories.map((category) => (
            <div
              key={category.id}
              className="p-3 my-2 bg-gray-200 rounded text-xl font-semibold text-center"
            >
              {category.name}
            </div>
          ))}
        </div>
      )}

      {/* Proceed Button */}
      <button
        onClick={() => {
          setStep(5);
        }}
        className={`w-full p-3 rounded text-lg transition duration-200 ${
          categories.length > 0
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }`}
        disabled={categories.length === 0}
      >
        Proceed
      </button>
    </div>
  );
};

export default Categorization;