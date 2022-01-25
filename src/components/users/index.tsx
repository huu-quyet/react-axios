import { styled } from '@mui/material/styles';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { fetchData } from '../axios';
import { IUser } from '../config/interface';
import { useHistory } from 'react-router-dom';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    fontSize: '1rem',
    borderBottom: '1px solid #111',
    padding: '8px',
  },

  [`&.${tableCellClasses.body}`]: {
    fontSize: '1rem',
    padding: '8px',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  cursor: 'pointer',
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },

  '&:hover': {
    background: theme.palette.grey['300'],
  },
}));

const TableUser: React.FC<any> = () => {
  const history = useHistory();
  const [users, setUsers] = useState([]);

  const fetchUsers = async (url: string) => {
    try {
      const data = await fetchData(url);
      if (data.statusText !== 'OK') {
        throw new Error('Something went wrong!');
      }

      setUsers(data.data);
    } catch (error) {}
  };

  const handleClick = (event: React.MouseEvent<HTMLTableRowElement>) => {
    history.push(`users/${event.currentTarget.dataset.set}`);
  };

  useEffect(() => {
    fetchUsers('/users');
  }, []);

  return (
    <Container maxWidth="xl">
      <TableContainer sx={{ padding: '0 6rem' }}>
        <Typography
          sx={{ marginTop: '2rem', fontSize: '2rem', fontWeight: '700' }}
        >
          Users
        </Typography>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">id</StyledTableCell>
              <StyledTableCell align="left">Name</StyledTableCell>
              <StyledTableCell align="left">UserName</StyledTableCell>
              <StyledTableCell align="left">Email</StyledTableCell>
              <StyledTableCell align="left">Phone</StyledTableCell>
              <StyledTableCell align="left">Website</StyledTableCell>
              <StyledTableCell align="left">City</StyledTableCell>
              <StyledTableCell align="left">Company</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user: IUser) => (
              <StyledTableRow
                data-set={user.id}
                onClick={handleClick}
                key={user.id}
              >
                <StyledTableCell align="left">{user.id}</StyledTableCell>
                <StyledTableCell align="left">{user.name}</StyledTableCell>
                <StyledTableCell align="left">{user.username}</StyledTableCell>
                <StyledTableCell align="left">{user.email}</StyledTableCell>
                <StyledTableCell align="left">{user.phone}</StyledTableCell>
                <StyledTableCell align="left">{user.website}</StyledTableCell>
                <StyledTableCell align="left">
                  {user.address.city}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {user.company.name}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default TableUser;
