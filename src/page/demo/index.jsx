import React, {Suspense}from 'react';
import routes from './route';
const MainPage = React.lazy(()=>import("../../component/layoutComponent"));
import LoadingPage from "../loadingPage"

class DemoPage extends React.Component{
    render(){
        return(
        <Suspense fallback={<LoadingPage />}>
            <MainPage routes={routes}/>    
        </Suspense>
        )
    }
}

export default DemoPage;