import {observable, action, computed} from 'mobx';

class PageNationStore{
    // 当前所在页码
    @observable currentPage
    // 数据总数
    @observable dataSize
    // 每页展示多少条数据
    @observable pageSize
    // 分页列表的第一项
    @observable pageBegin
    // 数据列表的第一项
    @observable dataBegin

    @observable requestType
    @observable pageNumValue
    @observable searchVal


    constructor(){
        this.currentPage = 1;
        this.dataSize = 0;
        this.pageSize = 3;
        this.pageBegin = 1;
        this.dataBegin = 0;
        this.requestType = "";
        this.pageNumValue = "";
        // 搜索文章的变量
        this.searchVal = "";
    }

    // 总共有多少页数据
    @computed get pageNumber(){
        return Math.ceil(this.dataSize/this.pageSize);
    }

    // 分页列表的最后一项
    @computed get pageEnd(){
        return (this.pageBegin+4)>=this.pageNumber?this.pageNumber:(this.pageBegin+4);
    }

    // 数据列表的最后一项
    @computed get dataEnd(){
        return this.dataBegin+this.pageSize-1;
    }

    @action
    updateCurrentPage(val){
        this.currentPage = val;
    }

    @action
    updateDataSize(val){
        this.dataSize = val;
    }

    @action
    updatePageSize(val){
        this.pageSize = val;
    }

    @action
    updatePageBegin(val){
        this.pageBegin = val;
    }

    @action
    updateDataBegin(val){
        this.dataBegin = val;
    }

    @action
    updatePageNumValue(val){
        this.pageNumValue = val;
    }

    // 更新搜索文章的变量
    @action
    updatesSearchVal(val){
        this.searchVal = val;
    }
}

const pageNationStore = new PageNationStore();

export default pageNationStore;