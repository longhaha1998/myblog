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
        this.handleClickAvatar = this.handleClickAvatar.bind(this);
        this.handleLoginOut = this.handleLoginOut.bind(this);
    }

    handleLoginOut(e){
        const {CurrentUser: currentUser} = this.props;
        e.preventDefault();
        axios.post(this.context+"/loginOut",{
            username: currentUser.userName
        }).then((res) => {
            sessionStorage.removeItem("currentUser");
            localStorage.removeItem("currentUser");
            currentUser.changeUserName("");
            currentUser.toggleIfLogined(false);
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
                            {!currentUser.userName?
                                <div onClick={(e) => this.handleClickAvatar(e)} id="avatarDom">
                                    <img id="avatarImg" src={defaultAvatar}></img>
                                </div>
                                :
                                <div id="loginedDom">
                                    <img id="loginedImg" src={defaultAvatar}></img>
                                    <div id="loginOutDom">
                                        {/* <a id="changeAvatar" onClick={}><img className="image" src={changIco}></img><span>更换头像</span></a> */}
                                        <a id="loginOut" onClick={(e) => {this.handleLoginOut(e)}}><img className="image" src={quitIco}></img><span>退出登录</span></a>
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