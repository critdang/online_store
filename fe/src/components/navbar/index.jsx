import * as React from 'react';
import {
  AppBar,
  Badge,
  Button,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
} from '@mui/material';
import { Container } from '@mui/system';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';

const CATEGORIES = gql`
  query {
    categories {
      id
      name
      thumbnail
      description
    }
  }
`;
export default function NavBar(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [categories, setCategories] = React.useState([]);

  const { data, loading, error } = useQuery(CATEGORIES);
  React.useEffect(() => {
    if (data) {
      setCategories(data.categories);
    }
  }, [data]);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const itemCart = props.itemCart;

  // style badgeContent
  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: -4,
      top: 5,
      padding: '0 4px',
    },
  }));

  function notificationsLabel(count) {
    if (count === 0) {
      return 'no notifications';
    }
    if (count > 99) {
      return 'more than 99 notifications';
    }
    return `${count} notifications`;
  }

  function handleLogout() {
    localStorage.removeItem('user');
  }

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: 'white',
        color: 'black',
        boxShadow: '0px 0px 0px 0px',
        paddingTop: '10px',
      }}
    >
      <Toolbar>
        <Grid container justify="space-between">
          <Link sx={{ color: 'white', textDecoration: 'none' }} to="/">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/2560px-H%26M-Logo.svg.png"
              style={{ width: '130px' }}
            ></img>
          </Link>
        </Grid>
        <Container
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'right',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Button sx={{ color: 'black', textDecoration: 'none' }}>
                Home
              </Button>
            </Link>
            <Button
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              sx={{
                color: 'black',
                '&:hover': {
                  opacity: '50%',
                },
              }}
            >
              Category
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <Link
                to={`/categories`}
                style={{ textDecoration: 'none', color: 'black' }}
              >
                <MenuItem onClick={handleClose} sx={{ color: 'black' }}>
                  All
                </MenuItem>
              </Link>
              {categories.map((category, index) => (
                <Link
                  to={`/category/${category.name}${category.id}`}
                  style={{ textDecoration: 'none', color: 'black' }}
                >
                  <MenuItem
                    onClick={handleClose}
                    sx={{ color: 'black' }}
                    key={index}
                  >
                    {category.name}
                  </MenuItem>
                </Link>
              ))}
            </Menu>
            <div>
              <Link
                to="/order"
                style={{ textDecoration: 'none', color: 'black' }}
              >
                <Button sx={{ color: 'black', textDecoration: 'none' }}>
                  Orders
                </Button>
              </Link>
              <Link to="/profile">
                <Button underline="none" sx={{ color: 'black' }}>
                  <PersonIcon></PersonIcon>
                </Button>
              </Link>
            </div>

            <Link to="/checkout">
              <IconButton aria-label={notificationsLabel(100)}>
                <StyledBadge badgeContent={itemCart} color="success">
                  <ShoppingCartIcon
                    cursor="pointer"
                    sx={{
                      color: 'white',
                      stroke: 'black',
                      verticalAlign: 'bottom',
                    }}
                  >
                    {' '}
                    Cart
                  </ShoppingCartIcon>
                </StyledBadge>
              </IconButton>
            </Link>
            <Link
              to="/login"
              style={{ textDecoration: 'none', paddingLeft: '30px' }}
            >
              <Button variant="outlined" color="error" onClick={handleLogout}>
                Log out
              </Button>
            </Link>
          </div>
        </Container>
      </Toolbar>
    </AppBar>
  );
}
