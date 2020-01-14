import firebase from '../Firebase';

class UserSurveyMap {
    
    constructor(){
        this.UserSurveyObj = firebase.firestore().collection('User_Survey_Map');
    }

    ref = ()=>{
        return  this.UserSurveyObj;
    }

    get = ()=>{
        return this.UserSurveyObj.get();
    }

    bySurveyId = (surveyId)=>{
        this.UserSurveyObj = this.UserSurveyObj.where("S_Uid", '==', surveyId);
        return this;
    }


    
    byUserId = (userId)=>{
        this.UserSurveyObj = this.UserSurveyObj.where("U_Uid", '==', userId);
        return this;
    }


}

UserSurveyMap.getUAMapId = (user) => {
    return user.data()["UA_Map_id"];
}

UserSurveyMap.getData = (val) => {
    return val.data();
}


UserSurveyMap.getDateTime = (val) => {
    return val.data()["DateTime"];
}

export default UserSurveyMap;