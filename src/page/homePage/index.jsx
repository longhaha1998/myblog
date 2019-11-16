import React, {Suspense}from 'react';
import {Link, Switch, Route, Redirect} from 'react-router-dom';
const HomeContent = React.lazy(() => import('../homeContent'));
const DemoPage = React.lazy(() => import('../demo'));
const ArticlePage = React.lazy(() => import('../article'));
const LoadingPage = React.lazy(() => import('../loadingPage'));
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
                        <Suspense fallback={<LoadingPage />}>
                            <HomeContent />
                        </Suspense>
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
                </Switch>
                <footer id="homefooter">
                    @Copyright 2019-01-01 longhaha All rights Reserved
                </footer>
            </div>
        )
    }
}

export default HomePage;