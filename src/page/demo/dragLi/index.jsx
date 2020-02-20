import React from 'react';
import './index.scss';

class DragLiDemo extends React.Component{

    constructor(props){
        super(props);
        this.draggingLi = null;
        this.ul = React.createRef();
        this.handleStart = this.handleStart.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.handleOver = this.handleOver.bind(this);
        this.getIndex = this.getIndex.bind(this);
    }

    componentDidMount(){
        this.ul.current.addEventListener('dragstart',this.handleStart,false);
        this.ul.current.addEventListener('dragenter',this.handleEnter,false);
        this.ul.current.addEventListener('dragover',this.handleOver,false);
    }

    componentWillUnmount(){
        this.ul.current.removeEventListener('dragstart',this.handleStart,false);
        this.ul.current.removeEventListener('dragenter',this.handleEnter,false);
        this.ul.current.removeEventListener('dragover',this.handleOver,false);
    }

    handleStart(event){
        event.dataTransfer.setData("text/plain",event.target.innerHTML);
        this.draggingLi = event.target;
    }

    handleEnter(event){
        event.preventDefault();
    }

    handleOver(event){
        event.preventDefault();
        let currentLi = event.target;
        if(currentLi.nodeType === 1 && currentLi.nodeName === "LI"){
            var preCurrentRect = currentLi.getBoundingClientRect();
			var preDraggingRect = this.draggingLi.getBoundingClientRect();
            // 保证只触发一次动画
            if(currentLi.animated){
                return;
            }
            if(this.draggingLi !== currentLi){
                if(this.getIndex(this.draggingLi)<this.getIndex(currentLi)){
                    currentLi.parentNode.insertBefore(this.draggingLi,currentLi.nextSibling);
                }else{
                    currentLi.parentNode.insertBefore(this.draggingLi,currentLi);
                }
            }
            this.animate(this.draggingLi,preDraggingRect.top-this.draggingLi.getBoundingClientRect().top);
            this.animate(currentLi,preCurrentRect.top-currentLi.getBoundingClientRect().top);
        }
    }

    animate(target, val){
        // 关键帧1，让li回到原来的位置
        target.style.transition = "none";
        target.style.transform  = "translate3d(0,"+val+"px,0)";
        // 触发重绘
        let temp = target.offsetHeight;
        // 关键帧2，让li变换到现在该在的位置
        target.style.transition = "all 300ms";
        target.style.transform  = "translate3d(0,0,0)";

        if(target.animated){
            clearTimeout(target.animated);
        }

        target.animated = setTimeout(function() {
            target.style.transition = "";
            target.style.transform  = "";
            // 确保下一次动画能正常触发
            target.animated = false;
        }, 300);
    }

    getIndex(node){
        let index = 0;
        while(node.previousElementSibling){
            index++;
            node = node.previousElementSibling;
        }
        return index;
    }

    render(){
        return(
            <div id="DragLiDemo">
                <div id="DragLiDom">
			        <ul ref={this.ul} id="DragLiContainer">
			        	<li className="DragLiEle" draggable>1</li>
			        	<li className="DragLiEle" draggable>2</li>
			        	<li className="DragLiEle" draggable>3</li>
			        	<li className="DragLiEle" draggable>4</li>
                        <li className="DragLiEle" draggable>5</li>
                        <li className="DragLiEle" draggable>6</li>
			        </ul>
                </div>
            </div>
        )
    }
}

export default DragLiDemo;