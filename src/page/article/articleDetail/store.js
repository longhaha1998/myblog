import {observable, action} from "mobx";

class CurrentArticleStore{
    @observable currentArticleDetail

    constructor(){
        this.currentArticleDetail = {};
    }

    @action
    updateCurrentArticleDetail(val){
        this.currentArticleDetail = val;
    }
}

const currentArticleStore = new CurrentArticleStore();

export default currentArticleStore;