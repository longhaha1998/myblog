import React, {Suspense} from 'react';
// import routes from './route';
const MainPage = React.lazy(()=>import("../../component/layoutComponent"));
import LoadingPage from "../loadingPage"

import './index.scss'

class ArticlePage extends React.Component{
    render(){
        return(
            // <Suspense fallback={<LoadingPage />}>
            //     <MainPage routes={routes}/>    
            // </Suspense>
            <div id="articleBox">
                ArticlePage!!!!
            </div>
        )
    }
}

export default ArticlePage;