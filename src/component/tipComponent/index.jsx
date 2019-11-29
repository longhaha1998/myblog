import React from 'react';
import "./index.scss";
import { observer } from "mobx-react";
import successImg from "@/assets/image/success.png";
import failImg from "@/assets/image/fail.png";
import warningImg from "@/assets/image/warning.png";

@observer
class TipComponent extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        const tipStore = this.props.tipStore;
        return(
            <div id="tipDom">
                {
                    tipStore.tipData
                    &&
                    <div id="tipDataDom">
                        {tipStore.success && <img src={successImg}></img>}
                        {tipStore.fail && <img src={failImg}></img>}
                        {tipStore.warning && <img src={warningImg}></img>}
                        <span>
                            {tipStore.tipData}
                        </span>
                    </div>
                }
            </div>
        )
    }
}

export default TipComponent;