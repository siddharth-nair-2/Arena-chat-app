import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import ChatProvider from "./Context/ChatProvider";
const theme = extendTheme({
  colors: {
    arenaColors: {
      100: "#EBF7E3",
      200: "#9BD770",
      300: "#66B032",
      400: "#375F1B",
      500: "#1B3409",
    },
  },
});
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ChatProvider>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </ChatProvider>
  </BrowserRouter>
);
