'use client';

import { useSelector } from 'react-redux';
import Link from 'next/link';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

export default function Sidebar() {
  const { user } = useSelector((state) => state.auth);

  const getMenuItems = () => {
    switch (user?.role) {
      case 'ADMIN':
        return [
          { text: 'Manage Users', href: '/dashboard/users' },
          { text: 'Manage Orders', href: '/dashboard/orders' },
          { text: 'Categories', href: '/dashboard/categories' }
        ];
      case 'ARTIST':
        return [
          { text: 'My Artworks', href: '/dashboard/artworks' },
          { text: 'Orders', href: '/dashboard/orders' },
          { text: 'Profile', href: '/dashboard/profile' }
        ];
      default:
        return [
          { text: 'My Orders', href: '/dashboard/orders' },
          { text: 'Profile', href: '/dashboard/profile' }
        ];
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          marginTop: '64px' // height of AppBar
        },
      }}
    >
      <List>
        {getMenuItems().map((item) => (
          <ListItem button key={item.text} component={Link} href={item.href}>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}