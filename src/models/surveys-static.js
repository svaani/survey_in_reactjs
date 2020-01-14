import firebase from '../Firebase';

class SurveysStatic {
    
    constructor(){
        this.SurveyObj = firebase.firestore().collection('Surveys-Static');
    }

    ref = () =>{
        return this.SurveyObj;
    }

    get = ()=>{
        return this.SurveyObj.get();
    }

    byId = (id)=>{
        this.SurveyObj = this.SurveyObj.where("S_Uid", '==', id);
        return this;
    }

}

SurveysStatic.isDraft =(survey)=>{
    return survey.data()["isDraft"];
}

SurveysStatic.getSurveyId = (survey)=>{
    return survey.data()["S_Uid"]
}


SurveysStatic.getName = (survey)=>{
    return survey.data()["Name"]
}

export default SurveysStatic;