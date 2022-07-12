import {
  Avatar,
  IconButton,
  Icon,
  Button,
  Box,
  makeStyles,
} from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useState } from 'react';
import { useAuthContext } from './authContext';
import { signOutEndpoint } from './backend';

const useStyles = makeStyles({
  userDetails: {
    borderBottom: '1px solid rgb(224,224,224)',
    padding: '16px',
    display: 'flex',
    marginBottom: '8px',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      marginBottom: '8px',
    },
  },
});

export default function UserMenu() {
  const { user, onSignOut } = useAuthContext();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function signOut() {
    signOutEndpoint();
    onSignOut();
  }
  return (
    <div>
      <IconButton
        aria-label="Próximo mês"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <Avatar>
          <Icon>person</Icon>
        </Avatar>
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <Box className={classes.userDetails}>
          <Avatar>
            <Icon>person</Icon>
          </Avatar>
          <div> {user.name}</div>
          <small>{user.email}</small>
        </Box>

        <MenuItem onClick={signOut}>Sair</MenuItem>
      </Menu>
    </div>
  );
}
