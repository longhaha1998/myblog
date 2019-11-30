import {observable, action} from "mobx";

class CurrentUserStore {
    @observable userName;
    @observable ifLogined;
    @observable role;
    @observable avatar;


    constructor(){
        this.userName = null;
        this.ifLogined = false;
        this.avatar = "";
        this.role = [];
    }

    @action
    changeUserName(val){
        this.userName = val;
    }

    @action
    changeRole(arr){
        this.role = arr;
    }

    @action
    toggleIfLogined(val){
        this.ifLogined = val;
    }

    @action
    changeUser(name, arr, flag){
        this.userName = name;
        this.role = arr;
        this.ifLogined = flag;
    }

    @action
    changeAvatar(val){
        this.avatar = val;
    }
}

const currentUser = new CurrentUserStore();

export default currentUser;