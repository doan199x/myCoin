import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    footer:{
        padding: '1%',
        marginTop: '1%',
        textAlign: 'center',
        backgroundColor: '#273044',
        color: '#9da2aa',
    },
}));

export default function Footer() {
    const classes = useStyles();
    return (
        <div className={classes.footer}>
         Contact us for more.
        </div>
    )
}
