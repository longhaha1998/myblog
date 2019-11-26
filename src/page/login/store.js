import { observable, action, autorun } from "mobx";

class UserStore{
    @observable userName;
    @observable password;
    @observable repassword;
    @observable ifSignUp;

    constructor(){
        this.userName = "";
        this.password = "";
        this.repassword = "";
        this.ifSignUp = false;
    }

    @action updateUserName(val){
        this.userName = val;
    }

    @action updatePassword(val){
        this.password = val;
    }

    @action updateRepassword(val){
        this.repassword = val;
    }

    @action toggleIfSignUp(val){
        this.ifSignUp = val;
    }
}

// let mbxData = new MobxData();
// autorun(() => {
//     console.log("autorun")
//     if (mbxData.quan) {
//         mbxData.goods.forEach((item) => {
//             item.set("check", mbxData.quan);
//         })
//     }
// })
// export default mbxData;

export default new UserStore();