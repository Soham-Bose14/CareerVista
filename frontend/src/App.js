import './App.css';
import Home from "./pages/home";
import Company from "./pages/company";
import JobSeeker from "./pages/jobSeeker";
import Candidates from "./components/Candidates"
import CompanyOptions from './pages/companyOptions';
import JobSeekerOptions from './pages/jobSeekerOptions';
import UpdateJob from "./pages/updateJob";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path='/' component={Home} exact />
          <Route path='/company' component={Company} exact/>
          <Route path='/jobSeeker' component={JobSeeker} exact/>
          <Route path='/company/candidates' component={Candidates} exact/>
          <Route path='/company/options' component={CompanyOptions} exact/>
          <Route path='/jobSeeker/options' component={JobSeekerOptions} exact/>
          <Route path='/company/updateJob' component={UpdateJob} exact/>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
