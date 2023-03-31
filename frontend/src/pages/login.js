import { useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Alert,
  Box,
  Button,
  FormHelperText,
  Link,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import api from './api/axios';


const Login = () => {


  const router = useRouter();
  const [method, setMethod] = useState('details');

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      submit: null
    },
    validationSchema: Yup.object({}),
    onSubmit: async (values, helpers) => {  
      try {
        const response = await api.post(`login/`, {
            username: values.username,
            password: values.password
          }, {
            headers: {
                'Content-Type': 'application/json'
            }
          });
        localStorage.setItem('customer_id', response.data.user_id);
        localStorage.setItem('token', response.data.token);
        router.push('/home');
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

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
          router.push('/home'); // Redirect to login page
        })
        .catch(error => {

        });
  }, []);


  return (
    <>
      <Head>
        <title>
        Login | Banking System 
        </title>
      </Head>
      <Box
        sx={{
          backgroundColor: 'background.paper',
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
                Login
              </Typography>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Don&apos;t have an account?
                &nbsp;
                <Link
                  component={NextLink}
                  href="/register"
                  underline="hover"
                  variant="subtitle2"
                >
                  Register
                </Link>
              </Typography>
            </Stack>
            <Tabs
              sx={{ mb: 3 }}
              value={method}
            >
              <Tab
                label="Account Details"
                value="details"
              />

            </Tabs>
            {method === 'details' && (
              <form
                noValidate
                onSubmit={formik.handleSubmit}
              >
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="username"
                  />
                  <TextField
                    error={!!(formik.touched.password && formik.errors.password)}
                    fullWidth
                    helperText={formik.touched.password && formik.errors.password}
                    label="Password"
                    name="password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="password"
                    value={formik.values.password}
                  />
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
                  Sign In
                </Button>

                <Alert
                  color="primary"
                  severity="info"
                  sx={{ mt: 3 }}
                >
                  <div>
                    Please use the user credentials provided when you registered.
                  </div>
                </Alert>
              </form>
            )}
            
          </div>
        </Box>
      </Box>
    </>
  );
};



export default Login;