import React, { useContext } from 'react'
import './style.scss'
import homeurl from '../../img/home.jpg'
import { Button } from '@material-ui/core'
import { useHistory } from 'react-router';
import { UserContext } from '../../context/UserProvider';

export default function Home() {
  const history = useHistory();
  const [state, dispatch] = useContext(UserContext);
  if (state.privateKey) {
    history.push("/account");
    return <></>;
}
    return (
       <div className = "main">
         <div className = "main__box">
        
         <Button href= "/password" 
         variant="contained" 
         color="secondary">
        Sign in
      </Button>
      <Button href= "/signup" variant="contained" color="primary">
          Sign up
         </Button>
         </div>
         <div className= "main__div">
          <img className = "main__img" src = {homeurl}/>
        </div>
       </div>

    )
}