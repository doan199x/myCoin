import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Header from '../src/Header/Header'
import Footer from '../src/Footer/Footer'
import Error from "./pages/Error/Error";
import Signin from "./pages/Signin/Signin";
import Signup from "./pages/Signup/Signup";

function App() {
  return (
    <Router>
        <Header/>
        <Switch>
          <Route exact path="/signin">       
          <Signin/> 
          </Route>
          <Route exact path="/signup">
          <Signup/> 
          </Route>
          <Route>
                  <Error />
                </Route>
        </Switch>
      <Footer/>
  </Router>
  );
}

export default App;
