import React from 'react';
import './index.scss';
import { inject, observer } from "mobx-react";

@inject("PageNationStore")
@observer
class PageNationComponent extends React.Component{
    constructor(props){
        super(props);
        this.handleClickPage = this.handleClickPage.bind(this);
        this.handleClickMovePage = this.handleClickMovePage.bind(this);
        this.handleChangePageMaxNum = this.handleChangePageMaxNum.bind(this);
        this.handlePageNumChange = this.handlePageNumChange.bind(this);
    }

    handlePageNumChange(e){
        if(e.keyCode === 13 && Number(e.target.value) !== NaN){
            const {PageNationStore: pageNationStore} = this.props;
            let temp =  Number(e.target.value);
            if(temp>=1 && temp<=pageNationStore.pageNumber){
                pageNationStore.updateDataBegin(pageNationStore.dataBegin+(temp-pageNationStore.currentPage)*pageNationStore.pageSize);
                pageNationStore.updatePageBegin(temp-4>1?temp-4:1);
                pageNationStore.updateCurrentPage(temp);
                this.props.getArticleList(`${pageNationStore.requestType}&begin=${pageNationStore.dataBegin}&end=${pageNationStore.dataEnd}`);
            }
        }
    }

    handleChangePageMaxNum(e){
        const {PageNationStore: pageNationStore} = this.props;
        pageNationStore.updatePageSize(Number(e.target.value));
        pageNationStore.updateDataBegin(0);
        pageNationStore.updatePageBegin(1);
        pageNationStore.updateCurrentPage(1);
        this.props.getArticleList(`${pageNationStore.requestType}&begin=${pageNationStore.dataBegin}&end=${pageNationStore.dataEnd}`);
    }

    handleClickPage(i){
        const {PageNationStore: pageNationStore} = this.props;
        if(i !== pageNationStore.currentPage){
            pageNationStore.updateDataBegin(pageNationStore.dataBegin+(i-pageNationStore.currentPage)*pageNationStore.pageSize);
            pageNationStore.updateCurrentPage(i);
            this.props.getArticleList(`${pageNationStore.requestType}&begin=${pageNationStore.dataBegin}&end=${pageNationStore.dataEnd}`);
        }
    }

    handleClickMovePage(ifNext){
        const {PageNationStore: pageNationStore} = this.props;
        if(ifNext){
            if(pageNationStore.currentPage === pageNationStore.pageNumber){
                return;
            }else{
                pageNationStore.updateDataBegin(pageNationStore.dataBegin+pageNationStore.pageSize);
                if(pageNationStore.currentPage+1>pageNationStore.pageEnd){
                    pageNationStore.updatePageBegin(pageNationStore.pageBegin+1);
                }
                pageNationStore.updateCurrentPage(pageNationStore.currentPage+1);
                this.props.getArticleList(`${pageNationStore.requestType}&begin=${pageNationStore.dataBegin}&end=${pageNationStore.dataEnd}`);
            }
        }else{
            if(pageNationStore.currentPage === 1){
                return;
            }else{
                pageNationStore.updateDataBegin(pageNationStore.dataBegin-pageNationStore.pageSize);
                if(pageNationStore.currentPage-1<pageNationStore.pageBegin){
                    pageNationStore.updatePageBegin(pageNationStore.pageBegin-1);
                }
                pageNationStore.updateCurrentPage(pageNationStore.currentPage-1);
                this.props.getArticleList(`${pageNationStore.requestType}&begin=${pageNationStore.dataBegin}&end=${pageNationStore.dataEnd}`);
            }
        }
    }

    render(){
        const {PageNationStore: pageNationStore} = this.props;
        let pageList = [];
        for(let i = pageNationStore.pageBegin;i<=pageNationStore.pageEnd;i++){
            pageList.push((
                <a key={`page${i}`} onClick={(e) => {e.preventDefault();this.handleClickPage(i);}} className={pageNationStore.currentPage === i?'currentPageElement':''}>{i}</a>
            ))
        }
        let pageNumList = [];
        for(let i = 1;i<=pageNationStore.pageNumber;i++){
            pageNumList.push((
                <option key={`pageNum${i}`}>{i}</option>
            ));
        }
        return(
            pageNationStore.pageNumber>0
            &&
            <div id="pageNationDom">
                <div id="pageContainer">
                    <span id="currentPageNumSpan">当前页码：<a>{pageNationStore.currentPage}</a></span>
                    <a className="pageElementChange" onClick={(e) => {e.preventDefault();this.handleClickMovePage(false);}}>上一页</a>
                    {pageNationStore.pageBegin>1 && <a className="pageLeft" onClick={(e) => {e.preventDefault();}}>...</a>}
                        {pageList}
                    {pageNationStore.pageEnd<pageNationStore.pageNumber && <a className="pageLeft" onClick={(e) => {e.preventDefault();}}>...</a>}
                    <a className="pageElementChange" onClick={(e) => {e.preventDefault();this.handleClickMovePage(true);}}>下一页</a>


                    <span id="jumpToPageNumSpan">跳转至：第</span>
                    <input onChange={e => {pageNationStore.updatePageNumValue(e.target.value)}} onKeyDown={(e) => {this.handlePageNumChange(e);}} id="jumpToPageNumInput" list="pageNumList" value = {pageNationStore.pageNumValue}/>
                    <datalist id="pageNumList">
                        {pageNumList}
                    </datalist>
                    <span>页</span>

                    <span id="pageMaxNumSpan">当前页最大显示数：</span>
                    <select id="pageMaxNumSelect" value={pageNationStore.pageSize} onChange={e => {this.handleChangePageMaxNum(e);}}>
                        <option value={1}>{1}</option>
                        <option value={3}>{3}</option>
                        <option value={5}>{5}</option>
                        <option value={8}>{8}</option>
                        <option value={10}>{10}</option>
                    </select>
                </div>
            </div>
        )
    }
}

export default PageNationComponent;