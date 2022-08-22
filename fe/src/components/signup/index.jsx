import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import helperFn from '../../utils/helperFn';
import { ToastContainer } from 'react-toastify';
const theme = createTheme();
const SIGNUP = gql`
  mutation ($input: InputSignup) {
    createUser(inputSignup: $input)
  }
`;
export default function SignUp() {
  const [input, setInput] = React.useState();
  const [rePassword, setRePassword] = React.useState();
  const navigate = useNavigate();
  const validPassword = (password) => {
    return password.trim().match(/^[a-zA-Z0-9]{6,30}$/);
  };
  const [signup] = useMutation(SIGNUP, {
    onError: (err) => {
      helperFn.toastAlertFail(err.message);
    },
  });
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      if (!input.email || !input.password || !input.fullname || !rePassword)
        return helperFn.toastAlertFail('Please fill all the fields');
      if (rePassword.rePassword !== input.password) {
        return helperFn.toastAlertFail('Passwords must match');
      }
      if (!validPassword(input.password))
        return helperFn.toastAlertFail('Password contains the length 6-30');
      const { data } = await signup({
        variables: {
          input: {
            email: input.email,
            password: input.password,
            fullname: input.fullname,
            address: input.address,
            phone: input.phone,
          },
        },
      });
      if (data) {
        console.log(data);
        helperFn.toastAlertSuccess('Please check your email');
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={(e) =>
                    setInput({ ...input, [e.target.name]: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  type="password"
                  name="password"
                  label="Password"
                  id="password"
                  onChange={(e) =>
                    setInput({ ...input, [e.target.name]: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  type="password"
                  name="rePassword"
                  label="Re-Password"
                  id="rePassword"
                  onChange={(e) =>
                    setRePassword({
                      ...rePassword,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  name="fullname"
                  label="Full Name"
                  id="fullname"
                  onChange={(e) =>
                    setInput({ ...input, [e.target.name]: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="address"
                  label="Address"
                  id="address"
                  onChange={(e) =>
                    setInput({ ...input, [e.target.name]: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="phone"
                  label="Phone Number"
                  id="phone"
                  onChange={(e) =>
                    setInput({ ...input, [e.target.name]: e.target.value })
                  }
                />
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSignup}
            >
              Sign Up
            </Button>
            <ToastContainer />
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  to="/login"
                  variant="body2"
                  style={{ textDecoration: 'none' }}
                >
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
