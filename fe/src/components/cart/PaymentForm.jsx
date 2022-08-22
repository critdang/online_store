import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
export default function PaymentForm(props) {
  const { paymentMethod, setPaymentMethod } = props;
  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Payment method
          </Typography>
        </Grid>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            '& > *': {
              m: 1,
            },
          }}
        >
          <ButtonGroup variant="outlined" aria-label="outlined button group">
            <Button onClick={() => setPaymentMethod('cash')}>Cash</Button>
            <Button onClick={() => setPaymentMethod('credit card')}>
              Credit Card
            </Button>
          </ButtonGroup>
        </Box>
      </Grid>
      {paymentMethod === 'credit card' && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              required
              id="cardName"
              label="Name on card"
              fullWidth
              autoComplete="cc-name"
              variant="standard"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              id="cardNumber"
              label="Card number"
              fullWidth
              autoComplete="cc-number"
              variant="standard"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              id="expDate"
              label="Expiry date"
              fullWidth
              autoComplete="cc-exp"
              variant="standard"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              id="cvv"
              label="CVV"
              helperText="Last three digits on signature strip"
              fullWidth
              autoComplete="cc-csc"
              variant="standard"
            />
          </Grid>
          {/* <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="secondary" name="saveCard" value="yes" />}
            label="Remember credit card details for next time"
          />
        </Grid> */}
        </Grid>
      )}
      {paymentMethod === 'cash' && (
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Cash has been choosen to checkout
          </Typography>
        </Grid>
      )}
    </React.Fragment>
  );
}
