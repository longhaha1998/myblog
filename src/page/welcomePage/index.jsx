import React from 'react';
import {BrowserRouter, Router, Link, Switch, Redirect} from 'react-router-dom'
import './index.scss'

class WelcomePage extends React.Component{
    render(){
        return(
            <div id="welcomDom">
                <div id="welcomAnimDom">
                    <div id="welcomFirstWord">Welcome</div>
                    <div id="welcomSecondWord">To</div>
                    <div id="welcomThirdWord">Longhaha's</div>
                    <div id="welcomFouthWord">Blog</div>
                    <div id="describeDom">Sincerely hope that we can enjoy every moment of our lives</div>
                    <BrowserRouter>
                        <Link id="welcomLink">continue</Link>
                    </BrowserRouter>
                </div>
            </div>
        )
    }
}

export default WelcomePage;