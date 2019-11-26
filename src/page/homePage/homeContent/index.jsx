import React, {Suspense}from 'react';
import "./index.scss";
const BannerPage = React.lazy(() => import('../bannerPage'));
const ImageLinkPage = React.lazy(() => import('../imageLinkPage'));
import LoadingPage from '../../loadingPage';
// import headPng from '../../assets/image/head.jpg';
import imageA from '@/assets/image/2.jpg';
import imageB from '@/assets/image/5.jpg';
import imageC from '@/assets/image/8.jpg';


class HomeContent extends React.Component{
    constructor(props){
        super(props);
        this.handleClickImg = this.handleClickImg.bind(this);
    }

    handleClickImg(e){
        this.props.history.push(this.props.location.pathname+e.target.getAttribute("name"));
    }

    componentDidMount(){
        document.getElementById("imageLinkBox").addEventListener("click",this.handleClickImg,false);
    }

    componentWillUnmount(){
        document.getElementById("imageLinkBox").removeEventListener("click",this.handleClickImg,false);
    }

    render(){
        return(
            <React.Fragment>
                <main id="homeMain">
                    <Suspense fallback={<LoadingPage />}>
                        <BannerPage />
                        <div id="imageLinkBox">
                            <ImageLinkPage domName="/article" childImage={imageA} tips={"无限魅力的js"}/>
                            <ImageLinkPage domName="/demo" childImage={imageB} tips={"有趣的demo"}/>
                            <ImageLinkPage domName="/article" childImage={imageC} tips={"其他文章"}/>
                        </div>
                    </Suspense>
                </main>
            </React.Fragment>
        )
    }
}

export default HomeContent;
