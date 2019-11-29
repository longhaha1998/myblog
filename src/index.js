import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import store from './store';
import { Provider } from 'mobx-react';
const AppPage = React.lazy(() => import('@/page/index.js'));
import LoadingPage from "./page/loadingPage"
import {IPContext} from "./context";
import axios from 'axios';
import TipComponent from './component/tipComponent';

// `withCredentials` 表示跨域请求时是否需要使用凭证
axios.defaults.withCredentials = true;
// `timeout` 指定请求超时的毫秒数(0 表示无超时时间)
// 如果请求话费了超过 `timeout` 的时间，请求将被中断
axios.defaults.timeout = 30000;

class App extends React.Component {
    // passive: Boolean，设置为true时，表示 listener 永远不会调用 preventDefault()。如果 listener 仍然调用了这个函数，客户端将会忽略它并抛出一个控制台警告。
    // once:  Boolean，表示 listener 在添加之后最多只调用一次。如果是 true， listener 会在其被调用之后自动移除。
    // capture:  Boolean，表示 listener 会在该类型的事件捕获阶段传播到该 EventTarget 时触发。
    componentDidMount () {
        window.addEventListener("wheel",(e) => {
            if (e.ctrlKey) {
                e.preventDefault();
            }
        },{passive: false,capture: false});

        window.onload = () => {
            const {CurrentUser: currentUser} = {...store};
            let tempCurrentUser = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');
            if(tempCurrentUser){
                currentUser.changeUserName(tempCurrentUser);
                currentUser.toggleIfLogined(true);
            }
        }
    }

    render () {
        return (
            // <IPContext.Provider value={"http://192.168.43.133:7001"}>
            <React.Fragment>
                <IPContext.Provider value={"http://172.22.65.13:7001"}>
                    <Provider {...store}>
                        <Suspense fallback={<LoadingPage />}>
                                <AppPage />  
                        </Suspense>
                    </Provider>
                </IPContext.Provider>
                {ReactDOM.createPortal(<TipComponent tipStore = {store.TipStore}/>, document.getElementById("app"))}
            </React.Fragment>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById("app"));