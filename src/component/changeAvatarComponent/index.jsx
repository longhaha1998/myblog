import React from "react";
import { inject, observer } from "mobx-react";
import {IPContext} from './../../context';
import backUrl from './../../assets/image/back.png';
import defaultAvatar from "./../../assets/image/default.jpg";
import "./index.scss"

@inject("CurrentUser", "TipStore")
@observer
class ChangeAvatarComponent extends React.Component{

    static contextType = IPContext;

    constructor(props){
        super(props);
        this.file = null;
        this.fileType = null;
        this.fileName = null;
        this.preTime = 0;
        this.timer = null;
        this.initMovePosition ={
            x:0,
            y:0
        };
        this.initScalePosition ={
            x:0,
            y:0
        };
        this.moving = false;
        this.sourceRef = React.createRef();
        this.preRef = React.createRef();
        this.sourceDom = React.createRef();
        this.cropRef = React.createRef();
        this.moveBox = React.createRef();
        this.adjustBox = React.createRef();
        this.avatarFile = React.createRef();
        this.cropDom = React.createRef();
        this.lt = React.createRef();
        this.ltScaling = false;
        this.rt = React.createRef();
        this.rtScaling = false;
        this.lb = React.createRef();
        this.lbScaling = false;
        this.rb = React.createRef();
        this.rbScaling = false;
        this.state={
            avatar: defaultAvatar,
        };
        this.initScale = this.initScale.bind(this);
        this.changeWH = this.changeWH.bind(this);
        this.handleSelectAvatar = this.handleSelectAvatar.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMove = this.handleMove.bind(this);
        this.handleLTScale = this.handleLTScale.bind(this);
        this.handleLBScale = this.handleLBScale.bind(this);
        this.handleRTScale = this.handleRTScale.bind(this);
        this.handleRBScale = this.handleRBScale.bind(this);
        this.handleFinishSelect = this.handleFinishSelect.bind(this);
    }

