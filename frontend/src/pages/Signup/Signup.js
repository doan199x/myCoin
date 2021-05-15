import React from "react";
import { useHistory } from "react-router-dom";
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
import { makeStyles } from "@material-ui/core/styles";
import { productAPI } from "../../config/productAPI.js";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import background from "../../img/home.jpg";
import md5 from 'md5';

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
  password: yup.string().email("Đây không phải email hợp lệ!"),
});

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
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
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

toast.configure();

export default function Signup() {
  const classes = useStyles();
  const history = useHistory();
  //const [state, dispatch] = useContext(UserContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { ref: emailFormHookRef, ...emailFormHookRest } = register(
    "email",
    {
      required: "true",
    }
  );

  const onSubmit = async (data) => {
    const email = data.email;
    await productAPI
      .signup(email)
      .then((data) => {
        const element = document.createElement("a");
        const file = new Blob([JSON.stringify(data.data)], {
          type: "text/plain;charset=utf-8",
        });
        element.href = URL.createObjectURL(file);
        element.download = "keystore.txt";
        document.body.appendChild(element);
        element.click();
        if (data.data) {
          toast.info("☑️  Đăng ký thành công! Vui lòng đăng nhập.  ☑️");
          //Yêu cầu đăng nhập
          history.push('/signin');
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Gặp lỗi khi đăng ký! Vui lòng thử lại.");
      });
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
            Sign up
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Email (Không bắt buộc)"
              type="email"
              id="email"
              autoComplete="current-email"
              name="email"
              inputRef={emailFormHookRef}
              {...emailFormHookRest}
              error={!!errors.email}
              helperText={errors?.email?.message}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign Up
            </Button>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
