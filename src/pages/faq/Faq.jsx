import { Box, Divider, FormControl, IconButton, InputLabel, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import CButton from '../../common/CButton'
import AddFaq from './AddFaq'
import CDialog from '../../common/CDialog'
import { Add, DeleteOutline, EditOutlined } from '@mui/icons-material'
import { axiosReq } from '../../../utils/axiosReq'
import { useQuery } from '@tanstack/react-query'
import Loader from '../../common/Loader'
import ErrorMsg from '../../common/ErrorMsg'
import FAQCard from './FAQCard'

const Faq = () => {
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  const { data: faq, isLoading, isError } = useQuery({
    queryKey: ['faq'],
    queryFn: async () => {
      const res = await axiosReq.get('/faq/all')
      return res.data
    }
  })

  return (
    <Box maxWidth='xl'>
      <Stack direction={{ xs: 'column', md: 'row' }} gap={2} alignItems='center' justifyContent='space-between'>
        <Box>
          <Typography variant='h5'>Frequently Asked Question</Typography>
        </Box>
        <CButton onClick={() => setAddDialogOpen(true)} contained startIcon={<Add />} >Add</CButton>
      </Stack>

      <CDialog disableOutsideClick={true} title='Add FAQ' open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <AddFaq onClose={() => setAddDialogOpen(false)} />
      </CDialog>

      <Stack direction='row' flexWrap='wrap' gap={2} mt={4}>
        {isLoading ? <Loader /> : isError ? <ErrorMsg /> :
          faq?.length === 0 ? <Typography>No data found</Typography> :
            faq.map((item, index) => (
              <FAQCard key={index} item={item} />
            ))}
      </Stack>

    </Box>
  )
}

export default Faq