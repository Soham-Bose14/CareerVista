import './App.css';
import { useEffect, useState } from 'react';
import { useLocation, BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Loader from './components/Loader';

import Home from "./pages/home";
import Company from "./pages/company";
import JobSeeker from "./pages/jobSeeker";
import Candidates from "./components/Candidates";
import CompanyOptions from './pages/companyOptions';
import JobSeekerOptions from './pages/jobSeekerOptions';
import UpdateJob from "./pages/updateJob";

function RoutesWithLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.pathname === '/company/candidates') {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 700); // Delay only for /company/candidates
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [location.pathname]);

  return (
    <>
      {loading && <Loader />}
      <Switch>
        <Route path='/' component={Home} exact />
        <Route path='/company' component={Company} exact />
        <Route path='/jobSeeker' component={JobSeeker} exact />
        <Route path='/company/candidates' component={Candidates} exact />
        <Route path='/company/options' component={CompanyOptions} exact />
        <Route path='/jobSeeker/options' component={JobSeekerOptions} exact />
        <Route path='/company/updateJob' component={UpdateJob} exact />
      </Switch>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <RoutesWithLoader />
      </div>
    </Router>
  );
}

export default App;
