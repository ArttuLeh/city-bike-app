import { Box, TextField, Grid, Button } from '@mui/material'
import { useDispatch } from 'react-redux'
import { addNewStation } from '../reducers/stationsReducer';
import { useState } from 'react';
import type { AppDispatch } from '../store';
import { useNavigate } from 'react-router-dom';

const AddStation = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [FID, setFID] = useState<number>(0);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [town, setTown] = useState('');
    const [operator, setOperator] = useState('');
    const [capacity, setCapacity] = useState<number>(0);
    const [x, setX] = useState<number>(0);
    const [y, setY] = useState<number>(0);

    const navigate = useNavigate();

    const resetForm = () => {
        setFID(0);
        setName('');
        setAddress('');
        setTown('');
        setOperator('');
        setCapacity(0);
        setX(0);
        setY(0);
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const content = {
            FID: FID,
            name: name,
            address: address,
            town: town,
            operator: operator,
            capacity: capacity,
            x: x,
            y: y
        }
        dispatch(addNewStation(content));
        navigate('/stations');
        resetForm();
    }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 400, margin: '0 auto' }}>
        <h2>Add New Journey</h2>

        <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    label="FID"
                    type="number"
                    fullWidth
                    value={FID}
                    onChange={(e) => setFID(Number(e.target.value))}
                    required
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    label="Name"
                    type="string"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(String(e.target.value))}
                    required
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    label="Address"
                    type="string"
                    fullWidth
                    value={address}
                    onChange={(e) => setAddress(String(e.target.value))}
                    required
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    label="Town"
                    type="string"
                    fullWidth
                    value={town}
                    onChange={(e) => setTown(String(e.target.value))}
                    required
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    label="Operator"
                    type="string"
                    fullWidth
                    value={operator}
                    onChange={(e) => setOperator(String(e.target.value))}
                    required
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    label="Capacity"
                    type="number"
                    fullWidth
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    required
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    label="X Coordinate"
                    type="number"
                    fullWidth
                    value={x}
                    onChange={(e) => setX(Number(e.target.value))}
                    required
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    label="Y Coordinate"
                    type="number"
                    fullWidth
                    value={y}
                    onChange={(e) => setY(Number(e.target.value))}
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

export default AddStation;