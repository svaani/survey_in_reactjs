import firebase from '../Firebase';

class Answers {
    
    constructor(){
        this.AnswersObj = firebase.firestore().collection('Answers');
    }

    ref = ()=>{
        return this.AnswersObj;
    }

    get = ()=>{
        return this.AnswersObj.get();
    }

    bySurveyId = (surveyId)=>{
        this.AnswersObj = this.AnswersObj.where("S_Uid", '==', surveyId);
        return this;
    }

    byQuestionId = (questionId)=>{
        this.AnswersObj = this.AnswersObj.where("Q_Uid", '==', questionId);
        return this;
    }
}

Answers.getQuestionId = (answer) => {
    return answer.data()["Q_Uid"];
}

Answers.getAnswerId = (answer) => {
    return answer.data()["A_Uid"];
}

export default Answers;