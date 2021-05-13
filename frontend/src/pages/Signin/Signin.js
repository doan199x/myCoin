import React, { useContext, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { makeStyles } from "@material-ui/core/styles";
import { productAPI } from "../../config/productAPI.js";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import background from "../../img/home.jpg";
import md5 from 'md5';
import { TYPE } from '../../reducer/userReducer';
import { UserContext } from '../../context/UserProvider';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        My Coin
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const schema = yup.object().shape({
  password: yup.string().required("Mật khẩu không được bỏ trống!").min(9),
});

const useStyles = makeStyles((theme) => ({
  root: {
    height: "80vh",
    width: "80%",
    marginLeft: '10%'
  },
  image: {
    backgroundImage: `url(${background})`,
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
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
    display: 'flex',
    flexDirection: 'column'
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  button: {
    color: 'blue',
    marginTop: '5%'
  },
}));

toast.configure();

export default function Signin() {
  const classes = useStyles();
  const history = useHistory();
  const refInput = useRef(null);
  const params = useParams();
  const [state, dispatch] = useContext(UserContext);
  if (state.privateKey) {
    history.push("/account");
    //return <></>;
}
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { ref: passwordFormHookRef, ...passwordFormHookRest } = register(
    "password",
    {
      required: "true",
    }
  );

  const onSubmit = async () => {
    // if (refInput.current.value) {
    //     // dispatch({ type: TYPE.CALLING_API });
    //     const file = refInput.current.files.item(0);
    //    const text = await file.text();
    //    const password = params.password;
    //     try {
    //         const key = JSON.parse(text);
    //         await productAPI.signin(key, password).then((data) => {
    //           history.push('/account');
    //         }).catch((err) => {
    //           toast.error("Invalid file!");
    //         });
    //         refInput.current.value = null;
    //     } catch (error) {
    //       toast.error("Something wrong! Try again!");
    //     }
    // }
    //
    if (refInput.current.value) {
      dispatch({ type: TYPE.CALLING_API });
      const file = refInput.current.files.item(0);
      const text = await file.text();
      const password = params.password;
      try {
          const key = JSON.parse(text);
           await productAPI.signin(key, password).then((res) => {
              dispatch({ type: TYPE.SET_USER, payload: { key, balance: res.data.balance } });
          }).catch(() => {
              dispatch({ type: TYPE.DONE_CALL });
              toast.error('Invalid file!');
          });
          refInput.current.value = null;
      } catch (error) {
          dispatch({ type: TYPE.DONE_CALL });
      }
  }
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            <button className = {classes.button} onClick={() => {
                    if (refInput.current) {
                        refInput.current.click();
                    }
                }}>
                  
                    <div className = {classes.add}>
                        <h4>Keystore file</h4>
                        <input onChange={onSubmit} ref={refInput} style={{ display: "none" }} type="file" accept=".txt" />
                    </div>
                </button>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
