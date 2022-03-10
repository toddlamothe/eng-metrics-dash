import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";

import App from './App';

ReactDOM.render(
  <StyledEngineProvider injectFirst>   
      <BrowserRouter>
        <App />
      </BrowserRouter>   
  </StyledEngineProvider>,
  document.getElementById('root')
);