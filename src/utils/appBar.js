import React from 'react';
import { AppBar, Button, IconButton, Typography, Toolbar } from '@material-ui/core';

import Constants from './constants';

const AppBarCustom = (props) => {
    return <AppBar position="static">
        <Toolbar>{/**to use route redirect insted location href-todo */}
            <IconButton edge="end" color="inherit" aria-label="menu"
                onClick={() => {
                    window.location.href = localStorage.getItem("role") == Constants.ROLES.END_USER
                        ?
                        "/end-user-landing" : "/admin-landing"
                }}>
                Home   |
            </IconButton>
            <Typography style={{ "width": "90%" }} variant="h6" color="inherit">
                |    {props.title}
            </Typography>
            <Button style={{ "display": "inline-block" }} onClick={() => { localStorage.removeItem("userId"); window.location.reload() }} color="inherit">
                Logout
            </Button>
        </Toolbar>
    </AppBar>;
}

export default AppBarCustom;