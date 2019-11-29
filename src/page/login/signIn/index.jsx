import React from 'react';
import './index.scss';
import { inject, observer } from "mobx-react";
import { Base64 } from 'js-base64';
import {IPContext} from './../../../context';
import axios from "axios";

@inject("UserStore","CurrentUser","TipStore")
@observer
class SignInDom extends React.Component{

    static contextType = IPContext;
    

    constructor(props){
        super(props);
        this.state={
            ifMemberMe: true,
        }
        this.handleSignIn = this.handleSignIn.bind(this);
        this.checkForm = this.checkForm.bind(this);
    }

    checkForm({userName:username, password}){
        const {UserStore:user} = this.props;
        if (username && password) {
            return true;
        } else {
            if(!username){
                user.changeStatus("nameNull");
            }
            if(!password){
                user.changeStatus("passwordNull");
            }
            return false;
        }
    }

    handleSignIn(){
        const {UserStore:user, CurrentUser:currentUser, TipStore:tipStore} = this.props;
        if(!this.checkForm(user)){
            return;
        }
        user.toggleSignInAnim();
        axios.post(this.context+"/login",{
            username: Base64.encode(user.userName),
            password: Base64.encode(user.password),
            ifMemberMe: this.state.ifMemberMe
        }).then(res => {
            const {status} = res.data;
            user.toggleSignInAnim();
            if(status === -1){
                user.changeStatus("passwordErr");
            }else if(status === 0){
                user.changeStatus("nameErr");
            }else{
                sessionStorage.setItem("currentUser",res.data.username);
                if(this.state.ifMemberMe){
                    localStorage.setItem("currentUser",res.data.username);
                }else{
                    localStorage.removeItem("currentUser");
                }
                currentUser.changeUserName(res.data.username);
                currentUser.toggleIfLogined(true);
                user.initial();
                user.toggleIfSignUp(false);
                this.props.history.replace('/home');
                tipStore.changeData("登录成功","success");
            }
        }).catch((err)=>{
            user.toggleSignInAnim();
            console.log(err);
            tipStore.changeData("登录失败","fail");
        });
    }

    render(){
        const {UserStore} = this.props;
        return(
            <div id="signinDom">
                <form id="signinForm">
                    <div className="group">
                        <label htmlFor="user" className="label">用户名</label>
                        <input onChange={(e) => {UserStore.updateUserName(e.target.value)}} value={UserStore.userName} placeholder="输入用户名" id="user" type="text" className="input" />
                        {UserStore.nameNull && <label className="errorMsg">请输入用户名!</label>}
                        {UserStore.nameErr && <label className="errorMsg">用户名或密码错误!</label>}
                        {UserStore.passwordErr && <label className="errorMsg">用户名不存在！</label>}
                        {UserStore.timeErr && <label className="errorMsg">身份认证已过期，请重新登陆！</label>}
                    </div>
                    <div className="group">
                        <label htmlFor="pass" className="label">密码</label>
                        <input onChange={(e) => {UserStore.updatePassword(e.target.value)}} value={UserStore.password} placeholder="输入密码" id="pass" type="password" className="input" data-type="password" />
                        {UserStore.passwordNull && <label className="errorMsg">请输入密码!</label>}
                    </div>
                    <div className="group">
                        <input onChange={(e) => {this.setState({ifMemberMe: !this.state.ifMemberMe})}} value={this.state.ifMemberMe} id="check" type="checkbox" className="check" defaultChecked/>
                        <label id="checkLabel" htmlFor="check">
                            <span className="icon"></span> 
                            Keep me Signed in
                        </label>
                    </div>
                    <div className="group">
                        {!UserStore.signInAnim?
                            <input onClick={(e) => {e.preventDefault();this.handleSignIn();}} type="submit" className="button" value="登录" />
                            :
                            <div className="loginAnim">
                                <div className="bounceDom">
                                    <div className="bounce1"></div>
                                    <div className="bounce2"></div>
                                    <div className="bounce3"></div>
                                </div>
                            </div>
                        }
                    </div>
                </form>
            </div>
        )
    }
}

export default SignInDom;