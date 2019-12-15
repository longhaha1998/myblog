import React, {Suspense} from "react";
import './index.scss';
import {inject, observer} from 'mobx-react';
import axios from 'axios';
import {IPContext} from './../../context.js';
const PageNationComponent = React.lazy(() => import("../../component/pageNation"));
import LoadingPage from "../loadingPage"

@inject("AdminStore", "TipStore", "CurrentUser", "PageNationStore")
@observer
class AdminPage extends React.Component{

    static contextType = IPContext;

    constructor(props){
        super(props);
        this.handleClickUserM = this.handleClickUserM.bind(this);
        this.handleClickArticleM = this.handleClickArticleM.bind(this);
        this.renderAdminTHead = this.renderAdminTHead.bind(this);
        this.renderAdminTBody = this.renderAdminTBody.bind(this);
        this.getAllArticle = this.getAllArticle.bind(this);
        this.handleChangeRight = this.handleChangeRight.bind(this);
        this.getTableList = this.getTableList.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.initialPageNationState = this.initialPageNationState.bind(this);
        this.deleteArticle = this.deleteArticle.bind(this);
        this.handleSearchArticle = this.handleSearchArticle.bind(this);
        this.handleSearchUser = this.handleSearchUser.bind(this);
    }

    initialPageNationState(){
        const {PageNationStore: pageNationStore} = this.props;
        pageNationStore.updateDataBegin(0);
        pageNationStore.updatePageBegin(1);
        pageNationStore.updateCurrentPage(1);
    }

    componentDidMount(){
        const {AdminStore: adminStore, TipStore: tipStore, CurrentUser: currentUser} = this.props;
        if(!currentUser.ifLogined || !(currentUser.role.indexOf("666")>-1)){
            if(sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser')){
                let tempCurrentUser = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');
                let user = JSON.parse(tempCurrentUser);
                if(!(user.role.indexOf("666")>-1)){
                    tipStore.changeData("无权限，请联系管理员","warning");
                    this.props.history.replace("/home");
                    return;
                }
            }else{
                tipStore.changeData("无权限，请联系管理员","warning");
                this.props.history.replace("/home");
                return;
            }
        }
        this.props.PageNationStore.updatePageSize(5);
        if(adminStore.ifUser){
            this.getAllUser();
        }else{
            adminStore.toggleStatus(true, false);
            this.getAllUser();
        }
    }

    getTableList(address){
        const {AdminStore: adminStore, TipStore: tipStore, PageNationStore: pageNationStore} = this.props;
        tipStore.toggleWaiting();
        axios.get(address)
        .then(res => {
            tipStore.toggleWaiting();
            if(res.data.status === 1){
                adminStore.updateData(res.data.data);
                pageNationStore.updateDataSize(res.data.count);
                pageNationStore.updatePageNumValue("");
                pageNationStore.updatesSearchVal("");
                adminStore.updateIsLoading(false);
            }else{
                tipStore.changeData("数据获取失败","fail");
            }
        }).catch(err => {
            if(tipStore.waiting){
                tipStore.toggleWaiting();
            }
            tipStore.changeData("获取用户数据失败","fail");
            console.log(err);
        })
    }

    deleteArticle(id){
        const {AdminStore: adminStore, TipStore: tipStore, PageNationStore: pageNationStore} = this.props;
        tipStore.toggleWaiting();
        axios.delete(this.context+`/deleteArticleById?id=${id}&begin=${pageNationStore.dataBegin}&end=${pageNationStore.dataEnd}`)
        .then(res => {
            tipStore.toggleWaiting();
            if(res.data.status === 1){
                adminStore.updateData(res.data.data);
                pageNationStore.updateDataSize(res.data.count);
                pageNationStore.updatePageNumValue("");
                pageNationStore.updatesSearchVal("");
                if(pageNationStore.dataBegin>=res.data.count){
                    pageNationStore.updateDataBegin(pageNationStore.dataBegin-pageNationStore.pageSize);
                    pageNationStore.updateCurrentPage(pageNationStore.currentPage-1);
                    this.getAllArticle();
                }
                tipStore.changeData("删除成功","success");
            }else{
                tipStore.changeData("删除失败","fail")
            }
        }).catch(err => {
            if(tipStore.waiting){
                tipStore.toggleWaiting();
            }
            tipStore.changeData("删除失败，网络原因","fail");
            console.log(err);
        })
    }