    componentDidMount(){
        this.fileType = this.props.CurrentUser.avatarType;
        this.sourceRef.current.onload = ()=>{
            this.initScale(this.sourceRef.current,true);
        };
        this.cropRef.current.onload = ()=>{
            this.initScale(this.cropRef.current);
        };

        this.adjustBox.current.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.initMovePosition.x = e.clientX;
            this.initMovePosition.y = e.clientY;
            this.moving = true;
        }, false);

        this.lt.current.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.initScalePosition.x = e.clientX;
            this.initScalePosition.y = e.clientY;
            this.ltScaling = true;
        });
        this.rt.current.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.initScalePosition.x = e.clientX;
            this.initScalePosition.y = e.clientY;
            this.rtScaling = true;
        });
        this.lb.current.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.initScalePosition.x = e.clientX;
            this.initScalePosition.y = e.clientY;
            this.lbScaling = true;
        });
        this.rb.current.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.initScalePosition.x = e.clientX;
            this.initScalePosition.y = e.clientY;
            this.rbScaling = true;
        });

        this.cropDom.current.addEventListener('mousemove',(e) => {
            e.preventDefault();
            this.handleMouseMove(e);
        },false);

        window.addEventListener('mouseup', (e) => {
            e.preventDefault();
            this.moving = false;
            this.ltScaling = false;
            this.rtScaling = false;
            this.lbScaling = false;
            this.rbScaling = false;
        },false)
    }

    componentWillUnmount(){
        this.adjustBox.current.removeEventListener('mousedown', (e) => {
            e.preventDefault();
            this.initMovePosition.x = e.clientX;
            this.initMovePosition.y = e.clientY;
            this.moving = true;
        }, false);

        this.lt.current.removeEventListener('mousedown', (e) => {
            e.preventDefault();
            this.initScalePosition.x = e.clientX;
            this.initScalePosition.y = e.clientY;
            this.ltScaling = true;
        });
        this.rt.current.removeEventListener('mousedown', (e) => {
            e.preventDefault();
            this.initScalePosition.x = e.clientX;
            this.initScalePosition.y = e.clientY;
            this.rtScaling = true;
        });
        this.lb.current.removeEventListener('mousedown', (e) => {
            e.preventDefault();
            this.initScalePosition.x = e.clientX;
            this.initScalePosition.y = e.clientY;
            this.lbScaling = true;
        });
        this.rb.current.removeEventListener('mousedown', (e) => {
            e.preventDefault();
            this.initScalePosition.x = e.clientX;
            this.initScalePosition.y = e.clientY;
            this.rbScaling = true;
        });

        this.cropDom.current.removeEventListener('mousemove',(e) => {
            e.preventDefault();
            this.handleMouseMove(e);
        },false);

        window.removeEventListener('mouseup', (e) => {
            e.preventDefault();
            this.moving = false;
            this.ltScaling = false;
            this.rtScaling = false;
            this.lbScaling = false;
            this.rbScaling = false;
        },false)
    }

    handleMouseMove(e){
        if(this.ltScaling || this.rtScaling || this.lbScaling || this.rbScaling){
            if(this.ltScaling){
                this.handleLTScale(e);
            }else if(this.lbScaling){
                this.handleLBScale(e);
            }else if(this.rtScaling){
                this.handleRTScale(e);
            }else if(this.rbScaling){
                this.handleRBScale(e);
            }
        }else if(this.moving){
            this.handleMove(e);
        }
    }

    handleLBScale(e){
        let {x, y} = this.initScalePosition;
        let differX = x-e.clientX;
        let differY = e.clientY-y;
        let differ = Math.abs(differX)>Math.abs(differY)?differX:differY;
        let move = this.moveBox.current;
        let adjust = this.adjustBox.current;
        let crop = this.cropRef.current;
        let preLeft = Number(window.getComputedStyle(adjust,null).getPropertyValue("left").slice(0,-2));
        let preTop = Number(window.getComputedStyle(adjust,null).getPropertyValue("top").slice(0,-2));
        let preBottom = Number(window.getComputedStyle(adjust,null).getPropertyValue("bottom").slice(0,-2));
        let preWidth = Number(window.getComputedStyle(adjust,null).getPropertyValue("width").slice(0,-2));
        let preHeight = Number(window.getComputedStyle(adjust,null).getPropertyValue("height").slice(0,-2));
        let pre = this.preRef.current;
        let source = this.sourceRef.current.getBoundingClientRect();
        if(differ+preWidth>1 && differ+preHeight>1 && differ<=preLeft && differ<=preBottom){
            adjust.style.top = preTop+"px";
            move.style.top = preTop+"px";
            crop.style.top = "-"+preTop+"px";
            adjust.style.left = preLeft-differ+"px";
            move.style.left = preLeft-differ+"px";
            crop.style.left =  differ-preLeft+"px";

            adjust.style.width = differ+preWidth+"px";
            move.style.width = differ+preWidth+"px";
            adjust.style.height = differ+preHeight+"px";
            move.style.height = differ+preHeight+"px";

            pre.style.width = 500*(source.width/(differ+preWidth))+"px";
            pre.style.height = 500*(source.height/(differ+preWidth))+"px";
            pre.style.left = (differ-preLeft)*(500/(differ+preWidth))+"px";
            pre.style.top = "-"+preTop*(500/(differ+preWidth))+"px";
        }else if(differ+preWidth<=0 || differ+preHeight<=0){
            let client = adjust.getBoundingClientRect();
            if(e.clientX>client.left && e.lientY<client.top){
                this.rtScaling = true;
                this.lbScaling = false;
            }else if(e.clientX<client.left && e.clientY<client.top){
                this.ltScaling = true;
                this.lbScaling = false;
            }else if(e.clientX>client.left && e.clientY>client.top){
                this.rbScaling = true;
                this.lbScaling = false;
            }
        }else if(differ>preLeft || differ>preBottom){
            adjust.style.top =preTop+"px";
            move.style.top =preTop+"px";
            crop.style.top = "-"+preTop+"px";
            if(preLeft<=preBottom){
                adjust.style.left = 0;
                move.style.left = 0;
                crop.style.left =  0;

                adjust.style.width = preLeft+preWidth+"px";
                move.style.width = preLeft+preWidth+"px";
                adjust.style.height = preLeft+preHeight+"px";
                move.style.height = preLeft+preHeight+"px";

                pre.style.width = 500*(source.width/(preLeft+preWidth))+"px";
                pre.style.height = 500*(source.height/(preLeft+preWidth))+"px";
                pre.style.left = 0;
                pre.style.top = "-"+preTop*(500/(preLeft+preWidth))+"px";
            }else{
                adjust.style.left = preLeft-preBottom+"px";
                move.style.left = preLeft-preBottom+"px";
                crop.style.left = preBottom-preLeft+"px";

                adjust.style.width = preBottom+preWidth+"px";
                move.style.width = preBottom+preWidth+"px";
                adjust.style.height = preBottom+preHeight+"px";
                move.style.height = preBottom+preHeight+"px";

                pre.style.width = 500*(source.width/(preBottom+preWidth))+"px";
                pre.style.height = 500*(source.height/(preBottom+preWidth))+"px";
                pre.style.left = (preBottom-preLeft)*(500/(preBottom+preWidth))+"px";
                pre.style.top = "-"+preTop*(500/(preBottom+preWidth))+"px";
            }
        }
        this.initScalePosition.x = e.clientX;
        this.initScalePosition.y = e.clientY;
    }

    handleRTScale(e){
        this.moving = false;
        let {x, y} = this.initScalePosition;
        let differX = e.clientX-x;
        let differY = y-e.clientY;
        let differ = Math.abs(differX)>Math.abs(differY)?differX:differY;
        let move = this.moveBox.current;
        let adjust = this.adjustBox.current;
        let crop = this.cropRef.current;
        let preLeft = Number(window.getComputedStyle(adjust,null).getPropertyValue("left").slice(0,-2));
        let preTop = Number(window.getComputedStyle(adjust,null).getPropertyValue("top").slice(0,-2));
        let preRight = Number(window.getComputedStyle(adjust,null).getPropertyValue("right").slice(0,-2));
        let preWidth = Number(window.getComputedStyle(adjust,null).getPropertyValue("width").slice(0,-2));
        let preHeight = Number(window.getComputedStyle(adjust,null).getPropertyValue("height").slice(0,-2));
        let pre = this.preRef.current;
        let source = this.sourceRef.current.getBoundingClientRect();
        if(differ+preWidth>1 && differ+preHeight>1 && differ<=preRight && differ<=preTop){
            adjust.style.left = preLeft+"px";
            move.style.left = preLeft+"px";
            crop.style.left =  "-"+preLeft+"px";
            adjust.style.top = preTop-differ+"px";
            move.style.top = preTop-differ+"px";
            crop.style.top = differ-preTop+"px";

            adjust.style.width = differ+preWidth+"px";
            move.style.width = differ+preWidth+"px";
            adjust.style.height = differ+preHeight+"px";
            move.style.height = differ+preHeight+"px";

            pre.style.width = 500*(source.width/(differ+preWidth))+"px";
            pre.style.height = 500*(source.height/(differ+preWidth))+"px";
            pre.style.left = "-"+preLeft*(500/(differ+preWidth))+"px";
            pre.style.top = (differ-preTop)*(500/(differ+preWidth))+"px";
        }else if(differ+preWidth<=1 || differ+preHeight<=1){
            let client = adjust.getBoundingClientRect();
            if(e.clientX<client.left && e.clientY>client.top){
                this.lbScaling = true;
                this.rtScaling = false;
            }else if(e.clientX<client.left && e.clientY<client.top){
                this.ltScaling = true;
                this.rtScaling = false;
            }else if(e.clientX>client.left && e.clientY>client.top){
                this.rbScaling = true;
                this.rtScaling = false;
            }
        }else if(differ>preRight || differ>preTop){
            adjust.style.left = preLeft+"px";
            move.style.left = preLeft+"px";
            crop.style.left =  "-"+preLeft+"px";
            if(preRight<=preTop){
                adjust.style.top = preTop-preRight+"px";
                move.style.top = preTop-preRight+"px";
                crop.style.top = preRight-preTop+"px";

                adjust.style.width = preRight+preWidth+"px";
                move.style.width = preRight+preWidth+"px";
                adjust.style.height = preRight+preHeight+"px";
                move.style.height = preRight+preHeight+"px";

                pre.style.width = 500*(source.width/(preRight+preWidth))+"px";
                pre.style.height = 500*(source.height/(preRight+preWidth))+"px";
                pre.style.left = "-"+preLeft*(500/(preRight+preWidth))+"px";
                pre.style.top = (preRight-preTop)*(500/(preRight+preWidth))+"px";
            }else{
                adjust.style.top = 0;
                move.style.top = 0;
                crop.style.top =  0;

                adjust.style.width = preTop+preWidth+"px";
                move.style.width = preTop+preWidth+"px";
                adjust.style.height = preTop+preHeight+"px";
                move.style.height = preTop+preHeight+"px";

                pre.style.width = 500*(source.width/(preTop+preWidth))+"px";
                pre.style.height = 500*(source.height/(preTop+preWidth))+"px";
                pre.style.left = "-"+preLeft*(500/(preTop+preWidth))+"px";
                pre.style.top = 0;
            }
        }
        this.initScalePosition.x = e.clientX;
        this.initScalePosition.y = e.clientY;
    }

    handleRBScale(e){
        this.moving = false;
        let {x, y} = this.initScalePosition;
        let differX = e.clientX-x;
        let differY = e.clientY-y;
        let differ = Math.abs(differX)>Math.abs(differY)?differX:differY;
        let move = this.moveBox.current;
        let adjust = this.adjustBox.current;
        let crop = this.cropRef.current;
        let preLeft = Number(window.getComputedStyle(adjust,null).getPropertyValue("left").slice(0,-2));
        let preTop = Number(window.getComputedStyle(adjust,null).getPropertyValue("top").slice(0,-2));
        let preRight = Number(window.getComputedStyle(adjust,null).getPropertyValue("right").slice(0,-2));
        let preBottom = Number(window.getComputedStyle(adjust,null).getPropertyValue("bottom").slice(0,-2));
        let preWidth = Number(window.getComputedStyle(adjust,null).getPropertyValue("width").slice(0,-2));
        let preHeight = Number(window.getComputedStyle(adjust,null).getPropertyValue("height").slice(0,-2));
        let pre = this.preRef.current;
        let source = this.sourceRef.current.getBoundingClientRect();
        if(differ+preWidth>1 && differ+preHeight>1 && differ<=preRight && differ<=preBottom){
            adjust.style.left = preLeft+"px";
            move.style.left = preLeft+"px";
            crop.style.left =  "-"+preLeft+"px";            
            adjust.style.top = preTop+"px";
            move.style.top = preTop+"px";
            crop.style.top = "-"+preTop+"px";

            adjust.style.width = differ+preWidth+"px";
            move.style.width = differ+preWidth+"px";
            adjust.style.height = differ+preHeight+"px";
            move.style.height = differ+preHeight+"px";

            pre.style.width = 500*(source.width/(differ+preWidth))+"px";
            pre.style.height = 500*(source.height/(differ+preWidth))+"px";
            pre.style.left =  "-"+preLeft*(500/(differ+preWidth))+"px";
            pre.style.top = "-"+preTop*(500/(differ+preWidth))+"px";
        }else if(differ+preWidth<=1 || differ+preHeight<=1){
            let client = adjust.getBoundingClientRect();
            if(e.clientX<client.left && e.lientY<client.top){
                this.ltScaling = true;
                this.rbScaling = false;
            }else if(e.clientX>client.left && e.clientY<client.top){
                this.rtScaling = true;
                this.rbScaling = false;
            }else if(e.clientX<client.left && e.clientY>client.top){
                this.lbScaling = true;
                this.rbScaling = false;
            }
        }else if(differ>preRight || differ>preBottom){
            adjust.style.left = preLeft+"px";
            move.style.left = preLeft+"px";
            crop.style.left =  "-"+preLeft+"px";            
            adjust.style.top = preTop+"px";
            move.style.top = preTop+"px";
            crop.style.top = "-"+preTop+"px";
            if(preRight<=preBottom){
                adjust.style.width = preRight+preWidth+"px";
                move.style.width = preRight+preWidth+"px";
                adjust.style.height = preRight+preHeight+"px";
                move.style.height = preRight+preHeight+"px";

                pre.style.width = 500*(source.width/(preRight+preWidth))+"px";
                pre.style.height = 500*(source.height/(preRight+preWidth))+"px";
                pre.style.left = "-"+preLeft*(500/(preRight+preWidth))+"px";
                pre.style.top = "-"+preTop*(500/(preRight+preWidth))+"px";
            }else{
                adjust.style.width = preBottom+preWidth+"px";
                move.style.width = preBottom+preWidth+"px";
                adjust.style.height = preBottom+preHeight+"px";
                move.style.height = preBottom+preHeight+"px";

                pre.style.width = 500*(source.width/(preBottom+preWidth))+"px";
                pre.style.height = 500*(source.height/(preBottom+preWidth))+"px";
                pre.style.left = "-"+preLeft*(500/(preBottom+preWidth))+"px";
                pre.style.top = "-"+preTop*(500/(preBottom+preWidth))+"px";
            }
        }
        this.initScalePosition.x = e.clientX;
        this.initScalePosition.y = e.clientY;
    }

    handleLTScale(e){
        this.moving = false;
        let {x, y} = this.initScalePosition;
        let differX = x-e.clientX;
        let differY = y-e.clientY;
        let differ = Math.abs(differX)>Math.abs(differY)?differX:differY;
        let move = this.moveBox.current;
        let adjust = this.adjustBox.current;
        let crop = this.cropRef.current;
        let preLeft = Number(window.getComputedStyle(adjust,null).getPropertyValue("left").slice(0,-2));
        let preTop = Number(window.getComputedStyle(adjust,null).getPropertyValue("top").slice(0,-2));
        let preWidth = Number(window.getComputedStyle(adjust,null).getPropertyValue("width").slice(0,-2));
        let preHeight = Number(window.getComputedStyle(adjust,null).getPropertyValue("height").slice(0,-2));
        let pre = this.preRef.current;
        let source = this.sourceRef.current.getBoundingClientRect();
        if(differ+preWidth>1 && differ+preHeight>1 && differ<=preLeft && differ<=preTop){
            adjust.style.left = preLeft-differ+"px";
            move.style.left = preLeft-differ+"px";
            crop.style.left =  differ-preLeft+"px";
            adjust.style.top = preTop-differ+"px";
            move.style.top = preTop-differ+"px";
            crop.style.top = differ-preTop+"px";

            adjust.style.width = differ+preWidth+"px";
            move.style.width = differ+preWidth+"px";
            adjust.style.height = differ+preHeight+"px";
            move.style.height = differ+preHeight+"px";

            pre.style.width = 500*(source.width/(differ+preWidth))+"px";
            pre.style.height = 500*(source.height/(differ+preWidth))+"px";
            pre.style.left = (differ-preLeft)*(500/(differ+preWidth))+"px";
            pre.style.top = (differ-preTop)*(500/(differ+preWidth))+"px";
        }else if(differ+preWidth<=1 || differ+preHeight<=1){
            let client = adjust.getBoundingClientRect();
            if(e.clientX>client.left && e.clientY>client.top){
                this.rbScaling = true;
                this.ltScaling = false;
            }else if(e.clientX>client.left && e.clientY<client.top){
                this.rtScaling = true;
                this.ltScaling = false;
            }else if(e.clientX<client.left && e.clientY>client.top){
                this.lbScaling = true;
                this.ltScaling = false;
            }
        }else if(differ>preLeft || differ>preTop){
            if(preLeft<=preTop){
                adjust.style.left = 0;
                move.style.left = 0;
                crop.style.left =  0;
                adjust.style.top = preTop-preLeft+"px";
                move.style.top = preTop-preLeft+"px";
                crop.style.top = preLeft-preTop+"px";

                adjust.style.width = preLeft+preWidth+"px";
                move.style.width = preLeft+preWidth+"px";
                adjust.style.height = preLeft+preHeight+"px";
                move.style.height = preLeft+preHeight+"px";

                pre.style.width = 500*(source.width/(preLeft+preWidth))+"px";
                pre.style.height = 500*(source.height/(preLeft+preWidth))+"px";
                pre.style.left = 0;
                pre.style.top = (preLeft-preTop)*(500/(preLeft+preWidth))+"px";
            }else{
                adjust.style.top = 0;
                move.style.top = 0;
                crop.style.top =  0;
                adjust.style.left = preLeft-preTop+"px";
                move.style.left = preLeft-preTop+"px";
                crop.style.left = preTop-preLeft+"px";

                adjust.style.width = preTop+preWidth+"px";
                move.style.width = preTop+preWidth+"px";
                adjust.style.height = preTop+preHeight+"px";
                move.style.height = preTop+preHeight+"px";

                pre.style.width = 500*(source.width/(preTop+preWidth))+"px";
                pre.style.height = 500*(source.height/(preTop+preWidth))+"px";
                pre.style.left = (preTop-preLeft)*(500/(preTop+preWidth))+"px";
                pre.style.top = 0;
            }
        }
        this.initScalePosition.x = e.clientX;
        this.initScalePosition.y = e.clientY;
    }

    handleMove(e){
        let {x,y} = this.initMovePosition;
        let adjust = this.adjustBox.current;
        let move = this.moveBox.current;
        let pre = this.preRef.current;
        let pos = adjust.getBoundingClientRect();
        let ppos = this.cropDom.current.getBoundingClientRect();
        let tempX = e.clientX;
        let preLeft = Number(window.getComputedStyle(adjust,null).getPropertyValue("left").slice(0,-2));
        let tempY = e.clientY;
        let preTop = Number(window.getComputedStyle(adjust,null).getPropertyValue("top").slice(0,-2));
        
        let wscale = Number(window.getComputedStyle(this.sourceRef.current,null).getPropertyValue("width").slice(0,-2))/Number(window.getComputedStyle(pre,null).getPropertyValue("width").slice(0,-2))
        let hscale = Number(window.getComputedStyle(this.sourceRef.current,null).getPropertyValue("height").slice(0,-2))/Number(window.getComputedStyle(pre,null).getPropertyValue("height").slice(0,-2))
        if(preLeft+(tempX-x)>=0 && preLeft+(tempX-x)+pos.width<=ppos.width){
            adjust.style.left = (preLeft+(tempX-x))+"px";
            this.cropRef.current.style.left = "-"+(preLeft+(tempX-x))+"px";
            move.style.left = (preLeft+(tempX-x))+"px";
            pre.style.left = "-"+Math.floor((preLeft+(tempX-x))/wscale)+"px";
        }else if(preLeft+(tempX-x)<0){
            adjust.style.left = 0;
            this.cropRef.current.style.left = 0;
            move.style.left = 0;
            pre.style.left = 0;
        }else if(preLeft+(tempX-x)+pos.width>ppos.width){
            adjust.style.left = (ppos.width - pos.width) + 'px';
            this.cropRef.current.style.left = '-'+(ppos.width - pos.width) + 'px';
            move.style.left = (ppos.width - pos.width) + 'px';
            pre.style.left = "-"+Math.floor((ppos.width - pos.width)/wscale)+ 'px';
        }
        this.initMovePosition.x=tempX;

        if(preTop+(tempY-y)>=0 && preTop+(tempY-y)+pos.height<=ppos.height){
            adjust.style.top = (preTop+(tempY-y))+"px";
            this.cropRef.current.style.top = "-"+(preTop+(tempY-y))+"px";
            move.style.top = (preTop+(tempY-y))+"px";
            pre.style.top = "-"+Math.floor((preTop+(tempY-y))/hscale)+"px";
        }else if(preTop+(tempY-y)<0){
            adjust.style.top = 0;
            this.cropRef.current.style.top = 0;
            move.style.top = 0;
            pre.style.top = 0;
        }else if(preTop+(tempY-y)+pos.height>ppos.height){
            adjust.style.top = (ppos.height-pos.height)+"px";
            this.cropRef.current.style.top  = "-" + (ppos.height-pos.height) + "px";
            move.style.top = (ppos.height - pos.height) + 'px';
            pre.style.top = "-"+Math.floor((ppos.height - pos.height)/hscale)+"px";
        }
        this.initMovePosition.y=tempY;
    }

    handleSelectAvatar(e){
        let file = this.avatarFile.current.files[0];
        this.fileType = file.type;
        this.fileName = file.name;
        if(file.size>3*1024*1024){
            this.props.TipStore.changeData("所选文件不能超过3mb", "fail");
        }else{
            try{
                let tempReader = new FileReader();
                tempReader.readAsDataURL(new Blob([file],{type:this.fileType}));
                tempReader.onload = ()=> {
                    this.sourceRef.current.src = tempReader.result;
                    this.cropRef.current.src = tempReader.result;
                    this.preRef.current.src = tempReader.result;
                }
                tempReader.onerror = ()=>{
                    throw new Error("获取头像出错！");
                }
            }catch(err){
                console.log(err);
                this.props.TipStore.changeData("读取文件时出错", "fail");
            }
        }
    }

    initScale(img,flag){
        let sourceDom = this.sourceDom.current;
        let move = this.moveBox.current;
        let adjust = this.adjustBox.current;
        move.style.left = 0;
        move.style.top = 0;
        adjust.style.left = 0;
        adjust.style.top = 0;
        this.cropRef.current.style.left = 0;
        this.cropRef.current.style.top = 0;
        this.preRef.current.style.left = 0;
        this.preRef.current.style.top = 0;
        if(img.naturalWidth>=img.naturalHeight){
            let scale = img.naturalWidth/500;
            this.changeWH(img, "500px", Math.floor(img.naturalHeight/scale)+"px");
            if(flag){
                this.changeWH(sourceDom, "500px", Math.floor(img.naturalHeight/scale)+"px");
                this.changeWH(move, Math.floor(img.naturalHeight/scale)+"px", Math.floor(img.naturalHeight/scale)+"px");
                this.changeWH(adjust, Math.floor(img.naturalHeight/scale)+"px", Math.floor(img.naturalHeight/scale)+"px");
                if(this.preRef.current.complete){
                    let tempScale = Math.floor(img.naturalHeight/scale)/500;
                    this.changeWH(this.preRef.current, Math.floor(500/tempScale)+"px", Math.floor(Math.floor(img.naturalHeight/scale)/tempScale)+"px");
                    this.preRef.current.onload = () => {
                        let tempScale = Math.floor(img.naturalHeight/scale)/500;
                        this.changeWH(this.preRef.current, Math.floor(500/tempScale)+"px", Math.floor(Math.floor(img.naturalHeight/scale)/tempScale)+"px");
                    }
                }else{
                    this.preRef.current.onload = () => {
                        let tempScale = Math.floor(img.naturalHeight/scale)/500;
                        this.changeWH(this.preRef.current, Math.floor(500/tempScale)+"px", Math.floor(Math.floor(img.naturalHeight/scale)/tempScale)+"px");
                    }
                }
            }
        }else{
            let scale = img.naturalHeight/500;
            this.changeWH(img, Math.floor(img.naturalWidth/scale)+"px", "500px");
            if(flag){
                this.changeWH(sourceDom, Math.floor(img.naturalWidth/scale)+"px", "500px");
                this.changeWH(move, Math.floor(img.naturalWidth/scale)+"px", Math.floor(img.naturalWidth/scale)+"px");
                this.changeWH(adjust, Math.floor(img.naturalWidth/scale)+"px", Math.floor(img.naturalWidth/scale)+"px");
                if(this.preRef.current.complete){
                    let tempScale = Math.floor(img.naturalWidth/scale)/500;
                    this.changeWH(this.preRef.current, Math.floor(Math.floor(img.naturalWidth/scale)/tempScale)+"px", Math.floor(500/tempScale)+"px");
                    this.preRef.current.onload = () => {
                        let tempScale = Math.floor(img.naturalWidth/scale)/500;
                        this.changeWH(this.preRef.current, Math.floor(Math.floor(img.naturalWidth/scale)/tempScale)+"px", Math.floor(500/tempScale)+"px");
                    }
                }else{
                    this.preRef.current.onload = () => {
                        let tempScale = Math.floor(img.naturalWidth/scale)/500;
                        this.changeWH(this.preRef.current, Math.floor(Math.floor(img.naturalWidth/scale)/tempScale)+"px", Math.floor(500/tempScale)+"px");
                    }
                }
            }
        }
    }

    changeWH(dom, width, height){
        dom.style.height = height;
        dom.style.width = width;
    }

    handleBack(e){
        e.preventDefault();
        this.props.history.replace(this.props.location.search.split("=")[1]);
    }

    handleFinishSelect(){
        let adjust = this.adjustBox.current;
        let source = this.sourceRef.current;
        let tempWidth = Number(window.getComputedStyle(adjust,null).getPropertyValue("width").slice(0,-2));
        let tempHeight = Number(window.getComputedStyle(adjust,null).getPropertyValue("height").slice(0,-2));
        let tempLeft = Number(window.getComputedStyle(adjust,null).getPropertyValue("left").slice(0,-2));
        let tempTop = Number(window.getComputedStyle(adjust,null).getPropertyValue("top").slice(0,-2));
        let sourceCanvas = document.createElement("canvas");
        let sourceWidth =  Number(window.getComputedStyle(source,null).getPropertyValue("width").slice(0,-2));
        let sourceHeight = Number(window.getComputedStyle(source,null).getPropertyValue("height").slice(0,-2));
        sourceCanvas.width = sourceWidth;
        sourceCanvas.height = sourceHeight;
        sourceCanvas.getContext("2d").drawImage(source,0,0,sourceWidth,sourceHeight);
        let targetCanvas = document.createElement("canvas");
        targetCanvas.width = tempWidth;
        targetCanvas.height = tempHeight;
        targetCanvas.getContext('2d').drawImage(sourceCanvas, tempLeft, tempTop, tempWidth, tempHeight, 0, 0, tempWidth, tempHeight);
        targetCanvas.toBlob((tempBlob) => {
            let tempFile = new File([tempBlob],this.fileName?this.fileName:"avatar.jpg",{lastModified:Date.now(),type:this.fileType?this.fileType:"image/jpeg"});
            this.props.postAvatar(tempFile);
        },this.fileType?this.fileType:"image/jpeg");
        // let tempBlob = new Blob([targetCanvas.toDataURL(this.fileType?this.fileType:"image/jpeg")],{type:this.fileType?this.fileType:"image/jpeg"});
        // let tempFile = new File([tempBlob],this.fileName?this.fileName:"avatar.jpg",{lastModified:Date.now(),type:this.fileType?this.fileType:"image/jpeg"});
    }

    render(){
        let {CurrentUser:currentUser} = this.props;
        return(
            <div id="changeAvatarDom">
                <main className="mainDom">
                    <header className="header">
                        <a onClick={(e) => {this.handleBack(e)}}><img src={backUrl}></img>返回</a>
                        <div>
                            <label htmlFor="selectAvatar" id="selectAvatarLabel"><span>选择头像</span></label>
                            <input ref={this.avatarFile} onChange={(e) => {this.handleSelectAvatar(e);}} accept=".jpg, .jpeg, .png" type="file" id="selectAvatar"></input>
                            <label onClick={this.handleFinishSelect} className="finishSelect">确定</label>
                        </div>
                    </header>
                    <div className="content">
                        <div className="clip">
                            <div ref={this.sourceDom} className="sourceDom">
                                <img ref={this.sourceRef} src={currentUser.avatar?currentUser.avatar:defaultAvatar} className='sourceImg'></img>
                                <div className="shadowBox"></div>
                                <div ref={this.cropDom} className="cropBox">
                                    <div ref={this.moveBox} className="cropImg" style={{left:0,top:0}}>
                                        <img ref={this.cropRef} src={currentUser.avatar?currentUser.avatar:defaultAvatar}/>
                                    </div>
                                    <div ref={this.adjustBox} className="cropSpanDom" style={{left:0,top:0}}>
                                        <span ref={this.lt} className="lt"></span>
                                        <span ref={this.rt} className="rt"></span>
                                        <span ref={this.lb} className="lb"></span>
                                        <span ref={this.rb} className="rb"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="line"></div>
                        <div className="preview">
                            <img ref={this.preRef} src={currentUser.avatar?JSON.parse(localStorage.getItem("avatar")):defaultAvatar} style={{left:0,top:0}}></img>
                        </div>
                    </div>
                </main>
            </div>
        )
    }
}

export default ChangeAvatarComponent;