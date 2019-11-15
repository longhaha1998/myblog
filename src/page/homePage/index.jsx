import React from 'react';
import {BrowserRouter, Router, Link, Switch, Redirect} from 'react-router-dom'
import './index.scss'

class HomePage extends React.Component{
    render(){
        return(
            <div id="homeDom">
                <header id="homeHead">
                    <div id="headLeftDom">LongHaHa's&nbsp;&nbsp;blog</div>
                    <div id="headRightDom">
                        <Link to="/home">首页</Link>
                        <Link to="/home/article">文章</Link>
                        <Link to="/home/demo">demo</Link>
                        <a id="contactMe">联系本人</a>
                    </div>
                </header>
                <main id="homeMain">
                    <div id="contentDom">

                    </div>
                </main>
            </div>
        )
    }
}

export default HomePage;