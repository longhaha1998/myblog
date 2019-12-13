import React from "react";
import './index.scss';

class LoadingPage extends React.Component{

    render(){
        return(
            <div id="LoadingBox" style={this.props.ifWaiting && {opacity:"0.5",position:'absolute',zIndex:"9999",top:0,left:0,backgroundColor:'white'}}>
	            <div className="bounce1"></div>
	            <div className="bounce2"></div>
	            <div className="bounce3"></div>
            </div>
        )
    }
}

export default LoadingPage;