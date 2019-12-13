import React, {Suspense}from 'react';
import {Link, Switch, Route, Redirect} from 'react-router-dom';
import { inject, observer } from "mobx-react";
import {Base64} from 'js-base64';
import axios from 'axios';
import {IPContext} from './../../context';
const HomeContent = React.lazy(() => import('./homeContent'));
const DemoPage = React.lazy(() => import('../demo'));
const ArticlePage = React.lazy(() => import('../article'));
const ChangeAvatarComponent = React.lazy(() => import("./../../component/changeAvatarComponent"));
const WriteArticle = React.lazy(() => import("../../component/writeArticle"));
const ArticleDetail = React.lazy(() => import("../../page/article/articleDetail"));
import defaultAvatar from "../../assets/image/default.jpg";
import quitIco from "../../assets/image/quit.png";
import changIco from "../../assets/image/change.png";
import cutIco from "../../assets/image/cut.png";
import LoadingPage from '../loadingPage';
import downLoadIco from '../../assets/image/download.png';
import writeIco from '../../assets/image/write.png';
import adminIco from '../../assets/image/admin.png';
import insertSort from '../../utils/insertSort';
import './index.scss'

@inject("UserStore", "CurrentUser", "TipStore", "ArticleStore")
@observer
class HomePage extends React.Component{

    static contextType = IPContext;

    constructor(props){
        super(props);
        this.avatarFile = React.createRef();
        this.handleClickAvatar = this.handleClickAvatar.bind(this);
        this.handleLoginOut = this.handleLoginOut.bind(this);
        this.handleChangeAvatar = this.handleChangeAvatar.bind(this);
        this.postAvatar = this.postAvatar.bind(this);
        this.downLoadAvatar = this.downLoadAvatar.bind(this);
        this.preventDefault = this.handleWriteArticle.bind(this);
    }

    componentDidMount(){
        if(localStorage.getItem("currentUser")){
            axios.get(this.context+"/ifLogined")
            .then( res => {
                if(res.data.status === -2){
                    this.props.history.replace('/login');
                    this.props.UserStore.changeStatus("timeErr");
                }
            }).catch(err => {
                console.log(err);
            })
        }
        axios.get(this.context+"/getArticleType")
        .then(res => {
            if(res.data.status === 1){
                let data = res.data.data;
                this.props.ArticleStore.updateType(insertSort(data, "num"));
            }
        }).catch(err => {
            console.log(err);
        })
    }

    handleSelectFile(){
        let files = this.avatarFile.current.files[0];
        if(files){
            if(files.size>3*1024*1024){
                this.props.TipStore.changeData("所选文件不能超过3mb", "fail");
            }else{
                this.postAvatar(files);
            }
        }
    }

    postAvatar(files){
        let formData = new FormData();
        formData.append("file",files);
        this.props.TipStore.toggleWaiting();
        axios.post(this.context+"/postAvatar",formData,{
            headers:{'Content-Type':'multipart/form-data'}
        }).then(res =>{
            const {status} = res.data;
            this.props.TipStore.toggleWaiting();
            if(status === 0){
                this.props.TipStore.changeData("头像类型只能为jpg/png,默认为jpg","warning");
            }else if(status === 1){
                let tempReader = new FileReader();
                tempReader.readAsDataURL(new Blob([files],{type:res.data.mime}));
                tempReader.onload = ()=> {
                    sessionStorage.setItem("avatar",JSON.stringify(tempReader.result));
                    sessionStorage.setItem("avatarType",JSON.stringify(res.data.mime));
                    if(localStorage.getItem("currentUser")){
                        localStorage.setItem("avatar",JSON.stringify(tempReader.result));
                        localStorage.setItem("avatarType",JSON.stringify(res.data.mime));
                    }
                    this.props.CurrentUser.changeAvatar(tempReader.result, res.data.mime);
                }
                tempReader.onerror = ()=>{
                    throw new Error("获取头像出错！");
                }
            }else{
                this.props.TipStore.changeData("更换失败", "fail");
            }
        }).catch((err) =>{
            console.log(err);
            if(this.props.TipStore.waiting){
                this.props.TipStore.toggleWaiting();
            }
            this.props.TipStore.changeData("网络原因，更换失败", "fail");
        });
    }

    handleLoginOut(e){
        const {CurrentUser: currentUser} = this.props;
        e.preventDefault();
        this.props.TipStore.toggleWaiting();
        axios.post(this.context+"/loginOut",{
            username: currentUser.userName
        }).then((res) => {
            this.props.TipStore.toggleWaiting();
            sessionStorage.removeItem("currentUser");
            sessionStorage.removeItem("avatar");
            localStorage.removeItem("currentUser");
            localStorage.removeItem("avatar");
            currentUser.changeUser("", [], false);
            currentUser.changeAvatar("","");
            if(res.data.status === -2){
                this.props.history.replace('/login');
                this.props.UserStore.changeStatus("timeErr");
            }
            if(res.data.status === 1){
                this.props.history.replace('/');
                this.props.TipStore.changeData("注销成功", "success");
            }
        }).catch((err) => {
            console.log(err);
            if(this.props.TipStore.waiting){
                this.props.TipStore.toggleWaiting();
            }
            this.props.TipStore.changeData("注销失败", "fail");
        });
    }

