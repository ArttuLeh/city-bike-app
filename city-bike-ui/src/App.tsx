import { Routes, Route, Link } from 'react-router-dom'
import { AppBar, Container, Toolbar, Button } from '@mui/material'

import JourneysView from './components/JourneysView'
import StationsView from './components/StationsView'
import StationView from './components/StationView'
import AddJourney from './components/AddJourney'
import Home from './components/Home'
import AddStation from './components/AddStation'

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
          <Button id="add-journey" color="inherit" component={Link} to="/add-journey">
            Add Journey
          </Button>
          <Button id="add-station" color="inherit" component={Link} to="/add-station">
            Add Station
          </Button>
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
        </Routes>
      </div>
    </Container>
  )
}

export default App
