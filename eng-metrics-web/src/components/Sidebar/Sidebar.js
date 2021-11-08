import React from "react";
import { useLocation, Link } from "react-router-dom";
import makeStyles from '@mui/styles/makeStyles';
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Hidden from "@mui/material/Hidden";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
// core components
import componentStyles from "assets/theme/components/sidebar.js";

const useStyles = makeStyles(componentStyles);

export default function Sidebar({ routes, logo, dropdown, input }) {
  const classes = useStyles();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = "responsive-menu-id";
  // creates the links that appear in the left menu / Sidebar
  const createLinks = (routes) => {
    return routes.map((prop, key) => {
      if (prop.divider) {
        return <Divider key={key} classes={{ root: classes.divider }} />;
      } else if (prop.title) {
        return (
          <Typography
            key={key}
            variant="h6"
            component="h6"
            classes={{ root: classes.title }}
          >
            {prop.title}
          </Typography>
        );
      }
      let textContent = (
        <>
          <Box minWidth="2.25rem" display="flex" alignItems="center">
            {typeof prop.icon === "string" ? (
              <Box
                component="i"
                className={prop.icon + " " + classes["text" + prop.iconColor]}
              />
            ) : null}
            {typeof prop.icon === "object" ? (
              <Box
                component={prop.icon}
                width="1.25rem!important"
                height="1.25rem!important"
                className={classes["text" + prop.iconColor]}
              />
            ) : null}
          </Box>
          {prop.name}
        </>
      );
      if (prop.href) {
        return (
          <ListItem
            key={key}
            component={"a"}
            href={prop.href}
            onClick={handleMenuClose}
            classes={{
              root:
                classes.listItemRoot +
                (prop.upgradeToPro
                  ? " " + classes.listItemRootUpgradeToPro
                  : ""),
              selected: classes.listItemSelected,
            }}
            target="_blank"
            selected={prop.upgradeToPro === true}
          >
            {textContent}
          </ListItem>
        );
      } else {
        return (
          <ListItem
            key={key}
            component={Link}
            onClick={handleMenuClose}
            to={prop.layout + prop.path}
            classes={{
              root:
                classes.listItemRoot +
                (prop.upgradeToPro
                  ? " " + classes.listItemRootUpgradeToPro
                  : ""),
              selected: classes.listItemSelected,
            }}
            selected={
              location.pathname === prop.layout + prop.path ||
              prop.upgradeToPro === true
            }
          >
            {textContent}
          </ListItem>
        );
      }
    });
  };
  let logoImage = (
    <img alt={logo.imgAlt} className={classes.logoClasses} src={logo.imgSrc} />
  );
  let logoObject =
    logo && logo.innerLink ? (
      <Link to={logo.innerLink} className={classes.logoLinkClasses}>
        {logoImage}
      </Link>
    ) : logo && logo.outterLink ? (
      <a href={logo.outterLink} className={classes.logoLinkClasses}>
        {logoImage}
      </a>
    ) : null;
  return <>
    <Hidden mdDown implementation="css">
      <Drawer variant="permanent" anchor="left" open>
        <Box paddingBottom="1rem">{logoObject}</Box>
        <List classes={{ root: classes.listRoot }}>
          {createLinks(routes)}
        </List>
      </Drawer>
    </Hidden>
  </>;
}