import { Box, Stack, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import CButton from '../../../common/CButton'
import { Add } from '@mui/icons-material'
import CategoryCard from './CategoryCard'
import CDialog from '../../../common/CDialog'
import AddCategory from './AddCategory'
import { axiosReq } from '../../../../utils/axiosReq'
import { useQuery } from '@tanstack/react-query'
import Loader from '../../../common/Loader'
import ErrorMsg from '../../../common/ErrorMsg'

const Categories = () => {
  const [addCatDialogOpen, setAddCatDialogOpen] = useState(false)

  const handleDialog = () => setAddCatDialogOpen(p => !p)

  const { data: categories, isLoading, isError } = useQuery({
    queryKey: ['category'],
    queryFn: () => axiosReq.get('/category/all'),
  })

  return (
    <Box>
      <Box>
        <Typography variant='h5'>Course Categories</Typography>
        <Typography variant='body2'>Total Catagories ({categories?.data.length})</Typography>
      </Box>
      <Stack mt={2} direction='row' justifyContent='space-between'>
        <Box />
        <CButton onClick={handleDialog} contained startIcon={<Add />} >Add Catagories</CButton>
      </Stack>
      {/* add categroy */}
      <CDialog open={addCatDialogOpen} title='Add Category' onClose={handleDialog}>
        <AddCategory onClose={handleDialog} />
      </CDialog>
      <Stack direction='row' gap={4} flexWrap='wrap' mt={4}>
        {
          isLoading ? <Loader /> :
            isError ? <ErrorMsg /> :
              categories?.data.map(data => (
                <CategoryCard key={data._id} data={data} />
              ))
        }
      </Stack>
    </Box>
  )
}

export default Categories