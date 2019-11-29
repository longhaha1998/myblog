import {observable, action, runInAction} from "mobx";

class TipStore{
    @observable tipData;
    @observable success;
    @observable fail;
    @observable warning

    @action
    changeData(val, type){
        this.tipData = val;
        this[type] = true;
        setTimeout(() => {
            runInAction(() => {
                this.tipData = "";
                this.success = false;
                this.fail = false;
                this.warning = false;
            })
        },1500);
    }

    constructor(){
        this.tipData = "";
        this.success = false;
        this.fail = false;
        this.warning = false;
    }
}

let tipStore = new TipStore();

export default tipStore;