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
import { useParams } from 'react-router-dom';
import Link from '@mui/material/Link';
import {
  Breadcrumbs,
  Modal,
  TableCell,
  tableCellClasses,
  TableRow,
} from '@mui/material';
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

const theme = createTheme();

const options = ['A-Z', 'Z-A'];

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

const PRODUCTBYCATEGORY = gql`
  query FilterProductByCategory($input: CategoryId) {
    filterProductByCategory(categoryId: $input) {
      id
      name
      price
      description
      productImage {
        href
      }
    }
  }
`;

export default function Home(props, { setLogin }) {
  const [input, setInput] = React.useState();
  const [products, setProducts] = React.useState([]);
  let { categoryId, categoryName } = useParams();
  categoryId = parseInt(categoryId);

  const { loading, error, data } = useQuery(PRODUCTBYCATEGORY, {
    variables: {
      input: {
        categoryId,
      },
    },
  });
  React.useEffect(() => {
    if (data) {
      setProducts(data.filterProductByCategory);
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
  if (error) console.log(error.message);
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
          <div role="presentation">
            <Breadcrumbs aria-label="breadcrumb">
              <Link underline="hover" color="inherit" href="/">
                Home
              </Link>
              <Typography color="text.primary">{categoryName}</Typography>
            </Breadcrumbs>
          </div>
          {/* End hero unit */}
          <div>
            <Typography
              variant="h3"
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {categoryName}
            </Typography>
          </div>
          {data === undefined ? (
            <Typography sx={{ marginTop: '100px' }} align="center" variant="h4">
              {' '}
              Updating Product soon ...
            </Typography>
          ) : (
            <Grid container spacing={3} marginTop={5}>
              {products.length > 0 &&
                products.map((product, index) => (
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
                                    <Button
                                      variant="contained"
                                      onClick={addToCart}
                                    >
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
          )}
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
