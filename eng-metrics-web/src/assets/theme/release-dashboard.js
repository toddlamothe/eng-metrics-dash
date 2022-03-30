const componentStyles = (theme) => ({
  header: {
    position: "relative",
    paddingBottom: "1rem",
    paddingTop: "1rem",
    [theme.breakpoints.up("md")]: {
      paddingTop: "1rem",
    },
  },
  containerRoot: {
    [theme.breakpoints.up("md")]: {
      paddingLeft: "15px",
      paddingRight: "15px",
    },
  },
});

export default componentStyles;
