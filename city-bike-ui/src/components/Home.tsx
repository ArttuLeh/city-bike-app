import { Typography } from '@mui/material';

const Home = () => {
  return (
    <div>
      <Typography variant="h4" align="center" sx={{ mb: 3 }}>
        Helsinki City Bike app
      </Typography>
      <Typography variant="body1" align="center">
        Here you can browse informations about Helsinki City Bike stations and
        journeys.
      </Typography>
    </div>
  );
};
export default Home;
