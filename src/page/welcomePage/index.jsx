import React from 'react';
import { Link, } from 'react-router-dom'
import { inject, observer } from "mobx-react"
import './index.scss'

@inject("WelcomeAnimStore")// 注入mobx实例到props
@observer// UserListStore实例和组件双向绑定
class WelcomePage extends React.Component{

    constructor (props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        this.props.history.push("./home");
    }

    componentDidMount () {
        let targetDom = document.getElementById("welcomDom");
        targetDom.addEventListener('click',this.handleClick,false);
    }

    componentWillUnmount () {
        let {WelcomeAnimStore} = this.props;
        let targetDom = document.getElementById("welcomDom");
        targetDom.removeEventListener('click',this.handleClick,false);
        sessionStorage.setItem("havePalyedAnim","true");
        WelcomeAnimStore.changeIfPlayAnim(sessionStorage.getItem("havePalyedAnim"));
    }

    render(){
        return(
            <div id="welcomDom">
                <div id="welcomAnimDom">
                    <div id="welcomFirstWord">Welcome&nbsp;&nbsp;</div>
                    <div id="welcomSecondWord">To&nbsp;&nbsp;</div>
                    <div id="welcomThirdWord">Longhaha's&nbsp;&nbsp;</div>
                    <div id="welcomFouthWord">Blog</div>
                    <div id="describeDom">Sincerely hope that we can enjoy every moment of our lives</div>
                    <Link id="welcomLink" to="/home">continue</Link>
                </div>
            </div>
        )
    }
}

export default WelcomePage;