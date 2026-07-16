import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../reducers/authReducer';
import { AppDispatch } from '../store';
import { Box, TextField, Grid, Button, Alert, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await dispatch(loginUser({ email, password }));
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    }
    resetForm();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: 550,
        margin: '0 auto',
      }}
    >
      <Typography variant="h4" align="center" sx={{ mb: 3 }}>
        Login
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ backgroundColor: '#fff', borderRadius: 1 }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ backgroundColor: '#fff', borderRadius: 1 }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Button
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
            type="submit"
            variant="contained"
          >
            Login
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
export default LoginForm;
