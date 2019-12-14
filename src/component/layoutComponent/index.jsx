import React, {Suspense}from 'react';
import {Link, Switch, Route, Redirect} from 'react-router-dom';
import LoadingPage from '../../page/loadingPage';
import listIco from "./../../assets/image/list.png";
import "./index.scss";

class LayoutComponent extends React.Component{
    render(){
        const navList = this.props.routes.map((item, index, arr) => {
            return(
                <li key={item.pathname}>
                    <Link to={item.pathname}><abbr title={item.name}>{item.name}</abbr></Link>
                </li>
            );
        });
        const visualList = this.props.routes.map((item, index, arr) => {
            return(
                <Route key={item.pathname} path={item.pathname}>
                    <Suspense fallback={<LoadingPage />}>
                        {item.component}
                    </Suspense>
                </Route>
            );
        });
        return(
            <div id="layoutBox">
                <nav id="layoutNav">
                    <input id="layoutCheck" type="checkbox" />
                    <label id="layoutCheckLabel" htmlFor="layoutCheck"><img src={listIco}></img></label>
                    <ul>
                        {navList}
                    </ul>
                </nav>
                <main>
                    <Switch>
                        {visualList}
                    </Switch>
                </main>
            </div>
        )
    }
}

export default LayoutComponent;