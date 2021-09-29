import React from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";

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
