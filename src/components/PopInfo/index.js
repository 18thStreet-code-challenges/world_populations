import React, { Fragment, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import InfoIcon from '@material-ui/icons/Info'
import Popover from '@material-ui/core/Popover'
import './popInfo.css'

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2)
  }
}))

// eslint-disable-next-line react/prop-types
const PopInfo = ({ children }) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)
  const id = open ? 'slider-info' : undefined
  return (
    <Fragment>
      <InfoIcon aria-describedby={id} className='popInfo' onClick={handleClick} />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <Typography className={classes.typography}>
          {children}
        </Typography>
      </Popover>
    </Fragment>
  )
}

export default PopInfo
