import {
  Button,
  Container,
  CssBaseline,
  Grid,
  Snackbar,
  Stack,
  TextField,
  Alert,
  Box,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import React, { useState } from "react";
import * as jose from "jose";
import { Buffer } from "buffer";
import { useRef } from "react";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const [verified, setVerified] = useState(false);
  const [encoded, setEncoded] = useState("");
  const [message, setMessage] = useState("");
  const [key, setKey] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const messageField = useRef(null);

  const signJwt = (payload) => {
    const secret = new TextEncoder().encode(key);
    return new jose.SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .sign(secret);
  };

  const _decoder = async (token = encoded) => {
    const secret = new TextEncoder().encode(key);
    try {
      const { payload } = await jose.jwtVerify(token.trim(), secret, {
        algorithms: ["HS256"],
      });
      setMessage(payload.message || "");
      setVerified(true);
    } catch (err) {
      try {
        const bufferObj = Buffer.from(token.split(".")[1], "base64");
        const decoded = JSON.parse(bufferObj.toString("utf8"));
        setMessage(decoded.message || "");
      } catch {
        setMessage("Could not decode payload.");
      }
      setVerified(false);
    }
  };
  

  const _encoderToClipboard = async () => {
    try {
      const msg = messageField.current.value; 
      setMessage(msg);                        
      const token = await signJwt({ message: msg }); 
      setEncoded(token);
      await navigator.clipboard.writeText(token);
      setVerified(!!token);
      setSnackbarMsg("Signed token copied to clipboard!");
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMsg("Error: Missing key or failed to sign.");
      setSnackbarOpen(true);
      setVerified(false);
    }
  };
  

  const _decodeFromClipboard = async () => {
    try {
      let token = (await navigator.clipboard.readText()).trim();
      setEncoded(token);
      await _decoder(token); // pass token directly to avoid race
      setSnackbarMsg("Token pasted from clipboard and decoded!");
      setSnackbarOpen(true);
      
    } catch (err) {
      setSnackbarMsg("Error: Could not read from clipboard.");
      setSnackbarOpen(true);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container>
        <Stack minHeight="100vh" justifyContent="center" spacing={2}>
          <TextField
            fullWidth
            label="Common Key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={2000}
            onClose={() => setSnackbarOpen(false)}
            message={snackbarMsg}
          />
          <TextField
            fullWidth
            label="Message to Send"
            multiline
            inputRef={messageField}
          />

          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button variant="contained" onClick={_encoderToClipboard}>
                Encode & Copy
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={_decodeFromClipboard}>
                Paste & Decode
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={() => {
                  setEncoded("");
                  setMessage("");
                  setVerified(false);
                }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>

          <Box>{message}</Box>
          <Alert severity={verified ? "success" : "error"}>
            {verified ? "Token is valid" : "Token is invalid"}
          </Alert>
          <Box>{encoded}</Box>
        </Stack>
      </Container>
    </ThemeProvider>
  );
}

export default App;
