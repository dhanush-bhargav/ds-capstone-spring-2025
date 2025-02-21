import React, { useState } from "react";
import { TextField, Button, List, ListItem, Container, Typography, Paper } from "@mui/material";

const ReviewArguments = ({ argumentsList, setArgumentsList, setStep }) => {
  const [editable, setEditable] = useState(null);
  const [tempValue, setTempValue] = useState("");

  const handleEdit = (index) => {
    setEditable(index);
    setTempValue(argumentsList[index]);
  };

  const handleSave = (index) => {
    const updatedArguments = [...argumentsList];
    updatedArguments[index] = tempValue;
    setArgumentsList(updatedArguments);
    setEditable(null);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: 20, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Review Your Arguments
        </Typography>
        <List>
          {argumentsList.map((arg, index) => (
            <ListItem key={index} sx={{ display: "flex", justifyContent: "space-between" }}>
              {editable === index ? (
                <TextField
                  fullWidth
                  variant="outlined"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  onBlur={() => handleSave(index)}
                />
              ) : (
                <Typography>{arg}</Typography>
              )}
              <Button variant="outlined" onClick={() => handleEdit(index)} sx={{ marginLeft: 2 }}>
                Edit
              </Button>
            </ListItem>
          ))}
        </List>
        
        {/* Updated Next Button to increment step dynamically */}
        <Button variant="contained" color="primary" onClick={() => setStep((prev) => prev + 1)}>
          Next
        </Button>
      </Paper>
    </Container>
  );
};

export default ReviewArguments;