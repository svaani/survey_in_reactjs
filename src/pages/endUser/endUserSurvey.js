import React, { Fragment, useState } from "react";
import { Redirect } from 'react-router';
import {
    FormControlLabel, Grid, RadioGroup, Radio,
    CardHeader, Paper, Card, CardContent, Divider,
    Button, CssBaseline
} from '@material-ui/core';

//Utils
import AppBarCustom from '../../utils/appBar';
import Constants from '../../utils/constants';


// Models 
import SurveysStatic from '../../models/surveys-static';
import UserSurveyMap from '../../models/user-survey-map';
import Questions from '../../models/questions';
import Answers from '../../models/answers';
import UserQAMap from '../../models/user-qa-map';


const EndUserSurvey = (props) => {
    const [surveyName, setSurveyName] = useState('');
    const [questions, setQuestions] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [QA_Map, setQA_Map] = useState({});

    const _updateSurveyName = () => {
        new SurveysStatic()
            .byId(props.match.params.surveyId)
            .get().then((surveySnapshot) => {
                setSurveyName(SurveysStatic.getName(surveySnapshot.docs[0]));
            });
    }

    const _updateAnswer = (event) => {
        let tempObj = {};
        tempObj[event.currentTarget.name] = event.currentTarget.value;
        //adds new value. If it exists, overrides
        setQA_Map({ ...QA_Map, ...tempObj });
    }

    const _submit = (type) => {
        if (Object.keys(QA_Map).length === 0) {
            alert(Constants.ERR.NO_ANSWER_ERROR);
            return;
        }
        if (props.match.params.type == Constants.SURVEY_STATUS.DRAFT) {
            //update if it is draft
            new UserSurveyMap()
                .bySurveyId(props.match.params.surveyId)
                .byUserId(localStorage.getItem("userId"))
                .get().then((uS_Map) => {
                    _updateRecord(uS_Map, type);
                });

        } else {
            //add new instead of update for non-draft
            _addRecord(type);
        }
    }

    const _addRecord = (type) => {

        let UA_Map_id = Date.now().toString() + "2";
        let ref_qa = new UserQAMap().ref();
        let ref_survey = new UserSurveyMap().ref();

        //Adding to UserSurveyMap DB
        ref_survey.add({
            "DateTime": Date.now(),
            "S_Uid": props.match.params.surveyId,
            "TimeTaken": null,
            "UA_Map_id": UA_Map_id,
            "U_Uid": localStorage.getItem("userId"),
            "isDraft": type == "draft"
        }).then(() => {

            //Adding to UserQAMap DB
            for (var entry in QA_Map) {
                if (QA_Map.hasOwnProperty(entry)) {
                    ref_qa.add({
                        "A_Uid": QA_Map[entry],
                        "Q_Uid": entry,
                        "UA_Map_id": UA_Map_id,
                        "isDraft": type == "draft"
                    });
                }
            }
            setIsSaved(true);
            alert(Constants.ALERT.SAVED);
        });
    }

    const _updateRecord = (uS_Map, type) => {
        let ua_map_id = UserSurveyMap.getUAMapId(uS_Map.docs[0]);
        //update only required data
        uS_Map.docs[0].ref.update({
            "DateTime": Date.now(),
            "isDraft": type == Constants.SURVEY_STATUS.DRAFT
        });
        for (var entry in QA_Map) {
            if (QA_Map.hasOwnProperty(entry)) {
                //update user question answer mapping
                new UserQAMap()
                    .byUAMapId(ua_map_id)
                    .get().then((ua_map) => {
                        ua_map.docs[0].ref.update({
                            "A_Uid": QA_Map[entry],
                            "Q_Uid": entry,
                            "UA_Map_id": ua_map_id,
                            "isDraft": type == Constants.SURVEY_STATUS.DRAFT
                        });
                    });
            }
        }
        setIsSaved(true);
        alert(Constants.ALERT.SAVED);
    }

    const _getQuestions = () => {
        if (props.match.params.type != Constants.SURVEY_STATUS.OPEN) {
            //if it is in draft state or closed, we need to fetch user input
            new UserSurveyMap()
                .bySurveyId(props.match.params.surveyId)
                .byUserId(localStorage.getItem("userId"))
                .get().then((uS_Map) => {
                    let ua_map_id = UserSurveyMap.getUAMapId(uS_Map.docs[0]);
                    new UserQAMap()
                        .byUAMapId(ua_map_id)
                        .get().then((ua_Map) => {
                            let tempObj = {}
                            ua_Map.docs.forEach((map_entry) => {
                                tempObj[UserQAMap.getQuestionId(map_entry)] = UserQAMap.getAnswerId(map_entry)
                            });
                            setQA_Map({ ...QA_Map, ...tempObj })
                        });
                });
        }
        //fetch question that are related to survey
        new Questions()
            .bySurveyId(props.match.params.surveyId)
            .get().then((questionsSnapshot) => {
                questionsSnapshot.docs.sort(
                    (q1, q2) => Number(Questions.getSequence(q1)) < Number(Questions.getSequence(q2)));
                //Map with answers
                new Answers()
                    .bySurveyId(props.match.params.surveyId)
                    .get().then((answers) => {
                        setQuestions(questionsSnapshot.docs.map((question) => {
                            let updatedQuestion = Questions.getData(question);
                            updatedQuestion["Answers"] = (answers.docs.filter((answer) => Answers.getQuestionId(answer) == Questions.getQuestionId(question)));
                            return updatedQuestion;
                        }));
                    });
            });
    }

    /*----------View part */
    if (localStorage.getItem("userId") == null) {
        //if the user has logged out redirect
        return <Redirect push to="/login" />;
    } else if (isSaved) {
        //redirect after save
        return <Redirect push to="/end-user-landing" />;
    } else {
        if (surveyName.length == 0)
            _updateSurveyName();
        if (questions == null)
            _getQuestions();
        return <Fragment>
            <CssBaseline />
            <AppBarCustom title={surveyName} />
            <Paper >
                {/**Question & answer list */
                    questions != null ? questions.map((question) => {
                        console.log(question);
                        return <Fragment>
                            <Card>
                                <CardHeader subheader={question["Question"]} />
                                <CardContent>
                                    <RadioGroup value={QA_Map[question["Q_Uid"]]} onChange={(event) => _updateAnswer(event)} name={question["Q_Uid"]}  >
                                        {question["Answers"].map((answer) => {
                                            return <FormControlLabel value={answer.data()["A_Uid"]} control={<Radio />} disabled={props.match.params.type == "closed"} label={answer.data()["Description"]} />
                                        })}
                                    </RadioGroup>
                                </CardContent>
                            </Card>

                            <Divider />
                        </Fragment>
                    })
                        :
                        <Fragment></Fragment>
                }

            </Paper>
            {/** Displaying buttons */}
            {props.match.params.type == "closed" ? <Fragment></Fragment>
                :
                <Grid container spacing={1} direction="row">
                    <Grid item>
                        <Button variant="contained" onClick={() => _submit("draft")}>
                            {Constants.BUTTON.SAVE_DRAFT}
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={() => _submit("done")}>
                            {Constants.BUTTON.SUBMIT}
                        </Button>
                    </Grid>
                </Grid>}
        </Fragment>;
    }
}

export default EndUserSurvey;