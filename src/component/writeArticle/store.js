import {observable, action} from "mobx";

class ArticleStore{
    @observable ifPreview;
    @observable ifMdFile;
    // 这个是文章分类的列表
    @observable articleType;


    @observable titleVal;
    @observable textVal;
    @observable currentID;
    @observable currentType;
    @observable visible;

    @observable ifEdit;
    @observable ifSave;

    constructor(){
        this.ifPreview = true;
        this.titleVal = '';
        this.textVal = '';
        this.ifMdFile = false;
        this.articleType = [];
        this.currentType = "js";
        this.visible = true;

        this.currentID = "";
        this.ifEdit = false;
        this.ifSave = false;
    }

    @action
    toggleIfPreview(){
        this.ifPreview = !this.ifPreview;
    }

    @action
    toggleIfMdFile(){
        this.ifMdFile = !this.ifMdFile;
    }

    @action
    updateType(val){
        this.articleType = val;
    }


    

    @action
    updateCurrentID(val){
        this.currentID = val;
    }

    @action
    updateVisible(val){
        this.visible = val;
    }

    @action
    updateTitle(val){
        this.titleVal = val;
    }

    @action
    updateText(val){
        this.textVal = val;
    }

    @action
    updateCurrentType(val){
        this.currentType = val;
    }




    @action
    toggleIfSave(val){
        this.ifSave = val;
    }

    @action
    toggleIfEdit(val){
        this.ifEdit = val;
    }
}

const articleStore = new ArticleStore();

export default articleStore;