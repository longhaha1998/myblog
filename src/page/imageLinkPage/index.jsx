import React from 'react';
import "./index.scss";

class ImageLinkPage extends React.Component{
    render(){
        return(
            <div className="imageLinkDom">
                <div className="imageLinkCover"></div>
                <img className="imageLink" src={this.props.childImage}></img>
                <div className="imageLinkTipDom">
                    <div className="imageLinkTip">{this.props.tips}</div>
                </div>
            </div>
        )
    }
}

export default ImageLinkPage;