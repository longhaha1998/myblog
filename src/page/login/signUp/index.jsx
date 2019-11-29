import React from 'react';
import './index.scss';
import { inject, observer } from "mobx-react";
import { Base64 } from 'js-base64';
import {IPContext} from './../../../context';
import axios from "axios";


@inject("UserStore","CurrentUser","TipStore")
@observer
class SignUpDom extends React.Component{

    static contextType = IPContext;

    constructor(props){
        super(props);
        this.handleSignUp = this.handleSignUp.bind(this);
        this.checkForm = this.checkForm.bind(this);
    }

    checkForm({userName:username, password, repassword}){
        const {UserStore:user} = this.props;
        if (username && password && repassword && password === repassword) {
            return true;
        } else {
            if(!username){
                user.changeStatus("nameNull");
            }
            if(!password){
                user.changeStatus("passwordNull");
            }
            if(repassword !== password){
                user.changeStatus("repasswordErr");
            }
            return false;
        }
    }

    handleSignUp(){
        const {UserStore:user, CurrentUser:currentUser, TipStore:tipStore} = this.props;
        if(!this.checkForm(user)){
            return;
        }
        user.toggleSignUpAnim();
        axios.post(this.context+"/register",{
            username: Base64.encode(user.userName),
            password: Base64.encode(user.password),
        }).then(res => {
            const { status } = res.data;
            user.toggleSignUpAnim();
            if(status === -1){
                user.changeStatus("nameErr");
            }else if(status ===0){
                user.changeStatus("registerErr");
            }else{
                sessionStorage.setItem("currentUser",res.data.username);
                localStorage.setItem("currentUser",res.data.username);
                currentUser.changeUserName(res.data.username);
                currentUser.toggleIfLogined(true);
                user.initial();
                user.toggleIfSignUp(false);
                this.props.history.replace('/home');
                tipStore.changeData("注册成功","success");
            }
        }).catch((err)=>{
            user.toggleSignUpAnim();
            console.log(err);
            tipStore.changeData("注册失败","fail");
        });
    }

    render(){
        const {UserStore} = this.props;
        return(
            <div id="signupDom">
                <form id="signUpForm">
                    <div className="group">
                        <label htmlFor="user1" className="label">用户名</label>
                        <input onChange={(e) => {UserStore.updateUserName(e.target.value)}} value={UserStore.userName} placeholder="输入用户名" id="user1" type="text" className="input" name="user"  />
                        {UserStore.nameNull && <label className="errorMsg">请输入用户名!</label>}
                        {UserStore.nameErr && <label className="errorMsg">用户名已存在!</label>}
                        {UserStore.registerErr && <label className="errorMsg">注册失败!</label>}
                    </div>
                    <div className="group">
                        <label htmlFor="password1" className="label">密码</label>
                        <input onChange={(e) => {UserStore.updatePassword(e.target.value)}} value={UserStore.password} placeholder="输入密码" id="password1" type="password" className="input" data-type="password"  />
                        {UserStore.passwordNull && <label className="errorMsg">请输入密码!</label>}
                    </div>
                    <div className="group">
                        <label htmlFor="password2" className="label">确认密码</label>
                        <input onChange={(e) => {UserStore.updateRepassword(e.target.value)}} value={UserStore.repassword} placeholder="确认密码" id="password2" type="password" className="input" data-type="password"  />
                        {UserStore.repasswordErr && <label className="errorMsg">两次输入的密码不一致!</label>}
                    </div>
                    <div className="group">
                        {!UserStore.signUpAnim?
                            <input onClick={(e) => {e.preventDefault();this.handleSignUp();}} type="submit" className="button" value="注册" />
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

export default SignUpDom;