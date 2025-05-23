/* eslint-disable react/prop-types */
import { AddBoxOutlined, FiberManualRecord, GridViewOutlined, KeyboardArrowRightOutlined, ListAlt, Person3, Person3Outlined, PlaylistAdd, Settings, SettingsOutlined, SpaceDashboard, SpaceDashboardOutlined } from '@mui/icons-material';
import { Badge, Box, Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material'
import { useState } from 'react';
import { NavLink } from 'react-router-dom';


const CDrawer = ({ handleDrawerClose }) => {
  const [expandedNavlinkIndex, setExpandedNavlinkIndex] = useState(1);


  const handleExpandedNavlink = (index) => {
    setExpandedNavlinkIndex(expandedNavlinkIndex === index ? null : index);
  };


  const links = [
    { name: 'Dashboard', icon: <GridViewOutlined />, path: '', end: true },
    { name: 'Advertisements', icon: <ListAlt />, path: 'advertisement' },
    { name: 'Create Link ', icon: <AddBoxOutlined />, path: 'create-link' },
    { name: 'Setting ', icon: <SettingsOutlined />, path: 'setting' },
  ];


  return (
    <Stack>
      <Stack alignItems='center'>
        <Box sx={{
          width: '100%',
          bgcolor: 'primary.main',
          height: '64px'
        }}>
          <Typography sx={{ fontSize: '25px', fontWeight: 600, color: '#fff', textAlign: 'center', mt: 1.5 }}>
            Car Advertisements
          </Typography>
        </Box>
      </Stack>

      <List sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 4 }}>
        {links.map((item, index) => (
          <ListItem disablePadding key={index} sx={{ display: 'block' }}>
            {item.more ? (
              <>
                <ListItemButton
                  sx={{ px: 1, mx: 2, borderRadius: '5px', mb: 0.5, color: 'gray' }}
                  onClick={() => handleExpandedNavlink(index)}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: 1.5, color: 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                  <KeyboardArrowRightOutlined sx={{
                    transition: '.5s',
                    transform: expandedNavlinkIndex === index ? 'rotate(90deg)' : 'rotate(0deg)'
                  }} />
                </ListItemButton>
                <Collapse in={expandedNavlinkIndex === index} timeout="auto" unmountOnExit>
                  <List component="div">
                    {item.more.map((subItem, id) => (
                      <NavLink
                        end={subItem.end}
                        onClick={handleDrawerClose}
                        className="link"
                        key={id}
                        to={subItem.path}
                      >
                        {({ isActive }) => (
                          <ListItemButton
                            sx={{
                              ml: 5,
                              mr: 2,
                              mb: 0.5,
                              borderRadius: '5px',
                              bgcolor: isActive ? 'primary.main' : '',
                              color: isActive ? '#fff' : 'gray',
                              ':hover': {
                                bgcolor: isActive ? 'primary.main' : '#F5F5F5',
                              },
                            }}
                          >
                            <FiberManualRecord sx={{ fontSize: '8px', mr: 2 }} />
                            <Typography sx={{ fontSize: '14px', whiteSpace: 'nowrap' }}>
                              {subItem.name}
                            </Typography>
                          </ListItemButton>
                        )}
                      </NavLink>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <NavLink end={item.end} className="link" to={item.path}>
                {({ isActive }) => (
                  <Stack
                    direction='row'
                    alignItems='center'
                    onClick={handleDrawerClose}
                    sx={{
                      py: 1,
                      px: 1,
                      mx: 2,
                      borderRadius: '5px',
                      bgcolor: isActive ? 'primary.main' : '',
                      color: isActive ? '#fff' : 'gray',
                      ':hover': {
                        bgcolor: isActive ? 'primary.main' : '#F5F5F5',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 0, mr: 1.5, color: 'inherit' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                    <Badge sx={{ mr: 2 }} badgeContent={item.notification} color="warning" />
                  </Stack>
                )}
              </NavLink>
            )}
          </ListItem>
        ))}
      </List>

    </Stack>
  )
}

export default CDrawer