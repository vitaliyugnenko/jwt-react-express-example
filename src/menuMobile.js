import React from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import CustomizedMenus from "./menu";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(5),
  },
  menuItem: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto",
    "& a": {
      margin: 0,
    },
    "&:hover:not(:last-child)": {
      backgroundColor: "#414fb8",
      color: "white",
    },
  },
  menuButton2: {
    backgroundColor: "#f50057",
    color: "white",
    "&:hover": {
      backgroundColor: "#c21360",
    },
  },
}));

export default function SimpleMenu(props) {
  const { name, LogOut } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const classes = useStyles();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        className={classes.menuButton2}
        aria-controls='simple-menu'
        aria-haspopup='true'
        onClick={handleClick}
      >
        {name || "Open Menu"}
      </Button>
      <Menu
        id='simple-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose} className={classes.menuItem}>
          <Button
            component={Link}
            to={"/"}
            color='inherit'
            className={classes.menuButton}
          >
            HOME
          </Button>
        </MenuItem>
        <MenuItem onClick={handleClose} className={classes.menuItem}>
          <Button
            component={Link}
            to={"/private"}
            color='inherit'
            className={classes.menuButton}
          >
            Private data
          </Button>
        </MenuItem>
        <MenuItem onClick={handleClose} className={classes.menuItem}>
          <Button
            component={Link}
            to={"/public"}
            color='inherit'
            className={classes.menuButton}
          >
            Public data
          </Button>
        </MenuItem>
        <MenuItem onClick={handleClose} className={classes.menuItem}>
          <Button
            component={Link}
            to={"/users"}
            color='inherit'
            className={classes.menuButton}
          >
            Users
          </Button>
        </MenuItem>
        <MenuItem className={classes.menuItem}>
          <CustomizedMenus name={name} LogOut={LogOut} mobile={true} />
        </MenuItem>
      </Menu>
    </div>
  );
}
