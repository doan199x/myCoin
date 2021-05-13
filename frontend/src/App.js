import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import Header from "../src/Header/Header";
import Footer from "../src/Footer/Footer";
import Error from "./pages/Error/Error";
import Signin from "./pages/Signin/Signin";
import Signup from "./pages/Signup/Signup";
import Password from "./pages/Signin/Password";
import Home from "./pages/Home/Home";
import { UserProvider } from "./context/UserProvider";
import reducer, { initialState } from "./reducer/userReducer";
import UserProtect from "./context/Userprotect.js"
import Account from "./pages/Account/Account";

function App() {
  return (
    <Router>
      <Header />
      <UserProvider initialState={initialState} reducer={reducer}>
        <Switch>
          <Route path="/signin/:password">
            <Signin />
          </Route>
          <Route exact path="/signup">
            <Signup />
          </Route>
          <Route exact path="/password">
            <Password />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
          <UserProtect>
            <Switch>
              <Route path="/account">
                <Account />
              </Route>
            </Switch>
          </UserProtect>
          <Route>
            <Error />
          </Route>
        </Switch>
      </UserProvider>
      <Footer />
    </Router>
  );
}

export default App;
