import React from 'react';
import ReactDOM from 'react-dom';
import LoadableComponent from '@/loadable'
const HomePage = LoadableComponent(() => import('@/page/homePage'));
const WelcomePage = LoadableComponent(() => import('@/page/welcomePage'));

class App extends React.Component {
    render(){
        return (
            <WelcomePage />
        )
    }
}

ReactDOM.render(<App/>,document.getElementById("app"));