    deleteUser(username){
        const {AdminStore: adminStore, TipStore: tipStore, PageNationStore: pageNationStore} = this.props;
        tipStore.toggleWaiting();
        axios.delete(this.context+`/deleteUserByName?user=${username}&begin=${pageNationStore.dataBegin}&end=${pageNationStore.dataEnd}`,{timeout:90000})
        .then(res => {
            tipStore.toggleWaiting();
            if(res.data.status === 1){
                adminStore.updateData(res.data.data);
                pageNationStore.updateDataSize(res.data.count);
                pageNationStore.updatePageNumValue("");
                pageNationStore.updatesSearchVal("");
                if(pageNationStore.dataBegin>=res.data.count){
                    pageNationStore.updateDataBegin(pageNationStore.dataBegin-pageNationStore.pageSize);
                    pageNationStore.updateCurrentPage(pageNationStore.currentPage-1);
                    this.getAllUser();
                }
                tipStore.changeData("删除成功","success");
            }else{
                tipStore.changeData("删除失败","fail")
            }
        }).catch(err => {
            if(tipStore.waiting){
                tipStore.toggleWaiting();
            }
            tipStore.changeData("删除失败，网络原因","fail");
            console.log(err);
        });
    }

    handleChangeRight(e, username, ifAdd, ifWrite){
        const {AdminStore: adminStore, TipStore: tipStore, PageNationStore: pageNationStore} = this.props;
        tipStore.toggleWaiting();
        axios.get(this.context+`/updateRight?user=${username}&ifAdd=${ifAdd}&ifWrite=${ifWrite}&begin=${pageNationStore.dataBegin}&end=${pageNationStore.dataEnd}`)
        .then(res => {
            tipStore.toggleWaiting();
            if(res.data.status === 1){
                adminStore.updateData(res.data.data);
                pageNationStore.updateDataSize(res.data.count);
                pageNationStore.updatePageNumValue("");
                pageNationStore.updatesSearchVal("");
                tipStore.changeData("更新成功","success");
            }else{
                tipStore.changeData("更新失败","fail");
            }
        }).catch(err => {
            if(tipStore.waiting){
                tipStore.toggleWaiting();
            }
            tipStore.changeData("更新失败","fail");
            console.log(err);
        })
    }

    getAllUser(){
        const {AdminStore: adminStore, PageNationStore: pageNationStore} = this.props;
        adminStore.updateIsLoading(true);
        this.initialPageNationState();
        adminStore.toggleStatus(true, false);
        this.getTableList(this.context+`/getAllUser?type=allUser&begin=${pageNationStore.dataBegin}&end=${pageNationStore.dataEnd}`);
        pageNationStore.requestType = this.context+"/getAllUser?type=allUser";
    }

    getAllArticle(){
        const {AdminStore: adminStore, PageNationStore: pageNationStore} = this.props;
        adminStore.updateIsLoading(true);
        this.initialPageNationState();
        adminStore.toggleStatus(false, true);
        this.getTableList(this.context+`/getAllArticle?type=allArticle&begin=${pageNationStore.dataBegin}&end=${pageNationStore.dataEnd}`);
        pageNationStore.requestType = this.context+"/getAllArticle?type=allArticle";
    }

    handleClickUserM(e){
        const {AdminStore: adminStore, PageNationStore: pageNationStore} = this.props;
        e.preventDefault();
        if(!adminStore.ifUser || pageNationStore.requestType === this.context+`/getSearchUserList?type=searchUserList`){
            this.getAllUser();
        }

    }

    handleClickArticleM(e){
        const {AdminStore: adminStore, PageNationStore: pageNationStore} = this.props;
        e.preventDefault();
        if(this.props.CurrentUser.role.indexOf("super")>-1){
            if(!adminStore.ifArticle || pageNationStore.requestType === this.context+`/getSearchList?type=searchList`){
                this.getAllArticle();
            }
        }else{
            this.props.TipStore.changeData("无权限，请联系超管","warning");
        }
    }

    renderAdminTHead(){
        const {AdminStore: adminStore, TipStore: tipStore} = this.props;
        return(
            <thead>
                {
                    adminStore.ifUser?
                    <tr>
                        <th>用户名</th>
                        <th>已有权限</th>
                        <th>创建时间</th>
                        <th>未有权限</th>
                        <th>操作</th>
                    </tr>
                    :
                    <tr>
                        <th>标题</th>
                        <th>作者</th>
                        <th>文章分类</th>
                        <th>创建时间</th>
                        <th>最近更新</th>
                        <th>操作</th>
                    </tr>
                }
            </thead>
        )
    }

