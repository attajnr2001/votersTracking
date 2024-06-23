import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { Container } from '@mui/material'
const RootLayout = () => {
    return (
        <Container>
            <Navbar />
            <Outlet />
        </Container>
    )
}

export default RootLayout
