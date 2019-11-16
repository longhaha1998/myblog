import React, {Suspense}from 'react';
import {Link, Switch, Route, Redirect} from 'react-router-dom';
const HomeContent = React.lazy(() => import('../homeContent'));
const DemoPage = React.lazy(() => import('../demo'));
const ArticlePage = React.lazy(() => import('../article'));
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
                    <Route exact path="/home">
                        <Suspense fallback={<div>Loading...</div>}>
                            <HomeContent />
                        </Suspense>
                    </Route>
                    <Route path="/home/demo">
                        <Suspense fallback={<div>Loading...</div>}>
                            <DemoPage />
                        </Suspense>
                    </Route>
                    <Route path="/home/article">
                        <Suspense fallback={<div>Loading...</div>}>
                            <ArticlePage />
                        </Suspense>
                    </Route>
                </Switch>
            </div>
        )
    }
}

export default HomePage;