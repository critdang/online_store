import * as React from 'react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import { Button, ListSubheader } from '@mui/material';
import { gql, useQuery, useMutation } from '@apollo/client';
import helperFn from '../../utils/helperFn';
import { useDispatch, useSelector } from 'react-redux';
import { cartItem, clearCart, deleteItem } from '../../reducers/carts.slice';

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
    createOrder(inputOrder: $input)
  }
`;
export default function Review(props) {
  console.log('🚀 ~ file: Review.jsx ~ line 31 ~ Review ~ props', props);
  const { data: dataCart, paymentMethod } = props;
  console.log('🚀 ~ file: Review.jsx ~ line 32 ~ Review ~ dataCart', dataCart);

  const DELTEITEMCART = gql`
    mutation deleteItemCart($input: InputItem) {
      deleteItemCart(inputItem: $input)
    }
  `;
  const [deleteItemCart] = useMutation(DELTEITEMCART, {
    onError: (err) => {
      console.log(err);
    },
  });

  const [createOrder] = useMutation(CREATEORDER, {
    onError: (err) => {
      console.log(err);
    },
  });

  const handleSubmitOrder = async (paymentMethod, cartId) => {
    const { data } = await createOrder({
      variables: {
        input: {
          cartId: dataCart[0].cartId,
          paymentMethod,
        },
      },
    });
    if (data) {
      dispatch(clearCart());
      helperFn.toastAlertSuccess(data.createOrder);
    }
  };
  const dispatch = useDispatch();

  const handleDeleteProductInCart = async (productId) => {
    try {
      const { data } = await deleteItemCart({
        variables: {
          input: {
            productId,
          },
        },
      });
      if (data) {
        console.log(data);
        await dispatch(deleteItem(productId));
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      {dataCart.length > 0 ? (
        dataCart.map((item) => (
          <List disablePadding>
            <ListItem key={item.name} sx={{ py: 1, px: 0 }}>
              <img
                src={item.thumbnail}
                style={{ width: '150px', marginRight: '10px' }}
              ></img>
              <ListItemText primary={item.name} secondary={item.description} />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <button>+</button>
                  <ListSubheader variant="body2">{item.quantity}</ListSubheader>
                  <button>-</button>
                </div>
                <Typography variant="body2">{item.price}</Typography>
                <Button
                  onClick={() => handleDeleteProductInCart(item.productId)}
                >
                  Delete
                </Button>
              </div>
            </ListItem>
          </List>
        ))
      ) : (
        <Typography variant="h4" sx={{ textAlign: 'center', color: 'red' }}>
          No product in cart
        </Typography>
      )}
      <ListItem sx={{ py: 1, px: 0 }}>
        <ListItemText primary="Shipping" />
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Free
        </Typography>
      </ListItem>

      {/* <ListItem sx={{ py: 1, px: 0 }}>
        <ListItemText primary="Total" />
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          $34.06
        </Typography>
      </ListItem> */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Payment method:
            <Typography gutterBottom>{paymentMethod}</Typography>
          </Typography>
          {/* <Grid item xs={6}></Grid> */}
        </Grid>
        <Grid item container direction="column" xs={12} sm={12}>
          <Button
            variant="contained"
            onClick={() => handleSubmitOrder(paymentMethod, dataCart[0].cartId)}
            sx={{ mt: 3, ml: 1 }}
          >
            Place order
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
