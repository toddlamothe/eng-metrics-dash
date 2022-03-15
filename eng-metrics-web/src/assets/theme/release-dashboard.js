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
      paddingLeft: "39px",
      paddingRight: "39px",
    },
  },
});

export default componentStyles;
