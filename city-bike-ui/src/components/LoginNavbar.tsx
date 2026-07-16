import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import Button from '@mui/material/Button';
import { logout } from '../reducers/authReducer';

const LoginNavbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  return (
    <div>
      {isAuthenticated ? (
        <Button
          variant="contained"
          color="error"
          onClick={() => dispatch(logout())}
        >
          Logout
        </Button>
      ) : (
        <Button variant="contained" href="/login">
          Login
        </Button>
      )}
    </div>
  );
};
export default LoginNavbar;
