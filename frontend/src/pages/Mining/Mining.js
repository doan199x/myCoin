import { Button } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import socket from "../../config/socketio";
import { EMIT_TYPE } from "../../constant/API";
import { UserContext } from "../../context/UserProvider";
import { isValidNewBlock, minePendingTransactions } from "../../function";
import { TYPE } from "../../reducer/userReducer";

export default function Mining() {
  const [state, dispatch] = useContext(UserContext);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [blockMining, setBlockMining] = useState(null);
  const [lastBlock, setLastBlock] = useState(null);
  const [difficulty, setDifficulty] = useState(0);

  const handleMining = () => {
    if (!state.isMining) {
      socket.emit(EMIT_TYPE.START_MINING, (pentrans) => {
        setPendingTransactions(pentrans);
      });
      dispatch({ type: TYPE.BEGIN_MINER });
    } else {
      socket.emit(EMIT_TYPE.STOP_MINING);
      dispatch({ type: TYPE.STOP_MINER });
    }
  };

  useEffect(() => {
    if (state.isMining && blockMining) {
        socket.emit(EMIT_TYPE.MINING_DONE_A_BLOCK, ({ block: blockMining, minerAddress: state.publicKey }));
    }
    return () => {
        socket.removeEventListener(EMIT_TYPE.MINING_DONE_A_BLOCK);
    };
}, [blockMining, state.isMining, state.publicKey]);

  useEffect(() => {
    if (state.isMining && lastBlock) {
      socket.on(EMIT_TYPE.MINING_ABLOCK, (block) => {
        if (isValidNewBlock(block, lastBlock)) {
          socket.emit(EMIT_TYPE.VOTE_NEW_BLOCK, { block, vote: true });
          setBlockMining(null);
        } else socket.emit(EMIT_TYPE.VOTE_NEW_BLOCK, { block, vote: false });
      });

      socket.on(EMIT_TYPE.NEW_TRANSACTION, (transaction) => {
        const newPendingTranaction = [...pendingTransactions];
        newPendingTranaction.push(transaction);
        setPendingTransactions(newPendingTranaction);
      });
    }

    return () => {
      if (state.isMining) {
        toast.error("Mining cancel");
        socket.emit(EMIT_TYPE.STOP_MINING);
      }
      socket.removeEventListener(EMIT_TYPE.NEW_TRANSACTION);
      socket.removeEventListener(EMIT_TYPE.MINING_ABLOCK);
    };
  }, [state.isMining, pendingTransactions, lastBlock, difficulty]);

  useEffect(() => {
    if (state.isMining) {
      setBlockMining(
        minePendingTransactions(pendingTransactions, difficulty, lastBlock)
      );
    }
  }, [difficulty, lastBlock, pendingTransactions, state.isMining]);

  useEffect(() => {
    socket.on(
      EMIT_TYPE.LAST_BLOCK,
      async ({ block, difficulty, pendingTransactions }) => {
        setLastBlock(block);
        setDifficulty(difficulty);
        setPendingTransactions(pendingTransactions);
        const key = {
          primaryKey: state.primaryKey,
          publicKey: state.publicKey,
        };
        socket.emit(EMIT_TYPE.GET_BALANCE, { key }, ({ balance }) => {
          if (balance >= 0) {
            dispatch({ type: TYPE.SET_BALANCE, payload: { balance } });
          }
        });
      }
    );
    return () => {
      socket.removeEventListener(EMIT_TYPE.LAST_BLOCK);
    };
  }, [dispatch, state.primaryKey, state.publicKey]);

  return (
    <div style={{ textAlign: "center" }}>
      <Button variant="contained" color="primary" onClick={handleMining}>
        {" "}
        {state.isMining ? "Stop Mining" : "Mining"}
      </Button>
    </div>
  );
}
