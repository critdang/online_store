import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { toast, ToastContainer } from 'react-toastify';
import helperFn from './utils/helperFn';
const theme = createTheme();

const REQUESTRESET = gql`
  mutation Mutation($inputRequest: InputRequest) {
    requestReset(inputRequest: $inputRequest)
  }
`;

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
  const [requestReset] = useMutation(REQUESTRESET, {
    onError: (err) => {
      helperFn.toastAlertFail(err.message);
    },
  });
  const handleSubmit = async () => {
    try {
      const { data } = await requestReset({
        variables: {
          inputRequest: {
            email: input.email,
          },
        },
      });
      if (data) {
        console.log(data);
        helperFn.toastAlertSuccess(
          'Submit successfully. Please check your email'
        );
      }
    } catch (err) {
      console.log(err);
      helperFn.toastAlertFail('Input your email address');
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
              <ToastContainer />
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
