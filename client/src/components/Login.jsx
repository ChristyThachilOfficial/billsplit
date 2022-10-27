import { useState } from 'react';
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box';
import './Login.css'
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const submitLogin = async () => {
        await axios.post('http://localhost:4000/user/login', { email, password }).then((response) => {
            localStorage.setItem('token', response.data.token)
            navigate('/')
        }).catch((err) => {
            console.log(err)
        })
    }
    return (
        <Box
            component="form"
            display="flex"
            justifyContent="flex-end"
            flexDirection="column"
            sx={{
                width: 500,
                maxWidth: '100%',

            }}
            noValidate
            autoComplete="off"

        >
            <h1 className='loginheader'>Login</h1>

            <TextField sx={{ m: 1 }} fullWidth onChange={(e) => { setEmail(e.target.value) }} label="Email" id="email" />
            <TextField sx={{ m: 1 }} fullWidth onChange={(e) => { setPassword(e.target.value) }} label="password" id="password" />
            <Button sx={{ m: 1 }} onClick={submitLogin} variant="contained">Login</Button>


        </Box>

    )
}


export default Login