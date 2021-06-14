import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./component/pages/Home/Home";

function App() {
  return (
    <div className="app">
      <Router >
        <Switch>
          <Route exact path={`/`}>
            <Home/>
          </Route>
      </Switch>
      </Router>
    
    </div>

  );
}

export default App;