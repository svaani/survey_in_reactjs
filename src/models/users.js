import firebase from '../Firebase';

class Users {
    
    constructor(){
        this.UserObj = firebase.firestore().collection('Users');
    }

    get = ()=>{
        return this.UserObj.get();
    }

    byId = (userId)=>{
        this.UserObj = this.UserObj.where("U_Uid", '==', userId);
        return this;
    }

    byPassword = (password) =>{
        this.UserObj = this.UserObj.where("Password", '==', password);
        return this;
    }

    byEmail = (email) =>{
        this.UserObj = this.UserObj.where("Email", '==', email);
        return this;
    }
}

Users.getUserId = (user) => {
    return user.data()["U_Uid"];
}

export default Users;