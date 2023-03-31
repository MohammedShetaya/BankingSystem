import { useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    Stack,
    TableRow,
    Paper,
    TextField,
    Toolbar,
    Alert,
    Grid,
    Typography
  } from '@mui/material';
import api from './api/axios';
import SideNav from '@/components/sideNav';



const columns = [
  { id: 'amount', label: 'Amount to Pay$', minWidth: 170 },
  { id: 'due_date', label: 'Due Date', minWidth: 150 },
  {
    id: 'paid',
    label: 'Is Paid',
    minWidth: 130
  },
  {
    id: 'created_at',
    label: 'Issued At',
    minWidth: 170,
    align: 'right',
  } 
];

const Intallments = () => {

    const router = useRouter();
    const [intstallments, setInstallments] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { loan_id } = router.query;


    useEffect(() => {
        const token = localStorage.getItem('token');
        const customer_id = localStorage.getItem('customer_id');
        console.log(token)
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

        api.get('customerInstallments/', {
        params: {
            loan_id: loan_id,
            customer_id: customer_id
        },
        headers: {
            Authorization: `Bearer ${token}`
        }
        })
        .then((response) => {
            console.log(response.data)
            setInstallments(response.data);
        }
        )
        .catch((error) => {
            console.log(error);
        });

    }, []);


    
    return (
      <>
        <Head>
          <title>
          Login | Banking System 
          </title>
        </Head>

        <Grid container >

            <Toolbar>

            </Toolbar>

            <Grid item  md={2} sm={3} xs={3}>
              <SideNav />
            </Grid>

            <Grid item md={8} sm="auto" xs="auto" style={{marginLeft:"5%"}} >
              <Stack>

              <TableContainer style={{marginTop:"5%", padding:"2%", backgroundColor:'rgb(245, 245, 245)'}}>
                    <Typography variant="h4" component="h2" gutterBottom>
                        Loan Installments 
                    </Typography>
                    <Alert
                    color="primary"
                    severity="info"
                    sx={{ mt: 3 }}
                    >
                        <div>
                            This data represents the installments of the loan. you can see the amount to pay, the due date and if it is paid or not.
                        </div>
                    </Alert>
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
                        {intstallments
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row) => {
                            return (
                              <TableRow hover role="checkbox" tabIndex={-1} key={row.id} id={row.id}>
                                {columns.map((column) => {
                                  let value = row[column.id];
                                  if (typeof value === "boolean")
                                    value = value ? "Paid" : "Not Paid";
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
            <Grid item md={12} style={{marginTop:"15%", left:"0" , right:"0", bottom:"0"}}>

            </Grid>
        </Grid>
      </>
    );
  };  



  export default Intallments;