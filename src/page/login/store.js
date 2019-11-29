import { observable, action, autorun, runInAction } from "mobx";

class UserStore{
    @observable userName;
    @observable password;
    @observable repassword;
    @observable ifSignUp;
    @observable nameNull;
    @observable passwordNull;
    @observable nameErr;
    @observable passwordErr;
    @observable repasswordErr;
    @observable registerErr;
    @observable signInAnim;
    @observable signUpAnim;
    @observable timeErr;

    constructor(){
        this.userName = "";
        this.password = "";
        this.repassword = "";
        this.ifSignUp = false;
        this.nameNull = false;
        this.passwordNull = false;
        this.nameErr = false;
        this.passwordErr = false;
        this.repasswordErr = false;
        this.registerErr = false;
        this.signInAnim = false;
        this.signUpAnim = false;
        this.timeErr = false;
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

    @action toggleSignInAnim(){
        this.signInAnim = !this.signInAnim;
    }

    @action toggleSignUpAnim(){
        this.signUpAnim = !this.signUpAnim;
    }

    @action initial(){
        this.userName = "";
        this.password = "";
        this.repassword = "";
        this.nameNull = false;
        this.passwordNull = false;
        this.nameErr = false;
        this.passwordErr = false;
        this.repasswordErr = false;
        this.registerErr = false;
        this.signInAnim = false;
        this.signUpAnim = false;
        this.timeErr = false;
    }

    @action changeStatus(property){
        this[property] = true;
        setTimeout(() => {
            runInAction(() => {
                this[property] = false;
            })
        },1200);
    }
}

let userStore = new UserStore()
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

export default userStore;