import React from 'react';
import { Grid, Button, Typography, Box, Container } from '@mui/material';
import backgroundImage from '../assets/bg3.png';
import { Link } from 'react-router-dom';

const Welcome = () => {
    const imageStyle = {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '90vh',
    };

    return (
        <>
            <Container>
                <Grid container >
                    <Grid item xs={12} md={6} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box textAlign="center">

                            <Typography variant="body1" gutterBottom>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum, culpa, asperiores distinctio laudantium labore odit libero, obcaecati iure reprehenderit a perferendis dignissimos saepe temporibus hic nesciunt neque atque quod molestiae alias rem? Accusantium ex consequatur aut rerum!                    </Typography>
                            <Button variant="contained" color="primary" component={Link} to="/login">
                                Login
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} style={imageStyle}></Grid>
                </Grid>


            </Container>
            <Grid container bgcolor={"#2737c4"} sx={{ height: "30vh" }}>
                Hello
            </Grid>

        </>
    );
};

export default Welcome;
