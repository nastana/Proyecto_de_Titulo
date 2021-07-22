import React from "react";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

import {About} from './Components/About'
import {Users} from './Components/Users'
import {Main} from './Components/Main'
import {Load} from './Components/Load'
function App() {
  return (
    <Router>

      <div>
        <Switch>
          <Route path = "/about" component={About}/>
          <Route path = "/input" component = {Users}/>
          <Route path = "/load" component = {Load}/>
          <Route path = "/" component={Main}/>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
