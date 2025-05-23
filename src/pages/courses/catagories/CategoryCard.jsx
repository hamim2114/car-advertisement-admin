import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Avatar, Chip, Box, IconButton } from '@mui/material';
import { BorderColorOutlined, EditOutlined } from '@mui/icons-material';
import CDialog from '../../../common/CDialog';
import EditCategory from './EditCategory';

const CategoryCard = ({ data }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const handleDialog = () => setEditDialogOpen(p => !p)
  return (
    <Card sx={{ width: { xs: '100%', sm: 345 }, borderRadius: 2, p: 1 }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Avatar sx={{ bgcolor: '#8e6ac8', width: 40, height: 40, mr: 2 }} src={data.img || '/no-image.png'} />
          <Box flex="1">
            <Typography variant="h6" fontWeight="bold">
              {data.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {data.subCategories.length} SubCategories
            </Typography>
          </Box>
          <IconButton onClick={handleDialog}>
            <BorderColorOutlined />
          </IconButton>
        </Box>
        <Typography variant="body2" color="textSecondary" mt={2}>
          {data.description}
        </Typography>
        <Box mt={2} display="flex" gap={1} flexWrap="wrap">
          {
            data.subCategories.map(sub => (
              <Chip key={sub} label={sub} sx={{ bgcolor: '#e1f5fe', color: '#0288d1' }} />
            ))
          }
        </Box>
      </CardContent>
      <CDialog open={editDialogOpen} title='Edit Category' onClose={handleDialog}>
        <EditCategory onClose={handleDialog} category={data} />
      </CDialog>
    </Card >
  );
};

CategoryCard.propTypes = {
  data: PropTypes.object.isRequired,
};

export default CategoryCard;
