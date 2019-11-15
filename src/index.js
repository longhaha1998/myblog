import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import store from './store';
import { Provider } from 'mobx-react';
const AppPage = React.lazy(() => import('@/page/index.js'));


class App extends React.Component {

    // passive: Boolean，设置为true时，表示 listener 永远不会调用 preventDefault()。如果 listener 仍然调用了这个函数，客户端将会忽略它并抛出一个控制台警告。
    // once:  Boolean，表示 listener 在添加之后最多只调用一次。如果是 true， listener 会在其被调用之后自动移除。
    // capture:  Boolean，表示 listener 会在该类型的事件捕获阶段传播到该 EventTarget 时触发。
    componentDidMount () {
        window.addEventListener("wheel",(e) => {
            if (e.ctrlKey) {
                e.preventDefault();
            }
        },{passive: false,capture: false})
    }

    render () {
        return (
            <Provider {...store}>
                <Suspense fallback={<div>Loading...</div>}>
                    <AppPage />               
                </Suspense>
            </Provider>
        )
    }
}

ReactDOM.render(<App/>,document.getElementById("app"));