// import React, { useState } from "react";
// import { TextField, Button, Container, Typography, Paper } from "@mui/material";

// const Login = ({ setUser }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = () => {
//     // Simulate authentication
//     setUser({ email });
//   };

//   return (
//     <Container component="main" maxWidth="xs">
//       <Paper elevation={3} style={{ padding: 20, textAlign: "center" }}>
//         <Typography variant="h5" gutterBottom>
//           Login
//         </Typography>
//         <TextField
//           fullWidth
//           label="Email"
//           variant="outlined"
//           margin="normal"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <TextField
//           fullWidth
//           label="Password"
//           type="password"
//           variant="outlined"
//           margin="normal"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <Button
//           fullWidth
//           variant="contained"
//           color="primary"
//           onClick={handleLogin}
//           style={{ marginTop: 10 }}
//         >
//           Login
//         </Button>
//       </Paper>
//     </Container>
//   );
// };

// export default Login;
