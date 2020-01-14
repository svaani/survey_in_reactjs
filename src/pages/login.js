import React, { Fragment, useRef, useState } from 'react';
import { Redirect } from 'react-router';
import { Grid, Button, TextField, CssBaseline, Typography, AppBar, Toolbar } from '@material-ui/core';

//Models
import Users from "../models/users";
import User_Roles_Map from '../models/user-roles-map';

//utils
import Constants from '../utils/constants';

/**
 * Common login module for all the roles
 */
const Login = () => {

    //In react it's good to consider userRef as dom read is faster 
    //and write gives faster percieved performance
    //It's a concious usage after adding some thoughts 
    const userName = useRef('');
    const password = useRef('');

    const [roleName, setRoleName] = useState("");

    const _login = () => {
        //Get data from firebase
        //as every query is new, it is not possible to extract a variable from Users Instance
        new Users()
            .byEmail(userName.current.value.toLowerCase())
            .byPassword(password.current.value)
            .get().then((snapshot) => {
                if (!snapshot.empty) {
                    let userId = Users.getUserId(snapshot.docs[0]);

                    //find the role of the user to redirect
                    new User_Roles_Map()
                        .byId(userId)
                        .get()
                        .then((snapshot) => {
                            localStorage.setItem("userId", userId);
                            let roleName = User_Roles_Map.getRoleName(snapshot.docs[0])
                            localStorage.setItem("role", roleName);
                            setRoleName(roleName);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
                //this.context.router.push('/sample');
                //browserHistory.push('/sample');
            })
            .catch((err) => {
                console.log(err);
            });
    }

    /*----------View part */
    if (roleName.length) {
        //if the role is retrieved, redirect based on the same
        switch (roleName) {
            case Constants.ROLES.END_USER:
                return <Redirect push to="/end-user-landing" />;
            case Constants.ROLES.ADMIN:
            case Constants.ROLES.SUPER_ADMIN:
                return <Redirect push to="/admin-landing" />;
            default:
                return <Redirect push to="/" />;
        }

    }
    else
        // login page UI
        return (
            <Fragment>
                <CssBaseline />
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" color="inherit">
                            {Constants.SURVEY}
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Grid container spacing={1} align="center" justify="center" direction="column">
                    <Grid item>
                        <TextField id="standard-basic" label="Email" inputRef={userName} />
                    </Grid>
                    <Grid item>
                        <TextField id="standard-basic" type="password" label="Password" 
                        inputRef={password} />
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={_login}>
                            {Constants.BUTTON.LOGIN}
                        </Button>
                    </Grid>
                </Grid>
            </Fragment>
        );
}

export default Login;