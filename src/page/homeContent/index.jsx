import React, {Suspense}from 'react';
import "./index.scss";
const BannerPage = React.lazy(() => import('../bannerPage'));
const ImageLinkPage = React.lazy(() => import('../imageLinkPage'));
const LoadingPage = React.lazy(() => import('../loadingPage'));
// import headPng from '../../assets/image/head.jpg';
import imageA from '@/assets/image/2.jpg';
import imageB from '@/assets/image/5.jpg';
import imageC from '@/assets/image/8.jpg';


class HomeContent extends React.Component{
    render(){
        return(
            <React.Fragment>
                <main id="homeMain">
                    <Suspense fallback={<LoadingPage />}>
                        <BannerPage />
                        <div id="imageLinkBox">
                            <ImageLinkPage childImage={imageA} tips={"无限魅力的js"}/>
                            <ImageLinkPage childImage={imageB} tips={"有趣的demo"}/>
                            <ImageLinkPage childImage={imageC} tips={"其他文章"}/>
                        </div>
                    </Suspense>
                </main>
            </React.Fragment>
        )
    }
}

export default HomeContent;
