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
import Swal from 'sweetalert2';
import axios from 'axios';

const theme = createTheme();
const SIGNUP = gql`
  mutation createUser($input: InputSignup) {
    createUser(inputSignup: $input) {
      id
    }
  }
`;
export default function SignUp() {
  const [input, setInput] = React.useState();
  const [rePassword, setRePassword] = React.useState();
  console.log(input);
  console.log(rePassword);
  const navigate = useNavigate();

  const validPassword = (password) => {
    return password
      .trim()
      .match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/);
  };
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      console.log(rePassword.rePassword);
      console.log(input.password);
      if (!input.email || !input.password || !input.fullname || !rePassword)
        return Swal.fire({ icon: 'error', text: 'Please fill all the fields' });
      if (rePassword.rePassword !== input.password)
        return Swal.fire({ icon: 'error', text: 'Passwords must match' });
      if (!validPassword(input.password))
        return Swal.fire({
          icon: 'error',
          text: 'Password contains atleast 1 special character, 1 number, 1 character',
        });
      axios
        .post('http://localhost:4007/user', input)
        .then((res) => {
          console.log(res);
          if (res.data.status === 200) {
            Swal.fire({ icon: 'success', text: res.data.message }).then(() => {
              navigate('/login');
            });
          } else if (res.data.status === 400)
            Swal.fire({
              icon: 'error',
              html:
                `User exist: ` +
                '<a href="/forgotPassword">Forgot password</a>',
            });
          else Swal.fire({ icon: 'error', text: res.data.message });
        })
        .catch(
          (error) => console.log(error)
          // Swal.fire({ icon: 'error', text: 'Something went wrong' })
        );
    } catch (e) {
      console.log(e);
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
              {/* <Grid item xs={12}>
                <TextField
                  name="fullName"
                  required
                  fullWidth
                  id="fullName"
                  label="Full Name"
                  autoFocus
                />
              </Grid> */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
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
