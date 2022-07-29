import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PersonIcon from '@mui/icons-material/Person';
import NavBar from './components/NavBar';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';

import {
  ButtonGroup,
  ClickAwayListener,
  FormControl,
  FormLabel,
  Grow,
  Input,
  MenuList,
  Modal,
  Paper,
  Popper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import styled from '@emotion/styled';
import Slider from 'react-slick';
import { gql, useQuery } from '@apollo/client';
function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" to="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

const PROFILE = gql`
  query {
    user {
      fullname
      email
      phone
      address
      gender
      avatar
    }
  }
`;

export default function Album(props, { setLogin }) {
  const TOKEN = JSON.parse(localStorage.getItem('user')).token;
  const { loading, error, data } = useQuery(PROFILE);
  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
        <Container
          maxWidth="xl"
          sx={{
            py: 5,
          }}
        >
          {/* End hero unit */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'end',
            }}
          >
            <div
              style={{ boxSizing: 'border-box', padding: '0px', margin: '0px' }}
            >
              <Typography variant="h6" gutterBottom>
                Edit Profile
              </Typography>
              <Grid container wrap sx={{ display: 'flex' }}>
                <React.Fragment>
                  <Grid container spacing={3} sm={12}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        id="email"
                        name="email"
                        label="Email"
                        fullWidth
                        variant="standard"
                        defaultValue={data.user.email}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        id="fullName"
                        name="fullName"
                        label="Full name"
                        fullWidth
                        autoComplete="given-name"
                        variant="standard"
                        defaultValue={data.user.fullname}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        id="phone"
                        name="phone"
                        label="Phone"
                        fullWidth
                        variant="standard"
                        defaultValue={data.user.phone}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        id="date"
                        label="Birthday"
                        type="date"
                        defaultValue="2017-05-24"
                        sx={{ width: 270 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <TextField
                        id="address1"
                        name="address1"
                        label="Address line 1"
                        fullWidth
                        variant="standard"
                        defaultValue={data.user.address}
                      />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                      <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">
                          Gender
                        </FormLabel>
                        <RadioGroup
                          aria-labelledby="demo-radio-buttons-group-label"
                          defaultValue="female"
                          name="radio-buttons-group"
                        >
                          <FormControlLabel
                            value="female"
                            control={<Radio />}
                            label="Female"
                          />
                          <FormControlLabel
                            value="male"
                            control={<Radio />}
                            label="Male"
                          />
                          <FormControlLabel
                            value="other"
                            control={<Radio />}
                            label="Other"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <Button variant="outlined">Update Profile</Button>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <Typography variant="h6" gutterBottom>
                        Change Password User
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        id="password"
                        name="password"
                        label="Current Password"
                        fullWidth
                        variant="standard"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        id="password"
                        name="password"
                        label="New Password"
                        fullWidth
                        variant="standard"
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <Button variant="outlined">Change Password</Button>
                    </Grid>
                  </Grid>
                </React.Fragment>
                <React.Fragment>
                  <Grid sm={12} md={3}>
                    <Card
                      sx={{
                        maxWidth: 345,
                        marginLeft: '20px',
                        maxHeight: '345px',
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="140"
                        // image="http://placehold.it/"
                        src={data.user.avatar}
                        alt={data.user.avatar}
                      />
                      <CardContent>
                        <Typography
                          gutterBottom
                          variant="h5"
                          component="div"
                          sx={{ textAlign: 'center' }}
                        >
                          Lizard
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textAlign: 'center' }}
                        >
                          critdang@gmail.com
                        </Typography>
                      </CardContent>
                      <CardContent sx={{ padding: '0', marginLeft: '7px' }}>
                        <Typography variant="body2">Upload Image</Typography>
                        <CardActions>
                          <Input type="file" sx={{ focused: 'true' }}></Input>
                        </CardActions>
                        <Button variant="outlined" size="small">
                          Update
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                </React.Fragment>
              </Grid>
            </div>
          </div>
        </Container>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography>
        <Copyright />
      </Box>
      {/* End footer */}
    </ThemeProvider>
  );
}
