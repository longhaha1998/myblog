import React from 'react';
import { inject, observer } from "mobx-react";
import './index.scss';
import clockIco from "./../../../assets/image/clock.png";
import jsIco from "./../../../assets/image/articleImg/js.png";
import css3Ico from "./../../../assets/image/articleImg/css3.png";
import csIco from "./../../../assets/image/articleImg/cs.png";
import dataIco from "./../../../assets/image/articleImg/data.png";
import reactIco from "./../../../assets/image/articleImg/react.png";
import writeIco from "./../../../assets/image/articleImg/write.png";
import htmlIco from "./../../../assets/image/articleImg/html.png";
import motionIco from "./../../../assets/image/articleImg/motion.png";
import { Remarkable } from 'remarkable';


@inject("ArticleVisualStore","ArticleStore","CurrentArticleStore","CurrentUser","TipStore")
@observer
class ArticleContainer extends React.Component{

    constructor(props){
        super(props);
        this.getImg = this.getImg.bind(this);
        this.getDetail = this.getDetail.bind(this);
        this.handleClickDetail = this.handleClickDetail.bind(this);
    }

    handleClickDetail(ele){
        if(ele.visible === 0){
            if(!this.props.CurrentUser.ifLogined || this.props.CurrentUser.userName !== ele.author){
                this.props.TipStore.changeData("无权限，请联系管理员","warning");
                return;
            }
        }
        this.props.history.push(`/home/articleDetail/${ele.id}`);
    }

    getImg(type){
        switch(type){
            case "js":
                return jsIco;
            case "css":
                return css3Ico;
            case "html":
                return htmlIco;
            case "data":
                return dataIco;
            case "frame":
                return reactIco;
            case "essay":
                return writeIco;
            case "mood":
                return motionIco;
            case "cs":
                return csIco;
            default:
                return jsIco;
        }
    }

    getDetail(data) {
        const md = new Remarkable('full');
        md.set({
            html: true,
            breaks: true,
            typographer: true,
        })
        return md.render(data).replace(/<(.*?)>/gm," ");
    }

    render(){
        return(
            this.props.ArticleVisualStore.articleList.map( ele => (
                <div key={ele.id} className="articleContentDom">
                    <header>
                        <h1><abbr title={ele.title}>{ele.title}</abbr></h1>
                        <a onClick={(e) => {e.preventDefault();this.handleClickDetail(ele)}}>详情>>></a>
                    </header>
                    <main>
                        <div>
                            <p>{this.getDetail(ele.detail).slice(0,200)+"......"}</p>
                        </div>
                        <img src={this.getImg(ele.type)}></img>
                    </main>
                    <footer>
                        <img src={clockIco}></img>
                        <span>{ele.create_time.slice(0,10)}</span>
                        <span>作者：{ele.author}</span>
                        {!ele.visible && <span className="personalArticle">个人文章</span>}
                        <span>最后更新于：{ele.update_time.slice(0,10)}</span>
                    </footer>
                </div>
            ))
        )
    }
}

export default ArticleContainer;