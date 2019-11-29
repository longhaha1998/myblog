import {observable, action} from "mobx";

class CurrentUserStore {
    @observable userName;
    @observable ifLogined;

    constructor(){
        this.userName = null;
        this.ifLogined = false;
    }

    @action
    changeUserName(val){
        this.userName = val;
    }

    @action
    toggleIfLogined(val){
        this.ifLogined = val;
    }
}

const currentUser = new CurrentUserStore();

export default currentUser;