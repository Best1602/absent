import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Swal from 'sweetalert2';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const LeaveRequestCard = () => {
    const [searchParams] = useSearchParams();
    const rowId = searchParams.get('rowId');
    const username = searchParams.get('username');
    const name1 = searchParams.get('name1');
    const typabsent = searchParams.get('typabsent');
    const startabsent = searchParams.get('startabsent');
    const endabsent = searchParams.get('endabsent');
    const datillabsent = searchParams.get('datillabsent');
    const nickname = searchParams.get('nickname');
    const jobposition = searchParams.get('jobposition');
    const [isId5, setIsId5] = useState(false);
    const [test, setTest] = useState({});
    console.log(test);
    console.log(isId5);
    useEffect(() => {
        // Fetch data from your MSSQL server for the specific rowId
        axios.get(`${import.meta.env.VITE_API_SERVICE}/table1/${rowId}`)
            .then(response => {
                // Check if the response contains data and is an array
                if (Array.isArray(response.data) && response.data.length > 0) {
                    // Check if the id of the fetched data is equal to 5
                    const isId5 = response.data[0].id === 5;

                    console.log('Is ID 5:', isId5);
                    setIsId5(isId5);
                    setTest(response.data[0]);
                } else {
                    console.error('No data or invalid response structure:', response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching data from MSSQL server:', error);
            });
    }, [rowId]);
    const handleApprove = () => {
        // Axios request for approval
        axios.post(`${import.meta.env.VITE_API_SERVICE}/test`, {
            id: 5,
            row_id: rowId,
            name1: name1,
            typabsent: typabsent,
            startabsent: startabsent,
            datillabsent: datillabsent,
            endabsent: endabsent,
        })
            .then(response => {
                // Handle success
                console.log('Approval successful:', response);
                // Show SweetAlert2 popup on success
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Approval successful!',
                }).then(() => {
                    // Close the browser window
                    window.close();
                });
            })
            .catch(error => {
                console.error('Error during approval:', error);
                // Close the browser window on error
                window.close();
            });
    };

    const handleReject = () => {
        // Axios request for rejection
        axios.post(`${import.meta.env.VITE_API_SERVICE}/test2`, {
            id: 8,
            row_id: rowId,
            name1: name1,
            typabsent: typabsent,
            startabsent: startabsent,
            datillabsent: datillabsent,
            endabsent: endabsent,
        })
            .then(response => {
                // Handle success
                console.log('Approval successful:', response);
                // Show SweetAlert2 popup on success
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Approval successful!',
                }).then(() => {
                    window.close();
                });
            })
            .catch(error => {
                console.error('Error during approval:', error);
                // Close the browser window on error
                window.close();
            });

    };

    return (
        <Grid container justifyContent="center" spacing={2}>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card sx={{ maxWidth: 345, mt: 5, ml: 5, mr: 5 }}>
                    <CardMedia sx={{ height: 170, objectFit: 'contain' }} image={`http://203.154.174.129/Absent-api/user-image/${username}`} title="user image" />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Leave Request
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Absent Doc.: {rowId}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Employee id: {username}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Name: {name1}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Nickname: {nickname}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Type: {typabsent}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Start Date: {startabsent}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            End Date: {endabsent}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Detail: {datillabsent}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Chief approves: {test.Chief}
                        </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'center', flexDirection: 'column' }}>
                        <Button
                            size="small"
                            variant="contained"
                            sx={{
                                width: '100%',
                                display: 'flex',
                                background: '#A6CF98',
                                '&:hover': {
                                    backgroundColor: '#557C55',
                                    boxShadow: 'none',
                                },
                            }}
                            onClick={handleApprove}
                            disabled={isId5} // Disable the button if ID is not 5
                        >
                            Approved
                        </Button>
                        <Button
                            size="small"
                            variant="contained"
                            sx={{
                                width: '100%',
                                display: 'flex',
                                background: '#EF4B4B',
                                m: 1.5,
                                '&:hover': {
                                    backgroundColor: '#EC8F6A',
                                    boxShadow: 'none',
                                },
                            }}
                            onClick={handleReject}
                        >
                            Reject
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
    );
};

export default LeaveRequestCard;
