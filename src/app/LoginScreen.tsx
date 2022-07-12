import {
  Box,
  Button,
  Container,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import { IUser, signInEndpoint } from './backend';

const useStyles = makeStyles({
  error: {
    backgroundColor: 'rgb(253,236,234)',
    borderradius: '4px',
    padding: '16px',
    margin: '16px 0',
  },
});
interface ILoginScreenProps {
  onSignIn: (user: IUser) => void;
}

export default function LoginScreen(props: ILoginScreenProps) {
  const classes = useStyles();
  const [email, setEmail] = useState('danilo@email.com');
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState('');

  function signIn(evt: React.FormEvent) {
    evt.preventDefault();
    signInEndpoint(email, password).then(props.onSignIn, e => {
      setError('E-mail não encontrado ou senha incorreta');
    });
  }

  return (
    <Container maxWidth="sm">
      <h1>Agenda react</h1>
      <p>Digite email e senha para entrar no sistema </p>
      <form onSubmit={signIn}>
        <TextField
          margin="normal"
          label="E=mail"
          fullWidth
          variant="outlined"
          value={email}
          onChange={evt => setEmail(evt.target.value)}
        />
        <TextField
          type="password"
          margin="normal"
          label="E=mail"
          fullWidth
          variant="outlined"
          value={password}
          onChange={evt => setPassword(evt.target.value)}
        />
        {error && <div className={classes.error}>{error}</div>}
        <Box textAlign="right" marginTop="16px">
          <Button type="submit" variant="contained" color="primary">
            Entrar
          </Button>
        </Box>
      </form>
    </Container>
  );
}

// value={event.date}
// onChange={evt => setEvent({ ...event, date: evt.target.value })}
