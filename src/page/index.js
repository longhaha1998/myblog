import React, {Suspense}from 'react';
import { HashRouter, Switch, Route, Redirect, Link} from 'react-router-dom'
import { inject, observer } from "mobx-react"
const WelcomePage = React.lazy(() => import('@/page/welcomePage'));
const HomePage = React.lazy(() => import('@/page/HomePage'));
const NotFoundPage = React.lazy(() => import('@/page/404Page'));
const LoginPage = React.lazy(() => import('@/page/login'));
import LoadingPage from './loadingPage';


@inject("WelcomeAnimStore")// 注入mobx实例到props
@observer// 实例和组件双向绑定
class AppPage extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        const { WelcomeAnimStore } = this.props;
        WelcomeAnimStore.changeIfPlayAnim(sessionStorage.getItem("havePalyedAnim"));
        return (
            <HashRouter>
                <Switch>
                    <Route exact path="/" render={(routeProps) => WelcomeAnimStore.ifPlayedAnim? <Redirect to="/home"/> :(<Suspense fallback={<LoadingPage />}><WelcomePage {...routeProps}/></Suspense>)}/>
                    <Route path="/home" render={(routeProps) => (<Suspense fallback={<LoadingPage />}><HomePage {...routeProps}/></Suspense>)} />
                    <Route path="/login" render={(routeProps) => (<Suspense fallback={<LoadingPage />}><LoginPage {...routeProps}/></Suspense>)} />
                    <Route path="/404">
                        <Suspense fallback={<LoadingPage />}>
                                <NotFoundPage />
                        </Suspense>
                    </Route>
                    <Route path="*">
                        <Redirect to="/404"></Redirect>
                    </Route>
                </Switch>
            </HashRouter>
        )
    }
}

export default AppPage;