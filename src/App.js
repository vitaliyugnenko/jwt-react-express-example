import React, { useState, useEffect } from "react";
import axios from "axios";
import Home from "./home";
import PrivateData from "./privateData";
import PublicData from "./publicData";
import PrivateUsersData from "./users";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import ButtonAppBar from "./toolbar";
import SignIn from "./auth";
import SignUp from "./register";

export default function App() {
  const [state, setState] = useState({
    username: "",
    successMessage: "",
    errorMessage: "",
    dataLoaded: false,
    qwerty: false,
  });

  useEffect(() => {
    // eslint-disable-next-line
    getPrivateData(...[, ,], "home");
  }, []);

  const loginUser = (email, password, history) => {
    if (email.length && password.length) {
      const data = {
        email: email,
        password: password,
      };
      axios
        .post("http://localhost/signin", data)
        .then(function (response) {
          if (response.status === 200) {
            setState((prevState) => ({
              ...prevState,
              successMessage: "Login successful. Redirecting to home page..",
              username: response.data.username,
            }));
            localStorage.setItem("access_token", response.data.token);
            setTimeout(() => {
              setState((prevState) => ({
                ...prevState,
                successMessage: "",
                errorMessage: "",
              }));
              history.push("/");
            }, 1500);
          } else {
            setState((prevState) => ({
              ...prevState,
              errorMessage: "Some error ocurre",
            }));
          }
        })
        .catch(function (error) {
          setState((prevState) => ({
            ...prevState,
            errorMessage: error.response.data.errors[0].msg,
          }));
        });
    } else {
      setState((prevState) => ({
        ...prevState,
        errorMessage: "Please enter valid username and password",
      }));
    }
  };

  const registerUser = (username, email, password, history) => {
    if (username.length && email.length && password.length) {
      const data = {
        username: username,
        email: email,
        password: password,
      };
      axios
        .post("http://localhost/signup", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then(function (response) {
          if (response.status === 200) {
            setState((prevState) => ({
              ...prevState,
              successMessage:
                "Registration successful. Redirecting to login page..",
              username: response.data.user,
              errorMessage: "",
            }));
            setTimeout(() => {
              setState((prevState) => ({
                ...prevState,
                successMessage: "",
                errorMessage: "",
              }));
              history.push("/signin");
            }, 1500);
          }
        })
        .catch(function (error) {
          if (error.response) {
            setState((prevState) => ({
              ...prevState,
              errorMessage: error.response.data.errors[0].msg,
            }));
          }
        });
    } else {
      setState((prevState) => ({
        ...prevState,
        errorMessage: "Please enter valid username and password",
      }));
    }
  };

  const getPrivateData = (history, location, source) => {
    axios
      .get("http://localhost/auth", {
        headers: {
          Authorization: localStorage.getItem("access_token"),
        },
      })
      .then(function (response) {
        if (response.status !== 200) {
          console.log("error");
        }
        setState((prevState) => ({
          ...prevState,
          successMessage:
            source !== "home" &&
            "Registration successful. Redirecting to home page..",
          username: response.data.username,
          dataLoaded: true,
        }));
      })
      .catch(function (error) {
        console.log(error);
        if (
          history &&
          location &&
          (location.pathname === "/private" || location.pathname === "/users")
        ) {
          history.push("/signin");
        }
        setState((prevState) => ({
          ...prevState,
          successMessage: "",
          username: "",
          dataLoaded: true,
        }));
      });
  };

  const LogOut = (history) => {
    localStorage.removeItem("access_token");
    setState((prevState) => ({
      ...prevState,
      username: "",
    }));
    history.push("/signin");
  };

  const clearMessage = () => {
    setState((prevState) => ({
      ...prevState,
      successMessage: "",
      errorMessage: "",
      username: "",
    }));
  };

  let mainContent = state.dataLoaded && (
    <Router>
      <ButtonAppBar name={state.username} LogOut={LogOut} />
      <Switch>
        <Route path='/private'>
          {!state.username ? (
            <Redirect to='/' />
          ) : (
            <PrivateData
              getPrivateData={getPrivateData}
              username={state.username}
            />
          )}
        </Route>
        <Route path='/public'>
          <PublicData />
        </Route>
        <Route path='/users'>
          {!state.username ? (
            <Redirect to='/' />
          ) : (
            <PrivateUsersData
              getPrivateData={getPrivateData}
              username={state.username}
            />
          )}
        </Route>
        <Route
          path='/signin'
          render={() => (
            <SignIn
              loginUser={loginUser}
              clearMessage={clearMessage}
              errorMessage={state.errorMessage}
              successMessage={state.successMessage}
              username={state.username}
              getPrivateData={getPrivateData}
            />
          )}
        ></Route>
        <Route
          path='/signup'
          render={() =>
            !state.username ? (
              <SignUp
                registerUser={registerUser}
                clearMessage={clearMessage}
                errorMessage={state.errorMessage}
                successMessage={state.successMessage}
              />
            ) : (
              <Redirect to={{ pathname: "/" }} />
            )
          }
        ></Route>
        <Route path='/'>
          <Home />
        </Route>
      </Switch>
    </Router>
  );
  // );

  return <div className='App'>{mainContent}</div>;
}
