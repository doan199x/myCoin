import React, { useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import "react-toastify/dist/ReactToastify.css";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import background from '../../img/home.jpg';
import socket from "../../config/socketio";
import { EMIT_TYPE } from "../../constant/API.js";
import { UserContext } from "../../context/UserProvider";
import { toast } from "react-toastify";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        MyCoin
        </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const schema = yup.object().shape({
  receiver: yup
    .string()
    .required("Please add a valid receiver!"),
  amount: yup.number("Please add a valid amount!").typeError('Amount must be a number!').required("Please add coin amount!").min(1, 'Amount must be greater than or equal to 1!'),
});
const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: `url(${background})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Sendcoin() {
  const classes = useStyles();
  const [state] = useContext(UserContext);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const { ref: receiverFormHookRef, ...receiverFormHookRest } = register("receiver", {
    required: "true",
  });
  const { ref: amountFormHookRef, ...amountFormHookRest } = register(
    "amount",
    {
      required: "true",
    }
  );

  useEffect(() => {
    socket.on(EMIT_TYPE.LISTENING_SEND_TRANSACTION, (value) =>{
      if (value){
        toast.success("Sent success");
      }
      else {
        toast.error("Sent fail");
      }
    });
    return () => {
      socket.removeEventListener(EMIT_TYPE.LISTENING_SEND_TRANSACTION);
    };
  }, []);

  const onSubmit = (data) => {
      socket.emit(EMIT_TYPE.SEND_TRANSACTION, ({
        publicKey: state.publicKey,
        privateKey: state.privateKey,
        amount: data.amount,
        payeePublicKey: data.receiver
      }));
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
            Send coin
            </Typography>
          <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="receiver"
              label="Receiver"
              name="receiver"
              autoFocus
              inputRef={receiverFormHookRef}
              {...receiverFormHookRest}
              error={!!errors.receiver}
              helperText={errors?.receiver?.message}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="amount"
              label="Coin amount"
              id="amount"
              autoComplete="current-password"
              inputRef={amountFormHookRef}
              {...amountFormHookRest}
              error={!!errors.amount}
              helperText={errors?.amount?.message}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              SEND
              </Button>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  )
}
