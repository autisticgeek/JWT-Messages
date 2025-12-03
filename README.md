# JWT Message

A simple React app for encoding and decoding messages using JSON Web Tokens (JWT).
This project demonstrates how to sign messages with a shared secret key, copy them to the clipboard, and verify/decode tokens pasted back in.

Features:
- Sign messages with a shared key using HS256 (HMAC SHA-256)
- Copy signed tokens directly to the clipboard
- Paste & decode tokens from the clipboard to verify authenticity
- Visual feedback with Material-UI alerts and snackbars
- Mobile-friendly layout with clear separation of input vs. output fields
- Fallback decoding: even if signature verification fails, the payload is still displayed

Getting Started
---------------
Prerequisites:
- Node.js (>= 16 recommended)
- npm or yarn

Installation:
1. Clone the repo and install dependencies:
   git clone https://github.com/your-username/jwt_message.git
   cd jwt_message
   npm install

Development:
- Run the app locally:
  npm start
- This starts the dev server at http://localhost:3000

Production Build:
- Create an optimized build:
  npm run build
- The build output will be in the build/ directory

Usage
-----
1. Enter a Common Key (shared secret).
2. Type your Message to Send.
3. Click "Encode & Copy" to generate a signed JWT and copy it to the clipboard.
4. Share the token with someone else.
5. To verify, paste the token from the clipboard and click "Paste & Decode".
6. The decoded message will display, along with a status indicator:
   - Token is valid if signature matches the key
   - Token is invalid if verification fails (but payload still shown)

Dependencies
------------
- React
- Material-UI
- jose (for JWT signing/verification)
- buffer (for base64 decoding)

Notes
-----
- This app is for educational/demo purposes.
- Do not use weak keys (like "password") in production.
- Clipboard access requires user permission in some browsers.
- webpack-dev-server is used only in development; production builds are static.

License
-------
MIT License. See LICENSE for details.
