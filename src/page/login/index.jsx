import React from "react";
import axios from "axios";
import './index.scss';
import { inject, observer } from "mobx-react";
import {IPContext} from './../../context';

@inject("UserStore")
@observer
class LoginPage extends React.Component{

    static contextType = IPContext;

    constructor(props){
        super(props);
        this.signInForm = React.createRef();
        this.signUpForm = React.createRef();
    }

    handleSignIn(){
    }

    handleSignUp(){
        console.log(this.context);
        const {UserStore} = this.props;
        axios.post(this.context+"/register",{
            username: UserStore.userName,
            password: UserStore.password,
        },{
            // `withCredentials` 表示跨域请求时是否需要使用凭证
            withCredentials:true
        }).then(res => {
            console.log(res.data);
        }).catch(err=>{console.log(err)});
    }

    componentDidMount(){

    }

    render(){
        const {UserStore} = this.props;
        return(
            <div id="loginDom">
                <section id="login-wrap">
                    <main id="loginMain">
                        <input onChange={(e) => {UserStore.toggleIfSignUp(false)}} id="tab-1" type="radio" name="tab" className="sign-in" defaultChecked/>
                        <label htmlFor="tab-1" className="tab">Sign In</label>
                        <input onChange={(e) => {UserStore.toggleIfSignUp(true)}} id="tab-2" type="radio" name="tab" className="sign-up"/>
                        <label htmlFor="tab-2" className="tab">Sign Up</label>
                        <div id="login-form">
                            <div id="signinDom">
                                <form id="signinForm">
                                    <div className="group">
                                        <label htmlFor="user" className="label">用户名</label>
                                        <input id="user" type="text" className="input" required/>
                                    </div>
                                    <div className="group">
                                        <label htmlFor="pass" className="label">密码</label>
                                        <input id="pass" type="password" className="input" data-type="password" required/>
                                    </div>
                                    <div className="group">
                                        <input id="check" type="checkbox" className="check" defaultChecked />
                                        <label id="checkLabel" htmlFor="check">
                                            <span className="icon"></span> 
                                            Keep me Signed in
                                        </label>
                                    </div>
                                    <div className="group">
                                        <input onClick={(e) => {e.preventDefault();this.handleSignIn();}} type="submit" className="button" value="登录" />
                                    </div>
                                </form>
                            </div>
                            <div id="signupDom">
                                <form id="signUpForm">
                                    <div className="group">
                                        <label htmlFor="user1" className="label">用户名</label>
                                        <input onChange={(e) => {UserStore.updateUserName(e.target.value)}} value={UserStore.userName} placeholder="输入用户名" id="user1" type="text" className="input" name="user" required />
                                    </div>
                                    <div className="group">
                                        <label htmlFor="password1" className="label">密码</label>
                                        <input onChange={(e) => {UserStore.updatePassword(e.target.value)}} value={UserStore.password} placeholder="输入密码" id="password1" type="password" className="input" data-type="password" required />
                                    </div>
                                    <div className="group">
                                        <label htmlFor="password2" className="label">确认密码</label>
                                        <input onChange={(e) => {UserStore.updateRepassword(e.target.value)}} value={UserStore.repassword} placeholder="确认密码" id="password2" type="password" className="input" data-type="password" required />
                                    </div>
                                    <div className="group">
                                        <input onClick={(e) => {e.preventDefault();this.handleSignUp();}} type="submit" className="button" value="注册" />
                                    </div>                                    
                                </form>
                            </div>
                        </div>
                    </main>
                </section>
            </div>
        )
    }
}

export default LoginPage;