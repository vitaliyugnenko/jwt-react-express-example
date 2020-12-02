import React from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { withRouter } from "react-router";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

function CustomizedMenus(props) {
  const { name, LogOut, history, mobile } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        aria-controls='customized-menu'
        aria-haspopup='true'
        variant='contained'
        color='secondary'
        onClick={handleClick}
      >
        {mobile && name ? "SignOut" : !mobile && name ? name : "Sign In"}
      </Button>
      <StyledMenu
        id='customized-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {!name && (
          <StyledMenuItem component={ReactRouterLink} to='/signin'>
            <ListItemText primary='Sign in' />
          </StyledMenuItem>
        )}

        {!name && (
          <StyledMenuItem component={ReactRouterLink} to='/signup'>
            <ListItemText primary='Sign up' />
          </StyledMenuItem>
        )}
        {name && (
          <StyledMenuItem onClick={() => LogOut(history)}>
            <ListItemText primary='Sign out' />
          </StyledMenuItem>
        )}
      </StyledMenu>
    </div>
  );
}

export default withRouter(CustomizedMenus);
