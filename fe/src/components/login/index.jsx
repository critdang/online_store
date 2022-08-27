import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import helperFn from '../../utils/helperFn';
import { onLogin } from '../../reducers/auth.slice';
import { useDispatch } from 'react-redux';

const theme = createTheme();

const LOGIN = gql`
  mutation login($input: InputLogin) {
    login(inputLogin: $input) {
      token
      userId
    }
  }
`;

export default function SignInSide() {
  const [input, setInput] = useState();
  const navigate = useNavigate();

  const [login] = useMutation(LOGIN, {
    onError: (err) => {
      helperFn.toastAlertFail(err.message);
    },
  });

  const dispatch = useDispatch();
  const handleLogin = async () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    try {
      if (!input)
        helperFn.toastAlertFail('Please provide your username and password');
      const { data } = await login({
        variables: {
          input: {
            email: input.email,
            password: input.password,
          },
        },
      });
      if (data) {
        dispatch(onLogin(data));
        const token = data.login.token;
        token.replaceAll('"', '');
        localStorage.setItem('user', JSON.stringify(data.login));
        navigate('/');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '90vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              'url(https://static.zara.net/photos///2022/I/T/2/p/0857/431/712/2/w/1247/0857431712_15_1_1.jpg?ts=1658928471883)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light'
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box noValidate sx={{ mt: 1 }}>
              {/* <form onSubmit={handleLogin}> */}
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={(e) =>
                  setInput({ ...input, [e.target.name]: e.target.value })
                }
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e) =>
                  setInput({ ...input, [e.target.name]: e.target.value })
                }
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                // type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleLogin}
              >
                Sign In
              </Button>
              <ToastContainer />

              {/* </form> */}
              <Grid container>
                <Grid item xs>
                  <Link
                    to="/requestReset"
                    variant="body2"
                    style={{ textDecoration: 'none' }}
                  >
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    to="/signup"
                    variant="body2"
                    style={{ textDecoration: 'none' }}
                  >
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
