import {
  Box,
  Button,
  Container,
  CssBaseline,
  Stack,
  TextField,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import React, { useState } from "react";
import * as jose from "jose";
import { Buffer } from "buffer";

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

  const _decoder = async () => {
    const secret = new TextEncoder().encode(key);
    await jose
      .jwtVerify(encoded, secret, {
        algorithms: ["HS256"],
      })
      .then((payload) => {
        setMessage(payload?.payload?.message);
        setVerified(true);
      })
      .catch((err) => {
        const bufferObj = Buffer.from(encoded.split(".")[1], "base64");
        setMessage(JSON.parse(bufferObj.toString("utf8")).message);
        setVerified(false);
      });
  };

  const signJwt = (payload) => {
    const secret = new TextEncoder().encode(key);
    return new jose.SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .sign(secret);
  };

  const _encoder = async () => {
    setEncoded(await signJwt({ message }).catch(() => "Missing Key"));
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container>
        <Stack minHeight="100vh" justifyContent="center" flex={1}>
          <Box>
            <TextField
              fullWidth
              label="Encoded"
              multiline
              value={encoded}
              onChange={(e) => setEncoded(e.target.value)}
            />
          </Box>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button variant="contained" onClick={() => _decoder()}>
              Decode
            </Button>
            <Button variant="contained" onClick={() => _encoder()}>
              Encode
            </Button>
            <TextField
              fullWidth
              label="Common Key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
            <Button variant="contained" color={verified ? "success" : "error"}>
              {verified ? "Valid" : "Invalid"}
            </Button>
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
          </Stack>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              multiline
              label="Decoded"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Box>
        </Stack>
      </Container>
    </ThemeProvider>
  );
}

export default App;
