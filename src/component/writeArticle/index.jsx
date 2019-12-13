import React from 'react';
import axios from 'axios';
import './index.scss';
import { inject, observer } from "mobx-react";
import { Remarkable } from 'remarkable';
import hljs from 'highlight.js';
import './atom-one-dark-reasonable.scss';
import {IPContext} from './../../context';

@inject("ArticleStore", "TipStore", "CurrentUser")
@observer
class WriteArticle extends React.Component{

    static contextType = IPContext;

    constructor(props){
        super(props);
        this.textDom = React.createRef();
        this.mdView = React.createRef();
        this.mdPic = React.createRef();
        this.handleClickMdIfPre = this.handleClickMdIfPre.bind(this);
        this.getRawMarkup = this.getRawMarkup.bind(this);
        this.handleChangeTitle = this.handleChangeTitle.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.handleInsertPic = this.handleInsertPic.bind(this);
        this.postPic = this.postPic.bind(this);
        this.handleSaveDraft = this.handleSaveDraft.bind(this);
        this.saveDraft = this.saveDraft.bind(this);
        this.removeDraft = this.removeDraft.bind(this);
        this.handlePublish = this.handlePublish.bind(this);
    }

    componentDidMount(){
        const {ArticleStore: articleStore, CurrentUser: currentUser, TipStore: tipStore} = this.props;
        let textDom = this.textDom.current;
        if(!currentUser.ifLogined){
            tipStore.changeData("请先登录","warning");
            this.props.history.replace(`/home`);
        }else if(!(currentUser.role.indexOf('2')>-1)){
            tipStore.changeData("无权限，请联系管理员","warning");
            this.props.history.replace(`/home`);
        }
        textDom.addEventListener("scroll",(e) => {this.handleScroll(e);},false);
        if(articleStore.ifEdit){
            this.removeDraft();
        }else{
            if(localStorage.getItem(`${this.props.CurrentUser.userName}_DraftText`) || localStorage.getItem(`${this.props.CurrentUser.userName}_DraftTitle`)){
                articleStore.updateText(localStorage.getItem(`${this.props.CurrentUser.userName}_DraftText`)?localStorage.getItem(`${this.props.CurrentUser.userName}_DraftText`):"");
                articleStore.updateTitle(localStorage.getItem(`${this.props.CurrentUser.userName}_DraftTitle`)?localStorage.getItem(`${this.props.CurrentUser.userName}_DraftTitle`):"");
            }
        }
    }

    componentWillUnmount(){
        const {ArticleStore: articleStore} = this.props;
        let textDom = this.textDom.current;
        textDom.removeEventListener("scroll",(e) => {this.handleScroll(e);},false);
        if(articleStore.ifSave){
            this.removeDraft();
        }else if(!articleStore.ifSave && articleStore.ifEdit){
            this.removeDraft();
        }else{
            this.saveDraft();
        }
        articleStore.toggleIfEdit(false);
        articleStore.toggleIfSave(false);
        articleStore.updateCurrentID("");
        articleStore.updateCurrentType("js");
        articleStore.updateVisible(true);
        articleStore.updateTitle("");
        articleStore.updateText("");
    }

    handleSaveDraft(e){
        e.preventDefault();
        if(this.props.ArticleStore.textVal || this.props.ArticleStore.titleVal){
            this.saveDraft()
            this.props.TipStore.changeData("保存成功","success");
        }else{
            this.props.TipStore.changeData("请输入内容","warning");
        }
    }

    saveDraft(){
        this.removeDraft();
        localStorage.setItem(`${this.props.CurrentUser.userName}_DraftText`,this.props.ArticleStore.textVal);
        localStorage.setItem(`${this.props.CurrentUser.userName}_DraftTitle`,this.props.ArticleStore.titleVal);
    }

    removeDraft(){
        localStorage.removeItem(`${this.props.CurrentUser.userName}_DraftText`);
        localStorage.removeItem(`${this.props.CurrentUser.userName}_DraftTitle`);
    }

