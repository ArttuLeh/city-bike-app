import axios from 'axios';
import { AuthResponse, LoginFormValues } from '../types';

const apiUrl = process.env.REACT_APP_API_URL;

const login = async (credentials: LoginFormValues) => {
  const { data } = await axios.post<AuthResponse>(
    `${apiUrl}/api/auth/login`,
    credentials,
  );
  console.log('login', data);
  return data;
};
// eslint-disable-next-line
export default { login };
