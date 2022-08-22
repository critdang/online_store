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
// const GETCART = gql`
//   query GetCart {
//     getCart {
//       name
//       description
//       quantity
//       thumbnail
//     }
//   }
// `;
const DELTEITEMCART = gql`
  mutation deleteItemCart($input: InputItem) {
    deleteItemCart(inputItem: $input)
  }
`;

export default function Review(props) {
  const { data, handleDeleteProductInCart } = props;
  // const [deleteItemCart] = useMutation(DELTEITEMCART, {
  //   onError: (err) => {
  //     console.log(err);
  //   },
  // });
  // const [cartItems, setCartItems] = React.useState();
  // console.log(
  //   '🚀 ~ file: Review.jsx ~ line 54 ~ Review ~ cartItems',
  //   cartItems
  // );
  // const { loading, error, data } = useQuery(GETCART, {
  //   onError: (err) => {
  //     helperFn.toastAlertFail(err.message);
  //   },
  // });
  // React.useEffect(() => {
  //   if (data) {
  //     console.log(data.getCart[0].name);
  //     setCartItems(data.getCart);
  //   }
  // }, [data]);
  // const handleDeleteProductInCart = async (productId) => {
  //   console.log(productId);
  //   try {
  //     const { data } = await deleteItemCart({
  //       variables: {
  //         input: {
  //           productId,
  //         },
  //       },
  //     });
  //     if (data) {
  //       console.log(data);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      <List disablePadding>
        {data &&
          data.map((item) => (
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
                <ListSubheader variant="body2">{item.quantity}</ListSubheader>
                <Typography variant="body2">{item.price}</Typography>
                <Button
                  onClick={() => handleDeleteProductInCart(item.productId)}
                >
                  Delete
                </Button>
              </div>
            </ListItem>
          ))}

        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Shipping" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Free
          </Typography>
        </ListItem>

        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            $34.06
          </Typography>
        </ListItem>
      </List>
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
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
