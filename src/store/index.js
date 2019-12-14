import WelcomeAnimStore from "./../page/welcomePage/store";
import UserStore from "./../page/login/store";
import CurrentUser from "./user";
import TipStore from "./../component/tipComponent/store";
import ArticleStore from './../component/writeArticle/store';
import ArticleVisualStore from './../page/article/store';
import CurrentArticleStore from './../page/article/articleDetail/store';
import PageNationStore from './../component/pageNation/store';
import AdminStore from './../page/adminPage/store';

const store = {
    WelcomeAnimStore,
    UserStore,
    CurrentUser,
    TipStore,
    ArticleStore,
    ArticleVisualStore,
    CurrentArticleStore,
    PageNationStore,
    AdminStore
}

export default store;