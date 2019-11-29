import {action, observable} from "mobx";

class WelcomeAnimStore {
    @observable ifPlayedAnim;

    constructor(){
        this.ifPlayedAnim = false;
    }

    @action
    changeIfPlayAnim (val) {
        this.ifPlayedAnim = val?true:false;
    }
}

let welcomeAnimStore = new WelcomeAnimStore();

export default welcomeAnimStore;