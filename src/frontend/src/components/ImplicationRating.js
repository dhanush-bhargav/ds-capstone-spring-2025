import React, { useState, useEffect } from "react";
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, Button, Paper } from "@mui/material";
import "./ImplicationRating.css"

const ImplicationRating = ({ allArguments, setRatedArguments, setStep, categories }) => {
  const [ratings, setRatings] = useState([]);

  // Debugging: Log received props
  console.log("Received categories in ImplicationRating:", categories);

  // Initialize ratings when allArguments or categories change
  useEffect(() => {
    if (allArguments && allArguments.length > 0) {
      setRatings(
        allArguments.map((arg) => ({
          argument: arg, // Store the whole argument string
          category: "Uncategorized", // Default
          rating: "Positive",  // Default
        }))
      );
    } else {
      setRatings([]);
    }
  }, [allArguments]);

  const handleRatingChange = (index, newRating) => {
    const updatedRatings = [...ratings];
    updatedRatings[index].rating = newRating;
    setRatings(updatedRatings);
  };

  const handleCategoryChange = (index, newCategory) => {
    const updatedRatings = [...ratings];
    updatedRatings[index].category = newCategory;
    setRatings(updatedRatings);
  };

  const handleSubmit = () => {
    setRatedArguments(ratings);
    setStep((prev) => prev + 1);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Rate the Implications of Each Argument
      </Typography>

      {ratings.length > 0 ? (
        ratings.map((item, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2, backgroundColor: "#f5f5f5" }}>
            <Typography variant="body1" fontWeight="bold">
              Argument:
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {item.argument} {/* Display the full argument */}
            </Typography>
            <FormControl fullWidth sx={{ mb: 1 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={item.category}
                onChange={(e) => handleCategoryChange(index, e.target.value)}
                label="Category"
              >
                <MenuItem value="Uncategorized">Uncategorized</MenuItem>
                {/* Fix: Ensure categories is always an array before mapping */}
                {(categories || []).map((cat, catIndex) => (
                  <MenuItem key={catIndex} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Rating</InputLabel>
              <Select
                value={item.rating}
                onChange={(e) => handleRatingChange(index, e.target.value)}
                label="Rating"
              >
                <MenuItem value="Positive">Positive</MenuItem>
                <MenuItem value="Neutral">Neutral</MenuItem>
                <MenuItem value="Negative">Negative</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        ))
      ) : (
        <Typography variant="body1">No arguments available for rating.</Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ mt: 2, width: "100%" }}
      >
        Submit Ratings
      </Button>
    </Box>
  );
};

export default ImplicationRating;











// import React, { useState, useEffect } from "react";
// import { Box, Typography, Select, MenuItem, FormControl, InputLabel, Button, Paper } from "@mui/material";

// const ImplicationRating = ({ allArguments, setRatedArguments, setStep, categories }) => {
//   const [ratings, setRatings] = useState([]);

//   // Initialize ratings when allArguments or categories changes
//   useEffect(() => {
//     if (allArguments.length > 0) {
//       setRatings(
//         allArguments.map((arg) => ({
//           argument: arg,  // Store the whole argument string
//           category: "Uncategorized", // Default
//           rating: "Positive",  //Default
//         }))
//       );
//     } else {
//       setRatings([]);
//     }
//   }, [allArguments]);

//   const handleRatingChange = (index, newRating) => {
//     const updatedRatings = [...ratings];
//     updatedRatings[index].rating = newRating;
//     setRatings(updatedRatings);
//   };

//   const handleCategoryChange = (index, newCategory) => {
//     const updatedRatings = [...ratings];
//     updatedRatings[index].category = newCategory;
//     setRatings(updatedRatings);
//   }

//   const handleSubmit = () => {
//     setRatedArguments(ratings);
//     setStep((prev) => prev + 1);
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4" gutterBottom>
//         Rate the Implications of Each Argument
//       </Typography>

//       {ratings.length > 0 ? (
//         ratings.map((item, index) => (
//           <Paper key={index} sx={{ p: 2, mb: 2, backgroundColor: "#f5f5f5" }}>
//             <Typography variant="body1" fontWeight="bold">
//               Argument:
//             </Typography>
//             <Typography variant="body1" sx={{ mb: 1 }}>
//               {item.argument} {/* Display the full argument */}
//             </Typography>
//             <FormControl fullWidth sx={{ mb: 1 }}>
//               <InputLabel>Category</InputLabel>
//               <Select
//                 value={item.category}
//                 onChange={(e) => handleCategoryChange(index, e.target.value)}
//                 label="Category"
//               >
//                 <MenuItem value="Uncategorized">Uncategorized</MenuItem>
//                 {categories.map((cat, catIndex) => (
//                   <MenuItem key={catIndex} value={cat}>
//                     {cat}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             <FormControl fullWidth>
//               <InputLabel>Rating</InputLabel>
//               <Select
//                 value={item.rating}
//                 onChange={(e) => handleRatingChange(index, e.target.value)}
//                 label="Rating"
//               >
//                 <MenuItem value="Positive">Positive</MenuItem>
//                 <MenuItem value="Neutral">Neutral</MenuItem>
//                 <MenuItem value="Negative">Negative</MenuItem>
//               </Select>
//             </FormControl>
//           </Paper>
//         ))
//       ) : (
//         <Typography variant="body1">No arguments available for rating.</Typography>
//       )}

//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handleSubmit}
//         sx={{ mt: 2, width: "100%" }}
//       >
//         Submit Ratings
//       </Button>
//     </Box>
//   );
// };

// export default ImplicationRating;


