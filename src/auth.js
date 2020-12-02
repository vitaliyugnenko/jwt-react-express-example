import React, { useState, useEffect } from "react";
import { Link as ReactRouterLink, Switch, Route } from "react-router-dom";
import { withRouter } from "react-router";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import MuiAlert from "@material-ui/lab/Alert";
import SignUp from "./register";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

function SignIn(props) {
  const {
    loginUser,
    history,
    successMessage,
    errorMessage,
    clearMessage,
    username,
  } = props;

  const classes = useStyles();

  useEffect(() => {
    if (username && !successMessage && !errorMessage) history.push("/");
  }, [username, successMessage, errorMessage, history]);

  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    clearMessage();
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            autoComplete='email'
            autoFocus
            onChange={handleChange}
          />
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            autoComplete='current-password'
            onChange={handleChange}
          />

          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
            onClick={(e) => {
              e.preventDefault();
              loginUser(state.email.trim(), state.password.trim(), history);
            }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item component={ReactRouterLink} to='/signup'>
              Don't have an account? Sign Up
            </Grid>
          </Grid>
          <Switch>
            <Route path='/signup'>
              <SignUp />
            </Route>
          </Switch>
        </form>
        <div className={classes.root}>
          {errorMessage && <Alert severity='error'>{errorMessage}</Alert>}
          {successMessage && username && (
            <Alert severity='success'>{successMessage}</Alert>
          )}
        </div>
      </div>
    </Container>
  );
}

export default withRouter(SignIn);
