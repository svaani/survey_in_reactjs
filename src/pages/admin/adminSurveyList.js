import React, { Fragment, useState } from "react";
import { Redirect } from 'react-router';
import { ListItem, List, ListItemText, 
    ListSubheader, Divider, CssBaseline } from '@material-ui/core';

//utils
import AppBarCustom from '../../utils/appBar';
import Constants from '../../utils/constants';

//models
import SurveysStatic from '../../models/surveys-static';

/**
 * To display admin survey list
 * @param props - used to get url parameters here 
 */
const AdminSurveyList = (props) => {
    //prelist is surveylist
    const [preList, setPreList] = useState(null);

    const _getSurveyList = () => {
        new SurveysStatic()
            .get().then((surveySnapshot) => {
                setPreList(surveySnapshot.docs);
            });
    }

    /*----------View part */
    if (localStorage.getItem("userId") == null) {
        return <Redirect push to="/login" />;
    } else {
        if (preList === null) _getSurveyList();
        return <Fragment> <CssBaseline />
            <AppBarCustom title={Constants.TITLE.ALL_SURVEYS} />
            <List>
                {
                    preList != null ?
                        preList.map((survey) => {
                            return (
                                <Fragment>
                                    <ListItem button key={survey.data()["S_Uid"]}>
                                        <ListItemText primary={`${Constants.SURVEY} ${survey.data()["Name"]}`} />
                                        <ListSubheader >
                                            {survey.data()["Description"]}
                                        </ListSubheader>
                                    </ListItem>
                                    <Divider />
                                </Fragment>);
                        })
                        :
                        <Fragment></Fragment>
                }
            </List>
        </Fragment>;
    }
}

export default AdminSurveyList;