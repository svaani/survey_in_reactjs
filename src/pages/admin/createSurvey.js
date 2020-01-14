import React, { Fragment, useState, useRef } from 'react';
import {
    FormControl, OutlinedInput, InputLabel,
    Button, CssBaseline, Grid
} from '@material-ui/core';
import { Redirect } from 'react-router';

//utils
import AppBarCustom from '../../utils/appBar';
import Constants from '../../utils/constants';

//models
import SurveysStatic from '../../models/surveys-static';

const CreateSurvey = () => {

    const surveyName = useRef('');
    const surveyDescription = useRef('');
    const [S_Uid, setS_Uid] = useState(null);

    const _saveAndAddQuestions = () => {
        if (surveyName.current.value.length == 0) {
            alert(Constants.ERR.NAME_MANDATORY);
            return;
        }
        //fetch surveys
        let ref = new SurveysStatic().ref();
        let s_Uid = surveyName.current.value + Math.floor(Math.random() * 1000);
        //add new survey
        ref.add({
            "DateTime": Date.now(),
            "Description": surveyDescription.current.value,
            "S_Uid": s_Uid,
            "Name": surveyName.current.value
        }).then(() => {
            setS_Uid(s_Uid);
        }
        );
    }



    /*----------View part */
    if (localStorage.getItem("userId") == null) {
        return <Redirect push to="/login" />;
    }
    else if (S_Uid != null) {
        return <Redirect push to={`/create-question/${S_Uid}/1`} />;
    } else {
        return <Fragment>
            <CssBaseline />
            <AppBarCustom title={Constants.TITLE.CREATE_SURVEY} />
            <Grid container direction="column">
                <Grid item>
                    <FormControl style={{ "margin": "20px 0" }} fullWidth variant="outlined">
                        <InputLabel htmlFor="survey_name">
                            {Constants.LABEL.SURVEY_NAME}

                        </InputLabel>
                        <OutlinedInput
                            id="survey_name"
                            inputRef={surveyName}
                            labelWidth={100}
                        />
                    </FormControl>
                    <FormControl style={{ "margin": "20px 0" }} fullWidth variant="outlined">
                        <InputLabel htmlFor="description">
                            {Constants.LABEL.DESCRIPTION}
                        </InputLabel>
                        <OutlinedInput
                            id="description"
                            inputRef={surveyDescription}
                            multiline={true}
                            rows={4}
                            rowsMax={6}
                            labelWidth={100}
                        />
                    </FormControl>

                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={_saveAndAddQuestions}>
                        {Constants.BUTTON.SAVE_ADD_QUESTIONS}
                    </Button>
                </Grid>
            </Grid>
        </Fragment>;
    }
}

export default CreateSurvey;