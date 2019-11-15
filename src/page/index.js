import React, {Suspense}from 'react';
import { BrowserRouter, Switch, Route, Redirect,} from 'react-router-dom'
import { inject, observer } from "mobx-react"
const WelcomePage = React.lazy(() => import('@/page/welcomePage'));
const HomePage = React.lazy(() => import('@/page/HomePage'));


@inject("WelcomeAnimStore")// 注入mobx实例到props
@observer// UserListStore实例和组件双向绑定
class AppPage extends React.Component {

    render(){
        const { WelcomeAnimStore } = this.props;
        WelcomeAnimStore.changeIfPlayAnim(sessionStorage.getItem("havePalyedAnim"));
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/" render={(routeProps) => WelcomeAnimStore.ifPlayedAnim?<Redirect to="/home" {...routeProps}/>:<WelcomePage {...routeProps}/>} />
                        <Route path="/home">
                            <HomePage />
                        </Route>
                    </Switch>
                </BrowserRouter>  
            </Suspense>
        )
    }
}

export default AppPage;