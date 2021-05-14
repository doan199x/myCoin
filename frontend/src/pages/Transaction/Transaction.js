import React, { useContext, useEffect, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from "@material-ui/data-grid";
//mport clone from "clone";
import nodata from "../../img/nodata.jpg";
import { Button, Divider, TextField } from "@material-ui/core";
import { productAPI } from "../../config/productAPI.js";
import { TYPE } from "../../reducer/userReducer";
import { UserContext } from "../../context/UserProvider";
import { useHistory } from "react-router";

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
  const [state, dispatch] = useContext(UserContext);
  const history = useHistory();
  const transaction = [{fromAddress: "sample", toAddress: "sample", amount: "10"},
{fromAddress: "sample", toAddress: "sample", amount: "10"},
{fromAddress: "sample", toAddress: "sample", amount: "10"}]
  if (state.privateKey) {
    
  }
  else {
    history.push("/");
    //return <></>;
  }
  useEffect(() => {
//
  },[]);
  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "fromAddress", headerName: "From Address", width: 300 },
    { field: "toAddress", headerName: "To Address", width: 300 },
    { field: "amount", headerName: "Amount", width: 150 },
  ];

  if (transaction?.length > 0) {
    for (let i = 0; i < transaction.length; i++) {
        transaction[i].id = i;
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
          {transaction ? (
            <div style={{ height: "400px", width: "1000px" }}>
              <DataGrid rows={transaction} columns={columns} pageSize={5} />
            </div>
          ) : (
            <div>
              <img src={nodata} className={classes.img} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
