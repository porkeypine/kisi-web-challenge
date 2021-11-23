import React, { useState } from 'react'

import { Link } from 'react-router-dom'
import { AppBar, Divider, Box, Toolbar, Typography, Menu, MenuItem, Button } from '@mui/material'

export const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <AppBar position="static" sx={{ marginBottom: '30px' }}>
      <Toolbar>
        <Typography variant="h4">Siki</Typography>
        <Box
          flexGrow="1"
          justifyContent="space-between"
          alignItems="center"
          display="flex"
          flexShrink="1"
        >
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', marginLeft: '30px' }}>
            <Typography fontSize='18px'>Groups</Typography>
          </Link>
        </Box>
        <Button
          id="basic-button"
          aria-controls="basic-menu"
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          color="inherit"
        >
          John Doe
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button'
          }}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>API</MenuItem>
          <MenuItem onClick={handleClose}>Credentials</MenuItem>
          <Divider />
          <MenuItem onClick={handleClose}>Sign Out</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
