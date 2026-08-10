// sunapiManager object
// by @inorganik
// import log4javascript from 'log4javascript';

import { SunapiClient } from './SunapiClient';
import { sunapiRestClient } from './SunapiRestClient';

import { HTTP_STATUS_CODES } from './HttpStatusCode';

import { UmpException } from '../Exception/UmpException';
import { SunapiException } from '../Exception/SunapiException';
import { ResetClientProps } from '../Constant/Constant';

// window.log = window.log4javascript = log4javascript;
const fromHex = window.fromHex;
const fastJsonStringfy = window.fastJsonStringfy;

// dependent upon CryptoJS MD5 hashing:
// http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/md5.js
export const SunapiManager = function () {
  'use strict';
  var _version = '0.0.2';
  var log = window.log.getLogger('sunapimanager');
  var useSunapiClient = true;

  //  var sunapiClient = null;
  var uri = {
    URI_PROFILE: '/stw-cgi/media.cgi?msubmenu=videoprofile',
    URI_PROFILE_POLICY: '/stw-cgi/media.cgi?msubmenu=videoprofilepolicy',
    URI_STREAM_URI: '/stw-cgi/media.cgi?msubmenu=streamuri',
    URI_SESSION_KEY: '/stw-cgi/media.cgi?msubmenu=sessionkey',
    URI_STORAGE_INFO: '/stw-cgi/recording.cgi?msubmenu=storage',
    URI_RECORDING_SETUP: '/stw-cgi/recording.cgi?msubmenu=general',
    URI_SEARCH_RECORDING_PERIOD: '/stw-cgi/recording.cgi?msubmenu=general',
  };

  var cgi = {
    INIT_CGI: 'pw_init.cgi',
    ATTRIBUTES: 'attributes.cgi',
    SYSTEM_CGI: 'system.cgi',
    SECURITY_CGI: 'security.cgi',
    MEDIA_CGI: 'media.cgi',
    RECORDING_CGI: 'recording.cgi',
    VIDEO_CGI: 'video.cgi',
    AI_CGI: 'ai.cgi',
  };

  var submenu = {
    STATUS_CHECK: 'statuscheck',
    DEVICE_INFO: 'deviceinfo',
    DATE: 'date',
    USER: 'users',
    PROFILE_ACCESS_INFO: 'profileaccessinfo',
    VIDEO_SOURCE: 'videosource',
    VIDEO_PROFILE: 'videoprofile',
    VIDEO_PROFILE_POLICY: 'videoprofilepolicy',
    VIDEO_STREAM_URI: 'streamuri',
    VIDEO_SESSION_KEY: 'sessionkey',
    RECORDING_STORAGE_INFO: 'storageinfo',
    RECORDING_SETUP: 'general',
    RECORDING_SEARCH_PERIOD: 'searchrecordingperiod',
    RECORDING_CALENDAR_SEARCH: 'calendarsearch',
    RECORDING_OVERLAPPED: 'overlapped',
    RECORDING_TIMELINE: 'timeline',
    RECORDING_AI_TIMELINE: 'aitimeline',
    SNAPSHOT: 'snapshot',
    GET_CLIENT_IP: 'getclientip',
  };

  var action = {
    VIEW: 'view',
    SET: 'set',
    ADD: 'add',
    UPDATE: 'update',
    REMOVE: 'remove',
    CONTROL: 'control',
    MONITORDIFF: 'monitordiff',
    CHECK: 'check',
  };

  var params = {
    CHANNEL_ID_LIST: 'ChannelIDList',
    OVERLAPPED_ID: 'OverlappedID',
  };

  var attributes;

  var SessionKey;
  var VideoProfiles;
  var VideoProfilePolicies;
  var StorageInfo;
  var RecordingSetup;
  var SearchRecordingPeriod;
  var loc_protocol = window.location.protocol;
  var splitProt = loc_protocol.split(':');
  var device = {
    ClientIPAddress: '127.0.0.1',
    cameraIp: '',
    captureName: '',
    username: '',
    password: '',
    port: 80,
    protocol: splitProt[0],
    hostname: '',
    deviceType: 'nvr',
    timeout: 10,
    debug: true,
    async: false,
  };
  var LONG_POLLING_TIMEOUT = 15000;

  var isJson = function (str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  var version = function () {
    return _version;
  };

  const get = (uri, data, async, isText, useSeq) => {
    if (typeof data === 'undefined') data = {};
    if (typeof async === 'undefined') async = false;
    if (typeof isText === 'undefined') isText = false;
    if (typeof useSeq === 'undefined') useSeq = true;

    var sunapiClient = this.sunapi;
    return new Promise(function (resolve, reject) {
      sunapiClient.get(
        uri,
        data,
        (response) => {
          if (typeof response === 'string') {
            response = JSON.parse(response);
          }
          if (response.data !== undefined) {
            response = response.data;
          }
          resolve(response);
        },
        (error) => {
          reject(
            new SunapiException({
              errorCode: fromHex('0x0702'),
              place: 'sunapiManager.js:init',
              uri: uri,
              status: error.Code,
              message: HTTP_STATUS_CODES[error.Code],
            })
          );
        },
        '',
        async ? true : false,
        isText,
        useSeq
      );
    });
  };

  function Constructor() {
    Constructor.prototype.version = version();
    this._sunapiClient = null;
  }

  Constructor.prototype = {
    /**
     * This function is initialize sunapiManager.
     * @function init
     * @memberof sunapiManager
     * @example
     *     example: sunapiManager.init(info);
     */
    init: async (info) => {
      try {
        device = info;
        var loc_protocol = window.location.protocol;
        var splitProt = loc_protocol.split(':');

        if (device.protocol !== splitProt[0]) {
          if (splitProt[0] === 'chrome-extension') {
            if (info.port == 80 && info.https == false) {
              device.protocol = 'http';
            } else {
              device.protocol = 'https';
            }
          } else {
            device.protocol = splitProt[0];
            if (info.port !== window.location.port) {
              device.port = info.port;
            }
          }
        }

        if (info.cameraIp && info.user && info.deviceType !== 'nvr') {
          info.hostname = info.cameraIp;
          info.username = info.user;
        }

        if (this.sunapi !== null) {
          this.sunapi = null;
        }

        if (!this.sunapi) {
          if (useSunapiClient) {
            this.sunapi = new SunapiClient(device);
          } else {
            this.sunapi = new sunapiRestClient();
            this.sunapi.init(device);
          }
        } else {
          throw new SunapiException({
            errorCode: fromHex('0x0702'),
            place: 'sunapiManager.js:init',
            message: 'sunapi client is not init',
          });
        }
      } catch (error) {
        throw new SunapiException({
          errorCode: fromHex('0x0702'),
          place: 'sunapiManager.js:init',
          message: 'username or password is empty',
        });
      }
      var sunapiURI = '/init-cgi/' + cgi.INIT_CGI;
      sunapiURI += '?msubmenu=' + submenu.STATUS_CHECK;
      sunapiURI += '&action=' + action.VIEW;

      return await get(sunapiURI);
    },
    getSunapiClient: () => {
      return this.sunapi;
    },
    login: async () => {
      const promises = [];
      var sunapiURI1 = '/stw-cgi/' + cgi.SYSTEM_CGI;
      sunapiURI1 += '?msubmenu=' + submenu.DEVICE_INFO;
      sunapiURI1 += '&action=' + action.VIEW;
      var sunapiURI2 = '/stw-cgi/' + cgi.SECURITY_CGI;
      sunapiURI2 += '?msubmenu=' + submenu.USER;
      sunapiURI2 += '&action=' + action.VIEW;

      return get(sunapiURI2);
      // try {
      //   return Promise.all([get(sunapiURI1, {}), get(sunapiURI2, {})]);
      // } catch (error) {
      //   console.log(error); // 'Out of fruits!'
      // }

      // return new Promise(function (resolve, reject) {
      //   try {
      //     get(sunapiURI, {})
      //       .then((response) => {
      //         log.warn(response);
      //         get(sunapiURI, {})
      //           .then((response) => {
      //             try {
      //               if (typeof response === 'string') {
      //                 response = JSON.parse(response);
      //               }
      //               if (response.data !== undefined) {
      //                 response = response.data;
      //               }

      //               if (response.Users !== 'undefined') {
      //                 var accountInfo = {};
      //                 var data = response.Users;

      //                 if (data.length === 1) {
      //                   //user
      //                   accountInfo = data[0];
      //                 } else if (data.length === 0) {
      //                   //guest
      //                   accountInfo.UserID = 'guest';
      //                 } else {
      //                   //admin or user(adminAccess)
      //                   if (typeof data[0].AdminAccess === 'undefined') {
      //                     accountInfo = data[0];
      //                   } else {
      //                     for (var idx = 0; idx < data.length; idx++) {
      //                       if (data[idx].AdminAccess) {
      //                         accountInfo = data[idx];
      //                         break;
      //                       }
      //                     }
      //                   }
      //                 }
      //               }
      //               resolve(accountInfo);
      //             } catch (error) {
      //               log.error(error);
      //               throw new SunapiException({
      //                 errorCode: fromHex('0x0702'),
      //                 place: 'sunapiManager.js:login',
      //                 message: 'The sunapi client clould not login to camera.',
      //               });
      //             }
      //           })
      //           .catch((error) => {
      //             reject(error);
      //             // log.error(error);
      //             // throw new SunapiException({
      //             //   errorCode: fromHex('0x0702'),
      //             //   place: 'sunapiManager.js:login',
      //             //   uri: sunapiURI,
      //             //   status: error.Code,
      //             //   message: HTTP_STATUS_CODES[error.Code],
      //             // });
      //           });
      //       })
      //       .catch((error) => {
      //         log.error(error);
      //         throw new SunapiException({
      //           errorCode: fromHex('0x0702'),
      //           place: 'sunapiManager.js:login',
      //           uri: sunapiURI,
      //           status: error.Code,
      //           message: HTTP_STATUS_CODES[error.Code],
      //         });
      //       });
      //   } catch (error) {
      //     log.error(error);
      //     throw new UmpException({
      //       errorCode: fromHex('0x0700'),
      //       place: 'sunapiManager.js:login',
      //       message: error.message,
      //     });
      //   }
      // });
    },
    logout: () => {
      try {
        if (this.sunapi !== null) {
          this.sunapi = null;
        }
      } catch (error) {
        console.error(error);
      }
    },
    // getSunapiClient: function () {
    //   return this._sunapiClient;
    // },
    attach: function (v) {
      this._sunapiClient = v;
    },
    dettach: function () {
      this._sunapiClient = null;
    },
    getAttributes: async () => {
      const promises = [];
      var sunapiURI = '/stw-cgi/' + cgi.ATTRIBUTES + '/attributes';

      try {
        return get(sunapiURI, {})
          .then((response) => {
              if (typeof response === 'string') {
                response = JSON.parse(response);
              }
              if (response.data !== undefined) {
                response = response.data;
              }
              resolve({
                name: 'attributes',
                data: response,
              });            
          })
          .catch((error) => {
            log.error(error);
            throw new SunapiException({
              errorCode: fromHex('0x0702'),
              place: 'sunapiManager.js:getAttributes',
              uri: sunapiURI,
              status: error.Code,
              message: HTTP_STATUS_CODES[error.Code],
            });
          });
        } catch (error) {
          throw new UmpException({
            uri: sunapiURI,
            errorCode: fromHex('0x0700'),
            place: 'sunapiManager.js:getAttributes',
            message: error.message,
          });
        }
    },
    getAttributes2: function () {
      return new Promise(function (resolve, reject) {
        var sunapiURI = '/stw-cgi/' + cgi.ATTRIBUTES + '/attributes';
        try {
          get(sunapiURI, {})
            .then((response) => {
              if (typeof response === 'string') {
                response = JSON.parse(response);
              }
              if (response.data !== undefined) {
                response = response.data;
              }
              resolve({
                name: 'attributes',
                data: response,
              });
            })
            .catch((error) => {
              log.error(error);
              throw new SunapiException({
                errorCode: fromHex('0x0702'),
                place: 'sunapiManager.js:getAttributes',
                uri: sunapiURI,
                status: error.Code,
                message: HTTP_STATUS_CODES[error.Code],
              });
            });
        } catch (error) {
          throw new UmpException({
            uri: sunapiURI,
            errorCode: fromHex('0x0700'),
            place: 'sunapiManager.js:getAttributes',
            message: error.message,
          });
        }
      });
    },
    getDeviceInfo: function () {
      var sunapiURI = '/stw-cgi/' + cgi.SYSTEM_CGI;
      sunapiURI += '?msubmenu=' + submenu.DEVICE_INFO;
      sunapiURI += '&action=' + action.VIEW;

      return get(sunapiURI);
    },
    getClientIp: function () {
      var sunapiClient = this._sunapiClient;
      return new Promise(function (resolve, reject) {
        var sunapiURI = '/stw-cgi/' + cgi.SYSTEM_CGI;
        sunapiURI += '?msubmenu=' + submenu.GET_CLIENT_IP;
        sunapiURI += '&action=' + action.VIEW;
        var getData = {};
        try {
          sunapiClient.get(
            sunapiURI,
            getData,
            function (response) {
              if (typeof response === 'string') {
                response = JSON.parse(response);
              }
              if (response.data !== undefined) {
                response = response.data;
              }
              if (typeof callback !== 'undefined' && callback != null) {
                callback(response);
              } else {
                resolve(response);
              }
            },
            function (errorData) {
              errorData.uri = sunapiURI;
              errorData.place = 'sunapiManager.js:getClientIp';
              if (typeof callback !== 'undefined' && callback != null) {
                callback(errorData);
              } else {
                reject(errorData);
              }
            },
            '',
            device.async ? true : false
          );
        } catch (error) {
          throw new UmpException({
            errorCode: fromHex('0x0700'),
            message: error.message,
          });
        }
      });
    },
    getTimezoneInfo: function () {
      var sunapiClient = this._sunapiClient;
      return new Promise(function (resolve, reject) {
        var sunapiURI = '/stw-cgi/' + cgi.SYSTEM_CGI;
        sunapiURI += '?msubmenu=' + submenu.DATE;
        sunapiURI += '&action=' + action.VIEW;
        sunapiURI += '&TimeZoneList';
        var getData = {};
        try {
          sunapiClient.get(
            sunapiURI,
            getData,
            function (response) {
              if (typeof response === 'string') {
                response = JSON.parse(response);
              }
              if (response.data !== undefined) {
                response = response.data;
              }
              if (typeof callback !== 'undefined' && callback != null) {
                callback(response);
              } else {
                resolve(response);
              }
            },
            function (errorData) {
              errorData.uri = sunapiURI;
              errorData.place = 'sunapiManager.js:getTimezoneInfo';
              if (typeof callback !== 'undefined' && callback != null) {
                callback(errorData);
              } else {
                reject(errorData);
              }
            },
            '',
            device.async ? true : false
          );
        } catch (error) {
          throw new UmpException({
            errorCode: fromHex('0x0700'),
            message: error.message,
          });
        }
      });
    },
    getDateInfo: function () {
      var sunapiClient = this._sunapiClient;
      return new Promise(function (resolve, reject) {
        var sunapiURI = '/stw-cgi/' + cgi.SYSTEM_CGI;
        sunapiURI += '?msubmenu=' + submenu.DATE;
        sunapiURI += '&action=' + action.VIEW;
        var getData = {};
        try {
          sunapiClient.get(
            sunapiURI,
            getData,
            function (response) {
              if (typeof response === 'string') {
                response = JSON.parse(response);
              }
              if (response.data !== undefined) {
                response = response.data;
              }
              if (typeof callback !== 'undefined' && callback != null) {
                callback(response);
              } else {
                resolve(response);
              }
            },
            function (errorData) {
              errorData.uri = sunapiURI;
              errorData.place = 'sunapiManager.js:getDateInfo';
              if (typeof callback !== 'undefined' && callback != null) {
                callback(errorData);
              } else {
                reject(errorData);
              }
            },
            '',
            device.async ? true : false
          );
        } catch (error) {
          throw new UmpException({
            errorCode: fromHex('0x0700'),
            message: error.message,
          });
        }
      });
    },
    getSnapshot: function (profile, channel) {
      var sunapiClient = this._sunapiClient;
      return new Promise(function (resolve, reject) {
        var sunapiURI = '/stw-cgi/' + cgi.VIDEO_CGI;
        sunapiURI += '?msubmenu=' + submenu.SNAPSHOT;
        sunapiURI += '&action=' + action.VIEW;
        if (profile !== null && profile !== undefined) {
          if (Number.isInteger(Number(profile))) {
            sunapiURI += '&Profile=' + profile;
          } else {
            throw new UmpException({
              errorCode: fromHex('0x0409'),
              message: 'Invalid profile number',
            });
          }
        }
        if (channel !== null && channel !== undefined) {
          if (Number.isInteger(Number(channel))) {
            sunapiURI += '&Channel=' + channel;
          } else {
            throw new UmpException({
              errorCode: fromHex('0x0409'),
              message: 'Invalid profile number',
            });
          }
        } else {
          sunapiURI += '&Channel=0';
        }
        var getData = {};
        try {
          sunapiClient.get(
            sunapiURI,
            getData,
            function (response) {
              if (typeof response === 'string') {
                response = JSON.parse(response);
              }
              if (response.data !== undefined && response.data.size !== 0) {
                if (typeof callback !== 'undefined' && callback != null) {
                  callback(response);
                } else {
                  resolve(response);
                }
              }
            },
            function (errorData) {
              errorData.uri = sunapiURI;
              errorData.place = 'sunapiManager.js:getSnapshot';
              if (typeof callback !== 'undefined' && callback != null) {
                callback(errorData);
              } else {
                reject(errorData);
              }
            },
            '',
            true
          );
        } catch (error) {
          throw new UmpException({
            errorCode: fromHex('0x0700'),
            message: error.message,
          });
        }
      });
    },
    /**
     *
     * @param {string} viewgroup User, Channel, Profile
     */
    getSystemProfileAccessInfo: function (viewgroup) {
      var sunapiClient = this._sunapiClient;
      return new Promise(function (resolve, reject) {
        var sunapiURI = '/stw-cgi/' + cgi.SYSTEM_CGI;
        sunapiURI += '?msubmenu=' + submenu.PROFILE_ACCESS_INFO;
        sunapiURI += '&action=' + action.VIEW;
        if (typeof channel !== 'undefined') {
          log.debug('request channel number: ' + channel);
          sunapiURI += '&Channel=' + channel;
        }
        //var url = device.protocol + "://" + device.serverAddress + sunapiURI;
        var getData = {};
        log.debug('sunapi URI', sunapiURI);
        try {
          sunapiClient.get(
            sunapiURI,
            getData,
            function (response) {
              if (typeof response === 'string') {
                response = JSON.parse(response);
              }
              if (response.data !== undefined) {
                response = response.data;
              }
              if (typeof callback !== 'undefined' && callback != null) {
                callback(response.Profile);
              } else {
                //setTimeout(function(){ console.log("sleep 1 second"); resolve(response.Profile);}, 3000);
                resolve(response.Profile);
              }
            },
            function (errorData) {
              errorData.uri = sunapiURI;
              errorData.place = 'sunapiManager.js:getSystemProfileAccessInfo';
              if (typeof callback !== 'undefined' && callback != null) {
                callback(errorData);
              } else {
                reject(errorData);
              }
            },
            '',
            device.async ? true : false
          );
        } catch (error) {
          throw new UmpException({
            errorCode: fromHex('0x0700'),
            message: error.message,
          });
        }
      });
    },
    getVideoSource: function () {
      var sunapiClient = this._sunapiClient;
      return new Promise(function (resolve, reject) {
        var sunapiURI = '/stw-cgi/' + cgi.MEDIA_CGI;
        sunapiURI += '?msubmenu=' + submenu.VIDEO_SOURCE;
        sunapiURI += '&action=' + action.VIEW;

        var getData = {};
        log.debug('sunapi URI', sunapiURI);
        try {
          sunapiClient.get(
            sunapiURI,
            getData,
            function (response) {
              if (typeof response === 'string') {
                response = JSON.parse(response);
              }
              if (response.data !== undefined) {
                response = response.data;
              }
              if (typeof callback !== 'undefined' && callback != null) {
                callback(response.VideoSources);
              } else {
                resolve(response.VideoSources);
              }
            },
            function (errorData) {
              errorData.uri = sunapiURI;
              errorData.place = 'sunapiManager.js:getVideoSource';
              if (typeof callback !== 'undefined' && callback != null) {
                callback(errorData);
              } else {
                reject(errorData);
              }
            },
            '',
            device.async ? true : false
          );
        } catch (error) {
          throw new UmpException({
            errorCode: fromHex('0x0700'),
            message: error.message,
          });
        }
      });
    },
    getVideoProfileAll: function () {
      var sunapiClient = this._sunapiClient;
      return new Promise(function (resolve, reject) {
        var sunapiURI = '/stw-cgi/' + cgi.MEDIA_CGI;
        sunapiURI += '?msubmenu=' + submenu.VIDEO_PROFILE;
        sunapiURI += '&action=' + action.VIEW;

        var getData = {};
        log.debug('sunapi URI', sunapiURI);
        try {
          sunapiClient.get(
            sunapiURI,
            getData,
            function (response) {
              if (typeof response === 'string') {
                response = JSON.parse(response);
              }
              if (response.data !== undefined) {
                response = response.data;
              }
              if (typeof callback !== 'undefined' && callback != null) {
                callback(response.VideoProfiles);
              } else {
                resolve(response.VideoProfiles);
              }
            },
            function (errorData) {
              errorData.uri = sunapiURI;
              errorData.place = 'sunapiManager.js:getVideoProfileAll';
              if (typeof callback !== 'undefined' && callback != null) {
                callback(errorData);
              } else {
                reject(errorData);
              }
            },
            '',
            device.async ? true : false
          );
        } catch (error) {
          throw new UmpException({
            errorCode: fromHex('0x0700'),
            message: error.message,
          });
        }
      });
    },
    getVideoProfile: function (channel) {
      var sunapiClient = this._sunapiClient;
      return new Promise(function (resolve, reject) {
        var sunapiURI = '/stw-cgi/' + cgi.MEDIA_CGI;
        sunapiURI += '?msubmenu=' + submenu.VIDEO_PROFILE;
        sunapiURI += '&action=' + action.VIEW;
        if (typeof channel !== 'undefined') {
          log.debug('request channel number: ' + channel);
          sunapiURI += '&Channel=' + channel;
        }
        //var url = device.protocol + "://" + device.serverAddress + sunapiURI;
        var getData = {};
        log.debug('sunapi URI', sunapiURI);
        try {
          sunapiClient.get(
            sunapiURI,
            getData,
            function (response) {
              if (typeof response === 'string') {
                response = JSON.parse(response);
              }
              if (response.data !== undefined) {
                response = response.data;
              }
              if (typeof callback !== 'undefined' && callback != null) {
                callback(response.VideoProfiles);
              } else {
                //setTimeout(function(){ console.log("sleep 1 second"); resolve(response.VideoProfiles);}, 3000);
                resolve(response.VideoProfiles);
              }
            },
            function (errorData) {
              errorData.uri = sunapiURI;
              errorData.place = 'sunapiManager.js:getVideoProfile';
              if (typeof callback !== 'undefined' && callback != null) {
                callback(errorData);
              } else {
                reject(errorData);
              }
            },
            '',
            device.async ? true : false
          );
        } catch (error) {
          throw new UmpException({
            errorCode: fromHex('0x0700'),
            message: error.message,
          });
        }
      });
    },
    getVideoProfilePolicyAll: function () {
      var sunapiClient = this._sunapiClient;
      return new Promise(function (resolve, reject) {
        var sunapiURI = '/stw-cgi/' + cgi.MEDIA_CGI;
        sunapiURI += '?msubmenu=' + submenu.VIDEO_PROFILE_POLICY;
        sunapiURI += '&action=' + action.VIEW;

        var getData = {};
        log.debug('sunapi URI', sunapiURI);
        try {
          sunapiClient.get(
            sunapiURI,
            getData,
            function (response) {
              if (typeof response === 'string') {
                response = JSON.parse(response);
              }
              if (response.data !== undefined) {
                response = response.data;
              }
              if (typeof callback !== 'undefined' && callback != null) {
                callback(response.VideoProfilePolicies);
              } else {
                resolve(response.VideoProfilePolicies);
              }
            },
            function (errorData) {
              errorData.uri = sunapiURI;
              errorData.place = 'sunapiManager.js:getVideoProfilePolicyAll';
              if (typeof callback !== 'undefined' && callback != null) {
                callback(errorData);
              } else {
                //console.log(errorData);
                reject(errorData);
              }
            },
            '',
            device.async ? true : false
          );
        } catch (error) {
          throw new UmpException({
            errorCode: fromHex('0x0700'),
            message: error.message,
          });
        }
      });
    },
    getVideoProfilePolicy: function (channel) {
      var sunapiClient = this._sunapiClient;
      return new Promise(function (resolve, reject) {
        var sunapiURI = '/stw-cgi/' + cgi.MEDIA_CGI;
        sunapiURI += '?msubmenu=' + submenu.VIDEO_PROFILE_POLICY;
        sunapiURI += '&action=' + action.VIEW;
        if (typeof channel !== 'undefined') {
          log.debug('request channel number: ' + channel);
          sunapiURI += '&Channel=' + channel;
        }
        var getData = {};
        log.debug('sunapi URI', sunapiURI);
        try {
          sunapiClient.get(
            sunapiURI,
            getData,
            function (response) {
              if (typeof response === 'string') {
                response = JSON.parse(response);
              }
              if (response.data !== undefined) {
                response = response.data;
              }
              if (typeof callback !== 'undefined' && callback != null) {
                callback(response.VideoProfilePolicies);
              } else {
                resolve(response.VideoProfilePolicies);
              }
            },
            function (errorData) {
              errorData.uri = sunapiURI;
              errorData.place = 'sunapiManager.js:getVideoProfilePolicy';
              if (typeof callback !== 'undefined' && callback != null) {
                callback(errorData);
              } else {
                //console.log(errorData);
                reject(errorData);
              }
            },
            '',
            device.async ? true : false
          );
        } catch (error) {
          throw new UmpException({
            errorCode: fromHex('0x0700'),
            message: error.message,
          });
        }
      });
    },
    getRtspStreamURL: function (channel, profile, mediaType, mode) {
      var sunapiClient = this._sunapiClient;
      return new Promise(function (resolve, reject) {
        log.debug(
          'getRtspURL: channel (' +
          channel +
          '), profile: (' +
          profile +
          ')' +
          '), MediaType: (' +
          mediaType +
          '), mode: (' +
          mode
        );
        var sunapiURI = '/stw-cgi/' + cgi.MEDIA_CGI;
        sunapiURI += '?msubmenu=' + submenu.VIDEO_STREAM_URI;
        sunapiURI += '&action=' + action.VIEW;
        if (typeof channel !== 'undefined') {
          log.debug('request channel number: ' + channel);
          sunapiURI += '&Channel=' + channel;
        }
        if (typeof profile !== 'undefined') {
          log.debug('request profile number: ' + profile);
          sunapiURI += '&Profile=' + profile;
        }
        if (typeof mode !== 'undefined') {
          sunapiURI += '&Mode=' + mode;
        }
        if (typeof mediaType !== 'undefined') {
          sunapiURI += '&MediaType=' + mediaType;
        }
        sunapiURI +=
          '&StreamType=RTPUnicast&TransportProtocol=TCP&RTSPOverHTTP=False&ClientType=PC';

        var getData = {};
        log.debug('sunapi URI', sunapiURI);
        try {
          sunapiClient.get(
            sunapiURI,
            getData,
            function (response) {
              if (typeof response === 'string') {
                response = JSON.parse(response);
              }
              if (response.data !== undefined) {
                response = response.data;
              }
              if (typeof callback !== 'undefined' && callback != null) {
                callback(response);
              } else {
                resolve(response);
              }
            },
            function (errorData) {
              errorData.uri = sunapiURI;
              errorData.place = 'sunapiManager.js:getRtspStreamURL';
              if (typeof callback !== 'undefined' && callback != null) {
                callback(errorData);
              } else {
                //console.log(errorData);
                reject(errorData);
              }
            },
            '',
            device.async ? true : false
          );
        } catch (error) {
          throw new UmpException({
            errorCode: fromHex('0x0700'),
            message: error.message,
          });
        }
      });
    },
    getSessionKey: function () {
      var sunapiClient = this._sunapiClient;
      return new Promise(function (resolve, reject) {
        log.debug('getSessionKey');
        var sunapiURI = '/stw-cgi/' + cgi.MEDIA_CGI;
        sunapiURI += '?msubmenu=' + submenu.VIDEO_SESSION_KEY;
        sunapiURI += '&action=' + action.VIEW;
        var getData = {};
        log.debug('sunapi URI', sunapiURI);
        try {
          sunapiClient.get(
            sunapiURI,
            getData,
            function (response) {
              if (typeof response === 'string') {
                response = JSON.parse(response);
              }
              if (response.data !== undefined) {
                response = response.data;
              }
              SessionKey = response;
              if (typeof callback !== 'undefined' && callback != null) {
                callback(response);
              } else {
                resolve(response);
              }
            },
            function (errorData) {
              errorData.uri = sunapiURI;
              errorData.place = 'sunapiManager.js:getSessionKey';
              if (typeof callback !== 'undefined' && callback != null) {
                callback(errorData);
              } else {
                //console.log(errorData);
                reject(errorData);
              }
            },
            '',
            device.async ? true : false
          );
          sunapiClient.join();
        } catch (error) {
          throw new UmpException({
            errorCode: fromHex('0x0700'),
            message: error.message,
          });
        }
      });
    },
    getStorageInfo: function () {
      var sunapiClient = this._sunapiClient;
      return new Promise(function (resolve, reject) {
        log.debug('getStorageInfo');
        var sunapiURI = '/stw-cgi/' + cgi.SYSTEM_CGI;
        sunapiURI += '?msubmenu=' + submenu.RECORDING_STORAGE_INFO;
        sunapiURI += '&action=' + action.VIEW;
        var getData = {};
        log.debug('sunapi URI', sunapiURI);
        try {
          sunapiClient.get(
            sunapiURI,
            getData,
            function (response) {
              if (typeof response === 'string') {
                response = JSON.parse(response);
              }
              if (response.data !== undefined) {
                response = response.data;
              }
              StorageInfo = response;
              if (typeof callback !== 'undefined' && callback != null) {
                callback(response);
              } else {
                resolve(response);
              }
            },
            function (errorData) {
              errorData.uri = sunapiURI;
              errorData.place = 'sunapiManager.js:getStorageInfo';
              if (typeof callback !== 'undefined' && callback != null) {
                callback(errorData);
              } else {
                //console.log(errorData);
                reject(errorData);
              }
            },
            '',
            device.async ? true : false
          );
          sunapiClient.join();
        } catch (error) {
          console.error(error);
          throw new UmpException({
            errorCode: fromHex('0x0700'),
            message: error.message,
          });
        }
      });
    },
    getRecordingSetup: function () {
      var sunapiClient = this._sunapiClient;
      return new Promise(function (resolve, reject) {
        log.debug('getRecordingSetup');
        var sunapiURI = '/stw-cgi/' + cgi.RECORDING_CGI;
        sunapiURI += '?msubmenu=' + submenu.RECORDING_SETUP;
        sunapiURI += '&action=' + action.VIEW;
        var getData = {};
        log.debug('sunapi URI', sunapiURI);
        try {
          sunapiClient.get(
            sunapiURI,
            getData,
            function (response) {
              if (typeof response === 'string') {
                response = JSON.parse(response);
              }
              if (response.data !== undefined) {
                response = response.data;
              }
              RecordingSetup = response;
              if (typeof callback !== 'undefined' && callback != null) {
                callback(response);
              } else {
                resolve(response);
              }
            },
            function (errorData) {
              let error = new SunapiException({
                errorCode: errorData.Code,
                place: 'sunapiManager.js:getRecordingSetup',
                message: errorData.message,
                uri: sunapiURI,
              });
              if (typeof callback !== 'undefined' && callback != null) {
                callback(error);
              } else {
                reject(error);
              }
            },
            '',
            device.async ? true : false
          );
          sunapiClient.join();
        } catch (error) {
          throw new UmpException({
            errorCode: fromHex('0x0700'),
            message: error.message,
          });
        }
      });
    },
    getSearchRecordingPeriod: function () {
      var sunapiClient = this._sunapiClient;
      return new Promise(function (resolve, reject) {
        log.debug('getSearchRecordingPeriod');
        var sunapiURI = '/stw-cgi/' + cgi.RECORDING_CGI;
        sunapiURI += '?msubmenu=' + submenu.RECORDING_SEARCH_PERIOD;
        sunapiURI += '&action=' + action.VIEW;
        var getData = {};
        log.debug('sunapi URI', sunapiURI);
        try {
          sunapiClient.get(
            sunapiURI,
            getData,
            function (response) {
              if (typeof response === 'string') {
                response = JSON.parse(response);
              }
              if (response.data !== undefined) {
                response = response.data;
              }
              SearchRecordingPeriod = response;
              if (typeof callback !== 'undefined' && callback != null) {
                callback(response);
              } else {
                resolve(response);
              }
            },
            function (errorData) {
              let error = new SunapiException({
                errorCode: errorData.Code,
                place: 'sunapiManager.js:getSearchRecordingPeriod',
                message: errorData.message,
                uri: sunapiURI,
              });
              if (typeof callback !== 'undefined' && callback != null) {
                callback(error);
              } else {
                reject(error);
              }
            },
            '',
            device.async ? true : false
          );
          sunapiClient.join();
        } catch (error) {
          throw new UmpException({
            errorCode: fromHex('0x0700'),
            message: error.message,
          });
        }
      });
    },
    getCalendarSearch: function (month, channelIdList) {
      var sunapiClient = this._sunapiClient;
      return new Promise(function (resolve, reject) {
        log.debug('getCalendarSearch');
        var sunapiURI = '/stw-cgi/' + cgi.RECORDING_CGI;
        sunapiURI += '?msubmenu=' + submenu.RECORDING_CALENDAR_SEARCH;
        sunapiURI += '&action=' + action.VIEW;
        if (typeof month !== 'undefined') {
          // if(device.deviceType === 'camera') {
          var strArray = month.split('-');
          month = strArray[0] + '-' + strArray[1];
          // }
          log.debug('request month: ' + month);
          sunapiURI += '&Month=' + month;
        }
        if (typeof channelIdList !== 'undefined') {
          log.debug('request ChannelIdList number: ' + channelIdList);
          sunapiURI += '&' + params.CHANNEL_ID_LIST + '=' + channelIdList;
        } else {
          sunapiClient.setTimeout(LONG_POLLING_TIMEOUT);
        }
        var getData = {};
        log.debug('sunapi URI', sunapiURI);
        try {
          sunapiClient.get(
            sunapiURI,
            getData,
            function (response) {
              if (typeof response === 'string') {
                response = JSON.parse(response);
              }
              if (response.data !== undefined) {
                response = response.data;
              }
              if (typeof callback !== 'undefined' && callback != null) {
                callback(response);
              } else {
                resolve(response);
              }
            },
            function (errorData) {
              let error = new SunapiException({
                errorCode: errorData.Code,
                place: 'sunapiManager.js:getCalendarSearch',
                message: errorData.message,
                uri: sunapiURI,
              });
              if (typeof callback !== 'undefined' && callback != null) {
                callback(error);
              } else {
                reject(error);
              }
            },
            '',
            device.async ? true : false
          );
          // sunapiClient.join();
        } catch (error) {
          throw new UmpException({
            errorCode: fromHex('0x0700'),
            message: error.message,
          });
        }
      });
    },
    getOverlappedIdList: function (fromDate, toDate, channelIdList) {
      var sunapiClient = this._sunapiClient;
      return new Promise(function (resolve, reject) {
        log.debug('getOverlappedIdList');
        var sunapiURI = '/stw-cgi/' + cgi.RECORDING_CGI;
        sunapiURI += '?msubmenu=' + submenu.RECORDING_OVERLAPPED;
        sunapiURI += '&action=' + action.VIEW;
        if (typeof fromDate !== 'undefined' && typeof toDate !== 'undefined') {
          log.debug('From Date: ' + fromDate + ', ToDate' + toDate);
          sunapiURI += '&FromDate=' + fromDate;
          sunapiURI += '&ToDate=' + toDate;
        } else {
          throw new SunapiException(
            'Invalid Parameter. This request do not execute.'
          );
        }
        if (typeof channelIdList !== 'undefined') {
          log.debug('request ChannelIdList number: ' + channelIdList);
          sunapiURI += '&' + params.CHANNEL_ID_LIST + '=' + channelIdList;
        }
        var getData = {};
        log.debug('sunapi URI', sunapiURI);
        try {
          sunapiClient.get(
            sunapiURI,
            getData,
            function (response) {
              if (typeof response === 'string') {
                response = JSON.parse(response);
              }
              if (response.data !== undefined) {
                response = response.data;
              }
              if (typeof callback !== 'undefined' && callback != null) {
                callback(response);
              } else {
                resolve(response);
              }
            },
            function (errorData) {
              let error = new SunapiException({
                errorCode: errorData.Code,
                place: 'sunapiManager.js:getOverlappedIdList',
                message: errorData.message,
                uri: sunapiURI,
              });
              if (typeof callback !== 'undefined' && callback != null) {
                callback(error);
              } else {
                reject(error);
              }
            },
            '',
            device.async ? true : false
          );
          // sunapiClient.join();
        } catch (error) {
          throw new UmpException({
            errorCode: fromHex('0x0700'),
            message: error.message,
          });
        }
      });
    },
    getTimeline: function (
      fromDate,
      toDate,
      channelIdList,
      overlappedId,
      type
    ) {
      var sunapiClient = this._sunapiClient;
      return new Promise(function (resolve, reject) {
        log.debug('getTimeline');
        var sunapiURI = '/stw-cgi/' + cgi.RECORDING_CGI;
        sunapiURI += '?msubmenu=' + submenu.RECORDING_TIMELINE;
        sunapiURI += '&action=' + action.VIEW;

        if (device.deviceType === 'camera') {
          fromDate = fromDate.replace(/T/gi, ' ').replace(/Z/g, '');
          toDate = toDate.replace(/T/gi, ' ').replace(/Z/g, '');
        }

        if (fromDate !== undefined) {
          log.debug('From Date: ' + fromDate);
          sunapiURI += '&FromDate=' + fromDate;
        } else {
          throw new SunapiException(
            'Invalid Parameter. This request do not execute.'
          );
        }
        if (toDate !== undefined) {
          log.debug('ToDate' + toDate);
          sunapiURI += '&ToDate=' + toDate;
        } else {
          throw new SunapiException(
            'Invalid Parameter. This request do not execute.'
          );
        }

        if (channelIdList !== undefined) {
          log.debug('request ChannelIdList number: ' + channelIdList);
          sunapiURI += '&' + params.CHANNEL_ID_LIST + '=' + channelIdList;
        }

        if (typeof overlappedId !== 'undefined') {
          log.debug('request overlappedId number: ' + overlappedId);
          sunapiURI += '&' + params.OVERLAPPED_ID + '=' + overlappedId;
        }

        if (typeof type !== 'undefined') {
          sunapiURI += '&Type=' + type;
        } else {
          sunapiURI += '&Type=All';
        }
        var getData = {};
        log.debug('sunapi URI', sunapiURI);
        try {
          sunapiClient.get(
            sunapiURI,
            getData,
            function (response) {
              if (typeof response === 'string') {
                response = JSON.parse(response);
              }
              if (response.data !== undefined) {
                response = response.data;
              }
              if (typeof callback !== 'undefined' && callback != null) {
                callback(response);
              } else {
                resolve(response);
              }
            },
            function (errorData) {
              errorData.uri = sunapiURI;
              errorData.place = 'sunapiManager.js:getTimeline';
              if (typeof callback !== 'undefined' && callback != null) {
                callback(errorData);
              } else {
                reject(errorData);
              }
            },
            '',
            device.async ? true : false
          );
          // sunapiClient.join();
        } catch (error) {
          //throw new SunapiException("getTimeline error occured");
          throw new UmpException({
            errorCode: fromHex('0x0700'),
            message: error.message,
          });
        }
      });
    },
    getAITimeline: function (
      fromDate,
      toDate,
      channelIdList,
      overlappedId,
      type
    ) {
      var sunapiClient = this._sunapiClient;
      return new Promise(function (resolve, reject) {
        log.debug('getTimeline');
        var sunapiURI = '/stw-cgi/' + cgi.AI_CGI;
        sunapiURI += '?msubmenu=' + submenu.RECORDING_AI_TIMELINE;
        sunapiURI += '&action=' + action.VIEW;

        if (device.deviceType === 'camera') {
          fromDate = fromDate.replace(/T/gi, ' ').replace(/Z/g, '');
          toDate = toDate.replace(/T/gi, ' ').replace(/Z/g, '');
        }

        if (fromDate !== undefined) {
          log.debug('From Date: ' + fromDate);
          sunapiURI += '&FromDate=' + fromDate;
        } else {
          throw new SunapiException(
            'Invalid Parameter. This request do not execute.'
          );
        }
        if (toDate !== undefined) {
          log.debug('ToDate' + toDate);
          sunapiURI += '&ToDate=' + toDate;
        } else {
          throw new SunapiException(
            'Invalid Parameter. This request do not execute.'
          );
        }

        if (channelIdList !== undefined) {
          log.debug('request ChannelIdList number: ' + channelIdList);
          sunapiURI += '&' + params.CHANNEL_ID_LIST + '=' + channelIdList;
        }

        if (typeof overlappedId !== 'undefined') {
          log.debug('request overlappedId number: ' + overlappedId);
          sunapiURI += '&' + params.OVERLAPPED_ID + '=' + overlappedId;
        }

        if (typeof type !== 'undefined') {
          sunapiURI += '&ClassType=' + type;
        } else {
          sunapiURI += '&ClassType=Person';
        }
        var getData = {};
        log.debug('sunapi URI', sunapiURI);
        try {
          sunapiClient.get(
            sunapiURI,
            getData,
            function (response) {
              if (typeof response === 'string') {
                response = JSON.parse(response);
              }
              if (response.data !== undefined) {
                response = response.data;
              }
              if (typeof callback !== 'undefined' && callback != null) {
                callback(response);
              } else {
                resolve(response);
              }
            },
            function (errorData) {
              errorData.uri = sunapiURI;
              errorData.place = 'sunapiManager.js:getTimeline';
              if (typeof callback !== 'undefined' && callback != null) {
                callback(errorData);
              } else {
                reject(errorData);
              }
            },
            '',
            device.async ? true : false
          );
          sunapiClient.join();
        } catch (error) {
          //throw new SunapiException("getTimeline error occured");
          throw new UmpException({
            errorCode: fromHex('0x0700'),
            message: error.message,
          });
        }
      });
    },
  };

  /**
   * This property is to set the received callback of transport.
   * @property recvCallback
   * @memberof RtspClient
   * @example
   *     RtspClient.recvCallback = calllback;
   */
  Object.defineProperty(Constructor.prototype, 'sunapi', {
    get: function () {
      return this._sunapiClient;
    },
    set: function (v) {
      this._sunapiClient = v;
    },
  });

  return new Constructor();
};
