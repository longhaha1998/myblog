import React from 'react';
import "./index.scss";

class ImageLinkPage extends React.Component{
    render(){
        return(
            <div className="imageLinkDom">
                <div className="imageLinkCover"></div>
                <img className="imageLink" src={this.props.childImage}></img>
                <div name={this.props.domName} className="imageLinkTipDom">
                    <div name={this.props.domName} className="imageLinkTip">{this.props.tips}</div>
                </div>
            </div>
        )
    }
}

export default ImageLinkPage;