/**
 * AccountService
 * @class AccountService
 * @author by Youngho Kim
 */
export const AccountService = {
  currentAccount: null,
  audioInAccess: false,
  audioOutAccess: false,
  alarmOutputAccess: false,
  ptzAccess: false,
  PrivacyAreaAccess: false,
  profileAccess: false, //DEFAULT PROFILE
  isGuest: false,
  isAdmin: false,
  fetchUser: (obj) => {
    return new Promise(function (resolve, reject) {
      try {
        AccountService.currentAccount = obj;
        if (AccountService.currentAccount.UserID === 'guest') {
          AccountService.audioInAccess = false;
          AccountService.audioOutAccess = false;
          AccountService.alarmOutputAccess = false;
          AccountService.ptzAccess = false;
          AccountService.profileAccess = false;
          AccountService.isGuest = true;
        } else {
          AccountService.audioInAccess =
            AccountService.currentAccount.AudioInAccess;
          AccountService.audioOutAccess =
            AccountService.currentAccount.AudioOutAccess;
          AccountService.alarmOutputAccess =
            AccountService.currentAccount.AlarmOutputAccess;
          AccountService.ptzAccess = AccountService.currentAccount.PTZAccess;
          AccountService.PrivacyAreaAccess =
            AccountService.currentAccount.PrivacyAreaAccess;
          AccountService.profileAccess =
            AccountService.currentAccount.VideoProfileAccess;
          AccountService.isGuest = false;
        }
        AccountService.isAdmin =
          AccountService.currentAccount.Index === 0 ||
          AccountService.currentAccount.AdminAccess;
        resolve(AccountService);
      } catch (error) {
        console.log(error);
        reject(false);
      }
    });
  },
  setAccount: async (obj) => {
    return await AccountService.fetchUser(obj);
  },
  getAccount: () => {},
  accountReady: function () {
    if (this.currentAccount !== null) {
      return true;
    } else {
      return false;
    }
  },
  isAudioInAble: function () {
    if (typeof this.audioInAccess === 'string') {
      this.audioInAccess = this.audioInAccess === 'True';
    }

    return this.audioInAccess;
  },
  isAudioOutAble: function () {
    if (typeof this.audioOutAccess === 'string') {
      this.audioOutAccess = this.audioOutAccess === 'True';
    }
    return this.audioOutAccess;
  },
  isAlarmOutputAble: function () {
    if (typeof this.alarmOutputAccess === 'string') {
      this.alarmOutputAccess = this.alarmOutputAccess === 'True';
    }
    return this.alarmOutputAccess;
  },
  isPTZAble: function () {
    if (typeof this.ptzAccess === 'string') {
      this.ptzAccess = this.ptzAccess === 'True';
    }

    return this.ptzAccess;
  },
  isPrivacyAble: function () {
    if (typeof this.PrivacyAreaAccess === 'string') {
      this.PrivacyAreaAccess = this.PrivacyAreaAccess === 'True';
    }
    return this.PrivacyAreaAccess;
  },
  isProfileAble: function () {
    if (typeof this.profileAccess === 'string') {
      this.profileAccess = this.profileAccess === 'True';
    }
    return this.profileAccess;
  },
  getUserId: function () {
    return this.currentAccount.UserID;
  },
};
