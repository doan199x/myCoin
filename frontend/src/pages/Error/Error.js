import { FormHelperText, makeStyles } from '@material-ui/core'
import React from 'react'
import error from "../../img/error.jpg"


const useStyles = makeStyles((theme) => ({
    div: {
        display: 'flex',
        justifyContent: 'center'
    },
    img: {
        width: '70%'
      },
}));
export default function Error() {
    const classes= useStyles();
    return (
        <div className = {classes.div}>
            <img className = {classes.img}  src = {error}/>
        </div>
    )
}
