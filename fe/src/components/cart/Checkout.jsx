import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddressForm from './AddressForm';
import PaymentForm from './PaymentForm';
import Review from './Review';
import NoProduct from './NoProduct';
import { Link, Navigate } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';
import helperFn from '../../utils/helperFn';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const steps = ['Shipping address', 'Payment details', 'Review your order'];

function GetStepContent(step, user, cartItems, refetch) {
  const [paymentMethod, setPaymentMethod] = React.useState('cash');

  switch (step) {
    case 0:
      return <AddressForm data={user} />;
    case 1:
      return (
        <PaymentForm
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />
      );
    case 2:
      return <Review paymentMethod={paymentMethod} data={cartItems} />;
    case 3:
      return <Typography>No product in cart</Typography>;
    default:
      throw new Error('Unknown step');
  }
}
const GETCART = gql`
  query GetCart {
    getCart {
      cartId
      productId
      name
      price
      description
      quantity
      thumbnail
    }
  }
`;
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
const theme = createTheme();

export default function Checkout() {
  const [paymentMethod, setPaymentMethod] = React.useState();
  const [user, setUser] = React.useState();
  const listCart = useSelector((state) => state.Carts);
  const [cartItems, setCartItems] = React.useState(listCart);
  let navigate = useNavigate();
  React.useEffect(() => {
    setCartItems(listCart);
  }, [listCart]);
  // const { loading, error, data, refetch } = useQuery(GETCART, {
  //   onError: (err) => {
  //     console.log(err);
  //   },
  // });
  // React.useEffect(() => {
  //   if (data) {
  //     console.log(data);
  //     setCartItems(data.getCart);
  //   }
  // }, [data]);
  // if (!data) return <NoProduct />;
  const { loadingUser, errorUser, data: dataUser } = useQuery(PROFILE);
  React.useEffect(() => {
    if (dataUser) {
      setUser(dataUser.user);
    }
  }, [dataUser]);

  const [activeStep, setActiveStep] = React.useState(0);
  if (activeStep === 3) {
    navigate('/');
  }
  const handleNext = () => {
    setActiveStep(activeStep + 1);

    // if (data) refetch();
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: 'relative',
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Your cart
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography component="h1" variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography variant="h5" gutterBottom>
                  Thank you for your order.
                </Typography>
                <Typography variant="subtitle1">
                  Your order number is #2001539. We have emailed your order
                  confirmation, and will send you an update when your order has
                  shipped.
                </Typography>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {GetStepContent(activeStep, user, cartItems)}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                      Back
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 3, ml: 1 }}
                  >
                    {/* {activeStep === steps.length - 1 ? 'Place order' : 'Next'} */}
                    {activeStep === steps.length - 1
                      ? 'Go to homepage'
                      : 'Next'}
                  </Button>
                </Box>
              </React.Fragment>
            )}
          </React.Fragment>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
