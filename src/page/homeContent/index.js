import React from "react";
import "./index.scss";
// import headPng from '../../assets/image/head.jpg';

class HomeContent extends React.Component{
    render(){
        return(
            <React.Fragment>
                <main id="homeMain">
                    <div id="contentDom">
                        <div id="contentHeader">
                            {/* <img src={headPng}></img> */}
                        </div>
                        <div id="contentTag">
                            <div id="labelBox">
                                <div className="labelDom purpleLabel">程序猿</div>
                                <div className="labelDom greenLabel">90后</div>
                                <div className="labelDom yellowLabel">javaScript</div>
                            </div>
                            <div id="describeBox">
                                <ul id="describeUl">
                                    <li>前端爱好者,建立本站的初衷是记录自己的学习历程以及便于总结知识</li>
                                    <li>东北大学2016级数字媒体技术专业学生</li>
                                    <li>本站源码<a href="https://github.com/longhaha1998/myblog">https://github.com/longhaha1998/myblog</a>,欢迎交流</li>
                                    <li>声明：本站所引用的内容（图片，字体等）如有侵权，请联系本人！</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </main>
            </React.Fragment>
        )
    }
}

export default HomeContent;
