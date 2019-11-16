import React, {Suspense}from 'react';
import "./index.scss";
const BannerPage = React.lazy(() => import('../bannerPage'));
const ImageLinkPage = React.lazy(() => import('../imageLinkPage'));
// import headPng from '../../assets/image/head.jpg';

class HomeContent extends React.Component{
    render(){
        return(
            <React.Fragment>
                <main id="homeMain">
                    <Suspense fallback={<div>Loading...</div>}>
                        <BannerPage />
                        <div id="imageLinkBox">
                            <ImageLinkPage />
                            <ImageLinkPage />
                            <ImageLinkPage />
                        </div>
                    </Suspense>
                </main>
            </React.Fragment>
        )
    }
}

export default HomeContent;