    handleInsertPic(e){
        let mdPic = this.mdPic.current;
        let file = mdPic.files[0];
        if(file){
            if(file.size>6*1024*1024){
                this.props.TipStore.changeData("所选文件不能超过6mb", "fail");
            }else{
                this.postPic(file);
            }
        }
    }

    postPic(file){
        let formData = new FormData();
        formData.append("file",file);
        this.props.TipStore.toggleWaiting();
        axios.post(this.context+"/postMdPic",formData,{
            headers:{'Content-Type':'multipart/form-data'}
        }).then(res => {
            const {status} = res.data;
            this.props.TipStore.toggleWaiting();
            if(status === 0){
                this.props.TipStore.changeData("图片类型只能为jpg/png","warning");
            }else if(status === 1){
                this.props.ArticleStore.updateText(this.textDom.current.value+`\n![图片描述](${this.context}${res.data.path.slice(3)})`)
                this.props.TipStore.changeData("上传成功","warning");
            }
        }).catch((err) =>{
            console.log(err);
            if(this.props.TipStore.waiting){
                this.props.TipStore.toggleWaiting();
            }
            this.props.TipStore.changeData("网络原因，上传失败", "fail");
        });
    }

    handleScroll(e){
        let textDom = this.textDom.current;
        let mdView = this.mdView.current;
        let per = mdView.scrollHeight/textDom.scrollHeight;
        mdView.scrollTo(0,textDom.scrollTop*per);
    }

    handleChangeTitle(e){
        const {ArticleStore: articleStore, TipStore:tipStore} = this.props;
        if(e.target.value.length<=30){
            articleStore.updateTitle(e.target.value);
        }else{
            tipStore.changeData('标题长度不能超过30','warning');
        }
    }

    handleClickMdIfPre(e){
        const {ArticleStore: articleStore} = this.props;
        e.preventDefault();
        articleStore.toggleIfPreview();
    }

    handlePublish(e){
        const {ArticleStore:articleStore} = this.props;
        e.preventDefault();
        if(articleStore.textVal && articleStore.titleVal){
            let tempData = articleStore.ifEdit?
            {
                id: articleStore.currentID,
                title: articleStore.titleVal,
                detail: articleStore.textVal,
                author: this.props.CurrentUser.userName,
                type: articleStore.currentType,
                visible: articleStore.visible?1:0
            }:{
                title: articleStore.titleVal,
                detail: articleStore.textVal,
                author: this.props.CurrentUser.userName,
                type: articleStore.currentType,
                visible: articleStore.visible?1:0
            };
            this.props.TipStore.toggleWaiting();
            let tempAddress = articleStore.ifEdit?this.context+"/updateArticleById":this.context+"/saveArticle";
            axios.post(tempAddress,tempData)
            .then(res => {
                this.props.TipStore.toggleWaiting();
                if(res.data.status === 1){
                    this.props.TipStore.changeData(articleStore.ifEdit?"修改成功":"发布成功", "success")
                    this.removeDraft();
                    if(articleStore.ifEdit){
                        this.props.history.replace(`/home/articleDetail/${articleStore.currentID}`);
                    }else{
                        this.props.history.replace(`/home/articleDetail/${res.data.articleId}`);
                    }
                    articleStore.toggleIfEdit(false);
                    articleStore.toggleIfSave(true);
                }else{
                    this.props.TipStore.changeData(articleStore.ifEdit?"修改失败":"发布失败", "fail");
                }
            }).catch(err =>{
                console.log(err);
                if(this.props.TipStore.waiting){
                    this.props.TipStore.toggleWaiting();
                }
                this.props.TipStore.changeData(articleStore.ifEdit?"网络原因，修改失败":"网络原因，发布失败", "fail");
            })

        }else{
            this.props.TipStore.changeData("内容或标题不能为空","warning");
        }
    }

    getRawMarkup() {
        const {ArticleStore: articleStore} = this.props;
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
        return { __html: md.render(articleStore.textVal) };
    }

