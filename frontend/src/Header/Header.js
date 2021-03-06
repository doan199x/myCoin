import React, { useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import logourl from "../img/logo.png";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { UserContext } from "../context/UserProvider";
import { Button, Tooltip } from "@material-ui/core";
import { TYPE } from '../reducer/userReducer.js';
import { EMIT_TYPE } from "../constant/API";
import socket from "../config/socketio";
import copy from 'copy-to-clipboard';
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
    marginBottom: "1%",
  },
  menuButton: {
    marginRight: theme.spacing(2),
    marginLeft: "5%",
    background: "none",
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
    fontWeight: "bold",
    color: "#273044",
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
    marginRight: "5%",
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  logo: {
    height: "50px",
    width: "50px",
  },
  linkgroup: {
    marginLeft: "30%",
    marginRight: "5%",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  link: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
    fontWeight: "bold",
    color: "#273044",
    textDecoration: "none",
  },
}));
toast.configure()
const copyKey = (key) => {
  console.log(key)
  copy(key);
  toast.info("Copied!")
}

export default function Header() {
  const classes = useStyles();
  const history = useHistory();
  const [state, dispatch] = useContext(UserContext);
  const handleLogOut = () => {
    dispatch({ type: TYPE.LOGOUT, payload: {} });
  };
  useEffect(() => {
    if (state.privateKey) {
      socket.emit(EMIT_TYPE.GET_BLOCKCHAIN, (blockchain) => {
        blockchain.chain.reverse();
        dispatch({ type: TYPE.SET_BLOCKCHAIN, payload: { blockchain: blockchain } })
      })
      socket.on(EMIT_TYPE.HISTORY_BLOCKCHAIN, (blockchain) => {
        blockchain.chain.reverse();
        dispatch({ type: TYPE.SET_BLOCKCHAIN, payload: { blockchain: blockchain } })
      })
    }
    return () => {
      if (state.privateKey) {
        socket.removeEventListener(EMIT_TYPE.HISTORY_BLOCKCHAIN);
      }
    }
  }, [dispatch, state.privateKey]);

  useEffect(() => {
    if (state.privateKey) {
      socket.on(
        EMIT_TYPE.LAST_BLOCK,
        async () => {
          const key = {
            privateKey: state.privateKey,
            publicKey: state.publicKey,
          };
          socket.emit(EMIT_TYPE.GET_BALANCE, { key }, ({ balance }) => {
            console.log(balance);
            if (balance >= 0) {
              dispatch({ type: TYPE.SET_BALANCE, payload: { balance } });
            }
          });
        }
      );
    }

    return () => {
      if (state.privateKey) {
        socket.removeEventListener(EMIT_TYPE.LAST_BLOCK);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, state.publicKey, state.publicKey]);

  return (
    <div className={classes.grow}>
      <AppBar color="default" position="static">
        <Toolbar>
          <Button
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
            onClick={() => history.push("/")}
            style={{ backgroundColor: "transparent" }}
            disableRipple={true}
          >
            <div>
              <img alt="" src={logourl} className={classes.logo} />
            </div>
          </Button>
          <Typography className={classes.title} variant="h4" noWrap>
            MyCoin
          </Typography>
          <div >
            {state.privateKey ? (
              <div className={classes.linkgroup}>
                <Button
                  onClick={() => history.push("/mining")}
                  className={classes.link}
                  variant="h5"
                  noWrap
                >
                  MINING
                </Button>
                <Button
                  onClick={() => history.push("/transaction")}
                  className={classes.link}
                  variant="h4"
                  noWrap
                >
                  TRANSACTION
                </Button>
                <Button
                  onClick={() => history.push("/sendcoin")}
                  className={classes.link}
                  variant="h4"
                  noWrap
                >
                  SEND COIN
                </Button>
                <Button
                  onClick={() => history.push("/account")}
                  className={classes.link}
                  variant="h4"
                  noWrap
                >
                  BALANCE: {state.balance}
                </Button>
                <Button title={state.publicKey}
                 aria-label={state.publicKey}
                 onClick = {() => copyKey(state.publicKey)}>
                  Copy key 
                </Button>
              </div>
            ) : (
              <></>
            )}
          </div>

          <div className={classes.grow} />
          {state.privateKey ? (
            <div>
              <Link onClick={handleLogOut}>
                <ExitToAppIcon />
              </Link>
            </div>
          ) : (
            <> </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
