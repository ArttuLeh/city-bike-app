import { Routes, Route, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from './store';
import {
  AppBar,
  Container,
  Toolbar,
  Button,
  ThemeProvider,
  CssBaseline,
} from '@mui/material';

import JourneysView from './components/JourneysView';
import StationsView from './components/StationsView';
import StationView from './components/StationView';
import AddJourney from './components/AddJourney';
import Home from './components/Home';
import AddStation from './components/AddStation';
import LoginForm from './components/LogingForm';
import { logout } from './reducers/authReducer';
import theme from './theme';

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  console.log('Authentication status:', isAuthenticated);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <AppBar position="sticky" sx={{ borderRadius: 1 }}>
          <Toolbar sx={{ gap: 1 }}>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button
              id="stations"
              color="inherit"
              component={Link}
              to="/stations"
            >
              Stations
            </Button>
            <Button
              id="journeys"
              color="inherit"
              component={Link}
              to="/journeys"
            >
              Journeys
            </Button>
            <Button
              id="add-journey"
              color="inherit"
              component={Link}
              to="/add-journey"
            >
              Add Journey
            </Button>
            <Button
              id="add-station"
              color="inherit"
              component={Link}
              to="/add-station"
            >
              Add Station
            </Button>
            {isAuthenticated ? (
              <Button
                style={{ position: 'absolute', right: 20 }}
                variant="outlined"
                color="error"
                onClick={() => dispatch(logout())}
              >
                Logout
              </Button>
            ) : (
              <Button
                style={{ position: 'absolute', right: 20 }}
                id="login"
                variant="outlined"
                color="inherit"
                component={Link}
                to="/login"
              >
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stations" element={<StationsView />} />
            <Route path="/journeys" element={<JourneysView />} />
            <Route path="/station/:id" element={<StationView />} />
            <Route path="/add-journey" element={<AddJourney />} />
            <Route path="/add-station" element={<AddStation />} />
            <Route path="/login" element={<LoginForm />} />
          </Routes>
        </div>
      </Container>
    </ThemeProvider>
  );
};

export default App;
