import React, { useState, useEffect } from 'react';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import { GoogleLogin, googleLogout } from '@react-oauth/google'
import { useDispatch } from 'react-redux'
import jwt_decode from 'jwt-decode'
import { useHistory } from 'react-router-dom';
import { signin, signup } from '../../actions/auth'


import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Icon from './Icon'
import Input from './Input'

import useStyles from './styles';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }

function Auth() {
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false)
  const [isSignup, setIsSignup] = useState(false)
  const [formData, setFormData] = useState(initialState)
  const dispatch = useDispatch()
  const history = useHistory()

  const handleShowPassword = () => setShowPassword(!showPassword)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (isSignup) {
      dispatch(signup(formData, history))
    } else {
      dispatch(signin(formData, history))
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value, })
  }

  const switchMode = () => {
    setIsSignup(!isSignup)
  }

  const googleSuccess = async (res) => {
    console.log(res)
    const result = jwt_decode(res?.credential);

    try {
      dispatch({ type: 'AUTH', data: { result, token: res?.credential }})

      history.push('/')
    } catch (error) {
      console.log(error)
    }
  }

  const googleFailure = (error) => {
    console.log(error)
  }

  return (
    <Container component="main" maxWidth="xs" >
      <Paper className={classes.paper} elevation={3} >
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5">{isSignup ? 'Sign In':'Sign Out'}</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2} >
              {
                isSignup && (
                  <>
                    <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                    <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                  </>
                )
              }
              <Input name="email" label="Email Address" handleChange={handleChange} type="email"  />
              <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
              { isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" />}
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            { isSignup ? 'Sign Up' : 'Sign In'}
          </Button>
              <GoogleLogin
                clientId={`918740139713-fl9cfss892crt46qcrmpadkqeu524f6m.apps.googleusercontent.com`}
                render={(renderProps) => (
                  <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained">
                    Google Sign In
                  </Button>
                )}
                onSuccess={googleSuccess}
                onFailure={googleFailure}
                cookiePolicy="single_host_origin"
              />
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button onClick={switchMode}>
                { isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up" }
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  )
}

export default Auth