import './App.css';
import Home from "./pages/home";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path='/' component={Home} exact />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
