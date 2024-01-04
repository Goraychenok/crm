import React from 'react';
import Layout from "./layout/Layout";
import {ThemeProvider} from "@mui/material";
import {createTheme} from "./theme";

const baseTheme = createTheme();

function App() {
  return (
    <>
      <ThemeProvider theme={baseTheme}>
        <Layout>
          <h1 className="text-3xl font-bold underline">
            Hello world!
          </h1>
        </Layout>
      </ThemeProvider>

    </>
  );
}

export default App;