    renderAdminTBody(){
        const {AdminStore: adminStore, TipStore: tipStore, CurrentUser: currentUser} = this.props;
        return(
            <tbody>
                {
                    adminStore.ifUser?
                    adminStore.tableData.map(ele => (
                        currentUser.userName === ele.username || ele.role.indexOf("super")>-1?
                        <tr key={ele.username} className="forbiddenTr">
                            <td>{ele.username}</td>
                            <td className="btnTd"><span>禁用</span></td>
                            <td>{ele.create_time.slice(0,10)}</td>
                            <td className="btnTd"><span>禁用</span></td>
                            <td className="deleteTd"><span>禁用</span></td>
                        </tr>
                        :
                        <tr key={ele.username}>
                            <td>{ele.username}</td>
                            <td className="btnTd">
                                {(ele.role.indexOf("2")>-1) && <a onClick={e => {e.preventDefault();this.handleChangeRight(e, ele.username, false, true)}}>写文章</a>}
                                {(ele.role.indexOf("666")>-1) && <a onClick={e => {e.preventDefault();this.handleChangeRight(e, ele.username, false, false)}}>管理员</a>}
                            </td>
                            <td>{ele.create_time.slice(0,10)}</td>
                            <td className="btnTd">
                                {!(ele.role.indexOf("2")>-1) && <a onClick={e => {e.preventDefault();this.handleChangeRight(e, ele.username, true, true)}}>写文章</a>}
                                {!(ele.role.indexOf("666")>-1) && <a onClick={e => {e.preventDefault();this.handleChangeRight(e, ele.username, true, false)}}>管理员</a>}
                            </td>
                            <td className="deleteTd"><a onClick={e => {e.preventDefault();this.deleteUser(ele.username)}}>删除用户</a></td>
                        </tr>
                    ))
                    :
                    adminStore.tableData.map(ele => (                        
                        <tr key={ele.id}>
                            <td className="titleTd"><abbr title={ele.title}>{ele.title}</abbr></td>
                            <td>{ele.author}</td>
                            <td>{ele.type}</td>
                            <td>{ele.create_time.slice(0,10)}</td>
                            <td>{ele.update_time.slice(0,10)}</td>
                            <td className="deleteTd"><a onClick={e => {e.preventDefault();this.deleteArticle(ele.id);}}>删除文章</a></td>
                        </tr>
                    ))
                }
            </tbody>
        )
    }

    handleSearchArticle(e){
        if(e.keyCode === 13){
            const {PageNationStore: pageNationStore} = this.props;
            this.initialPageNationState();
            this.getTableList(this.context+`/getSearchList?type=searchList&searchVal=${pageNationStore.searchVal}&begin=${pageNationStore.dataBegin}&end=${pageNationStore.dataEnd}`);
            pageNationStore.requestType = this.context+`/getSearchList?type=searchList`;
        }
    }

    handleSearchUser(e){
        if(e.keyCode === 13){
            const {PageNationStore: pageNationStore} = this.props;
            this.initialPageNationState();
            this.getTableList(this.context+`/getSearchUserList?type=searchUserList&searchVal=${pageNationStore.searchVal}&begin=${pageNationStore.dataBegin}&end=${pageNationStore.dataEnd}`);
            pageNationStore.requestType = this.context+`/getSearchUserList?type=searchUserList`;
        }
    }

    render(){
        const {AdminStore: adminStore, PageNationStore: pageNationStore} = this.props;
        return(
            adminStore.isLoading?
            <div id="adminLoadingDom"></div>
            :
            <div id="adminPageDom">
                <nav id="adminNav">
                    <a onClick={e => {this.handleClickUserM(e)}}>用户管理</a>
                    <a onClick={e => {this.handleClickArticleM(e)}}>文章管理</a>
                </nav>
                <main id="adminMain">
                    {
                        adminStore.ifArticle
                        ?
                        <div id="adminArticleTabDom">
                            <input onKeyDown={(e) => {this.handleSearchArticle(e);}} onChange={ e => {pageNationStore.updatesSearchVal(e.target.value)}} value={pageNationStore.searchVal} type="text" placeholder="按标题搜索" id="adminSearchArticleInput"/>
                        </div>
                        :
                        <div id="adminArticleTabDom">
                            <input onKeyDown={(e) => {this.handleSearchUser(e);}} onChange={ e => {pageNationStore.updatesSearchVal(e.target.value)}} value={pageNationStore.searchVal} type="text" placeholder="按用户名搜索" id="adminSearchArticleInput"/>
                        </div>
                    }
                    <div id="adminTableContainer">
                        <table id="adminTable">
                            {this.renderAdminTHead()}
                            {this.renderAdminTBody()}
                        </table>
                    </div>
                    <div id="tablePageNationDom">
                        <Suspense fallback={<LoadingPage />}>
                            <PageNationComponent getArticleList={this.getTableList}/>
                        </Suspense>
                    </div>
                </main>
            </div>
        )
    }
}

export default AdminPage;