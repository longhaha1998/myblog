import React from "react";
import './index.scss';

class LoadingPage extends React.Component{
    render(){
        return(
            <div id="LoadingBox">
	            <div className="bounce1"></div>
	            <div className="bounce2"></div>
	            <div className="bounce3"></div>
            </div>
        )
    }
}

export default LoadingPage;