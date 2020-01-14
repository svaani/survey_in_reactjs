import React, { Fragment, useState } from 'react';
import { ListItem, List, ListItemText, Divider, CssBaseline } from '@material-ui/core';
import { Redirect } from 'react-router';

//utils
import AppBarCustom from '../../utils/appBar';
import Constants from '../../utils/constants';

const EndUserLanding = () => {

    const [userChoice, setUserChoice] = useState(null);

    const _chooseSurveyType = (type) => {
        setUserChoice(type);
    }

    /*----------View part */
    if (localStorage.getItem("userId") == null | localStorage.getItem("userId") === "null") {
        return <Redirect push to="/login" />;
    } else if (userChoice != null) {
        return <Redirect push to={`/end-user-surveylist/${userChoice}`} />;
    } else {
        return <Fragment>
            <CssBaseline />
            <AppBarCustom title={Constants.TITLE.WELCOME}/>
            <List >
                <ListItem button onClick={() => _chooseSurveyType(Constants.SURVEY_STATUS.OPEN)}>
                    <ListItemText primary="Open Surveys">  </ListItemText >
                </ListItem >
                <Divider />
                <ListItem button onClick={() => _chooseSurveyType(Constants.SURVEY_STATUS.DRAFT)}>
                    <ListItemText primary="Draft Surveys">  </ListItemText >
                </ListItem>
                <Divider />
                <ListItem button onClick={() => _chooseSurveyType(Constants.SURVEY_STATUS.CLOSED)}>
                    <ListItemText primary="Closed Surveys">  </ListItemText >
                </ListItem>
                <Divider />
            </List>
        </Fragment>;
    }
}

export default EndUserLanding;