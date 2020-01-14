import React, { Fragment, useState } from 'react';
import { ListItem, List, ListItemText, Divider, CssBaseline } from '@material-ui/core';
import { Redirect } from 'react-router';

//utils
import AppBarCustom from '../../utils/appBar';
import Constants from '../../utils/constants';

const AdminLanding = () => {

    const [nextPage, setNextPage] = useState(null);

    
    /*----------View part */
    if (localStorage.getItem("userId") == null) {
        return <Redirect push to="/login" />;
    }
    else if (nextPage != null) {
        return <Redirect push to={nextPage} />;
    } else {
        //Navigation to differnt pages
        return <Fragment><CssBaseline />
            <AppBarCustom title={Constants.TITLE.WELCOME} />
            <List >
                <ListItem button onClick={() => { setNextPage("create-survey") }}>
                    <ListItemText primary={Constants.LABEL.CREATE_SURVEY}/> 
                </ListItem >
                <Divider />
                <ListItem button onClick={() => { setNextPage("admin-surveylist") }}>
                    <ListItemText primary={Constants.LABEL.SURVEY_LIST}/> 
                </ListItem>
                <Divider />
                <ListItem button onClick={() => { setNextPage("reports") }}>
                    <ListItemText primary={Constants.LABEL.REPORTS}/> 
                </ListItem>
                <Divider />
            </List>
        </Fragment>;
    }
}

export default AdminLanding;