    handleChangeAvatar(){
        if(this.props.location.pathname !==" /home/ChangeAvatar"){
            this.props.history.push({
                pathname: '/home/ChangeAvatar',
                search: `?preURL=${this.props.location.pathname}`
            });
        }
    }


    handleClickAvatar(){
        this.props.history.push("/login");
    }

    downLoadAvatar(e){
        e.preventDefault();
        this.props.TipStore.toggleWaiting();
        axios.get(this.context+`/avatar?username=${Base64.encode(this.props.CurrentUser.userName)}`,{
            responseType: 'blob' 
        }).then(avatarRes => {
            let blob = new Blob([avatarRes.data], {type: this.props.CurrentUser.avatarType});
            let tempA = document.createElement("a");
            let tempHref = window.getBlobURL(blob);
            tempA.href = tempHref;
            tempA.download = this.props.CurrentUser.avatarType.split('/')[1]==='jpeg'?Base64.encode(this.props.CurrentUser.userName)+'.jpg':Base64.encode(this.props.CurrentUser.userName)+'.png';
            document.body.appendChild(tempA);
            tempA.click();
            this.props.TipStore.toggleWaiting();
            document.body.removeChild(tempA);
            setTimeout(() => {
                window.revokeBlobURL(tempHref);
            },1000);
        }).catch(err => {
            if(this.props.TipStore.waiting){
                this.props.TipStore.toggleWaiting();
            }
            console.log(err);
            tipStore.changeData("头像获取失败","fail");
        })
    }

    handleWriteArticle(e){
        e.preventDefault();
        this.props.history.push('/home/writeArticle');
    }

    render(){
        const {CurrentUser: currentUser} = this.props;
        return(
            <div id="homeDom">
                <header id="homeHead">
                    <div id="headLeftDom"><a href="/home">LongHaHa's&nbsp;&nbsp;blog</a></div>
                    <div id="headRightDom">
                        <Link to="/home">首页</Link>
                        <Link to="/home/article">文章</Link>
                        <Link to="/home/demo">demo</Link>
                        <a id="contactMe">联系本人</a>
                        <div id="avatar">
                            {!currentUser.ifLogined?
                                <div onClick={(e) => this.handleClickAvatar(e)} id="avatarDom">
                                    <img id="avatarImg" src={defaultAvatar}></img>
                                </div>
                                :
                                <div id="loginedDom">
                                    {!currentUser.avatar?
                                        <img id="loginedImg" src={defaultAvatar}></img>
                                        :
                                        <img id="loginedImg" src={currentUser.avatar}></img>
                                    }
                                    <div id="loginOutDom">
                                        {currentUser.role.indexOf("666")>-1 && <a onClick={(e) => {e.preventDefault();}}><img className="image" src={adminIco}></img><span>后台管理</span></a>}
                                        {currentUser.role.indexOf("2")>-1 && <a onClick={(e) => {e.preventDefault();this.handleWriteArticle(e);}}><img className="image" src={writeIco}></img><span>写文章</span></a>}
                                        <input ref={this.avatarFile} onChange={(e) => {this.handleSelectFile(e);}} accept=".jpg, .jpeg, .png" type="file" id="avatarFile"></input>
                                        <label htmlFor="avatarFile" id="changeAvatar"><img className="image" src={changIco}></img><span>更换头像</span></label>
                                        <a onClick={(e) => {this.downLoadAvatar(e);}}><img className="image" src={downLoadIco}></img><span>下载头像</span></a>
                                        <a id="changeAvatar" onClick={(e) => {this.handleChangeAvatar(e);}}><img className="image" src={cutIco}></img><span>裁剪头像</span></a>
                                        <a id="loginOut" onClick={(e) => {this.handleLoginOut(e);}}><img className="image" src={quitIco}></img><span>退出登录</span></a>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </header>
                <Switch>
                    <Route exact path="/home" render={(routeProp) => (
                        <Suspense fallback={<LoadingPage />}>
                            <HomeContent {...routeProp}/>
                        </Suspense>
                    )}>
                    </Route>

                    <Route path="/home/demo">
                        <Suspense fallback={<LoadingPage />}>
                            <DemoPage />
                        </Suspense>
                    </Route>

                    <Route path="/home/article" render={(routeProp) => (
                        <Suspense fallback={<LoadingPage />}>
                            <ArticlePage {...routeProp}/>
                        </Suspense>
                    )}>
                    </Route>

                    <Route path="/home/ChangeAvatar" render={(routeProp) => (
                        <Suspense fallback={<LoadingPage />}>
                            <ChangeAvatarComponent {...routeProp} postAvatar={this.postAvatar}/>
                        </Suspense>
                    )}>
                    </Route>

                    <Route path="/home/writeArticle" render={(routeProp) => (
                        <Suspense fallback={<LoadingPage />}>
                            <WriteArticle {...routeProp}/>
                        </Suspense>
                    )}>
                    </Route>

                    <Route path="/home/articleDetail/:articleId" render={(routeProp) => (
                        <Suspense fallback={<LoadingPage />}>
                            <ArticleDetail {...routeProp}/>
                        </Suspense>
                    )}>
                    </Route>

                    <Route path="*">
                        <Redirect to="/404"></Redirect>
                    </Route>
                </Switch>
                <footer id="homefooter">
                    @Copyright 2019-01-01 longhaha All rights Reserved
                </footer>
            </div>
        )
    }
}

export default HomePage;