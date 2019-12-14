import React, {Suspense} from 'react';
import LoadingPage from "../loadingPage"
import './index.scss';
import {IPContext} from '../../context';
import { inject, observer } from "mobx-react";
const ArticleContainer = React.lazy(() => import("./articleContainer"));
const PageNationComponent = React.lazy(() => import("../../component/pageNation"));
import  axios from 'axios';

@inject("ArticleStore", "TipStore", "CurrentUser", "ArticleVisualStore", "PageNationStore")
@observer
class ArticlePage extends React.Component{

    static contextType = IPContext;

    constructor(props){
        super(props);
        this.getArticleList = this.getArticleList.bind(this);
        this.handleGetAll = this.handleGetAll.bind(this);
        this.handleGetMine = this.handleGetMine.bind(this);
        this.handleClickType = this.handleClickType.bind(this);
        this.handleClickTab1 = this.handleClickTab1.bind(this);
        this.handleClickTab2 = this.handleClickTab2.bind(this);
        this.initialPageNationState = this.initialPageNationState.bind(this);
        this.handleSearchArticle = this.handleSearchArticle.bind(this);
    }

    initialPageNationState(){
        const {PageNationStore: pageNationStore} = this.props;
        pageNationStore.updateDataBegin(0);
        pageNationStore.updatePageBegin(1);
        pageNationStore.updateCurrentPage(1);
    }

    componentDidMount(){
        const {PageNationStore: pageNationStore} = this.props;
        this.props.PageNationStore.updatePageSize(3);
        this.initialPageNationState();
        this.getArticleList(this.context+`/getArticleList?type=articleList&begin=${pageNationStore.dataBegin}&end=${pageNationStore.dataEnd}`);
        pageNationStore.requestType = this.context+`/getArticleList?type=articleList`;
        this.props.ArticleVisualStore.toggleIfAll(true);
        this.props.ArticleVisualStore.toggleIfMine(false);
    }

    handleSearchArticle(e){
        if(e.keyCode === 13){
            const {PageNationStore: pageNationStore} = this.props;
            this.initialPageNationState();
            this.getArticleList(this.context+`/getSearchList?type=searchList&searchVal=${pageNationStore.searchVal}&begin=${pageNationStore.dataBegin}&end=${pageNationStore.dataEnd}`);
            pageNationStore.requestType = this.context+`/getSearchList?type=searchList`;
        }
    }

    handleGetAll(){
        const {PageNationStore: pageNationStore} = this.props;
        if(!this.props.ArticleVisualStore.ifAll){
            this.initialPageNationState();
            this.getArticleList(this.context+`/getArticleList?type=articleList&begin=${pageNationStore.dataBegin}&end=${pageNationStore.dataEnd}`);
            pageNationStore.requestType = this.context+`/getArticleList?type=articleList`;
            this.props.ArticleVisualStore.toggleIfAll(true);
            this.props.ArticleVisualStore.toggleIfMine(false);
        }
    }

    handleGetMine(){
        const {PageNationStore: pageNationStore} = this.props;
        if(!this.props.ArticleVisualStore.ifMine){
            this.initialPageNationState();
            this.getArticleList(this.context+`/getMyArticle?type=${this.props.CurrentUser.userName}ArticleCache&user=${this.props.CurrentUser.userName}&begin=${pageNationStore.dataBegin}&end=${pageNationStore.dataEnd}`);
            pageNationStore.requestType = this.context+`/getMyArticle?type=${this.props.CurrentUser.userName}ArticleCache&user=${this.props.CurrentUser.userName}`;
            this.props.ArticleVisualStore.toggleIfAll(false);
            this.props.ArticleVisualStore.toggleIfMine(true);
        }
    }

    getArticleList(address){
        const {PageNationStore: pageNationStore} = this.props;
        this.props.TipStore.toggleWaiting();
        axios.get(address)
        .then(res => {
            this.props.TipStore.toggleWaiting();
            if(res.data.status === 1){
                this.props.ArticleVisualStore.updateList(res.data.data);
                pageNationStore.updateDataSize(res.data.count);
                pageNationStore.updatePageNumValue("");
                pageNationStore.updatesSearchVal("");
            }
            if(res.data.status === -2){
                this.props.TipStore.changeData("登录已过期，请重新登录","warning");
            }
        }).catch(err => {
            console.log(err);
            if(this.props.TipStore.waiting){
                this.props.TipStore.toggleWaiting();
            }
            this.props.TipStore.changeData("网络错误","warning");
        })
    }

