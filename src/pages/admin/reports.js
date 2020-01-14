import React, { Fragment, useState } from 'react';
import NVD3Chart from 'react-nvd3';
import { Grid, InputLabel, MenuItem, 
    Select,  CssBaseline, Typography} from '@material-ui/core';
import { Redirect } from 'react-router';

//utils
import AppBarCustom from '../../utils/appBar';
import Constants from '../../utils/constants';

//models
import SurveysStatic from '../../models/surveys-static';
import UserSurveyMap from '../../models/user-survey-map';
import Questions from '../../models/questions';
import Answers from '../../models/answers';

/**
 * Displaying 2 charts for now
 * pie chart & a bar chart
 * 
 * ---------------Should be divided into files
 */
const Reports = () => {

    const [preList, setPreList] = useState(null);
    const [currentSurvey, setCurrentSurvey] = useState(null);
    const [questionList, setQuestionList] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [pieChartData, setPieChartData] = useState(null);
    const [barChartData, setBarChartData] = useState(null);

    const _getSurveyList = () => {
        new SurveysStatic()
            .get().then((surveySnapshot) => {
                setPreList(surveySnapshot.docs);
            });
    }

    const _getQuestionList = () => {
        if (currentSurvey == null) {
            return;
        }
        //fetch questions from firebase
        new Questions()
            .bySurveyId(currentSurvey)
            .get().then((questions) => {
                setQuestionList(questions.docs);
            });
    }

    const _selectSurvey = (event) => {
        setCurrentSurvey(event.target.value);
        setQuestionList(null);
        setCurrentQuestion(null);
        setPieChartData(null);
        setBarChartData(null);
        //fetch user survey map from database
        new UserSurveyMap()
            .bySurveyId(currentSurvey)
            .get().then((surveylist) => {
                //creating the datastructure that is needed for the bar chart
                let tempArr = surveylist.docs.reduce(function (arr, ref) {
                    let updatedRef = UserSurveyMap.getData(ref);
                    updatedRef["date"] = new Date(UserSurveyMap.getDateTime(ref)).toLocaleString().split(",")[0];
                    arr[updatedRef["date"]] = arr[updatedRef["date"]] || [];
                    arr[updatedRef["date"]].push(updatedRef);
                    return arr;
                }, []);
                let preChartData = [];
                //updating with length to display number
                for (let entry in tempArr) {
                    preChartData.push({ "label": entry, "value": tempArr[entry].length });
                }
                setBarChartData([
                    {
                        "key": Constants.SURVEYS+ " :",
                        "color": "#d67777",
                        "values": preChartData
                    }]);
            });
    }

    const _selectQuestion = (event) => {
        //resetting values on change
        setCurrentQuestion(event.target.value);
        setPieChartData(null);
        //fetch answers from DB
        new Answers()
        .bySurveyId(currentSurvey)
            .byQuestionId(event.target.value)
            .get().then((answers) => {
                //creating datastructure for pie chart
                let tempArr = answers.docs.reduce(function (arr, ref) {
                    arr[Answers.getAnswerId(ref)] = arr[Answers.getAnswerId(ref)] || [];
                    arr[Answers.getAnswerId(ref)].push(ref.data());
                    return arr;
                }, []);
                let preChartData = [];
                //updating length to display number
                for (let entry in tempArr) {
                    preChartData.push({ "label": entry, "value": tempArr[entry].length, "Description": tempArr[entry][0]["Description"] });
                }
                setPieChartData(preChartData);
            });
    }

    /*----------View part */
    if (localStorage.getItem("userId") == null) {
        return <Redirect push to="/login" />;
    } else {
        if (preList == null) {
            _getSurveyList();
        }
        if (questionList == null) {
            _getQuestionList();
        }
        return <Fragment>
            <CssBaseline/>
            <AppBarCustom title={Constants.TITLE.REPORTS} />
            <InputLabel id="label" style={{ "width": "50%", "margin": "20px" }}>
                Select A Survey
            </InputLabel>
            <Select style={{ "width": "50%", "margin": "20px" }}
                labelId="label"
                id="select"
                onChange={(event) => { _selectSurvey(event) }}
                value={currentSurvey}>
                {
                    preList != null ?
                        preList.map((survey) =>
                            <MenuItem value={survey.data()["S_Uid"]}>
                                {survey.data()["Name"]}
                            </MenuItem>
                        )
                        :
                        <MenuItem>Loading..</MenuItem>
                }
            </Select>
            <Grid container spacing={8} justify="space-evenly" direction="row">
                <Grid item>
                    <Typography variant="h6" color="inherit">
                        {Constants.TITLE.DAYS_VS_NUMBERS}
                    </Typography>
                    {//barchart section ---------------
                        barChartData != null ?
                            <NVD3Chart type="multiBarHorizontalChart"
                                width="400"
                                datum={barChartData}
                                x="label"
                                y="value" />
                            :
                            <Fragment></Fragment>
                    }
                </Grid>
                <Grid item>
                    <Typography variant="h6" color="inherit">
                    {Constants.TITLE.ANS_REPORT}
                    </Typography>
                    <InputLabel id="questionlist" style={{ "width": "100%" }}>
                        Select A Question
                    </InputLabel>

                    <Select style={{ "width": "100%" }}
                        labelId="questionlist"
                        id="select"
                        onChange={(event) => { _selectQuestion(event) }}
                        value={currentSurvey}>
                        {
                            questionList != null ?
                                questionList.map((question) =>
                                    <MenuItem value={question.data()["Q_Uid"]}>
                                        {question.data()["Question"]}
                                    </MenuItem>
                                )
                                :
                                <MenuItem>
                                    Select a survey to get the questions..
                                </MenuItem>
                        }
                    </Select>
                    { //piechart section ---------------
                        pieChartData != null ?
                            <Fragment>
                                {
                                    pieChartData.map((entry) => {
                                        return <Typography>
                                            {entry["label"]}==> {entry["Description"]}
                                        </Typography>;
                                    })
                                }
                                <NVD3Chart type="pieChart" height="500" width="500" datum={pieChartData} x="label" y="value" />

                            </Fragment>
                            :
                            <Fragment></Fragment>
                    }
                </Grid>
            </Grid>
        </Fragment>;
    }
}

export default Reports;