import * as React from 'react';
import { AppBar, Button, Grid, Link, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { Container } from "@mui/system";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';

export default function NavBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
      <AppBar position="relative" >
        <Toolbar >
          <Grid container justify="space-between">
            <Link sx={{color:"white", textDecoration:'none'}} href= "http://localhost:3000">
              <Typography variant="h6" color="inherit" noWrap>
                Huy's store
              </Typography>
            
            </Link>
          
          </Grid>
          <Container
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'right',
            }}
          >
          <div style={{display: 'flex', alignItems: 'center'}}>
            <Button
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              sx={{color:"white", marginLeft: "20px", "&:hover": {
                opacity: "50%",
              },}}
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
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>

            <Link href="http://localhost:3000/order">
              <Button underline="none" sx={{color:"white"}}>
                Orders
              </Button>
            </Link>
            <Link href="http://localhost:3000/profile">
              <Button underline="none" sx={{color:"white"}}>
                <PersonIcon></PersonIcon>
              </Button>
            </Link>
            <Link  href="http://localhost:3000/checkout">
              <ShoppingCartIcon cursor="pointer" sx={{color:"transparent",stroke: 'white',verticalAlign: 'bottom'}} > Cart</ShoppingCartIcon>
            </Link>
          </div>

          </Container>
        </Toolbar>
      </AppBar>
  )
}