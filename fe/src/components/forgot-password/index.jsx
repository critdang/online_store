import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import helperFn from '../../utils/helperFn';
import { gql, useMutation } from '@apollo/client';
import { ToastContainer } from 'react-toastify';

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

const RESETPASSWORD = gql`
  mutation ResetPassword($inputReset: InputReset) {
    resetPassword(inputReset: $inputReset)
  }
`;

export default function UpdatePassword() {
  const [resetPassword] = useMutation(RESETPASSWORD, {
    onError: (err) => {
      helperFn.toastAlertFail(err.message);
    },
  });
  let { tokenId } = useParams();
  const [input, setInput] = React.useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!input) {
        helperFn.toastAlertFail('Please fill your form');
      }
      const { data } = await resetPassword({
        variables: {
          inputReset: {
            token: tokenId,
            password: input.password,
            confirmPassword: input.confirmPassword,
          },
        },
      });

      if (data) {
        helperFn.toastAlertSuccess(data.resetPassword);
      }
    } catch (err) {
      console.log(err);
      helperFn.toastAlertFail(err);
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
            Update Password
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              name="password"
              type="password"
              autoComplete="password"
              autoFocus
              onChange={(e) =>
                setInput({ ...input, [e.target.name]: e.target.value })
              }
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="confirm-password"
              onChange={(e) =>
                setInput({ ...input, [e.target.name]: e.target.value })
              }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Update Password
            </Button>
            <ToastContainer />
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
