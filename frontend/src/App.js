import React from "react";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

import {CreateSimulation} from './components/CreateSimulation'
import {Main} from './components/Main'
import {Load} from './components/Load'
import { Results } from "./components/Results";
// import {Test} from './components/Test'
function App() {
  return (
    <Router>

      <div>
        <Switch>
          {/* <Route path = "/about" component={About}/> */}
          {/* <Route path = "/test" component={Test} /> */}
          <Route path = "/input" component = {CreateSimulation}/>
          <Route path = "/load" component = {Load}/>
          <Route path = "/results/:id" component = {Results}/>
          <Route path = "/" component={Main}/>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
