import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { gql, useQuery } from '@apollo/client';
import helperFn from '../../utils/helperFn';
import {
  Breadcrumbs,
  IconButton,
  InputBase,
  MenuItem,
  Modal,
  Select,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const theme = createTheme();

// const CATEGORIES = gql`
//   query {
//     categories {
//       id
//       name
//       thumbnail
//       description
//     }
//   }
// `;
const CATEGORIES = gql`
  query ListCategories($input: listCategoriesBy) {
    listCategories(input: $input) {
      id
      name
      thumbnail
      description
      categoryProduct {
        productId
      }
    }
  }
`;

const CATEGORY = gql`
  query listCategory($input: CategoryId) {
    listCategory(categoryId: $input) {
      id
      name
      description
      thumbnail
      categoryProduct {
        productId
      }
    }
  }
`;

const SORTS = [
  {
    name: 'name',
    label: 'Name: A -> Z',
    value: 'ASC',
  },
  {
    name: 'name',
    label: 'Name: Z -> A',
    value: 'DESC',
  },
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
];
export default function Album() {
  const [displaySearch, setDisplaySearch] = React.useState('none');
  const [optionSort, setOptionSort] = React.useState(0);
  const [orderProductByName, setOrderProductByName] = React.useState({
    name: 'name',
    value: 'ASC',
  });
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const [categories, setCategories] = React.useState([]);
  const [categoryDetail, setCategory] = React.useState([]);

  const [idCategory, setIdCategory] = React.useState([]);

  // Categories
  const { data } = useQuery(
    CATEGORIES,
    {
      variables: {
        input: {
          [orderProductByName.name]: orderProductByName.value,
        },
      },
    },
    {
      onError: (err) => {
        console.log(err);
        helperFn.toastAlertFail(err.message);
      },
    }
  );
  React.useEffect(() => {
    if (data) setCategories(data.listCategories);
  }, [data]);

  // Detail categories
  const handleCategory = (id) => {
    setOpen(true);
    setIdCategory(parseInt(id));
  };

  const { data: dataCategory } = useQuery(
    CATEGORY,
    {
      variables: {
        input: {
          categoryId: idCategory,
        },
      },
    },
    {
      onError: (err) => {
        console.log(err);
      },
    }
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <Container
          sx={{
            py: 5,
          }}
        >
          <Box
            sx={{
              bgcolor: 'background.paper',
              pt: 8,
              pb: 6,
            }}
          >
            <div role="presentation">
              <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="/">
                  Home
                </Link>
                <Typography color="text.primary">Categories</Typography>
              </Breadcrumbs>
            </div>

            <Container maxWidth="sm">
              <Typography
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom
              >
                Categories
              </Typography>
              <Typography
                variant="h5"
                align="center"
                color="text.secondary"
                paragraph
              >
                Something short and leading about the collection below—its
                contents, the creator, etc. Make it short and sweet, but not too
                short so folks don&apos;t simply skip over it entirely.
              </Typography>
              <Stack
                sx={{ pt: 4 }}
                direction="row"
                spacing={2}
                justifyContent="center"
              >
                {/* <Button variant="contained">Home</Button> */}
              </Stack>
            </Container>
          </Box>
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
          <Container>
            {/* End hero unit */}
            <Grid container spacing={4}>
              {categories.map((category, index) => (
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
                      image={category.thumbnail}
                      alt="random"
                    />
                    <Container>
                      <Typography variant="body2" component="h2">
                        {category.name}
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
                          onClick={() => handleCategory(category.id)}
                        >
                          View
                        </Button>
                      </CardActions>
                      <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        BackdropProps={{
                          style: { backgroundColor: 'rgba(0,0,0,0.1)' },
                        }}
                      >
                        <Box sx={style}>
                          {dataCategory && (
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
                                <div>
                                  <img
                                    src={dataCategory.listCategory.thumbnail}
                                    alt="anh"
                                    style={{ width: '60%' }}
                                  />
                                </div>
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
                                    Detail product
                                  </Typography>
                                  <Typography>
                                    <strong>Name:</strong>{' '}
                                    {dataCategory.listCategory.name}
                                  </Typography>
                                  <Typography>
                                    <strong>Description:</strong>{' '}
                                    {dataCategory.listCategory.description}
                                  </Typography>
                                  <Typography>
                                    <strong>Product Quantity:</strong>{' '}
                                    {
                                      dataCategory.listCategory.categoryProduct
                                        .length
                                    }
                                  </Typography>
                                  <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={handleClose}
                                  >
                                    Close
                                  </Button>
                                </Container>
                              </Grid>
                            </Grid>
                          )}
                        </Box>
                      </Modal>
                      {/* <Typography
                      sx={{
                        fontSize: '14px',
                        backgroundColor: 'yellow',
                      }}
                    >
                      Show Products
                    </Typography> */}
                    </Container>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
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
