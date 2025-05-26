/* eslint-disable react/prop-types */
import { Box, Button, Container, IconButton, Input, InputAdornment, Stack, TextField, Typography, Paper } from '@mui/material'
import { useState } from 'react'
import { KeyboardArrowLeft, Visibility, VisibilityOff } from '@mui/icons-material';
import toast from 'react-hot-toast';
import CButton from '../../common/CButton';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../hook/useAuth';
import apiReq from '../../../utils/axiosReq'

const Login = () => {
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [forgotePassSecOpen, setForgotePassSecOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState({ email: '' });

  const { setToken } = useAuth()
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input) => apiReq.post('api/auth/login', input),
    onSuccess: (res) => {
      if (res.data.user.role === 'admin') {
        queryClient.invalidateQueries(['login']);
        setToken(res.data.jwt)
        toast.success(res.data.message)
      } else {
        toast.error('You are not authorized to access this page')
      }
    },
    onError: (err) => {
      toast.error(err.response.data)
    }
  })

  const handleSubmit = (event) => {
    handleKeyPress(event)
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    mutation.mutate({
      email: data.get('email'),
      password: data.get('password'),
    })
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  const passResetData = ''

  const passwordVisibilityHandler = () => setPasswordVisibility(!passwordVisibility);

  return (
    <Container maxWidth={false} sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      padding: 3
    }}>
      <Paper elevation={10} sx={{
        width: '100%',
        maxWidth: '450px',
        borderRadius: 2,
        p: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.95)'
      }}>
        {forgotePassSecOpen ? (
          <Box>
            <Button 
              onClick={() => setForgotePassSecOpen(false)}
              startIcon={<KeyboardArrowLeft />}
              sx={{ mb: 3, color: 'text.secondary' }}
            >
              Back to Login
            </Button>
            
            {passResetData ? (
              <Typography sx={{
                bgcolor: 'primary.light',
                color: 'primary.main',
                p: 2,
                borderRadius: 1
              }}>
                {passResetData.passwordResetMail.message}
              </Typography>
            ) : (
              <Stack spacing={3}>
                <Typography variant="h5" fontWeight={600}>
                  Reset Password
                </Typography>
                <TextField
                  fullWidth
                  label="Email Address"
                  variant="outlined"
                  value={forgotEmail.email}
                  onChange={(e) => setForgotEmail({ email: e.target.value })}
                />
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                >
                  Send Reset Link
                </Button>
              </Stack>
            )}
          </Box>
        ) : (
          <Stack spacing={3}>
            <Typography variant="h4" textAlign="center" color="primary.main" fontWeight={700}>
              Car Advertisement
            </Typography>
            
            <Typography variant="h5" textAlign="center" color="text.secondary">
              Admin Portal
            </Typography>

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  name="email"
                  label="Email Address"
                  variant="outlined"
                  required
                  fullWidth
                  onKeyDown={handleKeyPress}
                />

                <TextField
                  name="password"
                  label="Password"
                  variant="outlined"
                  required
                  fullWidth
                  type={passwordVisibility ? "text" : "password"}
                  onKeyDown={handleKeyPress}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={passwordVisibilityHandler}
                          edge="end"
                        >
                          {passwordVisibility ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* <Typography
                  onClick={() => setForgotePassSecOpen(true)}
                  sx={{
                    color: 'primary.main',
                    cursor: 'pointer',
                    textAlign: 'right',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Forgot Password?
                </Typography> */}

                <CButton
                  type="submit"
                  loading={mutation.isPending}
                  variant="contained"
                  size="large"
                  fullWidth
                >
                  Sign In
                </CButton>
              </Stack>
            </form>
          </Stack>
        )}
      </Paper>
    </Container>
  )
}

export default Login