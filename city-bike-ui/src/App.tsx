import { Routes, Route, Link } from 'react-router-dom'
import { AppBar, Container, Toolbar, Button } from '@mui/material'

import JourneysView from './components/JourneysView'
import StationsView from './components/StationsView'
import StationView from './components/StationView'
import Home from './components/Home'

const App = () => {
  return (
    <Container>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button id="stations" color="inherit" component={Link} to="/stations">
            Stations
          </Button>
          <Button id="journeys" color="inherit" component={Link} to="/journeys">
            Journeys
          </Button>
        </Toolbar>
      </AppBar>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stations" element={<StationsView />} />
          <Route path="/journeys" element={<JourneysView />} />
          <Route path="/stations/:id" element={<StationView />} />
        </Routes>
      </div>
    </Container>
  )
}

export default App
