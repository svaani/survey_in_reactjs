import firebase from '../Firebase';

class UserQAMap {
    
    constructor(){
        this.UserMapObj = firebase.firestore().collection('User_QA_Map');
    }

    ref =()=>{
        return this.UserMapObj;
    }

    get = ()=>{
        return this.UserMapObj.get();
    }

    byUAMapId = (id)=>{
        this.UserMapObj = this.UserMapObj.where("UA_Map_id", '==', id);
        return this;
    }

}

UserQAMap.getQuestionId = (question) => {
    return question.data()["Q_Uid"];
}


UserQAMap.getAnswerId = (answer) => {
    return answer.data()["A_Uid"];
}

export default UserQAMap;