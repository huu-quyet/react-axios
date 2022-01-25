import { Box, Container } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  BrowserRouter,
  NavLink,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import './App.css';
import TableUser from './components/users';
import UserInfo from './components/users/userDetail';
import Photos from './components/photos';

const theme = createTheme({
  palette: {
    success: {
      main: '#198754',
    },
  },

  typography: {
    button: {
      fontSize: '1rem',
      textTransform: 'capitalize',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 700,
    },

    h4: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: '#0acdf0',
    },
  },
});

const useStyles: any = makeStyles({
  header: {
    background: '#212529',
    width: '100vw',
  },

  container: {
    padding: '1rem 6rem',

    '& a': {
      color: '#fff',
      textDecoration: 'none',
      marginRight: '2rem',
      opacity: 0.6,
    },
  },

  active: {
    opacity: '1 !important',
    fontWeight: '600',
  },
});

function App() {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Container className={classes.header} maxWidth="xl">
          <Box className={classes.container} position="static">
            <NavLink activeClassName={classes.active} to="/users">
              Users
            </NavLink>
            <NavLink activeClassName={classes.active} to="/photos">
              Photos
            </NavLink>
          </Box>
        </Container>
        <Switch>
          <Route exact path="/">
            <Redirect to="/users" />
          </Route>
          <Route exact path="/users">
            <TableUser />
          </Route>
          <Route exact path="/users/:id">
            <UserInfo />
          </Route>
          <Route exact path="/photos">
            <Photos />
          </Route>
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
