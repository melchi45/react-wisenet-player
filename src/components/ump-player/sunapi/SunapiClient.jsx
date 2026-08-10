// import { CryptoJS } from 'crypto-js';
import MD5 from 'crypto-js/md5';
import { HTTP_STATUS_CODES } from './HttpStatusCode';

import { UmpException } from '../Exception/UmpException';
import { AuthException } from '../Exception/AuthException';

import { RestClientConfig } from './RestClientConfig';

const fromHex = window.fromHex;
const fastJsonStringfy = window.fastJsonStringfy;

export const SunapiClient = function (device_info) {
  'use strict';
  var _version = '0.0.1';
  // var sunapi_client_log = window.log.getLogger('sunapiclient');
  var sunapi_client_log = window.log.getLogger();

  var wwwAuthenticate = null;
  var authInfo = null;
  var SunapiClient = {};
  var loggingOn = false;
  var authCount = 0;
  var debug = false;

  var AuthTypeEnum = {
    None: 0,
    Basic: 1,
    Digest: 2,
    OAuth: 3,
  };

  var Timeout = {
    Default: 1000,
    Long: 15000,
    Short: 3000,
  };

  var RESTCLIENT_CONFIG = RestClientConfig;

  function Constructor(device_info) {
    var loc_protocol, splitProt;
    if (typeof device_info.debug !== 'undefined') {
      loggingOn = device_info.debug;
    }

    // if host name is exist and camera ip is not exist, set to camera ip
    if (
      typeof device_info.hostname !== 'undefined' &&
      device_info.hostname !== '' &&
      device_info.hostname !== null &&
      (typeof device_info.cameraIp === 'undefined' ||
        device_info.cameraIp === null ||
        device_info.cameraIp === '')
    ) {
      device_info.cameraIp = device_info.hostname;
    }

    // if username is exist on input parameter, we will use username instead user
    if (
      RESTCLIENT_CONFIG &&
      typeof device_info.username !== 'undefined' &&
      device_info.username !== null &&
      device_info.username !== '' &&
      (typeof device_info.user === 'undefined' ||
        device_info.user === null ||
        device_info.user === '')
    ) {
      device_info.user = device_info.username;
      RESTCLIENT_CONFIG.digest.username = device_info.username;
      RESTCLIENT_CONFIG.basic.username = device_info.username;
    }

    // check input parameter
    if (
      RESTCLIENT_CONFIG.serverType === 'camera' &&
      (device_info.cameraIp === undefined ||
        device_info.cameraIp === '' ||
        device_info.cameraIp === null)
    ) {
      // if cameraIp is empty, throw invalid parameter
      throw new UmpException({
        errorCode: window.fromHex('0x0400'),
        place: 'SunapiClient.js:60',
        message: 'cameraIP is empty from input parameter.',
      });
    } else if (
      RESTCLIENT_CONFIG.serverType === undefined ||
      RESTCLIENT_CONFIG.serverType === null
    ) {
      throw new UmpException({
        errorCode: window.fromHex('0x0404'),
        place: 'SunapiClient.js:67',
        message: 'device type is undefined.',
      });
    }

    if (
      RESTCLIENT_CONFIG.serverType === 'camera' &&
      (device_info.user === undefined ||
        device_info.user === '' ||
        device_info.user === null)
    ) {
      // if cameraIp is empty, throw invalid parameter
      throw new UmpException({
        errorCode: window.fromHex('0x0402'),
        place: 'SunapiClient.js:78',
        message: 'user id is empty from input parameter.',
      });
    }

    if (typeof device_info.authType !== 'undefined') {
      RESTCLIENT_CONFIG.authType = device_info.authType;
    }
    RESTCLIENT_CONFIG.proxy = device_info.proxy === true ? true : false;
    RESTCLIENT_CONFIG.serverType =
      typeof device_info.serverType !== 'undefined' &&
        device_info.serverType !== null &&
        device_info.serverType === 'grunt'
        ? 'grunt'
        : 'camera';

    if (RESTCLIENT_CONFIG.serverType === 'grunt') {
      if (RESTCLIENT_CONFIG.proxy) {
        RESTCLIENT_CONFIG.digest.hostname = window.location.hostname;
        RESTCLIENT_CONFIG.digest.port = window.location.port;
      } else {
        RESTCLIENT_CONFIG.digest.hostname = device_info.hostname;
        RESTCLIENT_CONFIG.digest.port = device_info.port;
      }
      RESTCLIENT_CONFIG.digest.protocol = device_info.protocol;
    } else {
      RESTCLIENT_CONFIG.digest.hostname = window.location.hostname;
      RESTCLIENT_CONFIG.digest.port = window.location.port;
      RESTCLIENT_CONFIG.digest.protocol = window.location.protocol;
    }

    if (
      typeof device_info.user !== 'undefined' &&
      device_info.user !== null &&
      device_info.user !== ''
    ) {
      RESTCLIENT_CONFIG.digest.username = device_info.user;
      RESTCLIENT_CONFIG.basic.username = device_info.user;
      RESTCLIENT_CONFIG.oauth.username = device_info.user;
    } else {
      throw new AuthException({
        errorCode: fromHex('0x0402'),
        place: 'SunapiClient.js:Constructor',
        message: 'user id is empty from input parameter.',
      });
    }

    if (
      typeof device_info.password !== 'undefined' &&
      device_info.password !== null &&
      device_info.password !== ''
    ) {
      RESTCLIENT_CONFIG.basic.password = device_info.password;
      RESTCLIENT_CONFIG.digest.password = device_info.password;
    } else {
      throw new AuthException({
        errorCode: fromHex('0x0403'),
        place: 'SunapiClient.js:Constructor',
        message: 'password is empty from input parameter.',
      });
    }

    RESTCLIENT_CONFIG.digest.ClientIPAddress = device_info.ClientIPAddress;
    if (typeof device_info.cors !== 'undefined') {
      RESTCLIENT_CONFIG.cors = device_info.cors;
    }
  }

  var log = function (str) {
    if (loggingOn) {
      sunapi_client_log.info(
        '%c%s%s',
        'background:gray; color: white; font-weight: bold;',
        '[Sunapi Client]',
        str
      );
      console.log('[SunapiClient] ' + str);
    }
  };

  SunapiClient.post = function (
    uri,
    jsonData,
    SuccessFn,
    FailFn,
    $scope,
    fileData,
    specialHeaders
  ) {
    if (typeof jsonData !== 'undefined') {
      uri += jsonToText(jsonData);
    }

    return ajax_async(
      'POST',
      uri,
      SuccessFn,
      FailFn,
      $scope,
      fileData,
      specialHeaders
    );
  };

  SunapiClient.get = function (
    uri,
    jsonData,
    SuccessFn,
    FailFn,
    $scope,
    isAsyncCall,
    isText,
    withoutSeqId
  ) {
    uri = encodeURI(uri);
    if (typeof jsonData !== 'undefined') {
      uri += jsonToText(jsonData);

      if (
        uri.indexOf('attributes.cgi') == -1 &&
        uri.indexOf('.cgi') != -1 &&
        (typeof withoutSeqId === 'undefined' ||
          withoutSeqId === null ||
          withoutSeqId === false)
      ) {
        var sequencenum = new Date().getTime();
        uri += '&SunapiSeqId=' + sequencenum;
      }
    }

    if (uri.indexOf('configbackup') !== -1 || isAsyncCall === true) {
      return ajax_async('GET', uri, SuccessFn, FailFn, $scope, '', '', isText);
    } else {
      return ajax_sync('GET', uri, SuccessFn, FailFn, isText);
    }
  };

  SunapiClient.mobile = function (
    uri,
    device,
    SuccessFn,
    FailFn,
    optionalData
  ) {
    var protocol = 'http',
      reqURL = '',
      xhr = new XMLHttpRequest(),
      auth = false,
      isTimeout = false;

    if (typeof optionalData !== 'undefined') {
      if (typeof optionalData.protocol !== 'undefined') {
        protocol = optionalData.protocol;
      }

      if (typeof optionalData.updateDate !== 'undefined') {
        uri += jsonToText(optionalData.updateDate);
      }
      if (typeof optionalData.auth !== 'undefined') {
        auth = true;
      }
    }

    reqURL =
      protocol +
      '://' +
      device.rtsp_url +
      ':' +
      device.rtsp_tunneling_port +
      uri;
    RESTCLIENT_CONFIG.digest.username = device.rtsp_id;
    RESTCLIENT_CONFIG.digest.password = device.rtsp_pwd;
    var OnErrorEvent = function (evt) {
      FailFn({
        Code: -2,
        message: 'Network Error',
      });
    };

    // Mobile safari ( for iOS )
    if (
      Object.prototype.toString
        .call(window.HTMLElement)
        .indexOf('Constructor') > 0
    ) {
      xhr.onload = xhr.onabort = function () {
        if (this.status === 401) {
          var wwwAuthenticate = this.getResponseHeader('WWW-Authenticate');
          var xhr = new XMLHttpRequest();

          xhr.onload = xhr.onabort = function () {
            isTimeout = false;
            if (this.status === 200) {
              if (
                typeof this.response !== 'undefined' &&
                this.response !== ''
              ) {
                var result = {};

                if (
                  this.responseType === 'arraybuffer' ||
                  this.responseXML !== null
                ) {
                  result.data = this.response;
                  SuccessFn(result);
                } else {
                  var resp = JSON.parse(this.response);

                  if (typeof resp === 'object') {
                    result.data = resp;
                    if (result.data.Response === 'Fail') {
                      FailFn({
                        Code: xhr.status,
                        message: result.data.Error.Details,
                      });
                    } else {
                      SuccessFn(result);
                    }
                  } else {
                    result.data = this.response;
                    SuccessFn(result);
                  }
                }
              } else {
                FailFn({
                  Code: -1,
                  message: 'No response',
                });
              }
            } else {
              FailFn({
                Code: xhr.status,
                message: HTTP_STATUS_CODES[xhr.status],
              });
            }
          };

          xhr.onerror = function () {
            FailFn({
              Code: xhr.status,
              message: HTTP_STATUS_CODES[xhr.status],
            });
          };
          xhr.ontimeout = function () {
            FailFn({
              Code: 408,
              message: HTTP_STATUS_CODES[408],
            });
          };

          if (auth) {
            xhr.open(
              'GET',
              reqURL,
              false,
              RESTCLIENT_CONFIG.digest.username,
              RESTCLIENT_CONFIG.digest.password
            );
          } else {
            xhr.open(
              'GET',
              reqURL,
              true,
              RESTCLIENT_CONFIG.digest.username,
              RESTCLIENT_CONFIG.digest.password
            );
            xhr.timeout = 10000;
          }

          xhr.setRequestHeader('Accept', 'application/json');
          xhr.setRequestHeader('Cache-Control', 'no-cache');
          xhr.send();
        } else {
          isTimeout = false;
          if (this.status === 200) {
            if (typeof this.response !== 'undefined' && this.response !== '') {
              var result = {};

              if (
                this.responseType === 'arraybuffer' ||
                this.responseXML !== null
              ) {
                result.data = this.response;
                SuccessFn(result);
              } else {
                var resp = JSON.parse(this.response);
                if (typeof resp === 'object') {
                  result.data = resp;
                  if (result.data.Response === 'Fail') {
                    FailFn({
                      Code: xhr.status,
                      message: result.data.Error.Details,
                    });
                  } else {
                    SuccessFn(result);
                  }
                } else {
                  result.data = this.response;
                  SuccessFn(result);
                }
              }
            } else {
              FailFn({
                Code: -1,
                message: 'No response',
              });
            }
          }
        }
      };
      xhr.onerror = function () {
        FailFn({
          Code: xhr.status,
          message: HTTP_STATUS_CODES[xhr.status],
        });
      };
      xhr.ontimeout = function () {
        FailFn({
          Code: 408,
          message: HTTP_STATUS_CODES[408],
        });
      };
      // Mobile Chrome
    } else {
      isTimeout = false;
      xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
          if (this.status === 401) {
            var wwwAuthenticate = this.getResponseHeader('WWW-Authenticate');
            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function () {
              if (this.readyState === 4) {
                if (this.status === 200) {
                  if (
                    typeof this.response !== 'undefined' &&
                    this.response !== ''
                  ) {
                    var result = {};
                    if (
                      this.responseType === 'arraybuffer' ||
                      this.responseXML !== null
                    ) {
                      result.data = this.response;
                      SuccessFn(result);
                    } else {
                      var resp = JSON.parse(this.response);

                      if (typeof resp === 'object') {
                        result.data = resp;
                        if (result.data.Response === 'Fail') {
                          FailFn(result.data.Error.Details);
                        } else {
                          SuccessFn(result);
                        }
                      } else {
                        result.data = this.response;
                        SuccessFn(result);
                      }
                    }
                  } else {
                    FailFn({
                      Code: -1,
                      message: 'No response',
                    });
                  }
                } else {
                  FailFn({
                    Code: xhr.status,
                    message: HTTP_STATUS_CODES[xhr.status],
                  });
                }
              }
            };

            // if(auth) {
            //   xhr.open('GET', reqURL, false, RESTCLIENT_CONFIG.digest.username, RESTCLIENT_CONFIG.digest.password);
            // } else {
            xhr.open(
              'GET',
              reqURL,
              true,
              RESTCLIENT_CONFIG.digest.username,
              RESTCLIENT_CONFIG.digest.password
            );
            xhr.timeout = 5000;
            // }

            xhr.setRequestHeader('Accept', 'application/json');
            xhr.ontimeout = function () {
              FailFn({
                Code: 408,
                message: HTTP_STATUS_CODES[408],
              });
            };
            xhr.send();
          } else {
            if (this.status === 200) {
              if (
                typeof this.response !== 'undefined' &&
                this.response !== ''
              ) {
                var result = {};

                if (
                  this.responseType === 'arraybuffer' ||
                  this.responseXML !== null
                ) {
                  result.data = this.response;
                  SuccessFn(result);
                } else {
                  var resp = JSON.parse(this.response);

                  if (typeof resp === 'object') {
                    result.data = resp;
                    if (result.data.Response === 'Fail') {
                      FailFn({
                        Code: xhr.status,
                        message: result.data.Error.Details,
                      });
                    } else {
                      SuccessFn(result);
                    }
                  } else {
                    result.data = this.response;
                    SuccessFn(result);
                  }
                }
              } else {
                FailFn({
                  Code: -1,
                  message: 'No response',
                });
              }
            }
          }
        }
      };
    }

    // if(auth) {
    //   xhr.open('GET', reqURL, false, RESTCLIENT_CONFIG.digest.username, RESTCLIENT_CONFIG.digest.password);
    // } else {
    xhr.open(
      'GET',
      reqURL,
      true,
      RESTCLIENT_CONFIG.digest.username,
      RESTCLIENT_CONFIG.digest.password
    );
    xhr.timeout = 5000;
    // }
    xhr.ontimeout = function () {
      FailFn({
        Code: 408,
        message: HTTP_STATUS_CODES[408],
      });
    };
    xhr.onerror = function () {
      FailFn({
        Code: xhr.status,
        message: HTTP_STATUS_CODES[xhr.status],
      });
    };
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Cache-Control', 'no-cache');
    log(reqURL);

    if (
      Object.prototype.toString
        .call(window.HTMLElement)
        .indexOf('Constructor') > 0
    ) {
      var process = $timeout(function () {
        isTimeout = true;
        xhr.send();
      }, 500);

      if (auth) {
        $timeout(function () {
          if (isTimeout) {
            $timeout.cancel(process);
            FailFn({
              Code: 408,
              message: HTTP_STATUS_CODES[408],
            });
          }
        }, 10000);
      }
    } else {
      xhr.send();
    }
  };

  function setDigestHeader(xhr, method, uri, digestCache) {
    var responseValue, digestAuthHeader;
    if (digestCache) {
      // by neighbor21 duks  조건으로 구분 - digestCache 없는 경우가 있음.. 없는경우 로직 추가
      if (digestCache.scheme.toLowerCase() === 'digest') {
        digestCache.nc = digestCache.nc + 1;
        digestCache.cnonce = generateCnonce();

        responseValue = formulateResponse(
          RESTCLIENT_CONFIG.digest.username,
          RESTCLIENT_CONFIG.digest.password,
          uri,
          digestCache.realm,
          method.toUpperCase(),
          digestCache.nonce,
          digestCache.nc,
          digestCache.cnonce,
          digestCache.qop
        );

        digestAuthHeader =
          digestCache.scheme +
          ' ' +
          'username="' +
          RESTCLIENT_CONFIG.digest.username +
          '", ' +
          'realm="' +
          digestCache.realm +
          '", ' +
          'nonce="' +
          digestCache.nonce +
          '", ' +
          'uri="' +
          uri +
          '", ' +
          'cnonce="' +
          digestCache.cnonce +
          '" ' +
          'nc=' +
          decimalToHex(digestCache.nc, 8) +
          ', ' +
          'qop=' +
          digestCache.qop +
          ', ' +
          'response="' +
          responseValue +
          '"';

        xhr.setRequestHeader('Authorization', digestAuthHeader);
      } else if (digestCache.scheme.toLowerCase() === 'xdigest') {
        digestCache.nc = digestCache.nc + 1;
        digestCache.cnonce = generateCnonce();

        responseValue = formulateResponse(
          RESTCLIENT_CONFIG.digest.username,
          RESTCLIENT_CONFIG.digest.password,
          uri,
          digestCache.realm,
          method.toUpperCase(),
          digestCache.nonce,
          digestCache.nc,
          digestCache.cnonce,
          digestCache.qop
        );

        digestAuthHeader =
          digestCache.scheme +
          ' ' +
          'username="' +
          RESTCLIENT_CONFIG.digest.username +
          '", ' +
          'realm="' +
          digestCache.realm +
          '", ' +
          'nonce="' +
          digestCache.nonce +
          '", ' +
          'uri="' +
          uri +
          '", ' +
          'cnonce="' +
          digestCache.cnonce +
          '" ' +
          'nc=' +
          decimalToHex(digestCache.nc, 8) +
          ', ' +
          'qop=' +
          digestCache.qop +
          ', ' +
          'response="' +
          responseValue +
          '"';

        xhr.setRequestHeader('Authorization', digestAuthHeader);
      } else if (digestCache.scheme.toLowerCase() === 'basic') {
        digestAuthHeader =
          digestCache.scheme +
          ' ' +
          btoa(
            RESTCLIENT_CONFIG.digest.username +
            ':' +
            RESTCLIENT_CONFIG.digest.password
          );

        xhr.setRequestHeader('Authorization', digestAuthHeader);
      }
    } else {
      /// by neighbor21 duks DigestCache 정보 없는 경우 임의로 할당
      digestCache = {
        scheme: 'Digest',
        realm: '',
        nonce: null,
        opaque: null,
        qop: 'auth',
        nc: null,
        cnonce: null,
      };
      responseValue = formulateResponse(
        RESTCLIENT_CONFIG.digest.username,
        RESTCLIENT_CONFIG.digest.password,
        uri,
        digestCache.realm,
        method.toUpperCase(),
        digestCache.nonce,
        digestCache.nc,
        digestCache.cnonce,
        digestCache.qop
      );
      digestAuthHeader =
        digestCache.scheme +
        ' ' +
        'username="' +
        RESTCLIENT_CONFIG.digest.username +
        '", ' +
        'realm="' +
        digestCache.realm +
        '", ' +
        'nonce="' +
        digestCache.nonce +
        '", ' +
        'uri="' +
        uri +
        '", ' +
        'cnonce="' +
        digestCache.cnonce +
        '" ' +
        'nc=' +
        decimalToHex(digestCache.nc, 8) +
        ', ' +
        'qop=' +
        digestCache.qop +
        ', ' +
        'response="' +
        responseValue +
        '"';
      xhr.setRequestHeader('Authorization', digestAuthHeader);
    }

    return xhr;
  }

  function isJSON(str) {
    try {
      return JSON.parse(str) && !!str;
    } catch (e) {
      return false;
    }
  }

  /// by neighbor21 duks 응답 데이터가 카메라와 NVR과 달라 파싱하는 함수를 추가함  -- '=' 로 Value 구분 'aaa.bbb.ccc=vlaue'
  function getDotEqualStrLineToObj(data) {
    var res = {};
    var tmRes = {};
    var strRes = data.split('\r\n');
    var getOrInit = function (obj, key) {
      return obj[key] ? obj[key] : (obj[key] = {});
    };
    for (var i = 0; i < strRes.length; i++) {
      if (!strRes[i]) continue;
      var strKeyArr = strRes[i].split('=');
      var strDotArr = strKeyArr[0].split('.');
      if (strDotArr.length == 1) {
        res[strDotArr[0]] = strKeyArr[1];
      } else {
        tmRes = getOrInit(res, strDotArr[0]);
        for (var j = 1; j < strDotArr.length - 1; j++) {
          tmRes = getOrInit(tmRes, strDotArr[j]);
        }
        tmRes[strDotArr[strDotArr.length - 1]] = strKeyArr[1];
      }
    }
    log('result : ' + fastJsonStringfy(res));
    return res;
  }

  function handleAccountBlock(failFn, xhr) {
    // ModalManagerService.open('message', {
    //     'buttonCount': 0,
    //     'message': "Exceeded maximum login attempts, please try after some time"
    // });
    // $location.path('/login');
    // if (SessionOfUserManager.IsLoginSuccess() === false) {
    failFn({
      Code: xhr.status,
      message: HTTP_STATUS_CODES[xhr.status],
    });
    log('After calling Account block fail fn' + xhr.status);
    // }
  }

  function setupAsyncCall(xhr, method, callbackList, uri, failFn) {
    var OnErrorEvent = function (evt) {
      failFn({
        Code: -2,
        message: 'Network Error',
      });
    };

    if (typeof callbackList !== 'undefined' && callbackList !== '') {
      if (typeof callbackList.ProgressEvent !== 'undefined') {
        xhr.upload.addEventListener(
          'progress',
          callbackList.ProgressEvent,
          false
        );
      }

      if (typeof callbackList.CompleteEvent !== 'undefined') {
        xhr.addEventListener('load', callbackList.CompleteEvent, false);
      }

      if (typeof callbackList.CancelEvent !== 'undefined') {
        xhr.addEventListener('abort', callbackList.CancelEvent, false);
      }

      if (typeof callbackList.FailEvent !== 'undefined') {
        xhr.addEventListener('error', callbackList.FailEvent, false);
      } else {
        xhr.addEventListener('error', OnErrorEvent, false);
      }
    }

    if (method === 'POST') {
      xhr.timeout = 300000;
    } else {
      xhr.timeout = 5000;
    }

    if (uri.indexOf('snapshot') !== -1) {
      xhr.responseType = 'blob';
    }

    if (uri.indexOf('configbackup') !== -1) {
      xhr.responseType = 'arraybuffer';
    }

    if (uri.indexOf('opensdk') !== -1) {
      xhr.withCredentials = true;
    }

    return xhr;
  }

  function makeNewRequest(
    method,
    uri,
    isAsync,
    inputAuthenticate,
    isText,
    xhr
  ) {
    var restClientConfig = RESTCLIENT_CONFIG.digest;
    var server = restClientConfig.protocol + '://' + restClientConfig.hostname;

    if (
      typeof restClientConfig.port !== 'undefined' &&
      restClientConfig.port !== null &&
      restClientConfig.port !== ''
    ) {
      server += ':' + restClientConfig.port;
    }

    if (typeof xhr === 'undefined' || xhr === null) {
      xhr = new XMLHttpRequest();
    }
    // xhr.open(method, server + uri, isAsync);
    xhr.open(method, server + uri, true);

    //if(SessionOfUserManager.IsWMFApp() === true  && RESTCLIENT_CONFIG.serverType === 'camera' &&
    //   (checkStaleResponseIssue(uri) === false))
    if (RESTCLIENT_CONFIG.serverType === 'camera' && RESTCLIENT_CONFIG.cors) {
      //Added for same origin request, now using custom digest to avoid browser hang and popups
      xhr.setRequestHeader('XClient', 'XMLHttpRequest');
    }

    if (!isText) {
      xhr.setRequestHeader('Accept', 'application/json');
    }

    // xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST');

    // xhr.setRequestHeader('Access-Control-Request-Method', '*');
    // xhr.setRequestHeader('Access-Control-Request-Headers', '*');

    // if(xhr.status == 0) {
    //     xhr.setRequestHeader("Connection", "Keep-alive");
    // }
    // xhr.setRequestHeader("Connection", "");
    // xhr.setRequestHeader("Connection", "close");

    if (wwwAuthenticate !== inputAuthenticate) {
      console.warn(
        'change www-authenticate info current=' +
        wwwAuthenticate +
        ', input=' +
        inputAuthenticate
      );
    }

    /** If there is a new Challenge from server, update the local digest cache  */
    if (wwwAuthenticate !== inputAuthenticate) {
      // var responseHeaders = wwwAuthenticate.split('\n');

      // // get authenticate header
      // var digestHeaders;
      // for(var i = 0; i < responseHeaders.length; i++) {
      //     if (responseHeaders[i].match(/www-authenticate/i) != null) {
      //         digestHeaders = responseHeaders[i];
      //     }
      // }

      authInfo = getAuthInfoInWwwAuthenticate(inputAuthenticate);
      wwwAuthenticate = inputAuthenticate;
    }

    if (
      typeof authInfo !== 'undefined' &&
      authInfo !== null &&
      authInfo.scheme === 'Digest'
    ) {
      xhr = setDigestHeader(xhr, method, uri, authInfo);
    }
    // else
    // {
    /** Sometime the digest issued by the server becomes invalid,
        we need to request new digest from server again */
    // if (typeof digestInfo !== 'undefined' && digestInfo !== 'undefined')
    // {
    // setDigestHeader(xhr, method, uri, digestInfo);
    // } else { // by neighbor21  duks
    // setDigestHeader(xhr, method, uri);
    // }
    // }
    return xhr;
  }

  /**
   * When ever server return STALE parameter in digest header, browser shows popup before control coming to
   * XHR callback, Inorder to avaoid it we will remove digest cache in scenarios in which STALE response can happen
   * just a temporary workaround
   */

  function checkStaleResponseIssue(url) {
    var retVal = false;

    /** As of not it happens only after SSL certificate install and delete */
    if (url.indexOf('ssl') !== -1) {
      if (url.indexOf('install') !== -1 || url.indexOf('remove') !== -1) {
        retVal = true;
      }
    }
    return retVal;
  }

  SunapiClient.clearDigestCache = function () {
    log('Clearing the Diegest cache !!!!!!!!!!!! ');
    authInfo = undefined;
  };

  var _send = function (
    method,
    uri,
    successFn,
    failFn,
    isAsyncCall,
    $scope,
    fileData,
    specialHeaders,
    isText
  ) {
    return new Promise(function (resolve, reject) {
      var xhr = makeNewRequest(
        method,
        uri,
        isAsyncCall,
        wwwAuthenticate,
        isText,
        null
      );

      if (isAsyncCall) {
        xhr = setupAsyncCall(xhr, method, $scope, uri, failFn);
        if (typeof specialHeaders !== 'undefined') {
          var hdrindex = 0;
          for (
            hdrindex = 0;
            hdrindex < specialHeaders.length;
            hdrindex = hdrindex + 1
          ) {
            xhr.setRequestHeader(
              specialHeaders[hdrindex].Type,
              specialHeaders[hdrindex].Header
            );
          }
        }
      }
      xhr.onreadystatechange = function () {
        switch (this.readyState) {
          case this.UNSENT: // 0
            log('Unsent');
            break;
          case this.OPENED: // 1
            log('Opened');
            break;
          case this.HEADERS_RECEIVED: // 2
            log('Header received');
            break;
          case this.LOADING: // 3
            log('Loading');
            break;
          case this.DONE: // 4
            log('Done');
            break;
        }

        // if (this.readyState === this.HEADERS_RECEIVED) {
        //     wwwAuthenticate = this.getResponseHeader('WWW-Authenticate');
        //     xhr = makeNewRequest(method, uri, isAsyncCall, wwwAuthenticate, isText, this);
        //     if(isAsyncCall) {
        //         xhr = setupAsyncCall(xhr, method, $scope, uri, failFn);
        //         if (typeof specialHeaders !== 'undefined') {
        //             var hdrindex = 0;
        //             for (hdrindex = 0; hdrindex < specialHeaders.length; hdrindex = hdrindex + 1) {
        //                 xhr.setRequestHeader(specialHeaders[hdrindex].Type, specialHeaders[hdrindex].Header);
        //             }
        //         }
        //     }
        //     xhr.send();
        // }

        if (this.readyState === XMLHttpRequest.DONE) {
          switch (xhr.status) {
            case 490:
              handleAccountBlock(failFn, xhr);
              break;
            case 401:
              authCount += 1;

              if (authCount < 2) {
                xhr = makeNewRequest(
                  method,
                  uri,
                  isAsyncCall,
                  this.getResponseHeader('WWW-Authenticate'),
                  isText,
                  this
                );
                if (isAsyncCall) {
                  xhr = setupAsyncCall(xhr, method, $scope, uri, failFn);
                  if (typeof specialHeaders !== 'undefined') {
                    var hdrindex = 0;
                    for (
                      hdrindex = 0;
                      hdrindex < specialHeaders.length;
                      hdrindex = hdrindex + 1
                    ) {
                      xhr.setRequestHeader(
                        specialHeaders[hdrindex].Type,
                        specialHeaders[hdrindex].Header
                      );
                    }
                  }
                }
                xhr.send();
              } else {
                reject({
                  Code: xhr.status,
                  message: HTTP_STATUS_CODES[xhr.status],
                });
                authCount = 0;
              }
              break;
            case 200:
              if (
                typeof this.response !== 'undefined' &&
                this.response !== ''
              ) {
                // resolve(this.response);
                // parseResponse(this, successFn, failFn, isText);
                var result = {};

                if (
                  xhr.responseType === 'blob' ||
                  xhr.responseType === 'arraybuffer' ||
                  xhr.responseXML !== null ||
                  isText
                ) {
                  result.data = xhr.response;
                  resolve(result);
                } else {
                  var resp;

                  if (isJSON(xhr.response) === false) {
                    resp = getDotEqualStrLineToObj(xhr.response);
                  } else {
                    resp = JSON.parse(xhr.response);
                  }

                  if (typeof resp === 'object') {
                    result.data = resp;

                    if (result.data.Response === 'Fail') {
                      reject({
                        Code: result.data.Error.Code,
                        message: result.data.Error.Details,
                      });
                    } else {
                      resolve(result);
                    }
                  } else {
                    result.data = xhr.response;
                    resolve(result);
                  }
                }

                authCount = 0;
              } else {
                reject({
                  Code: -1,
                  message: 'No response',
                });
              }
              break;
            default:
              reject({
                Code: xhr.status,
                message: HTTP_STATUS_CODES[xhr.status],
              });
              break;
          }
        }
      };
      // xhr.timeout = 1000;
      xhr.ontimeout = function () {
        reject({
          Code: 408,
          message: HTTP_STATUS_CODES[408],
        });
      };

      xhr.onerror = function () {
        console.error('error response status' + xhr.status);
      };

      log(uri);
      try {
        if (
          typeof fileData !== 'undefined' &&
          fileData !== null &&
          fileData !== ''
        ) {
          xhr.send(fileData);
        } else {
          xhr.send();
        }
      } catch (error) {
        throw error;
      }
    });
  };

  var ajax_sync = function (method, uri, successFn, failFn, isText) {
    _send(method, uri, successFn, failFn, false, null, null, null, isText)
      .then((response) => {
        if (debug) console.log(response);
        successFn(response);
      })
      .catch((error) => {
        if (debug) console.error(error);
        failFn(error);
      });
  };

  var ajax_async = function (
    method,
    uri,
    successFn,
    failFn,
    $scope,
    fileData,
    specialHeaders,
    isText
  ) {
    _send(
      method,
      uri,
      successFn,
      failFn,
      true,
      $scope,
      fileData,
      specialHeaders,
      isText
    )
      .then((response) => {
        console.log(response);
        successFn(response);
      })
      .catch((error) => {
        console.error(error);
        failFn(error);
      });
  };

  var response = function (e) {
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(this.response);
    // 	document.querySelector("#image").src = imageUrl;
  };

  var generateCnonce = function () {
    var characters = 'abcdef0123456789';
    var token = '';
    for (var i = 0; i < 16; i++) {
      var randNum = Math.round(Math.random() * characters.length);
      token += characters.substr(randNum, 1);
    }
    return token;
  };

  var formulateResponse = function (
    username,
    password,
    uri,
    realm,
    method,
    nonce,
    nc,
    cnonce,
    qop
  ) {
    var HA1 = MD5(username + ':' + realm + ':' + password).toString();
    var HA2 = MD5(method + ':' + uri).toString();
    var response = MD5(
      HA1 +
      ':' +
      nonce +
      ':' +
      decimalToHex(nc, 8) +
      ':' +
      cnonce +
      ':' +
      qop +
      ':' +
      HA2
    ).toString();

    return response;
  };

  var getAuthInfoInWwwAuthenticate = function (wwwAuthenticate) {
    var digestHeaders = wwwAuthenticate;
    var scheme = null;
    var realm = null;
    var nonce = null;
    var opaque = null;
    var qop = null;
    var cnonce = null;
    var nc = null;
    var returnValue;

    if (digestHeaders !== null) {
      digestHeaders = digestHeaders.split(',');
      scheme = digestHeaders[0].split(/\s/)[0];

      for (var i = 0; i < digestHeaders.length; i++) {
        var keyVal = digestHeaders[i].split('=');
        var key = keyVal[0];
        var val = keyVal[1].replace(/\"/g, '').trim();

        if (key.match(/realm/i) !== null) {
          realm = val;
        }

        if (key.match(/nonce/i) !== null) {
          nonce = val;
        }

        if (key.match(/opaque/i) !== null) {
          opaque = val;
        }

        if (key.match(/qop/i) !== null) {
          qop = val;
        }
      }

      cnonce = generateCnonce();
      nc++;

      returnValue = {
        scheme: scheme,
        realm: realm,
        nonce: nonce,
        opaque: opaque,
        qop: qop,
        cnonce: cnonce,
        nc: nc,
      };
    }

    return returnValue;
  };

  var decimalToHex = function (d, padding) {
    var hex = Number(d).toString(16);
    padding =
      typeof padding === 'undefined' || padding === null
        ? (padding = 2)
        : padding;

    while (hex.length < padding) {
      hex = '0' + hex;
    }
    return hex;
  };

  var jsonToText = function (json) {
    var uri = '';

    for (var key in json) {
      if (typeof json[key] === 'boolean') {
        uri += '&' + key + '=' + (json[key] === true ? 'True' : 'False');
      } else {
        uri += '&' + key + '=' + json[key];
      }
    }

    return uri;
  };

  var DetectBrowser = function () {
    var BrowserDetectRes = {};
    BrowserDetectRes.isOpera =
      (!!window.opr && !!opr.addons) ||
      !!window.opera ||
      navigator.userAgent.indexOf(' OPR/') >= 0;
    // Firefox 1.0+
    BrowserDetectRes.isFirefox = typeof InstallTrigger !== 'undefined';
    // At least Safari 3+: "[object HTMLElementConstructor]"
    BrowserDetectRes.isSafari =
      Object.prototype.toString
        .call(window.HTMLElement)
        .indexOf('Constructor') > 0;
    // Internet Explorer 6-11
    BrowserDetectRes.isIE = /*@cc_on!@*/ false || !!document.documentMode;
    // Edge 20+
    BrowserDetectRes.isEdge = !BrowserDetectRes.isIE && !!window.StyleMedia;
    // Chrome 1+
    BrowserDetectRes.isChrome = !!window.chrome && !!window.chrome.webstore;
    // Blink engine detection
    BrowserDetectRes.isBlink =
      (BrowserDetectRes.isChrome || BrowserDetectRes.isOpera) && !!window.CSS;

    return BrowserDetectRes;
  };

  Constructor.prototype = {
    get: function (
      uri,
      jsonData,
      SuccessFn,
      FailFn,
      $scope,
      isAsyncCall,
      isText,
      withoutSeqId
    ) {
      return SunapiClient.get(
        uri,
        jsonData,
        SuccessFn,
        FailFn,
        $scope,
        isAsyncCall,
        isText,
        withoutSeqId
      );
    },
    post: function (
      uri,
      jsonData,
      SuccessFn,
      FailFn,
      $scope,
      fileData,
      specialHeaders
    ) {
      return SunapiClient.post(
        uri,
        jsonData,
        SuccessFn,
        FailFn,
        $scope,
        fileData,
        specialHeaders
      );
    },
    setTimeout: function (timeout) {
      if (timeout !== 'undefined') {
        RESTCLIENT_CONFIG.digest.timeout = timeout;
      }
    },
    getAuthInfo: function () {
      return authInfo;
    },
  };

  return new Constructor(device_info);
};
