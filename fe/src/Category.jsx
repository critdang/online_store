import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import MenuItem from '@mui/material/MenuItem';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';

import {
  ButtonGroup,
  ClickAwayListener,
  Grow,
  MenuList,
  Modal,
  Paper,
  Popper,
  TableCell,
  tableCellClasses,
  TableRow,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import styled from '@emotion/styled';
import Slider from 'react-slick';
import { gql, useMutation, useQuery } from '@apollo/client';

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

const theme = createTheme();

const options = ['A-Z', 'Z-A'];

const PRODUCTS = gql`
  query {
    products(isDefault: true) {
      id
      name
      description
      amount
      price
      productImage {
        id
        href
      }
      categoryProduct {
        category {
          name
        }
      }
    }
  }
`;
const PRODUCTSIMAGES = gql`
  query {
    products {
      id
      name
      description
      amount
      price
      productImage {
        id
        href
      }
      categoryProduct {
        category {
          name
        }
      }
    }
  }
`;

const PRODUCTDETAIL = gql`
  query productDetail($input: ProductId) {
    productDetail(productId: $input) {
      id
      name
      description
      price
      amount
      productImage {
        id
        href
      }
    }
  }
`;
export default function Home(props, { setLogin }) {
  const [input, setInput] = React.useState();
  const { loading, error, data } = useQuery(PRODUCTS);

  const [products, setProducts] = React.useState([]);
  React.useEffect(() => {
    if (data) {
      // console.log(data);
      setProducts(data.products);
    }
  }, [data]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const addToCart = () => {
    props.addToCart();
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [displaySearch, setDisplaySearch] = React.useState('none');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [openButton, setOpenButton] = React.useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const anchorRef = React.useRef(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
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

  //lisen toggle modal
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [openModal, setOpenModal] = React.useState(false);
  const [idProduct, setIdProduct] = React.useState();
  const {
    data: detailData,
    loading: loadingProductId,
    error: errorProductId,
    refetch,
  } = useQuery(PRODUCTDETAIL, {
    variables: {
      input: {
        productId: idProduct,
      },
    },
  });
  if (detailData) console.log(detailData);
  const handleOpenModal = (id) => {
    setOpenModal(true);
    setIdProduct(parseInt(id));
    refetch();
  };
  const handleCloseModal = () => setOpenModal(false);

  //setting slick
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error! {error.message}</div>;
  // if (loadingProductId) return <div>Loading...</div>;
  // if (errorProductId) return <div>Error! {errorProductId.message}</div>;
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
        <Container
          sx={{
            py: 5,
          }}
        >
          {/* End hero unit */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography
              variant="h3"
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {' '}
              Trang phuc
            </Typography>
            <div>
              <Button
                sx={{
                  alignItems: 'center',
                  cursor: 'pointer',
                  justifyContent: 'end',
                  display: 'flex',
                  width: '5%',
                }}
                onClick={() => {
                  displaySearch === 'none'
                    ? setDisplaySearch('flex')
                    : setDisplaySearch('none');
                }}
              >
                {' '}
                Filter
              </Button>
            </div>
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
              <Typography>Sort By Name:</Typography>
              <React.Fragment>
                <ButtonGroup
                  variant="contained"
                  ref={anchorRef}
                  aria-label="split button"
                >
                  <Button onClick={handleClickOptions}>
                    {options[selectedIndex]}
                  </Button>
                  <Button
                    size="small"
                    aria-controls={open ? 'split-button-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-label="select merge strategy"
                    aria-haspopup="menu"
                    onClick={handleToggle}
                  >
                    <ArrowDropDownIcon />
                  </Button>
                </ButtonGroup>
                <Popper
                  open={openButton}
                  anchorEl={anchorRef.current}
                  role={undefined}
                  transition
                  disablePortal
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin:
                          placement === 'bottom'
                            ? 'center top'
                            : 'center bottom',
                      }}
                    >
                      <Paper>
                        <ClickAwayListener onClickAway={handleCloseOptions}>
                          <MenuList id="split-button-menu" autoFocusItem>
                            {options.map((option, index) => (
                              <MenuItem
                                key={option}
                                selected={index === selectedIndex}
                                onClick={(event) =>
                                  handleMenuItemClick(event, index)
                                }
                              >
                                {option}
                              </MenuItem>
                            ))}
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </React.Fragment>
            </div>
          </div>
          <Grid container spacing={3} marginTop={5}>
            {products.map((product, index) => (
              <Grid item key={index} xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: 'none',
                    position: 'relative',
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      // 16:9
                      pt: '30%',
                    }}
                    image={
                      product.productImage[0]
                        ? product.productImage[0].href
                        : 'https://source.unsplash.com/random'
                    }
                    alt="random"
                  />
                  <AddCircleOutlineIcon
                    sx={{
                      position: 'absolute',
                      bottom: '14%',
                      width: '100%',
                      cursor: 'pointer',
                      fontSize: '30px',
                      '&:hover': {
                        color: 'white',
                      },
                    }}
                    onClick={addToCart}
                  ></AddCircleOutlineIcon>
                  <Container>
                    <Typography variant="body2" component="h2">
                      {product.name}
                    </Typography>
                  </Container>
                  <Container
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <CardActions>
                      <Button
                        size="small"
                        key={index}
                        onClick={() => handleOpenModal(product.id)}
                      >
                        View
                      </Button>
                    </CardActions>
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
                              Product's Image Detail
                            </Typography>
                            <Slider {...settings}>
                              <div>
                                <h2>hi</h2>
                              </div>
                              <div>
                                <img
                                  src="https://source.unsplash.com/random"
                                  alt="anh"
                                  style={{ width: '60%' }}
                                />
                              </div>
                            </Slider>
                          </Grid>
                          <Grid
                            item
                            xs={4}
                            align="left"
                            sx={{ backgroundColor: '#dedede' }}
                          >
                            {detailData && (
                              <Container>
                                <Typography
                                  variant="h5"
                                  sx={{ color: '#009688' }}
                                >
                                  Detail product
                                </Typography>
                                <Typography>
                                  <strong>Name:</strong>{' '}
                                  {detailData.productDetail.name}
                                </Typography>
                                <Typography>
                                  <strong>Price:</strong>{' '}
                                  {detailData.productDetail.price}
                                </Typography>
                                <Typography>
                                  <strong>Description:</strong>{' '}
                                  {detailData.productDetail.description}
                                </Typography>
                                <Typography>
                                  <strong>Remaining amount:</strong>{' '}
                                  {detailData.productDetail.amount}
                                </Typography>
                                <Button variant="contained" onClick={addToCart}>
                                  Add
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="error"
                                  onClick={handleCloseModal}
                                >
                                  Close
                                </Button>
                              </Container>
                            )}
                          </Grid>
                        </Grid>
                      </Box>
                    </Modal>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        backgroundColor: 'yellow',
                      }}
                    >
                      {product.price}
                    </Typography>
                  </Container>
                </Card>
              </Grid>
            ))}
          </Grid>
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
