import React from "react";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
}));

function PrivateData(props) {
  const classes = useStyles();
  const { username } = props;

  return (
    <Container component='main' maxWidth='xl'>
      <CssBaseline />
      <div className={classes.paper}>
        {username && (
          <Typography component='h1' variant='h5'>
            Only authorized users can view this content.
          </Typography>
        )}
      </div>
    </Container>
  );
}

export default withRouter(PrivateData);
