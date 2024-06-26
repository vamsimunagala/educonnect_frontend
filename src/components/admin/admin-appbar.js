import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Avatar, Box, styled } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '10px',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const UserInfo = styled('div')(({ theme }) => ({
  marginLeft: '10px',
  color: theme.palette.text.secondary,
}));

const CustomAppBar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [adminDetails, setAdminDetails] = useState({ username: 'Admin', avatarUrl: '/default-avatar.jpg' });

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const response = await axios.get('https://bored-constantine-demo1234r5t.koyeb.app/appbar-userdetails', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.data.data) {
          setAdminDetails({
            username: response.data.data.name,
            avatarUrl: response.data.data.profile_picture_url || '/default-avatar.jpg',
          });
        }
      } catch (error) {
        console.error('Error fetching admin details:', error);
      }
    };

    fetchAdminDetails();
  }, []);

  const open = Boolean(anchorEl);
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" noWrap component={Link} to="/admin-dashboard" sx={{ textDecoration: 'none', color: 'inherit' }}>
            EduConnect Admin
          </Typography>
        </Box>
        <IconButton onClick={handleMenu} size="large" edge="end" color="inherit">
          <Avatar alt={adminDetails.username} src={adminDetails.avatarUrl} />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <UserHeader>
            <Avatar alt={adminDetails.username} src={adminDetails.avatarUrl} />
            <UserInfo>
              <Typography variant="subtitle1">{adminDetails.username}</Typography>
            </UserInfo>
          </UserHeader>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
