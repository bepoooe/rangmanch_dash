import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import theme from './theme';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './components/DashboardLayout';
import ContentLibrary from './pages/ContentLibrary';
// @ts-ignore
import Analytics from './pages/Analytics';
import AudienceInsights from './pages/AudienceInsights';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
// import Home from './pages/Home'; // Commented out as it's not currently used
import SignUp from './pages/SignUp';
import Settings from './pages/Settings';
import SocialDataScraper from './components/SocialDataScraper';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  // For demo purposes, we'll check if user is logged in
  const isLoggedIn = true; // In a real app, this would come from authentication state

  useEffect(() => {
    // Hide loader after 1.5 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  console.log('App rendering with routes');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {loading && <Loader />}
      <Router>
        <Switch>
          <Route path="/login">
            {isLoggedIn ? <Redirect to="/" /> : <SignIn />}
          </Route>
          
          <Route path="/signup">
            {isLoggedIn ? <Redirect to="/" /> : <SignUp />}
          </Route>
          
          <Route path="/home">
            <Redirect to="/" />
          </Route>
          
          <Route path="/content-library">
            <DashboardLayout>
              <ContentLibrary />
            </DashboardLayout>
          </Route>
          
          <Route path="/analytics">
            <DashboardLayout>
              <Analytics />
            </DashboardLayout>
          </Route>
          
          <Route path="/audience-insights">
            <DashboardLayout>
              <AudienceInsights />
            </DashboardLayout>
          </Route>
          
          <Route path="/profile">
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          </Route>
          
          <Route path="/settings">
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          </Route>
          
          <Route path="/scrape">
            <DashboardLayout>
              <SocialDataScraper />
            </DashboardLayout>
          </Route>
          
          <Route path="/" exact>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </Route>
          
          {/* Redirect any unknown routes to Dashboard */}
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default App;