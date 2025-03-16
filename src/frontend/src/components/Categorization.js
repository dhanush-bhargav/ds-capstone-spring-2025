// Categorization.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Categorization = ({
  setCategories,
  setStep,
  categories,
  questionId,
  allArguments,
  setAllArguments,
}) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tempCategories, setTempCategories] = useState([]); // Use for UI updates
  const [categorizedArguments, setCategorizedArguments] = useState({});

  useEffect(() => {
    setTempCategories(categories || []);
  }, [categories]);

  useEffect(() => {
    const initialCategorizedArguments = {};
    tempCategories.forEach((cat) => {
      initialCategorizedArguments[cat.id] = [];
    });
    // Removed uncategorized initialization

    if (allArguments) {
      allArguments.forEach((arg) => {
        if (
          arg.categoryId &&
          tempCategories.find((cat) => cat.id === arg.categoryId)
        ) {
          initialCategorizedArguments[arg.categoryId].push(arg.id);
        } // Removed else block for uncategorized
      });
    }

    setCategorizedArguments(initialCategorizedArguments);
  }, [allArguments, tempCategories]);

  const handleAddCategory = () => {
    if (input.trim() !== "") {
      const newCategoryId = uuidv4();
      setTempCategories([
        ...tempCategories,
        { id: newCategoryId, argument_category: input },
      ]);
      setCategorizedArguments({
        ...categorizedArguments,
        [newCategoryId]: [],
      }); //Crucial for adding arguments to new categories
      setInput("");
    }
  };

  const handleEditCategory = (id, newValue) => {
    const newName = prompt("Enter new category name:", newValue);
    if (newName !== null && newName.trim() !== "") {
      //Check if it's not cancelled or empty
      setTempCategories(
        tempCategories.map((category) =>
          category.id === id
            ? { ...category, argument_category: newName }
            : category //Update
        )
      );
    }
  };

  const handleDeleteCategory = (categoryId) => {
    const updatedCategories = tempCategories.filter(
      (category) => category.id !== categoryId
    );
    setTempCategories(updatedCategories);

    setCategorizedArguments((prevCategorizedArguments) => {
        // Removed uncategorized update
      const { [categoryId]: _, ...rest } = prevCategorizedArguments; // Remove the category
      return { ...rest }; // Removed uncategorized
    });
  };

  const handleArgumentClick = (argumentId, currentCategoryId) => {
    const categoryOptions = tempCategories
      .map(
        (cat) => `<option value="${cat.id}">${cat.argument_category}</option>`
      )
      .join("");

    const promptHTML = `
        <select id="categorySelect">
          <option value="">Select a Category</option> {/* Changed default option */}
          ${categoryOptions}
        </select>
      `;

    const userResponse = prompt("Select a category:", promptHTML);

    let selectedCategoryId = null;
    if (userResponse) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(userResponse, "text/html");
      const selectElement = doc.getElementById("categorySelect");
      selectedCategoryId = selectElement ? selectElement.value : null;
    }


    if (
        selectedCategoryId !== null &&
        selectedCategoryId !== "" && // Check for empty string (no selection)
        selectedCategoryId !== currentCategoryId
      ) {
      setCategorizedArguments((prev) => {
        const updatedCategorizedArguments = { ...prev };

        // Remove from current category
        if (currentCategoryId) {
          updatedCategorizedArguments[currentCategoryId] = (
            updatedCategorizedArguments[currentCategoryId] || []
          ).filter((id) => id !== argumentId);
        } // Removed else block (uncategorized)

        // Add to new category
        // Removed uncategorized specific handling
        if (!updatedCategorizedArguments[selectedCategoryId]) {
            updatedCategorizedArguments[selectedCategoryId] = [];
        }
          updatedCategorizedArguments[selectedCategoryId].push(argumentId);

        return updatedCategorizedArguments;
      });
    }
  };

  const handleProceed = async () => {
    setIsLoading(true);
    setError(null);

    // First API call (for new categories)
    const newCategories = tempCategories.filter(
      (tempCat) =>
        !categories || !categories.some((cat) => cat.id === tempCat.id)
    );
    const newCategoriesPayload = {
      topic_id: questionId,
      argument_categories: newCategories.map((cat) => ({
        argument_category: cat.argument_category,
      })),
    };

    try {
      if (newCategories.length > 0) {
        const readCategoryResponse = await axios.post(
          "http://localhost:5000/read_user_argument_categories",
          newCategoriesPayload
        );
        if (readCategoryResponse.data.success) {
          const categoryResponse = await axios.get(
            `http://localhost:5000/get_argument_categories?topic_id=${questionId}`
          );
          if (categoryResponse?.data?.success === true) {
            const newCategories = categoryResponse.data.argument_categories.map(
              (category) => ({
                id: category.category_id,
                name: category.argument_category,
              })
            );
            setCategories(newCategories); //Update main categories
            setStep(5);
          } else {
            setError("Failed to get all categories");
          }
        } else {
          setError("Failed to write new categories");
        }
      }
    } catch (apiError) {
      setError(
        "API Error: " + (apiError.response?.data?.message || apiError.message)
      );
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
      <button
        onClick={handleAddCategory}
        className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
        disabled={!input.trim()}
      >
        Add Category
      </button>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Removed Uncategorized Section */}

        {tempCategories.map((category) => (
          <div key={category.id} className="mb-4">
            <div className="border rounded">
              {/* Category Header: Name and Buttons */}
              <div
                className="p-2 border-b font-bold flex items-center justify-between"
                style={{ display: "flex", gap: "10px", padding: "10px" }}
              >
                <div style={{ flex: 1, padding: "10px" }}>
                  <span>{category.argument_category}</span>
                </div>
                <div className="flex items-center" style={{ padding: "10px" }}>
                  <IconButton
                    onClick={() =>
                      handleEditCategory(
                        category.id,
                        category.argument_category
                      )
                    }
                    aria-label="edit category"
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                </div>
                <div className="flex items-center" style={{ padding: "10px" }}>
                  <IconButton
                    onClick={() => handleDeleteCategory(category.id)}
                    aria-label="delete category"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </div>

              {/* Arguments List */}
              {categorizedArguments[category.id]?.map((argumentId) => {
                const argument = allArguments?.find(
                  (arg) => arg.id === argumentId
                );
                return argument ? (
                  <div
                    key={argument.id}
                    className="p-2 border-b hover:bg-gray-100 flex items-center justify-between"
                  >
                    <span
                      className="cursor-pointer"
                      onClick={() =>
                        handleArgumentClick(argument.id, category.id)
                      }
                    >
                      {argument.text}
                    </span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleProceed}
        className="mt-4 p-3 bg-green-500 text-white rounded hover:bg-green-600"
        disabled={isLoading}
      >
        Proceed
      </button>
    </div>
  );
};

export default Categorization;