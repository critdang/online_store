import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { gql, useMutation, useQuery } from '@apollo/client';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import helperFn from '../../utils/helperFn';

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
      birthday
    }
  }
`;
const EDITPROFILE = gql`
  mutation editProfile($input: InputProfile) {
    editProfile(inputProfile: $input) {
      fullname
      email
      address
      phone
      gender
      avatar
      birthday
    }
  }
`;

const CHANGEPASSWORD = gql`
  mutation changePassword($input: InputPassword) {
    changePassword(inputPassword: $input) {
      email
    }
  }
`;

const UPDATEAVATAR = gql`
  mutation uploadAvatar($file: Upload!) {
    uploadAvatar(file: $file)
  }
`;

export default function Album(props, { setLogin }) {
  const [inputUpdateUser, setUpdatedUser] = React.useState();
  const [inputUpdatePassword, setUpdatedPassword] = React.useState({
    oldPassword: '',
    newPassword: '',
  });
  const [selectedFile, setSelectedFile] = React.useState();
  const [avatar, setAvatar] = React.useState('');

  const convertBase64 = (file, cb) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  };

  const navigate = useNavigate();
  const [editProfile] = useMutation(EDITPROFILE);
  const [changePassword] = useMutation(CHANGEPASSWORD);

  // open/hide password input
  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const [values, setValues] = React.useState({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
  });
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  // Upload Avatar
  const TOKEN = JSON.parse(localStorage.getItem('user')).token;
  const userId = JSON.parse(localStorage.getItem('user')).userId;
  const [uploadAvatar] = useMutation(UPDATEAVATAR, {
    onError: (err) => {
      console.log(err);
    },
  });
  const handleUploadAvatar = async () => {
    // const formData = new FormData();
    // formData.append('file', selectedFile);
    // formData.append('upload_preset', 'docs_upload_example_us_preset');

    // var url = 'https://api.cloudinary.com/v1_1/demo/image/upload';
    // fetch(url, {
    //   method: 'POST',
    //   mode: 'cors',
    //   body: formData,
    // })
    //   .then((response) => {
    //     console.log(response.text());
    //     return response;
    //   })
    //   .then((data) => {
    //     console.log(data);
    //   });

    // axios({
    //   method: 'patch',
    //   url: `http://localhost:4007/user/${userId}/changeAvatar`,
    //   data: formData,
    //   headers: { authorization: `Bearer ${TOKEN}` },
    // })
    //   .then((res) => helperFn.toastAlertSuccess('Update avatar successfully'))
    //   .catch((error) => helperFn.toastAlertFail(error.message));
    const { data } = await uploadAvatar({
      variables: {
        file: {
          selectedFile,
        },
      },
    });
    if (data) {
      console.log(data);
    }
  };
  console.log(inputUpdateUser);
  // handleUpdateUser
  const handleUpdateUser = async () => {
    try {
      const { data } = await editProfile({
        variables: {
          input: {
            email: inputUpdateUser.email,
            fullname: inputUpdateUser.fullname,
            address: inputUpdateUser.address,
            phone: inputUpdateUser.phone,
            gender: inputUpdateUser.gender,
            birthday: inputUpdateUser.birthday,
          },
        },
      });
      if (data) {
        console.log(data);
        helperFn.toastAlertSuccess('Update information successfully');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdatePassword = async () => {
    if (
      inputUpdatePassword.newPassword === '' ||
      inputUpdatePassword.oldPassword === ''
    ) {
      toast.warn('Fill in. Please', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      try {
        const { data } = await changePassword({
          variables: {
            input: {
              oldPassword: inputUpdatePassword.oldPassword,
              newPassword: inputUpdatePassword.newPassword,
            },
          },
        });
        if (data) {
          console.log(data);
          helperFn.toastAlertSuccess('Update password successfully');
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  const { loading, error, data } = useQuery(PROFILE);

  const [birthday, setBirthday] = React.useState('');
  // setBirthday(data.user.birthday);
  // const a = moment(new Date()).format('DD-MM-YYYY');
  //
  React.useEffect(() => {
    if (data) {
      const date = moment(data.user.birthday ? data.user.birthday : '').format(
        'YYYY-MM-DD'
      );
      setBirthday(date);
    }
  }, [data]);

  React.useEffect(() => {
    if (selectedFile) {
      convertBase64(selectedFile, (result) => {
        setAvatar(result);
        console.log(avatar);
      });
    }
  }, [selectedFile]);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;
  // eslint-disable-next-line react-hooks/rules-of-hooks

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
                        onChange={(e) =>
                          setUpdatedUser({
                            ...inputUpdateUser,
                            [e.target.name]: e.target.value,
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        id="fullname"
                        name="fullname"
                        label="Full name"
                        fullWidth
                        autoComplete="given-name"
                        variant="standard"
                        defaultValue={data.user.fullname}
                        onChange={(e) =>
                          setUpdatedUser({
                            ...inputUpdateUser,
                            [e.target.name]: e.target.value,
                          })
                        }
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
                        onChange={(e) =>
                          setUpdatedUser({
                            ...inputUpdateUser,
                            [e.target.name]: e.target.value,
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        id="date"
                        label="Birthday"
                        type="date"
                        name="birthday"
                        defaultValue={birthday}
                        sx={{ width: 270 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={(e) =>
                          setUpdatedUser((preUser) => ({
                            ...preUser,
                            [e.target.name]: e.target.value,
                          }))
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <TextField
                        id="address"
                        name="address"
                        label="Address line 1"
                        fullWidth
                        variant="standard"
                        defaultValue={data.user.address}
                        onChange={(e) =>
                          setUpdatedUser({
                            ...inputUpdateUser,
                            [e.target.name]: e.target.value,
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">
                          Gender
                        </FormLabel>
                        <RadioGroup
                          aria-labelledby="demo-radio-buttons-group-label"
                          name="gender"
                          defaultValue={data.user.gender}
                          onChange={(e) =>
                            setUpdatedUser({
                              ...inputUpdateUser,
                              [e.target.name]: e.target.value,
                            })
                          }
                        >
                          <FormControlLabel
                            value="Female"
                            control={<Radio />}
                            label="Female"
                          />
                          <FormControlLabel
                            value="Male"
                            control={<Radio />}
                            label="Male"
                          />
                          <FormControlLabel
                            value="Other"
                            control={<Radio />}
                            label="Other"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <Button variant="outlined" onClick={handleUpdateUser}>
                        Update Profile
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <Typography variant="h6" gutterBottom>
                        Change Password User
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <InputLabel htmlFor="standard-adornment-password">
                        Password
                      </InputLabel>
                      <Input
                        id="oldPassword"
                        type={values.showPassword ? 'text' : 'password'}
                        value={values.oldPassword}
                        name="oldPassword"
                        fullWidth
                        variant="standard"
                        onChange={(e) =>
                          setUpdatedPassword({
                            ...inputUpdatePassword,
                            [e.target.name]: e.target.value,
                          })
                        }
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                            >
                              {values.showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InputLabel htmlFor="standard-adornment-password">
                        Password
                      </InputLabel>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type={values.showPassword ? 'text' : 'password'}
                        fullWidth
                        variant="standard"
                        value={values.newPassword}
                        onChange={(e) =>
                          setUpdatedPassword({
                            ...inputUpdatePassword,
                            [e.target.name]: e.target.value,
                          })
                        }
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                            >
                              {values.showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <Button variant="outlined" onClick={handleUpdatePassword}>
                        Change Password
                      </Button>
                      <ToastContainer />
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
                        src={!selectedFile ? data.user.avatar : avatar}
                        alt={data.user.avatar}
                      />
                      {console.log(selectedFile)}
                      <CardContent>
                        <Typography
                          gutterBottom
                          variant="h5"
                          component="div"
                          sx={{ textAlign: 'center' }}
                        >
                          {data.user.fullname}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textAlign: 'center' }}
                        >
                          {data.user.email}
                        </Typography>
                      </CardContent>
                      <CardContent sx={{ padding: '0', marginLeft: '7px' }}>
                        <Typography variant="body2">
                          Upload Profile Image
                        </Typography>
                        <CardActions>
                          <Input
                            type="file"
                            sx={{ focused: 'true' }}
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                          ></Input>
                        </CardActions>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handleUploadAvatar}
                        >
                          Update Image
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
