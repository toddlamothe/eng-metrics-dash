import React from "react";

import makeStyles from '@mui/styles/makeStyles';
import Box from "@mui/material/Box";

// core components
import componentStyles from "assets/theme/components/admin-footer.js";

const useStyles = makeStyles(componentStyles);

const Footer = () => {
  const classes = useStyles();
  return (
    <Box component="footer" width="100%" padding="2.5rem 0">
      2021 Union Street Media
    </Box>
  );
};

export default Footer;
