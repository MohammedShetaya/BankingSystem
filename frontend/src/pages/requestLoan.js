import { useEffect, useState } from 'react'
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {   Alert, Box, Button, Link, Stack, TextField, Typography} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import api from './api/axios';

const RequestLoan = () => {
    const router = useRouter();
    const [showMessage, setShowMessage] = useState(false)
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
      setSelectedDate(date);
    };

    const formik = useFormik({
    initialValues: {
        total_amount: 0,
        term_in_months: 0,
        start_date: new Date().toISOString(),
    },
    validationSchema: Yup.object({
      total_amount: Yup
        .number()
        .max(1000000)
        .min(1)
        .required('This Field is required'),
    term_in_months: Yup
        .number()
        .max(120)
        .min(1)
        .required('This Field is required'),
    start_date: Yup
      .date()
      .required('Please select a date')
    }),
    onSubmit: async (values, helpers) => {
      try {
        const token = localStorage.getItem('token')
        const customer_id = localStorage.getItem('customer_id')
        const start_date = new Date(values.start_date.$y, values.start_date.$M, values.start_date.$D).toISOString().slice(0, 10)
        const response = await api.post(`loanRequest/`, {
            customer: customer_id,
            total_amount: values.total_amount,
            term_in_months: values.term_in_months,
            start_date: start_date
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        setShowMessage(true)
        setTimeout(() => {
            router.push('/home')
          }, 5000)
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('token');

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
  }, []);



  function renderInput(props) {
    return <TextField {...props} />;
  }
  

  return (
    <>
      <Head>
        <title>
          Register | New Customer
        </title>
      </Head>
      <Box
        sx={{
          flex: '1 1 auto',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: '100px',
            width: '100%'
          }}
        >
          <div>
            <Stack
              spacing={1}
              sx={{ mb: 3 }}
            >
              <Typography variant="h4">
                Please Fill in The following Details    
              </Typography>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                make sure you fill in all the fields correctly
              </Typography>
            </Stack>
            <form
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <Stack spacing={2}>
                <TextField
                  error={!!(formik.touched.total_amount && formik.errors.total_amount)}
                  fullWidth
                  helperText={formik.touched.total_amount && formik.errors.total_amount}
                  label="Total Loan Amount"
                  name="total_amount"
                  type="number"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.total_amount}
                />


                <TextField
                  error={!!(formik.touched.term_in_months && formik.errors.term_in_months)}
                  fullWidth
                  helperText={formik.touched.term_in_months && formik.errors.term_in_months}
                  label="Term in Months"
                  name="term_in_months"
                  type="number"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.term_in_months}
                />

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker 
                        value={formik.values.start_date}
                        onBlur={formik.handleBlur}
                        onChange={(date) => {
                            formik.setFieldValue('start_date', date)
                        }}
                        renderInput={renderInput}                    
                    />
                </LocalizationProvider>

              </Stack>
              {formik.errors.submit && (
                <Typography
                  color="error"
                  sx={{ mt: 3 }}
                  variant="body2"
                >
                  {formik.errors.submit}
                </Typography>
              )}
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
              >
                Continue
              </Button>

                {
                    showMessage && (
                        <Alert
                        color="primary"
                        severity="success"
                        sx={{ mt: 3 }}
                      >
                        <div>
                            Loan Request Sent Successfully. Now you wait for the bank to approve your loan.
                        </div>
                      </Alert>
                    )
                }
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
};


export default RequestLoan;
