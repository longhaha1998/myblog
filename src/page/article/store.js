import {observable, action} from "mobx";

class ArticleVisualStore{
    @observable articleList

    @observable ifAll
    @observable ifMine

    constructor(){
        this.articleList = [];
        this.ifAll = true;
        this.ifMine = false;
    }

    @action
    toggleIfAll(val){
        this.ifAll = val;
    }

    @action
    toggleIfMine(val){
        this.ifMine = val;
    }

    @action
    updateList(val){
        this.articleList = val;
    }
}

const articleVisualStore = new ArticleVisualStore();

export default articleVisualStore;