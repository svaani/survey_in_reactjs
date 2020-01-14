import React from 'react';
import firebase from '../Firebase';

class Questions {
    
    constructor(){
        this.QuestionObj = firebase.firestore().collection('Questions');
    }

    ref = ()=>{
        return this.QuestionObj;
    }

    get = ()=>{
        return this.QuestionObj.get();
    }

    bySurveyId = (surveyId)=>{
        this.QuestionObj = this.QuestionObj.where("S_Uid", '==', surveyId);
        return this;
    }

}

Questions.getSequence = (question) => {
    return question.data()["Sequence"];
}


Questions.getQuestionId = (question) => {
    return question.data()["Q_Uid"];
}


Questions.getData = (question) => {
    return question.data();
}


export default Questions;