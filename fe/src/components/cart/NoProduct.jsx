import * as React from 'react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import { Button, ListSubheader } from '@mui/material';
import { gql, useQuery, useMutation } from '@apollo/client';
import helperFn from '../../utils/helperFn';

const products = [
  {
    name: 'Product 1',
    desc: 'A nice thing',
    price: '$9.99',
  },
  {
    name: 'Product 2',
    desc: 'Another thing',
    price: '$3.45',
  },
  {
    name: 'Product 3',
    desc: 'Something else',
    price: '$6.51',
  },
  {
    name: 'Product 4',
    desc: 'Best thing of all',
    price: '$14.11',
  },
];

const addresses = ['1 MUI Drive', 'Reactville', 'Anytown', '99999', 'USA'];
const payments = [
  { name: 'Card type', detail: 'Visa' },
  { name: 'Card holder', detail: 'Mr John Smith' },
  { name: 'Card number', detail: 'xxxx-xxxx-xxxx-1234' },
  { name: 'Expiry date', detail: '04/2024' },
];
const DELTEITEMCART = gql`
  mutation deleteItemCart($input: InputItem) {
    deleteItemCart(inputItem: $input)
  }
`;
const CREATEORDER = gql`
  mutation ($input: InputOrder) {
    createOrder(inputOrder: $input) {
      orderId
    }
  }
`;
export default function Review(props) {
  const { data, handleDeleteProductInCart, paymentMethod } = props;
  const [createOrder] = useMutation(CREATEORDER, {
    onError: (err) => {
      console.log(err);
    },
  });
  const handleSubmitOrder = async (paymentMethod, cartId) => {
    const { data } = await createOrder({
      variables: {
        input: {
          cartId: data[0].cartId,
          paymentMethod,
        },
      },
    });
    if (data) {
      console.log(data);
    }
  };
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      <Typography variant="h4" sx={{ textAlign: 'center' }}>
        No product in cart
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Shipping
          </Typography>
          <Typography gutterBottom>John Smith</Typography>
          <Typography gutterBottom>{addresses.join(', ')}</Typography>
        </Grid>
        <Grid item container direction="column" xs={12} sm={6}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Payment details
          </Typography>
          <Grid container>
            {payments.map((payment) => (
              <React.Fragment key={payment.name}>
                <Grid item xs={6}>
                  <Typography gutterBottom>{payment.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom>{payment.detail}</Typography>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
          <Button
            variant="contained"
            onClick={() => handleSubmitOrder(paymentMethod, data[0].cartId)}
            sx={{ mt: 3, ml: 1 }}
          >
            Place order
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
