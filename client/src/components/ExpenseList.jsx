import * as React from 'react';
import { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import jwt_decode from "jwt-decode";


export default function ExpenseList() {
    const [expense, setExpense] = React.useState([])
    const [Token, setToken] = useState(localStorage.getItem('token'))
    const [borrowed, setBorrowed] = useState([])

    useEffect(() => {
        setToken(localStorage.getItem('token'))
        if (Token) {
            const decodedToken = jwt_decode(Token)

            getExpenses(decodedToken)
            borrowedbills(decodedToken)

        }


    }, [])

    const borrowedbills = async (decoded) => {
        await axios.get(`http://localhost:4000/expense/pendingbills/${decoded.username}`).then((response) => {
            if (response.data.bills) {
                setBorrowed(response.data.bills)

            }

        })
    }

    const getExpenses = async (decoded) => {

        await axios.get(`http://localhost:4000/expense/getexpenses/${decoded.userId}`).then((response) => {
            setExpense(...expense, response.data.expense)

        }).catch((err) => {
            console.log('error here', err)
        })
    }

    return (<>
        {
            expense.map((list) => {
                return (
                    <List key={list._id} sx={{ width: '100%', bgcolor: 'background.paper' }}>

                        {




                            <>
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar alt="Remy Sharp" src="" />
                                    </ListItemAvatar>

                                    <ListItemText
                                        
                                        secondary={
                                            <React.Fragment>

                                                <Typography
                                                    sx={{ display: 'inline' }}
                                                    style={{ color: "green" }}
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                >
                                                    {`You are owned $${Math.floor(parseInt(list.expense) - (parseInt(list.expense) / list.totalPersons))}`}
                                                </Typography>
                                                {` — From ${list.friends.map(friend => friend)}`}
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" /> </>



                        }


                    </List>
                )
            })


        }

        {borrowed.map((list) => {
            return (
                <List key={list._id} sx={{ width: '100%', bgcolor: 'background.paper' }}>





                    <>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar alt="Remy Sharp" src="" />
                            </ListItemAvatar>

                            <ListItemText
                                primary={list.groupName}
                                secondary={
                                    <React.Fragment>

                                        <Typography
                                            sx={{ display: 'inline' }}
                                            style={{ color: "red" }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {`You owe $${Math.floor((parseInt(list.expense) / list.totalPersons))}`}
                                        </Typography>
                                        {` — To ${list.paidby.name}`}
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </>











                </List>
            )
        })}
    </>


    )
}

