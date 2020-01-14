import React, { Fragment, useState } from "react";
import { Redirect } from 'react-router';
import {
    ListItem, List, ListItemText,
    ListSubheader, Divider, CssBaseline
} from '@material-ui/core';

//Models
import SurveysStatic from '../../models/surveys-static';
import UserSurveyMap from '../../models/user-survey-map';

//Utils
import AppBarCustom from '../../utils/appBar';
import Constants from '../../utils/constants';


const EndUserSurveyList = (props) => {
    //preList is surveyList
    const [preList, setPreList] = useState(null);
    //selected Survey
    const [survey, setSurvey] = useState(null);

    const _getSurveyList = () => {

        //Map survey with user
        new SurveysStatic()
            .get().then((surveySnapshot) => {
                new UserSurveyMap()
                    .get().then((userSnapshot) => {
                        _processSurveyList(surveySnapshot, userSnapshot)

                    });
            });
    }


    const _processSurveyList = (surveySnapshot, userSnapshot) => {
        let surveyType = props.match.params.type;
        let arrSurveyIds;
        switch (surveyType) {
            case Constants.SURVEY_STATUS.CLOSED:
            case Constants.SURVEY_STATUS.DRAFT:
                //loop through UserSurveyMap first and then find if it is closed or drafted
                arrSurveyIds = userSnapshot.docs.filter(
                    (survey) =>
                        surveyType === Constants.SURVEY_STATUS.DRAFT
                            ?
                            SurveysStatic.isDraft(survey) : !SurveysStatic.isDraft(survey))
                    .map((survey) => SurveysStatic.getSurveyId(survey));
                setPreList(surveySnapshot.docs.filter(
                    (survey) =>
                        arrSurveyIds.indexOf(SurveysStatic.getSurveyId(survey)) >= 0))
                break;
            case Constants.SURVEY_STATUS.OPEN:
                //For open Survyes looping through UserSurveyMap
                arrSurveyIds = userSnapshot.docs.map(
                    (survey) =>
                        SurveysStatic.getSurveyId(survey));
                setPreList(surveySnapshot.docs.filter(
                    (survey) =>
                        arrSurveyIds.indexOf(SurveysStatic.getSurveyId(survey)) < 0))
                break;
            default:
                //on wrong url
                alert(Constants.ERR.WRONG_SURVEY_TYPE);
                break;
        }

    }

    const _chooseSurvey = (surveyId) => {
        setSurvey(surveyId);
    }

    /*----------View part */
    if (localStorage.getItem("userId") == null) {
        return <Redirect push to="/login" />;
    } else if (survey != null) {
        return <Redirect push to={`/end-user-survey/${survey}/${props.match.params.type}`} />;
    } else {
        //Display part
        if (preList === null) _getSurveyList();
        return <Fragment> <CssBaseline />
            <AppBarCustom title={`${Constants.SURVEYS}  ${props.match.params.type}`} />
            <List>
                { /**List of surveys */
                    preList != null ?
                        preList.map((survey) => {
                            return (
                                <Fragment>
                                    <ListItem button key={survey.data()["S_Uid"]} onClick={() => _chooseSurvey(survey.data()["S_Uid"])}>
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

export default EndUserSurveyList;