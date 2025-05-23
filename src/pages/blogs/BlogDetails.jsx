import { axiosReq } from '../../../utils/axiosReq'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Box, Typography, Avatar, Divider } from '@mui/material'
import Loader from '../../common/Loader'
import { format } from 'date-fns'

const BlogDetails = () => {
  const { id } = useParams()
  const { data, isLoading } = useQuery({
    queryKey: ['blog', id],
    queryFn: async () => {
      const res = await axiosReq.get(`/blog/details/${id}`)
      return res.data
    }
  })

  if (isLoading) {
    return <Loader />
  }

  return (
    <Box sx={{
      bgcolor: '#fff',
      borderRadius: '8px',
      p: 3,
      minHeight: '100vh'
    }} maxWidth='xl'>
      <Typography variant="h4" gutterBottom>{data.title}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar src={data.author.img} sx={{ mr: 2 }} />
        <Typography variant="subtitle1">@{data.author.username}</Typography>
      </Box>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {format(new Date(data.createdAt), 'MMMM dd, yyyy')}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Category: {data.category}
      </Typography>
      <Box sx={{ my: 3 }}>
        <img src={data.image} alt={data.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
      </Box>
      <Divider sx={{ my: 3 }} />
      <Box dangerouslySetInnerHTML={{ __html: data.content }} />
    </Box>
  )
}

export default BlogDetails