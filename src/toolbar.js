import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CustomizedMenus from "./menu";
import { Link } from "react-router-dom";

import SimpleMenu from "./menuMobile";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
    marginRight: theme.spacing(5),
  },
  customizedMenus: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  simpleMenu: {
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  title: {
    flexGrow: 1,
  },
}));

export default function ButtonAppBar(props) {
  const classes = useStyles();
  const { name, LogOut } = props;

  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' className={classes.title}>
            JWT
          </Typography>
          <Button
            component={Link}
            to={"/"}
            color='inherit'
            className={classes.menuButton}
          >
            HOME
          </Button>
          <Button
            component={Link}
            to={"/private"}
            color='inherit'
            className={classes.menuButton}
          >
            Private data
          </Button>

          <Button
            component={Link}
            to={"/public"}
            color='inherit'
            className={classes.menuButton}
          >
            Public data
          </Button>

          <Button
            component={Link}
            to={"/users"}
            color='inherit'
            className={classes.menuButton}
          >
            Users
          </Button>

          <div className={classes.simpleMenu}>
            <SimpleMenu name={name} LogOut={LogOut} />
          </div>

          <div className={classes.customizedMenus}>
            <CustomizedMenus name={name} LogOut={LogOut} />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
