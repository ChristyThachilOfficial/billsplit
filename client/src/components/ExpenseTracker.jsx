import { useState,useEffect } from 'react';
import { AppBar, Box, Button, Tab, Tabs, TextField, Typography } from '@mui/material'
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import React from 'react'
import './ExpenseTracker.css'
import GroupList from './GroupList';
import Modal from '@mui/material/Modal';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import ExpenseList from './ExpenseList';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    
    transform: 'translate(-50%, -50%)',
    width: 400,
    height:600,
    bgcolor: 'background.paper',
    borderRadius: 4,
    boxShadow: 24,
    p: 4,
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};


function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}


function ExpenseTracker() {
    const [value, setValue] = useState(0);
    const [open, setOpen] = React.useState(false);
    const [groupName, setGroupName] = useState('')
    const [expense,setExpense] = useState(0)
    const [addExpense, setAddExpense] = React.useState(false)
    const [createGroup, setCreateGroup] = React.useState(false)
    const [personName, setPersonName] = React.useState([]);
    const [friends, setFriends] = React.useState([])
    const theme = useTheme();
    const [Token, setToken] = useState(localStorage.getItem('token'))
    const [decoded, setDecoded] = useState({})
    
    useEffect(() => {
        setToken(localStorage.getItem('token'))
        if (Token) {
            const decodedToken = jwt_decode(Token)
            setDecoded(decodedToken)
        }
        getFriends();

        
    }, [])
    
    const getFriends = async () => {
         await axios.get('http://localhost:4000/user/friends').then((response) => {
             if (response.data.users.length > 0) {
                 setFriends(response.data.users)
            }
            
        })
    }

    const groupCreate = async(e) => {
        e.preventDefault()
        await axios.post('http://localhost:4000/group/create', { groupName, personName, expense, decoded })
        window.location.reload()
        handleClose();
    }

    const createExpense = async (e) => {
        e.preventDefault()
        await axios.post('http://localhost:4000/expense/create', { personName, expense, decoded })
        window.location.reload()
        handleClose();
    }

    
    const handleChangeAddMembers = (event) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

  return (
      <div className='maindiv'>
          <AppBar style={{ background: '#2E3B55' }} position="static">
              <Tabs
                  value={value}
                  onChange={handleChange}
                  indicatorColor="secondary"
                  textColor="inherit"
                  variant="fullWidth"
                  aria-label="full width tabs example"
              >
                  <Tab label="Groups" {...a11yProps(0)} />
                  <Tab label="Friends" {...a11yProps(1)} />
                  
              </Tabs>
          </AppBar>
          <SwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={value}
              onChangeIndex={handleChangeIndex}
          >
              <TabPanel value={value} index={0} dir={theme.direction}>
                  <GroupList  />
              </TabPanel>
              <TabPanel value={value} index={1} dir={theme.direction}>
                  <ExpenseList />
              </TabPanel>
              
          </SwipeableViews>
          <div>
              {
                  value === 0 ?

                      <Button onClick={() => { setAddExpense(false); setCreateGroup(true); handleOpen() }} style={{ position: 'absolute', bottom: 0, right: 0, margin: '10vh' }} variant="contained">Create group</Button> :
                      <Button onClick={() => { setAddExpense(true); setCreateGroup(false); handleOpen() } } style={{ position: 'absolute', bottom: 0, right: 0, margin: '10vh' }} variant="contained">Add Expense</Button>
              }
              <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
              >
                  <Box sx={style} component="form">
                      <Typography id="modal-modal-title" sx={{ m: 1 }} variant="h4" component="h6">
                          {addExpense? "Add expense": "Create Group"}
                          
                      </Typography>
                      {createGroup && <TextField sx={{ m: 1 }} value={groupName} onChange={(e)=>setGroupName(e.target.value)} fullWidth label="Group name" id="name" />}
                      
                      <FormControl sx={{ m: 1,minWidth:300 }}>
                          <InputLabel  id="demo-multiple-chip-label">Members</InputLabel>
                          <Select
                              labelId="demo-multiple-chip-label"
                              id="demo-multiple-chip"
                              multiple
                              value={personName}
                              onChange={handleChangeAddMembers}
                              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                              renderValue={(selected) => (
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                      {selected.map((value) => (
                                          <Chip key={value} label={value} />
                                      ))}
                                  </Box>
                              )}
                              MenuProps={MenuProps}
                          >
                              {friends.map((friend) => (
                                  <MenuItem
                                      key={friend.email}
                                      value={friend.firstName}
                                      style={getStyles(friend.firstName, personName, theme)}
                                  >
                                      {friend.firstName}
                                  </MenuItem>
                              ))}
                          </Select>
                      </FormControl>
                      <TextField sx={{ m: 1 }} type="number" fullWidth value={expense} onChange={(e)=> setExpense(e.target.value)} label="Expense" id="expense" />
                      <Typography id="modal-modal-title" sx={{ m: 1 }} variant="h6" component="h6">
                          Paid by you and split equally.
                      </Typography>
                      {createGroup ?
                          <Button style={{ position: 'absolute', bottom: 0, right: 0, margin: '5vh' }} onClick={groupCreate} variant="contained">Create Group</Button> :
                          <Button style={{ position: 'absolute', bottom: 0, right: 0, margin: '5vh' }} onClick={createExpense} variant="contained">Add expense</Button>

                        }
                      
                  </Box>
              </Modal>
          </div>
          
      </div>
  )
}

export default ExpenseTracker