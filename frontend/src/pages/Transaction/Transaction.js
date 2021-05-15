/* eslint-disable array-callback-return */
import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from "@material-ui/data-grid";
//mport clone from "clone";
import nodata from "../../img/nodata.jpg";
import { UserContext } from "../../context/UserProvider";
import { useHistory } from "react-router";
import { Tooltip } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
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
}));

export default function Transaction() {
  const [state] = useContext(UserContext);
  const history = useHistory();
  if (state.privateKey) {

  }
  else {
    history.push("/");
    //return <></>;
  }

  const transactions = [];

  state.blockchain.chain.map(block => {
    block.transaction.map(trans => transactions.push(trans));
  })

  const columns = [
    { field: "id", headerName: "LASTEST", width: 100 },
    {
      field: "fromAddress", headerName: "From Address", renderCell: (params) => (
        <Tooltip title={params.formattedValue} >
          <span className="table-cell-trucate">{params.formattedValue}</span>
        </Tooltip>
      ), sortable: false, width: 400
    },
    {
      field: "toAddress", headerName: "To Address", renderCell: (params) => (
        <Tooltip title={params.formattedValue} >
          <span className="table-cell-trucate">{params.formattedValue}</span>
        </Tooltip>
      ), sortable: false, width: 400
    },
    { field: "amount", headerName: "Amount", sortable: false, width: 100 },
  ];

  const columnsBlockChain = [
    { field: "id", headerName: "Lasted", width: 100 },
    { field: "index", headerName: "index", width: 100 },
    {
      field: "transaction", headerName: "Transactions", renderCell: (params) => (
        <div>{params.formattedValue.length}</div>
      ), sortable: false, width: 400
    },
    {
      field: "hash", headerName: "Hash", sortable: false, width: 400
    },
    { field: "Miner", headerName: "Miner", sortable: false, width: 100 },
  ];

  if (transactions?.length > 0) {
    for (let i = 0; i < transactions.length; i++) {
      transactions[i].id = i;
      if (transactions[i].fromAddress===""){
        transactions[i].fromAddress = "SYSTEM";
      }
    }
  }
  const newBlockChain = [...state.blockchain.chain];
  if (state.blockchain.chain.length > 0){
    for (let i = 0; i < state.blockchain.chain.length; i++) {
      newBlockChain[i].id = i;
    }
  }
  const classes = useStyles();
  return (
    <div>
      <div className={classes.transaction}>
        <div className={classes.line}>
          <h2 style={{ textAlign: "center", color: "#00033e" }}>
            {" "}
            Transaction history
          </h2>
        </div>
        <div className={classes.grid}>
          {transactions.length > 0 ? (
            <>
              <div style={{ height: "400px", width: "1000px" }}>
                <DataGrid rows={transactions} columns={columns} pageSize={5} />
              </div>
            </>
          ) : (
            <div>
              <img src={nodata} alt="" className={classes.img} />
            </div>
          )}
        </div>
        <div className={classes.line}>
          <h2 style={{ textAlign: "center", color: "#00033e" }}>
            {" "}
            Lastest Block
          </h2>
        </div>
        <div className={classes.grid}>
          {state.blockchain.chain.length > 0 ? (
            <>
              <div style={{ height: "400px", width: "1000px" }}>
                <DataGrid rows={state.blockchain.chain} columns={columnsBlockChain} pageSize={5} />
              </div>
            </>
          ) : (
            <>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
