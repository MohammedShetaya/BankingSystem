  import { useEffect, useState } from 'react';
  import Head from 'next/head';
  import { useRouter } from 'next/router';
  import {
      Table,
      TableBody,
      TableCell,
      TableContainer,
      TableHead,
      Box,
      Button,
      Stack,
      TableRow,
      Paper,
      TextField,
      Toolbar,
      Grid,
      Typography
    } from '@mui/material';
  import {  styled } from '@mui/material/styles';
  import { tableCellClasses } from '@mui/material/TableCell';
  import api from './api/axios';
  import SideNav from '@/components/sideNav';


  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));
      
  const columns = [
    { id: 'total_amount', label: 'Amount With Interest $', minWidth: 170 },
    { id: 'interest', label: 'Interest Rate %', minWidth: 150 },
    {
      id: 'created_at',
      label: 'Accepted At',
      minWidth: 170,
      align: 'right',
    } 
  ];





  const Home = () => {

      const router = useRouter();
      const [customerLoanRequests, setCustomerLoanRequests] = useState([]);
      const [customerLoans, setCustomerLoans] = useState([]);
      const [page, setPage] = useState(0);
      const [rowsPerPage, setRowsPerPage] = useState(10);
    

      useEffect(() => {
        const token = localStorage.getItem('token');
        const customer_id = localStorage.getItem('customer_id');
        
        if (!token) 
          router.push('/login'); // Redirect to login page
        
        // validate the token
        api.post("validateToken/", {

        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {

        })
        .catch(error => {
          router.push('/login'); // Redirect to login page
        });

        //get the loan requests of the customer 
        api.get("customerLoanRequests/", {
          params: {
            customer_id: customer_id
          },
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(response => {
          setCustomerLoanRequests(response.data);
        }).catch(error => {
          console.log(error);
        });

        // get the accepted loans of the customer
        api.get("customerLoans/", {
          params: {
            customer_id: customer_id
          },
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(response => {
          setCustomerLoans(response.data);
        }).catch(error => {
          console.log(error);
        });
        
      }, []);


      const handleRowClick = (event, newPage) => {
        // get the component key from the event
        const loan_id = event.currentTarget.getAttribute('id');

        router.push({
          pathname: '/installments',
          query: {loan_id}
        })
      }

      
      return (
        <div style={{backgroundColor:"rgb(250, 250, 250)", padding:"2%"}}>
          <Head>
            <title>
            Login | Banking System 
            </title>
          </Head>

          <Grid container >

            <Grid item  md={2} sm={3} xs={3}>
              <SideNav />
            </Grid>

            <Grid item md={8} sm="auto" xs="auto" style={{marginLeft:"5%"}} >
              <Stack>

                  <Typography variant="h4" component="h2" gutterBottom>
                      Welcome to your Banking System!
                  </Typography>
                  <TableContainer component={Paper} style={{padding:"2%", marginTop:"3%"}}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4" component="h2" gutterBottom>
                      Loan Requests 
                    </Typography>
                    <Button variant="contained" href='/requestLoan' color="primary">Request a Loan</Button>
                  </Box>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                        <TableRow>
                            <StyledTableCell>Total Amount $</StyledTableCell>
                            <StyledTableCell align="right">Term (months)</StyledTableCell>
                            <StyledTableCell align="right">Start Date</StyledTableCell>
                            <StyledTableCell align="right">Created At</StyledTableCell>
                            <StyledTableCell align="right">Status</StyledTableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {customerLoanRequests.map((row) => (
                            <StyledTableRow key={row.total_amount}>
                            <StyledTableCell component="th" scope="row">
                                {row.total_amount}
                            </StyledTableCell>
                            <StyledTableCell align="right">{row.term_in_months}</StyledTableCell>
                            <StyledTableCell align="right">{row.start_date}</StyledTableCell>
                            <StyledTableCell align="right">{row.created_at}</StyledTableCell>
                            <StyledTableCell align="right">{row.status}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TableContainer style={{marginTop:"10%", padding:"2%", backgroundColor:'rgb(240, 240, 240)'}}>
                  <Typography variant="h4" component="h2" gutterBottom>
                      Accepted Loans 
                  </Typography>
                  <Table  aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                          >
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {customerLoans
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                          return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={row.id} id={row.id} onClick={handleRowClick}>
                              {columns.map((column) => {
                                const value = row[column.id];
                                return (
                                  <TableCell key={column.id} align={column.align}>
                                    {column.format && typeof value === 'number'
                                      ? column.format(value)
                                      : value}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>


              </Stack>
            </Grid>

          </Grid>
        </div>
      );
    };  



    export default Home;