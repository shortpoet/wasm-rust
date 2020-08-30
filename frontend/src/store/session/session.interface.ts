import { Moment } from 'moment';
import moment from 'moment';
import { useStorage } from '@/composables/useStorage';
import { colorLog } from '@/utils/colorLog';
const storage = useStorage()

const debug = false

export interface ISession {
  created: Moment;
  projectName: string;
  categoryName: string;
}

export class Session implements ISession {
  created: Moment;
  projectName: string;
  categoryName: string;
  sessionKey: string;

  constructor(projectName: string, categoryName: string) {
    this.projectName = projectName;
    this.categoryName = categoryName;
    this.sessionKey = `rust-session`;
    this.created = moment()
    this.checkExpiry()
  }

  setStorage() {
    colorLog('setting session', undefined, debug)
    storage.setWExpiry(this.sessionKey, this)
    colorLog(JSON.stringify(this), undefined, debug)
  }

  public getSession(sessionKey: string) {
    colorLog('getting session', undefined, debug)
    const session = storage.getWExpiry(sessionKey)
    colorLog(JSON.stringify(session), undefined, debug)
    return session
  }

  public endSession() {
    colorLog('ending session', undefined, debug)
    const session = storage.remove(this.sessionKey)
    colorLog(JSON.stringify(session), undefined, debug)
    return session
  }
  
  checkExpiry() {
    colorLog('checking session expiry', undefined, debug)
    // console.log(this);
    if (!storage.getWExpiry(this.sessionKey)) {
      this.setStorage()
    } else {
      const session: Session = storage.getWExpiry(this.sessionKey)
      this.projectName = session.projectName
      this.created = moment(session.created)
      this.categoryName = session.categoryName
      this.sessionKey = session.sessionKey
    }
    // console.log(this);
  }


}