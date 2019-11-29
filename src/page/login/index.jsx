import React from "react";
import './index.scss';
import { inject, observer } from "mobx-react";
const SignInDom =  React.lazy(() => import('./signIn'));
const SignUpDom =  React.lazy(() => import('./signUp'));

@inject("UserStore")
@observer
class LoginPage extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        const {UserStore} = this.props;
        return(
            <div id="loginDom">
                <section id="login-wrap">
                    <main id="loginMain">
                        <input onChange={(e) => {UserStore.toggleIfSignUp(false);UserStore.initial();}} id="tab-1" type="radio" name="tab" className="sign-in" defaultChecked/>
                        <label htmlFor="tab-1" className="tab">Sign In</label>
                        <input onChange={(e) => {UserStore.toggleIfSignUp(true);UserStore.initial();}} id="tab-2" type="radio" name="tab" className="sign-up"/>
                        <label htmlFor="tab-2" className="tab">Sign Up</label>
                        <div id="login-form">
                            <SignInDom history={this.props.history}/>
                            <SignUpDom history={this.props.history}/>
                        </div>
                    </main>
                </section>
            </div>
        )
    }
}

export default LoginPage;