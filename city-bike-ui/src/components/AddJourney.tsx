import { Box, TextField, Grid, Button } from '@mui/material'
import { useDispatch } from 'react-redux'
import { addNewJourney } from '../reducers/journeyReducer';
import { useState } from 'react';
import type { AppDispatch } from '../store';

const AddJourney = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [departure_station_id, setDepartureStationId] = useState<number>(0);
    const [return_station_id, setReturnStationId] = useState<number>(0);
    const [departure_station_name, setDepartureStationName] = useState('');
    const [return_station_name, setReturnStationName] = useState('');
    const [covered_distance, setCoveredDistance] = useState<number>(0);
    const [duration_sec, setDuration_sec] = useState<number>(0);

    const resetForm = () => {
        setDepartureStationId(0);
        setReturnStationId(0);
        setDepartureStationName('');
        setReturnStationName('');
        setCoveredDistance(0);
        setDuration_sec(0);
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const content = {
            departure_station_id: departure_station_id,
            return_station_id: return_station_id,
            departure_station_name: departure_station_name,
            return_station_name: return_station_name,
            covered_distance_m: covered_distance,
            duration_sec: duration_sec
        }
        dispatch(addNewJourney(content));
        resetForm();
    }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 400, margin: '0 auto' }}>
        <h2>Add New Journey</h2>

        <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    label="Departure Station ID"
                    type="number"
                    fullWidth
                    value={departure_station_id}
                    onChange={(e) => setDepartureStationId(Number(e.target.value))}
                    required
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    label="Return Station ID"
                    type="number"
                    fullWidth
                    value={return_station_id}
                    onChange={(e) => setReturnStationId(Number(e.target.value))}
                    required
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    label="Departure Station Name"
                    type="string"
                    fullWidth
                    value={departure_station_name}
                    onChange={(e) => setDepartureStationName(String(e.target.value))}
                    required
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    label="Return Station Name"
                    type="string"
                    fullWidth
                    value={return_station_name}
                    onChange={(e) => setReturnStationName(String(e.target.value))}
                    required
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    label="Covered Distance (m)"
                    type="number"
                    fullWidth
                    value={covered_distance}
                    onChange={(e) => setCoveredDistance(Number(e.target.value))}
                    required
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    label="Duration (sec)"
                    type="number"
                    fullWidth
                    value={duration_sec}
                    onChange={(e) => setDuration_sec(Number(e.target.value))}
                    required
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
                <Button type="submit" variant="contained">
                    Create
                </Button>
            </Grid>
        </Grid>
    </Box>
  )
}

export default AddJourney;