import React, { useContext } from 'react'
import { UserContext } from '../../context/UserProvider';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router';

const useStyles = makeStyles({
    root: {
      minWidth: 275,
      textAlign: 'center',
      width: '50%',
      marginLeft: '25%',
      margin: '5%'
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
      paddingBottom: '5%',
    },
    btn: {
        marginLeft: '43%',
        paddingBottom: '5%',
        paddingTop: '5%'
    },
  });

export default function Account() {
    const [state] = useContext(UserContext);
    const classes = useStyles();
    const history = useHistory();
  const bull = <span className={classes.bullet}>•</span>;
    if (state.privateKey) {

  }
    return (
        <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          My Coin wallet
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
        <Button onClick = {() => history.push('/mining')} size="small">Start mining</Button>
      </CardActions>
    </Card>
    )
}
