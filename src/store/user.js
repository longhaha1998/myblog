import {observable, action} from "mobx";

class CurrentUserStore {
    @observable userName;

    constructor(){
        this.userName = null;
    }

    @action
    changeUserName(val){
        this.userName = val;
    }
}

export default new CurrentUserStore();