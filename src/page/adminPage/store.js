import { action, observable } from "mobx";

class AdminStore{
    @observable ifUser;
    @observable ifArticle;

    @observable tableData;

    @observable isLoading;

    constructor(){
        this.ifUser = true;
        this.ifArticle = false;
        this.tableData = [];
        this.isLoading = true;
    }

    @action
    updateIsLoading(val){
        this.isLoading = val;
    }

    @action
    toggleStatus(tempIfUser,tempIfArticle){
        this.ifUser = tempIfUser;
        this.ifArticle = tempIfArticle;
    }

    @action
    updateData(val){
        this.tableData = val;
    }
}

const adminStore = new AdminStore();

export default adminStore;