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
import { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import ModalLoading from './components/ModalLoading';
import { Link } from 'react-router-dom';

const theme = createTheme();

export default function SignUp() {
  const [input, setInput] = useState();
  // const [loading, setLoading] = useState(false);
  const fire = (title, text, icon) => {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: 'OK',
    });
  };
  const handleSubmit = async () => {
    // setLoading(true);
    try {
      if (!input) {
        Swal.fire({ icon: 'error', text: 'Error', title: 'Missing data' });
      }
      // axios({
      //   method: 'POST',
      //   url: 'http://localhost:4007/user/forgotPassword',
      //   data: input,
      // })
      axios('http://localhost:4007/user/forgotPassword', {
        method: 'POST',
        data: input,
      })
        .then(function (response) {
          if (response.data.status == 200) {
            Swal.fire({
              title: 'Success',
              text: 'Please check your email',
              icon: 'success',
              confirmButtonText: 'Resend email',
            }).then(function () {
              window.location = 'http://localhost:3000/forgotPassword';
            });
          } else {
            fire('Error', response.data.message, 'error');
          }
          // setTimeout(function () {
          //   setLoading(false);
          // }, 1000);
        })
        .catch((err) => console.log(err));
    } catch (err) {
      // setTimeout(function () {
      //   setLoading(false);
      // }, 1000);
      console.log(err);
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Forgot Password
          </Typography>
          <Box
            // component="form"
            // noValidate
            // onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  sx={{ width: '300px' }}
                  onChange={(e) =>
                    setInput({ ...input, [e.target.name]: e.target.value })
                  }
                />
              </Grid>
            </Grid>
            <Button
              // type="submit"
              onClick={handleSubmit}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Submit
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
      {/* <ModalLoading isOpen={loading} /> */}
    </ThemeProvider>
  );
}
