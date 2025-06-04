import './App.css';
import Home from "./pages/home";
import Company from "./pages/company";
import Results from "./components/Results"
import CompanyOptions from './pages/companyOptions';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path='/' component={Home} exact />
          <Route path='/company' component={Company} exact/>
          <Route path='/results' component={Results} exact/>
          <Route path='/company/options' component={CompanyOptions} exact/>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