    handleClickTab1(){
        const {PageNationStore: pageNationStore} = this.props;
        if(this.props.ArticleVisualStore.ifAll){
            this.initialPageNationState();
            this.getArticleList(this.context+`/getArticleList?type=articleList&begin=${pageNationStore.dataBegin}&end=${pageNationStore.dataEnd}`);
            pageNationStore.requestType = this.context+`/getArticleList?type=articleList`;
        }
    }

    handleClickTab2(){
        const {PageNationStore: pageNationStore} = this.props;
        if(!this.props.CurrentUser.ifLogined){
            this.props.TipStore.changeData("请先登录","warning");
            return;
        }else{
            if(this.props.ArticleVisualStore.ifMine){
                this.initialPageNationState();
                this.getArticleList(this.context+`/getMyArticle?type=${this.props.CurrentUser.userName}ArticleCache&user=${this.props.CurrentUser.userName}&begin=${pageNationStore.dataBegin}&end=${pageNationStore.dataEnd}`);
                pageNationStore.requestType = this.context+`/getMyArticle?type=${this.props.CurrentUser.userName}ArticleCache&user=${this.props.CurrentUser.userName}`;
            }
            return;
        }
    }

    handleClickType(type){
        const {PageNationStore: pageNationStore} = this.props;
        if(pageNationStore.requestType === this.context+`/getArticleList?type=${type}ArticleList` || pageNationStore.requestType === this.context+`/getMyArticle?type=${this.props.CurrentUser.userName}${type}ArticleCache&user=${this.props.CurrentUser.userName}`){
            return;
        }
        this.initialPageNationState();
        if(this.props.ArticleVisualStore.ifAll){
            this.getArticleList(this.context+`/getArticleList?type=${type}ArticleList&begin=${pageNationStore.dataBegin}&end=${pageNationStore.dataEnd}`);
            pageNationStore.requestType = this.context+`/getArticleList?type=${type}ArticleList`;
        }else{
            this.getArticleList(this.context+`/getMyArticle?type=${this.props.CurrentUser.userName}${type}ArticleCache&user=${this.props.CurrentUser.userName}&begin=${pageNationStore.dataBegin}&end=${pageNationStore.dataEnd}`);
            pageNationStore.requestType = this.context+`/getMyArticle?type=${this.props.CurrentUser.userName}${type}ArticleCache&user=${this.props.CurrentUser.userName}`;
        }
    }

    render(){
        const {ArticleStore:articleStore, CurrentUser:currentUser, PageNationStore:pageNationStore} = this.props;
        const linkList = articleStore.articleType.map(item => (
            <a onClick={(e) => {e.preventDefault();this.handleClickType(item.id);}} key={item.id} title={item.name}>{item.name}</a>
        ))
        return(
            <div id="articleBox">
                <main id="articleMain">
                    <nav id="articleNav">
                        {linkList}
                    </nav>
                    <div id="articleListDom">
                        <div id="articleTabDom">
                            <input onChange={(e) => {this.handleGetAll(e);}} id="article-tab-1" type="radio" name="article-tab" className="article-tab-all" defaultChecked/>
                            <label htmlFor="article-tab-1" className="article-tab" onClick={(e) => {this.handleClickTab1()}}>全部文章</label>
                            <input onChange={(e) => {this.handleGetMine(e);}} id="article-tab-2" type="radio" name="article-tab" className="article-tab-mine" disabled={!this.props.CurrentUser.ifLogined?"disabled":""}/>
                            <label htmlFor="article-tab-2" className="article-tab" onClick={(e) => {this.handleClickTab2()}}>我的文章</label>
                            <input onKeyDown={(e) => {this.handleSearchArticle(e);}} onChange={ e => {pageNationStore.updatesSearchVal(e.target.value)}} value={pageNationStore.searchVal} type="text" placeholder="按标题搜索" id="searchArticleInput"/>
                        </div>
                        <Suspense fallback={<LoadingPage />}>
                            <ArticleContainer history={this.props.history}/>
                        </Suspense>
                        <Suspense fallback={<LoadingPage />}>
                            <PageNationComponent getArticleList={this.getArticleList}/>
                        </Suspense>
                    </div>
                </main>
            </div>
        )
    }
}

export default ArticlePage;