    render(){
        const {ArticleStore: articleStore} = this.props;
        const typeList = articleStore.articleType.map(item => (
            <option value={item.id} key={item.id}>{item.name}</option>
        ));
        return(
            <div id="writeDom">
                <div id="mdDom">
                    <div id="mdMain">
                        <input onChange={(e) => {this.handleChangeTitle(e);}} value={articleStore.titleVal} id="mdInput" placeholder="请输入标题"></input>
                        <ul id="mdUl">
                            <li>
                                <input ref={this.mdPic} id="mdPic" onChange={(e) => {this.handleInsertPic(e);}} accept=".jpg, .jpeg, .png" type="file"></input>
                                <label htmlFor="mdPic" id="insertPic"></label>
                            </li>
                            <li>
                                <a id="mdFile" onClick={(e) => {e.preventDefault();articleStore.toggleIfMdFile();}}></a>
                            </li>
                            <li>
                                <a id="mdIfPre" onClick={(e) => {this.handleClickMdIfPre(e);}}></a>
                            </li>
                            <li>
                                <a id="mdDraft" onClick={(e) => {this.handleSaveDraft(e);}}></a>
                            </li>
                            <li id="mdSelectLi">
                                <p>选择文章分类</p>
                                <select id="mdSelect" onChange={e => {articleStore.updateCurrentType(e.target.value)}} value={articleStore.currentType}>
                                    {typeList}
                                </select>
                            </li>
                            <li id="mdSwitchLi">
                                <p>仅自己可见</p>
                                <label htmlFor="mdCheckBox" id="mdSwitch">
                                    {articleStore.visible?
                                        <input onChange={(e) => {articleStore.updateVisible(!e.target.checked);}} id="mdCheckBox" type="checkbox"/>
                                        :
                                        <input onChange={(e) => {articleStore.updateVisible(!e.target.checked);}} id="mdCheckBox" type="checkbox" defaultChecked/>
                                    }
                                    <div className="slider round"></div>
                                </label> 
                            </li>
                            <li className="mdRightLi">
                                <a id="mdPublish" onClick={(e) => {this.handlePublish(e)}}></a>
                            </li>
                        </ul>
                        <textarea  ref={this.textDom} id="mdEditor" onChange={(e) => {articleStore.updateText(e.target.value);}} value={articleStore.textVal} placeholder="请输入内容">
                        </textarea>
                    </div>
                </div>
                {
                    articleStore.ifPreview
                    &&
                    <div ref={this.mdView} id="mdView">
                        <h1>{articleStore.titleVal}</h1>
                        <div id="mdViewDom" dangerouslySetInnerHTML={this.getRawMarkup()}></div>
                    </div>
                }
                {
                    articleStore.ifMdFile
                    &&
                    <div id="mdFileDom">
                        <main>
                            <div className="header">
                                Markdown语法参考
                            </div>
                            <div className="content">
                                <ul>
                                    <li># 一级标题</li>
                                    <li>## 二级标题</li>
                                    <li>##### 五级标题</li>
                                </ul>
                                <ul>
                                    <li>水平线</li>
                                    <li>___</li>
                                    <li>***</li>
                                </ul>
                                <ul>
                                    <li>*斜体*</li>
                                    <li>**粗体**</li>
                                    <li>> 引用段落</li>
                                </ul>
                                <ul>
                                    <li>==标记==</li>
                                    <li>++下划线++</li>
                                    <li>~~删除线~~</li>
                                </ul>
                                <ul>
                                    <li>```</li>
                                    <li>代码块</li>
                                    <li>```</li>
                                </ul>
                                <ul>
                                    <li>列表li：+, -,*</li>
                                    <li>列表ol：1. 2. 3.</li>
                                    <li>定义初始ol序号：57. 1. 2.</li>
                                </ul>
                                <ul>
                                    <li>[标题](链接地址)</li>
                                    <li>![图片描述](图片链接地址)</li>
                                </ul>
                            </div>
                            <div className="footer">
                                <a onClick={(e) => {e.preventDefault();articleStore.toggleIfMdFile();}}>我知道了</a>
                            </div>
                        </main>
                    </div>
                }
            </div>
        )
    }
}

export default WriteArticle;