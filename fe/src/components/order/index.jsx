import * as React from 'react';
// import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import {
  Breadcrumbs,
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  MenuList,
  Modal,
  Paper,
  Popper,
  Select,
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
import Link from '@mui/material/Link';
import { gql, useQuery } from '@apollo/client';
import helperFn from '../../utils/helperFn';

// style table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

// seed trial data for table
function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];
const styleModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1200,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const theme = createTheme();

const options = ['A-Z', 'Z-A'];

const ORDERS = gql`
  query ListOrders($input: listOrdersBy) {
    listOrders(input: $input) {
      orderId
      paymentDate
      firstItem {
        id
        name
        price
      }
      totalItem
      totalAmount
    }
  }
`;

const DETAILORDER = gql`
  query OrderDetail($input: OrderId) {
    orderDetail(orderId: $input) {
      paymentDate
      orderDate
      product {
        name
        price
        thumbnail
        quantity
      }
      totalAmount
    }
  }
`;

const SORTS = [
  {
    name: 'amount',
    label: 'Amount: A -> Z',
    value: 'ASC',
  },
  {
    name: 'amount',
    label: 'Amount: Z -> A',
    value: 'DESC',
  },
  {
    name: 'date',
    label: 'Date: A -> Z',
    value: 'ASC',
  },
  {
    name: 'date',
    label: 'Date: Z -> A',
    value: 'DESC',
  },
];
export default function Order({ setLogin }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [displaySearch, setDisplaySearch] = React.useState('none');
  const [openButton, setOpenButton] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleClickOptions = () => {
    console.info(`You clicked ${options[selectedIndex]}`);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpenButton(false);
  };

  const handleToggle = () => {
    openButton ? setOpenButton(false) : setOpenButton(true);
  };

  const handleCloseOptions = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpenButton(false);
  };
  // ################################################

  const [orders, setOrders] = React.useState([]);
  const [orderId, setOrderId] = React.useState([]);
  const [optionSort, setOptionSort] = React.useState(0);
  const [orderProductByName, setOrderProductByName] = React.useState({
    name: 'amount',
    value: 'ASC',
  });
  const { data: dataOrders, error } = useQuery(
    ORDERS,
    {
      variables: {
        input: {
          [orderProductByName.name]: orderProductByName.value,
        },
      },
    },
    {
      onError: (err) => {
        helperFn.toastAlertFail(err.message);
      },
    }
  );
  React.useEffect(() => {
    if (dataOrders) {
      setOrders(dataOrders.listOrders);
    }
  }, [dataOrders]);

  //lisen toggle modal
  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = (orderId) => {
    setOpenModal(true);
    setOrderId(parseInt(orderId));
  };
  const handleCloseModal = () => setOpenModal(false);

  const { data: detailOrder } = useQuery(DETAILORDER, {
    variables: {
      input: {
        id: orderId,
      },
    },
  });

  if (error) <div>{error.message}</div>;
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
          <div role="presentation">
            <Breadcrumbs aria-label="breadcrumb">
              <Link underline="hover" color="inherit" href="/">
                Home
              </Link>
              <Typography color="text.primary">Orders</Typography>
            </Breadcrumbs>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'end',
            }}
          >
            <Button
              sx={{ alignItems: 'right', cursor: 'pointer', float: 'right' }}
              onClick={() => {
                displaySearch === 'none'
                  ? setDisplaySearch('flex')
                  : setDisplaySearch('none');
              }}
            >
              {' '}
              Filter
            </Button>
            <div
              style={{
                display: displaySearch,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search Product"
                inputProps={{ 'aria-label': 'search product' }}
              />

              <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
              </IconButton>
              <Typography>Sort By :</Typography>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={optionSort}
                label="Sort"
                onChange={(e) => {
                  const value = e.target.value;
                  setOptionSort(value);
                  setOrderProductByName(SORTS[value]);
                }}
              >
                {SORTS.map((option, index) => {
                  return (
                    <MenuItem key={index} value={index}>
                      {option.label}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
          </div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>No.</StyledTableCell>
                  <StyledTableCell align="right">
                    Completed Date
                  </StyledTableCell>
                  <StyledTableCell align="right">First Item</StyledTableCell>
                  <StyledTableCell align="right">Total Item</StyledTableCell>
                  <StyledTableCell align="right">Total Amount</StyledTableCell>
                  <StyledTableCell align="right">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.length > 0 &&
                  orders.map((order, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell component="th" scope="row">
                        {index + 1}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {order.paymentDate}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {order.firstItem.name}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {order.totalItem}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {order.totalAmount}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <Button
                          variant="primary"
                          onClick={() => handleOpenModal(order.orderId)}
                        >
                          View
                        </Button>
                        <Modal
                          open={openModal}
                          onClose={handleCloseModal}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                          BackdropProps={{
                            style: { backgroundColor: 'rgba(0,0,0,0.1)' },
                          }}
                        >
                          <Box sx={styleModal}>
                            <Grid container>
                              <Grid item xs={8} align="center">
                                <Typography
                                  variant="h5"
                                  sx={{
                                    backgroundColor: '#f3f3f3',
                                    color: '#009688',
                                  }}
                                >
                                  Ship To My Address
                                </Typography>
                                <TableContainer component={Paper}>
                                  <Table
                                    sx={{ minWidth: 700 }}
                                    aria-label="customized table"
                                  >
                                    <TableHead>
                                      <TableRow>
                                        <StyledTableCell>
                                          All Item
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                          Product Name
                                        </StyledTableCell>
                                        <StyledTableCell>
                                          Thumbnail
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                          Quantity
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                          Price
                                        </StyledTableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {/* {rows.map((row) => ( */}
                                      {detailOrder &&
                                        detailOrder.orderDetail.product.map(
                                          (item, index) => (
                                            <StyledTableRow>
                                              <StyledTableCell
                                                component="th"
                                                scope="row"
                                              >
                                                {index + 1}
                                              </StyledTableCell>
                                              <StyledTableCell align="right">
                                                {item.name}
                                              </StyledTableCell>
                                              <StyledTableCell>
                                                <img
                                                  style={{
                                                    width: '25%',
                                                  }}
                                                  src={item.thumbnail}
                                                ></img>
                                              </StyledTableCell>
                                              <StyledTableCell align="right">
                                                {item.quantity}
                                              </StyledTableCell>
                                              <StyledTableCell align="right">
                                                {item.price}
                                              </StyledTableCell>
                                            </StyledTableRow>
                                          )
                                        )}
                                      {/* ))} */}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </Grid>
                              <Grid
                                item
                                xs={4}
                                align="left"
                                sx={{ backgroundColor: '#dedede' }}
                              >
                                <Container>
                                  <Typography
                                    variant="h5"
                                    sx={{ color: '#009688' }}
                                  >
                                    Seller Shipping From
                                  </Typography>
                                  {detailOrder && (
                                    <Typography>
                                      <strong>Order Date:</strong>{' '}
                                      {detailOrder.orderDetail.orderDate}
                                    </Typography>
                                  )}
                                  {detailOrder && (
                                    <Typography>
                                      <strong>Payment Date:</strong>{' '}
                                      {detailOrder.orderDetail.paymentDate}
                                    </Typography>
                                  )}

                                  {detailOrder && (
                                    <Typography>
                                      <strong>Completed Date:</strong> 201900
                                      Shanghai China
                                    </Typography>
                                  )}

                                  {detailOrder && (
                                    <Typography>
                                      <strong>Total amount:</strong>{' '}
                                      {detailOrder.orderDetail.totalAmount}
                                    </Typography>
                                  )}
                                </Container>
                              </Grid>
                            </Grid>
                          </Box>
                        </Modal>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
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
      </Box>
      {/* End footer */}
    </ThemeProvider>
  );
}
