/* eslint-disable react/prop-types */
import { Box, Button, Container, IconButton, Input, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { KeyboardArrowLeft, Visibility, VisibilityOff } from '@mui/icons-material';
import toast from 'react-hot-toast';
import CButton from '../../common/CButton';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosReq } from '../../../utils/axiosReq';
import useAuth from '../../hook/useAuth';

const Login = () => {
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [forgotePassSecOpen, setForgotePassSecOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState({ email: '' });


  const { setToken } = useAuth()
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input) => axiosReq.post('/auth/login', input),
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
    <Container sx={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: { xs: 'column', lg: 'row' },
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      py: { xs: 5, lg: 0 },
      background: 'linear-gradient(90deg, #EDF3FF 0%, #FFE8D7 100%, #F0FFDF 100%)',
    }} maxWidth='xxl'>
      <Stack alignItems='center' sx={{ width: { xs: '100%', md: '50%' } }}>
        {
          forgotePassSecOpen ? (
            <Stack sx={{
              width: { xs: '100%', md: '480px' },
              justifyContent: 'center',
            }}>
              <Stack sx={{ width: '100%' }} direction='row' alignItems='center' justifyContent={'space-between'}>

                <Button onClick={() => setForgotePassSecOpen(false)} sx={{
                  color: 'gray',
                  mb: 2,
                }} startIcon={<KeyboardArrowLeft />}>Back</Button>
              </Stack>
              {
                passResetData ?
                  <Typography sx={{
                    bgcolor: 'light.main',
                    borderRadius: '8px',
                    px: 2, py: 1, color: 'primary.main'
                  }}>{passResetData.passwordResetMail.message}</Typography> :
                  <Stack>
                    <Typography sx={{ fontWeight: 600, fontSize: '25px', mb: 3 }}>Forgote Password?</Typography>
                    <Input value={forgotEmail.email} sx={{ mb: 2 }} placeholder='Enter Your Email' onChange={(e) => setForgotEmail({ email: e.target.value })} type="text" />
                    {/* <TextField onChange={(e)=> setForgotEmail(e.target.value)} sx={{ mb: 2 }} fullWidth placeholder='email address' variant="outlined" /> */}
                    <Button
                      // isLoading={passResetLoading} 
                      // disable={passResetLoading} 
                      // onClick={handleForgotePassword}
                      variant='contained'
                    >Send
                    </Button>
                  </Stack>
              }
            </Stack>

          ) : (
            <Stack sx={{
              width: { xs: '100%', md: '480px' },
              justifyContent: 'center',
            }}>
              <Box sx={{
                mb: 2
              }}>
                <Typography sx={{ fontSize: '35px', color: 'primary.main', fontWeight: 600, textAlign: 'center' }}>Edu-Quest</Typography>
                {/* <img width='100%' src="logo.svg" alt="" /> */}
              </Box>
              <Typography sx={{ fontWeight: 600, fontSize: '25px', mb: 3, textAlign: 'center' }}>Sign in</Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  name='email'
                  required
                  sx={{ mb: 2 }}
                  fullWidth
                  label="Email"
                  variant="standard"
                  onKeyDown={handleKeyPress}
                />
                <TextField
                  sx={{ mb: 1 }}
                  variant="standard"
                  type={passwordVisibility ? "text" : "password"}
                  name="password"
                  label="Password"
                  required
                  fullWidth
                  onKeyDown={handleKeyPress}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={passwordVisibilityHandler}
                          onMouseDown={passwordVisibilityHandler}
                          edge="end"
                        >
                          {passwordVisibility ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Typography onClick={() => setForgotePassSecOpen(true)} sx={{ fontSize: '15px', mb: 4, mt: 1, color: 'primary.main ', cursor: 'pointer' }}>Forgote Password?</Typography>
                <CButton type='submit' style={{ mb: 2, width: '100%' }}
                  loading={mutation.isPending}
                  variant='contained'
                >
                  Sign In
                </CButton>
              </form>

            </Stack>
          )
        }
      </Stack>
    </Container>

  )
}

export default Login