//Categorization.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const Categorization = ({ setCategories, setStep, categories, token, questionId }) => {
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tempCategories, setTempCategories] = useState([])


    const handleAddCategory = () => {
        if (input.trim() !== "") {
            setTempCategories([...tempCategories, {argument_category: input}]);
            setInput("");
        }
    };

    const handleProceed = async () => {
        if (tempCategories.length > 0) {
            setIsLoading(true);
            setError(null)
            try {
                const response = await axios.post('http://localhost:5000/read_user_argument_categories', {
                    topic_id: questionId,
                    argument_categories: tempCategories
                });
                if (response?.data?.success === true) {
                    setIsLoading(true)
                    setError(null)
                    try {
                        const categoryResponse = await axios.get(`http://localhost:5000/get_argument_categories?topic_id=${questionId}`);
                        if (categoryResponse?.data?.success === true) {
                            const newCategories = response?.data?.argument_categories.map((category) => ({
                                id: category.category_id,
                                name: category.argument_category
                            }));
                            setCategories([...categories, newCategories])
                            setStep(5)
                        }
                    }
                    catch {
                        setError(error.response?.data?.message || "Failed to fetch categories")
                    }
                }
            }
            catch {
                setError(error.response?.data?.message || "Failed to add categories")
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
            {tempCategories.length > 0 && (
            <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">Your Categories:</h3>
                {tempCategories.map((category, index) => (
                    <div
                        key={index}
                        className="p-3 my-2 bg-gray-200 rounded text-xl font-semibold text-center"
                    >
                        {category.argument_category}
                    </div>
                ))}
            </div>
            )}

            {/* Proceed Button */}
            <button
                onClick={handleProceed}
                className={`w-full p-3 rounded text-lg transition duration-200 ${
                tempCategories.length > 0
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
                disabled={tempCategories.length === 0}
            >
                Proceed
            </button>
        </div>
    );
};

export default Categorization;