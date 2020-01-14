import React, { Fragment, useState, useRef, useEffect } from 'react';
import { ListItem, List, ListItemText,FormControlLabel, 
    Checkbox, FormControl, Grid, OutlinedInput, 
    InputLabel, Button, CssBaseline  } from '@material-ui/core';
import { Redirect } from 'react-router';

//utils
import AppBarCustom from '../../utils/appBar';
import Constants from '../../utils/constants';

//models
import Questions from '../../models/questions';
import Answers from '../../models/answers';

const CreateQuestion = (props) => {

    //question text reference
    const question = useRef('');
    //current answer holder
    const newAnswer = useRef('');

    //to navigate after save
    const [isSaved, setIsSaved] = useState(false);
    //keep adding to the stack of answers
    const [answers, setAnswers] = useState([]);
    //to decide if more questions need to answered
    const [redirect, setRedirect] = useState(null);
    const [multiChoice, setMultiChoice] = useState(false);

    useEffect(() => {
        //reset values on new page
        setIsSaved(false);
        setAnswers([]);
        setMultiChoice(false);
    }, [redirect]);

    const _save = (param) => {
        if (question.length == 0) {
            //validation for no question text
            alert(Constants.ERR.BLANK_QUESTION);
            return;
        } else if (answers.length == 0) {
            //validation for no answer text
            alert(Constants.ERR.BLANK_ANSWER);
            return;
        }
        let S_Uid = props.match.params.surveyId;
        let ref = new Questions().ref();
        let q_Uid = Date.now();
        ref.add({
            "Q_Uid": q_Uid.toString()+"2",
            "Question": question.current.value,
            "S_Uid": S_Uid,
            "Sequence": props.match.params.nth * 10,
            "isMultiChoice": multiChoice
        }).then(() => {
            let ansRef = new Answers().ref();

            answers.forEach((answer) => {
                ansRef.add({
                    "A_Uid": Date.now().toString()+Math.floor(Math.random() * 100),
                    "Description": answer,
                    "Q_Uid": q_Uid.toString()+"2",
                    "S_Uid": S_Uid,
                    "isDepended": false,
                });
            });
            alert(Constants.ALERT.SAVED);
            setIsSaved(true);
            setRedirect(param);
        }
        );
    }

    const _done = () => {
        _save(0);
    }

    const _next = () => {
        _save(1);
    }

    const _addNewAnswer = (event) => {
        let currentAnswers = [...answers];
        currentAnswers.push(newAnswer.current.value);
        setAnswers(currentAnswers);
        //reset the answer holder
        newAnswer.current.value = "";
    }

    /*----------View part */
    if (localStorage.getItem("userId") == null) {
        return <Redirect push to="/login" />;
    } else if (isSaved) {
        switch (redirect) {
            case 0:
                return <Redirect push to="/admin-landing" />;
            case 1:
                return <Redirect push to={`/create-question/${props.match.params.surveyId}/${Number(props.match.params.nth) + 1}`} />;
        }
        return <Fragment>loading...</Fragment>

    }
    else {
        return <Fragment>
            <CssBaseline />
            <AppBarCustom title={Constants.TITLE.ADD_QUESTIONS}/>
            <Grid container spacing={1} direction="column">
                <Grid item>
                    <FormControl style={{ "margin": "20px 0" }} fullWidth variant="outlined">
                        <InputLabel htmlFor="add_question">
                            {Constants.LABEL.ADD_QUESTION} 
                        </InputLabel>
                        <OutlinedInput
                            id="add_question"
                            inputRef={question}
                            labelWidth={100}
                        />
                    </FormControl>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={false}
                                onChange={()=>{}}
                                disabled
                                color="primary"
                            />
                        }
                        label={Constants.LABEL.IS_DEPENDED}
                    />, <FormControlLabel
                        control={
                            <Checkbox
                                checked={multiChoice}
                                onChange={()=>{setMultiChoice(!multiChoice)}}
                            
                                color="primary"
                            />
                        }
                        label={Constants.LABEL.MULTICHOICE_ALLOWED}
                    />
                    <List>
                        {
                            answers.map((answer, index) => {
                                return <ListItem button  >
                                    <ListItemText primary={index + 1 + "." + answer} />
                                </ListItem>
                            })
                        }
                    </List>
                    <FormControl style={{ "margin": "20px", "width": "50%" }} variant="outlined">
                        <InputLabel htmlFor="answer_option">Answer Option : </InputLabel>
                        <OutlinedInput
                            id="answer_option"
                            inputRef={newAnswer}
                            multiline={true}
                            rowsMax={2}
                            labelWidth={120}
                        />
                    </FormControl>
                    <Button variant="contained" color="default" onClick={(event) => { _addNewAnswer(event) }} style={{ "margin": "10px 0 0 0 " }} >
                    {Constants.BUTTON.ADD}
                        
                </Button>

                </Grid>
                <Grid item>
                    <Button style={{ "margin": "20px" }} variant="contained" color="default" onClick={_next}>
                    {Constants.BUTTON.NEXT}
                        
                </Button>
                    <Button style={{ "margin": "20px" }} variant="contained" color="primary" onClick={_done}>
                        {Constants.BUTTON.SAVE_EXIT}
                </Button>
                </Grid>
            </Grid>
        </Fragment>;
    }
}

export default CreateQuestion;