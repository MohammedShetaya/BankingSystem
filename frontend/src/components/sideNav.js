import React from 'react';
import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import api from '@/pages/api/axios';

const NavDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    boxSizing: 'border-box',
    width: 240,
    position: 'fixed',
    zIndex: 1,
    height: '100%',
  },
}));

const NavList = styled(List)(({ theme }) => ({
  paddingTop: theme.spacing(4),
}));

const NavListItem = styled(ListItem)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const NavListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
}));



export default function SideNav() {
    const router = useRouter();
    const handleLogOutClick = () => {
        localStorage.removeItem('token');
        router.push('/login'); // Redirect to login page
    }


  return (
    <NavDrawer variant="permanent">
      <NavList style={{marginLeft:"5%"}}>
        <NavListItem style={{marginTop:"10%"}} button>
          <NavListItemIcon>
            <AccountCircleIcon />
          </NavListItemIcon>
          <ListItemText primary="Profile" />
        </NavListItem>
        <NavListItem button onClick={handleLogOutClick}>
          <NavListItemIcon>
            <LogoutIcon />
          </NavListItemIcon>
          <ListItemText primary="Logout" />
        </NavListItem>
      </NavList>
    </NavDrawer>
  );
}


