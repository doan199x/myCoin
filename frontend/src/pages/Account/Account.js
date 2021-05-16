import React, { useContext } from "react";
import { UserContext } from "../../context/UserProvider";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router";
import { Tooltip } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import nodata from "../../img/nodata.jpg";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    textAlign: "center",
    width: "50%",
    marginLeft: "25%",
    margin: "5%",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
    paddingBottom: "5%",
  },
  btn: {
    marginLeft: "43%",
    paddingBottom: "5%",
    paddingTop: "5%",
  },
  grid: {
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
  },
  img: {
    width: "50%",
    marginTop: "2%",
  },
  transaction: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  line: {
    width: "100%",
  },
});

export default function Account() {
  const [state] = useContext(UserContext);
  const classes = useStyles();
  const history = useHistory();
  const bull = <span className={classes.bullet}>•</span>;

  const transactions = [];
  state.blockchain.chain.map((block) => {
    block.transaction.map((trans) => {
      if (trans.fromAddress === state.publicKey) {
        trans.fromAddress = "YOUR WALLET";
        transactions.push(trans);
      } else if (trans.toAddress === state.publicKey) {
        trans.toAddress = "YOUR WALLET";
        transactions.push(trans);
      }
    });
  });

  const columns = [
    { field: "id", headerName: "Latest", width: 120 },
    {
      field: "fromAddress",
      headerName: "From Address",
      renderCell: (params) => (
        <Tooltip title={params.formattedValue}>
          <span className="table-cell-trucate">{params.formattedValue}</span>
        </Tooltip>
      ),
      sortable: false,
      width: 400,
    },
    {
      field: "toAddress",
      headerName: "To Address",
      renderCell: (params) => (
        <Tooltip title={params.formattedValue}>
          <span className="table-cell-trucate">{params.formattedValue}</span>
        </Tooltip>
      ),
      sortable: false,
      width: 400,
    },
    { field: "amount", headerName: "Amount", sortable: false, width: 150 },
  ];

  if (transactions?.length > 0) {
    for (let i = 0; i < transactions.length; i++) {
      transactions[i].id = i;
      if (
        transactions[i].fromAddress === "" ||
        transactions[i].fromAddress === null
      ) {
        transactions[i].fromAddress = "SYSTEM";
      }
    }
  }
  const newBlockChain = [...state.blockchain.chain];
  if (state.blockchain.chain.length > 0) {
    for (let i = 0; i < state.blockchain.chain.length; i++) {
      newBlockChain[i].id = i;
      newBlockChain[i].miner = "SYSTEM";
      for (let j = 0; j < newBlockChain[i].transaction.length; j++) {
        if (newBlockChain[i].transaction[j].fromAddress === "SYSTEM") {
          newBlockChain[i].miner = newBlockChain[i].transaction[j].toAddress;
        }
      }
    }
  }
  return (
    <div>
      <Card className={classes.root}>
        <CardContent>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            Wallet
          </Typography>
          <Typography variant="h5" component="h2">
            Account{bull}detail
          </Typography>
          <Typography variant="body2" component="p">
            Balance:
            {state.balance}
          </Typography>
        </CardContent>
        <CardActions className={classes.btn}>
          <Button onClick={() => history.push("/mining")} size="small">
            Start mining
          </Button>
        </CardActions>
      </Card>
      {/* */}
      <div className={classes.transaction}>
        <div className={classes.line}>
          <h2 style={{ textAlign: "center", color: "#00033e" }}>
            {" "}
            Your transaction history
          </h2>
        </div>
        <div className={classes.grid}>
          {transactions.length > 0 ? (
            <>
              <div style={{ height: "300px", width: "1200px" }}>
                <DataGrid rows={transactions} columns={columns} pageSize={5} />
              </div>
            </>
          ) : (
            <div>
              <img src={nodata} alt="" className={classes.img} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
