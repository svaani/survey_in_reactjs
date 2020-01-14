import firebase from '../Firebase';

class User_Roles_Map {
    
    constructor(){
        this.UserRolesObj = firebase.firestore().collection('User-Roles-Map');
    }

    get = ()=>{
        return this.UserRolesObj.get();
    }

    
    byId = (userId)=>{
        this.UserRolesObj = this.UserRolesObj.where("U_Uid", '==', userId)
        return this;
    }
}

User_Roles_Map.getRoleName = (snapshotdoc) =>{
    return snapshotdoc.data()["RoleName"];
}

export default User_Roles_Map;