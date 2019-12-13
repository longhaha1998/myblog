import React from 'react';
import './index.scss';
import './atom-one-dark-reasonable.scss';
import { inject, observer } from "mobx-react";
import clockIco from "./../../../assets/image/clock.png";
import { Remarkable } from 'remarkable';
import hljs from 'highlight.js';
import axios from 'axios';
import {IPContext} from "./../../../context";

@inject("ArticleVisualStore","ArticleStore","CurrentArticleStore","TipStore","CurrentUser")
@observer
class ArticleDetail extends React.Component{

    static contextType = IPContext;

    constructor(props){
        super(props);
        this.getDetailView = this.getDetailView.bind(this);
        this.handleToEdit = this.handleToEdit.bind(this);
        this.state ={
            isLoading: true
        }
    }

    componentDidMount(){
        const {CurrentUser: currentUser} = this.props;
        this.props.TipStore.toggleWaiting();
        axios.get(this.context+`/getArticleById?id=${this.props.match.params.articleId}`)
        .then(res => {
            this.props.TipStore.toggleWaiting();
            if(res.data.status === 1){
                console.log(res.data)
                if(res.data.data.visible === 0){
                    if(!currentUser.ifLogined || !(currentUser.userName === res.data.data.author)){
                        this.props.TipStore.changeData("无权限，请联系管理员","warning");
                        this.props.history.replace("/home");
                        return;
                    }
                }
                this.props.CurrentArticleStore.updateCurrentArticleDetail(res.data.data);
                this.setState({
                    isLoading: false
                })
            }
        }).catch((err) => {
            console.log(err);
            if(this.props.TipStore.waiting){
                this.props.TipStore.toggleWaiting();
            }
            this.props.TipStore.changeData("网络错误","warning");
        })
    }

    componentWillUnmount(){
        this.props.CurrentArticleStore.updateCurrentArticleDetail({});
    }

    handleToEdit(){
        const {CurrentUser:currentUser, TipStore:tipStore, ArticleStore:articleStore} = this.props;
        const currentArticle = this.props.CurrentArticleStore.currentArticleDetail;
        if(!currentUser.ifLogined){
            tipStore.changeData("请先登录","warning");
            return;
        }else{
            if(currentUser.role.indexOf("2")>-1 && currentArticle.author === currentUser.userName){
                articleStore.toggleIfEdit(true);
                articleStore.updateVisible(currentArticle.visible);
                articleStore.updateTitle(currentArticle.title);
                articleStore.updateText(currentArticle.detail);
                articleStore.updateCurrentType(currentArticle.type);
                articleStore.updateCurrentID(currentArticle.id);
                this.props.history.push("/home/writeArticle");
            }else{
                tipStore.changeData("无权限，请联系管理员","fail");
            }
        }
    }

    getDetailView(){
        const currentArticle = this.props.CurrentArticleStore.currentArticleDetail;
        const md = new Remarkable('full');
        md.set({
            html: true,
            breaks: true,
            typographer: true,
            highlight: function (str, lang) {
                if (lang && hljs.getLanguage(lang)) {
                  try {
                    return hljs.highlight(lang, str).value;
                  } catch (err) {}
                }
            
                try {
                  return hljs.highlightAuto(str).value;
                } catch (err) {}
            
                return ''; // use external default escaping
              } 
        })
        return { __html: md.render(currentArticle.detail) };
    }

    render(){
        const currentArticle = this.props.CurrentArticleStore.currentArticleDetail;
        return(
            this.state.isLoading
            ?
            <div id="articleDetailDom">
                <main id="articleDetailMain">
                </main>
            </div>
            :
            <div id="articleDetailDom">
                <main id="articleDetailMain">
                    <div id="detailHeader">
                        <h1>{currentArticle.title}</h1>
                        <footer>
                            <img src={clockIco}></img>
                            <span>{currentArticle.create_time.slice(0,10)}</span>
                            <span>作者：{currentArticle.author}</span>
                            {!currentArticle.visible && <span className="personalArticle">个人文章</span>}
                            <span>最后更新于：{currentArticle.update_time.slice(0,10)}</span>
                            <a onClick={e => {e.preventDefault();this.handleToEdit();}}>编辑此页>></a>
                        </footer>
                    </div>
                    <div id="articleDetailViewDom" dangerouslySetInnerHTML={this.getDetailView()}></div>
                </main>
            </div>
        );
    }
}

export default ArticleDetail;