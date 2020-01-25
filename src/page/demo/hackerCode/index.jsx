import React from 'react';
import './index.scss';

class HackerCode extends React.Component{
    constructor(props){
        super(props);
        this.hackCtx = React.createRef();
    }

    componentDidMount(){
        let ctx = this.hackCtx.current.getContext('2d');
        let w = Number(window.getComputedStyle(this.hackCtx.current, null).getPropertyValue("width").slice(0,-2));
        let h = Number(window.getComputedStyle(this.hackCtx.current, null).getPropertyValue("height").slice(0,-2));
        let yPositions = new Array(300).fill(0);
        setInterval(() => {
            this.initDraw(ctx, w, h, yPositions);
        }, 30);
    }

    initDraw(ctx, w, h, yPositions){
        ctx.fillStyle = 'rgba(0,0,0,0.05)';
        ctx.fillRect(0,0,w,h);
        ctx.fillStyle = 'green';
        ctx.font = '15px Bungasai';
        yPositions.map((y, index) => {
            let text = String.fromCharCode(Math.random()*666);
            let x = index*10;
            ctx.fillText(text,x,y);
            if(y>Math.random()*10000){
                yPositions[index] = 0;
            }else{
                yPositions[index] = y+10;
            }
        });
    }

    render(){
        return(
            <div id="hackerCodeDom">
                <canvas width="1080px" height="820px" ref={this.hackCtx} id="hackerCodeCtx"></canvas>
            </div>
        )
    }
}

export default HackerCode;