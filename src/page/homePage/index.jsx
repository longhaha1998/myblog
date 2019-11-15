import React from 'react';
import {BrowserRouter, Router, Link, Switch, Redirect, Route} from 'react-router-dom';
const HomeContent = React.lazy(() => import('@/page/homeContent'));
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
                <Switch>
                    <Route path="/home">
                        <HomeContent />
                    </Route>
                </Switch>
            </div>
        )
    }
}

export default HomePage;