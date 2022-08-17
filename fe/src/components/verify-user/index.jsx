import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import helperFn from '../../utils/helperFn';
import { gql, useMutation } from '@apollo/client';

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

const VERIFY = gql`
  mutation Verify($inputToken: InputToken) {
    verify(inputToken: $inputToken)
  }
`;

export default function UpdatePassword() {
  // const [verify] = useMutation(VERIFY, {
  //   onError: (err) => {
  //     helperFn.toastAlertFail(err.message);
  //   },
  // });
  let { tokenId } = useParams();
  const [verify, { data }] = useMutation(VERIFY, {
    variables: {
      inputToken: {
        token: tokenId,
      },
    },
    onError: (err) => {
      helperFn.toastAlertFail(err.message);
    },
  });

  React.useEffect(() => {
    verify();
    if (data) {
      helperFn.toastAlertSuccess(data.verify);
    }
  }, [verify, tokenId]);
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
            Verify User
          </Typography>
          <Typography>Your account has been updated successfully</Typography>
          <Typography>
            Click <a href="/login">here</a> to go homepage
          </Typography>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
