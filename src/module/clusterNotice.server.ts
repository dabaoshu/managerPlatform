import { LOCAL_STORAGE } from "@/constants";

class ClusterNotice {
  set notice(val) {
    localStorage.setItem(LOCAL_STORAGE.HIDDEN_MSG, val);
  }
  get notice() {
    return localStorage.getItem(LOCAL_STORAGE.HIDDEN_MSG);
  }

  clear = () => {
    this.notice = ""
  }

}


const noticeServer = new ClusterNotice()

export default noticeServer