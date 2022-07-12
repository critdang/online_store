import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Container } from '@mui/system';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
} from '@mui/material';
import NavBar from './components/NavBar';

export default function AddressForm() {
  return (
    <div style={{ boxSizing: 'border-box', padding: '0px', margin: '0px' }}>
      <NavBar />
      <Typography variant="h6" gutterBottom>
        Edit Profile
      </Typography>
      <Grid container wrap sx={{display: 'flex' }}>
        <React.Fragment>
          <Grid container spacing={3} sm={12}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="email"
                name="email"
                label="Email"
                fullWidth
                variant="standard"
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
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="phone"
                name="phone"
                label="Phone"
                fullWidth
                variant="standard"
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
                autoComplete="shipping address-line1"
                variant="standard"
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
              sx={{ maxWidth: 345, marginLeft: '20px', maxHeight: '345px' }}
            >
              <CardMedia
                component="img"
                alt="green iguana"
                height="140"
                // image="http://placehold.it/"
                src="https://demos.creative-tim.com/argon-dashboard/assets/img/bg-profile.jpg"
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
              <CardContent sx={{ padding: '0', marginLeft: '7px'}}>
                <Typography variant="body2" >
                  Upload Image
                </Typography>
                <CardActions>
                  <Input type="file" sx={{ focused: 'true' }}></Input>
                </CardActions>
                <Button variant="outlined" size="small">Update</Button>
              </CardContent>
            </Card>
          </Grid>
        </React.Fragment>
      </Grid>
    </div>
  );
}
