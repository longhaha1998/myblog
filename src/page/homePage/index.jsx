import React, {Suspense}from 'react';
import {Link, Switch, Route, Redirect} from 'react-router-dom';
import { inject, observer } from "mobx-react";
import axios from 'axios';
import {IPContext} from './../../context';
const HomeContent = React.lazy(() => import('./homeContent'));
const DemoPage = React.lazy(() => import('../demo'));
const ArticlePage = React.lazy(() => import('../article'));
import defaultAvatar from "../../assets/image/default.jpg";
import quitIco from "../../assets/image/quit.png";
import changIco from "../../assets/image/change.png";
import LoadingPage from '../loadingPage';
import './index.scss'

@inject("UserStore", "CurrentUser", "TipStore")
@observer
class HomePage extends React.Component{

    static contextType = IPContext;

    constructor(props){
        super(props);
        this.avatarFile = React.createRef();
        this.handleClickAvatar = this.handleClickAvatar.bind(this);
        this.handleLoginOut = this.handleLoginOut.bind(this);
    }

    handleSelectFile(){
        let files = this.avatarFile.current.files[0];
        console.log(files);
        if(files.size>3*1024*1024){
            this.props.TipStore.changeData("所选文件不能超过3mb", "fail");
        }else{
            let formData = new FormData();
            formData.append("file",files);

            axios.post(this.context+"/postAvatar",formData,{
                headers:{'Content-Type':'multipart/form-data'}
            }).then(res =>{
                const {status} = res.data;
                if(status === 0){
                    this.props.TipStore.changeData("头像类型只能为jpg/jpeg/png","warning");
                }else if(status === 1){
                    let tempReader = new FileReader();
                    tempReader.readAsDataURL(new Blob([files],{type:res.data.mime}));
                    tempReader.onload = ()=> {
                        sessionStorage.setItem("avatar",JSON.stringify(tempReader.result));
                        if(localStorage.getItem("currentUser")){
                            localStorage.setItem("avatar",JSON.stringify(tempReader.result));
                        }
                        this.props.CurrentUser.changeAvatar(tempReader.result);
                    }
                    tempReader.onerror = ()=>{
                        throw new Error("获取头像出错！");
                    }
                }else{
                    this.props.TipStore.changeData("更换失败", "fail");
                }
            }).catch((err) =>{
                console.log(err);
                this.props.TipStore.changeData("网络原因，更换失败", "fail");
            })
        }
    }

    handleLoginOut(e){
        const {CurrentUser: currentUser} = this.props;
        e.preventDefault();
        axios.post(this.context+"/loginOut",{
            username: currentUser.userName
        }).then((res) => {
            sessionStorage.removeItem("currentUser");
            sessionStorage.removeItem("avatar");
            localStorage.removeItem("currentUser");
            localStorage.removeItem("avatar");
            currentUser.changeUser("", [], false);
            currentUser.changeAvatar("");
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
            this.props.TipStore.changeData("注销失败", "fail");
        });
    }

    handleClickAvatar(){
        this.props.history.push("/login");
    }

    render(){
        const {CurrentUser: currentUser} = this.props;
        return(
            <div id="homeDom">
                <header id="homeHead">
                    <div id="headLeftDom">LongHaHa's&nbsp;&nbsp;blog</div>
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
                                        <input ref={this.avatarFile} onChange={(e) => {this.handleSelectFile(e);}} accept=".jpg, .jpeg, .png" type="file" id="avatarFile"></input>
                                        <label htmlFor="avatarFile" id="changeAvatar"><img className="image" src={changIco}></img><span>更换头像</span></label>
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
                    <Route path="/home/article">
                        <Suspense fallback={<LoadingPage />}>
                            <ArticlePage />
                        </Suspense>
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