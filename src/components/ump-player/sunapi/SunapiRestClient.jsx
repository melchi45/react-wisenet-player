import { UmpException } from '../Exception/UmpException';

// digest auth request
// by @inorganik

// dependent upon CryptoJS MD5 hashing:
// http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/md5.js
export var sunapiRestClient = function () {
  'use strict';
  var log = window.log.getLogger();
  var _version = '0.0.1';

  var DEVICE_CONFIG = {
    serverType: 'camera', // 'grunt' or 'camera'
    hostname: '', //'211.189.132.70', /// by neighbor21 duks >>> /// 변경  192.168.75.77 -> 211.189.132.70
    port: 80, /// by neighbor21  duks
    protocol: 'http', /// by neighbor21 duks
    rtspPort: 554,
    ClientIPAddress: '127.0.0.1', //default client ip used for rtsp useragent will be replaced later
    username: '',
    password: '',
  };
  var data = null;
  var successFn;
  var errorFn;
  var worker;
  var authInfo;
  var promise_mode = true;
  var _self;
  var promise;

  var onMessage = function (event) {
    log.debug('onMessage Event: ', window.fastJsonStringfy(event));

    if (
      event.data !== '' &&
      event.data !== null &&
      typeof event.data !== 'undefined'
    ) {
      if (event.data.id === 'auth') {
        if (typeof event.data.auth === 'object') {
          authInfo = event.data.auth;
        }
      } else {
        if (event.data.success && event.data.id === 'response') {
          successFn(event.data.response);
        } else {
          errorFn(event.data.status);
        }
        this.terminate();
      }
    }
  };

  var onError = function (err) {
    log.debug('onError Event: ' + window.fastJsonStringfy(err));
    log.debug(err.message);
    // if (err.message === "Not a critical error") {
    //   log.debug(err.message);
    // } else {
    //   log.debug(err.message);
    // }
    worker.terminate();
  };

  var post = function (uri, jsonData, $scope, fileData, specialHeaders) {
    data = {
      async: true,
      deviceInfo: DEVICE_CONFIG,
      method: 'post',
      uri: uri,
      body: jsonData,
      scope: $scope,
      file: fileData,
      header: specialHeaders,
      isText: isText,
      auth: authInfo,
      promise: promise_mode,
    };

    if (!promise_mode) {
      worker = new Worker('/media/ump/Worker/sunapi/sunapiRequestTask.js');
      //worker.onmessage = onMessage;
      worker.addEventListener('message', onMessage);
      //worker.onerror = onError;
      worker.addEventListener('error', onError);

      worker.postMessage(data);
    } else {
      worker = new Worker('/media/ump/Worker/sunapi/sunapiRequestTask.js');
      promise = new Promise(function (resolve, reject) {
        worker.onmessage = function (event) {
          log.debug('onMessage Event: ', window.fastJsonStringfy(event));

          if (
            event.data !== '' &&
            event.data !== null &&
            typeof event.data !== 'undefined'
          ) {
            if (event.data.id === 'auth') {
              if (typeof event.data.auth === 'object') {
                authInfo = event.data.auth;
              }
            } else {
              if (event.data.success && event.data.id === 'response') {
                successFn(event.data.response);
              } else {
                errorFn(event.data);
              }
              resolve();
              this.terminate();
            }
          }
        };
        worker.onerror = function (err) {
          log.error('Worker Error: ' + err);
        };
      });
      worker.postMessage(data);
    }
  };

  var get = function (uri, jsonData, $scope, isAsyncCall, isText) {
    data = {
      async: isAsyncCall ? true : false,
      deviceInfo: DEVICE_CONFIG,
      method: 'get',
      uri: uri,
      body: jsonData,
      scope: $scope,
      isText: isText,
      auth: authInfo,
      promise: promise_mode,
    };

    if (!promise_mode) {
      worker = new Worker('/media/ump/Worker/sunapi/sunapiRequestTask.js');
      //worker.onmessage = onMessage;
      worker.addEventListener('message', onMessage);
      //worker.onerror = onError;
      worker.addEventListener('error', onError);

      worker.postMessage(data);
    } else {
      worker = new Worker('/media/ump/Worker/sunapi/sunapiRequestTask.js');
      promise = new Promise(function (resolve, reject) {
        worker.onmessage = function (event) {
          log.debug('onMessage Event: ', window.fastJsonStringfy(event));

          if (
            event.data !== '' &&
            event.data !== null &&
            typeof event.data !== 'undefined'
          ) {
            if (event.data.id === 'auth') {
              if (typeof event.data.auth === 'object') {
                authInfo = event.data.auth;
              }
            } else {
              if (event.data.success && event.data.id === 'response') {
                successFn(event.data.response);
              } else {
                errorFn(event.data);
              }
              resolve();
              this.terminate();
            }
          }
        };
        worker.onerror = function (err) {
          log.error('Worker Error: ' + err);
        };
      });
      worker.postMessage(data);
    }
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

  var version = function () {
    return _version;
  };

  function Constructor() {
    _self = this;
    Constructor.prototype.version = version();
  }

  Constructor.prototype = {
    /**
     * This function is initialize sunapiRestClient.
     * @function init
     * @memberof sunapiRestClient
     * @example
     *     example: sunapiRestClient.init(deviceInfo);
     */
    init: function (device_info) {
      log.info('Version: ' + Constructor.prototype.version);

      // if deviceType is not defined, default is camera
      if (
        device_info.deviceType !== undefined &&
        device_info.deviceType !== '' &&
        device_info.deviceType !== null
      ) {
        DEVICE_CONFIG.serverType = device_info.deviceType;
      } else {
        console.warn(
          "The device type is not defined, set to 'camera' by default."
        );
      }

      // check input parameter
      if (
        DEVICE_CONFIG.serverType === 'nvr' &&
        (device_info.hostname === undefined ||
          (device_info.hostname === '' && device_info.hostname === null))
      ) {
        // if hostname is empty, throw invalid parameter
        throw new UmpException({
          errorCode: window.fromHex('0x0401'),
          place: 'sunapiClient.js:52',
          message: 'hostname is empty from input parameter.',
        });
      } else if (
        DEVICE_CONFIG.serverType === 'camera' &&
        (device_info.cameraIp === undefined ||
          device_info.cameraIp === '' ||
          device_info.cameraIp === null)
      ) {
        // if cameraIp is empty, throw invalid parameter
        throw new UmpException({
          errorCode: window.fromHex('0x0400'),
          place: 'sunapiClient.js:60',
          message: 'cameraIP is empty from input parameter.',
        });
      }

      if (
        DEVICE_CONFIG.serverType === 'nvr' &&
        (device_info.username === undefined ||
          device_info.username === '' ||
          device_info.username === null)
      ) {
        // if cameraIp is empty, throw invalid parameter
        throw new UmpException({
          errorCode: window.fromHex('0x0402'),
          place: 'sunapiClient.js:70',
          message: 'username is empty from input parameter.',
        });
      } else if (
        DEVICE_CONFIG.serverType === 'camera' &&
        (device_info.user === undefined ||
          device_info.user === '' ||
          device_info.user === null)
      ) {
        // if cameraIp is empty, throw invalid parameter
        throw new UmpException({
          errorCode: window.fromHex('0x0402'),
          place: 'sunapiClient.js:78',
          message: 'user id is empty from input parameter.',
        });
      }

      if (
        device_info.password === undefined ||
        device_info.password === '' ||
        device_info.password === null
      ) {
        // if cameraIp is empty, throw invalid parameter
        throw new UmpException({
          errorCode: window.fromHex('0x0403'),
          place: 'sunapiClient.js:80',
          message: 'password is empty from input parameter.',
        });
      }

      var loc_protocol = window.location.protocol;
      var splitProt = loc_protocol.split(':');

      DEVICE_CONFIG.serverType = device_info.deviceType;
      DEVICE_CONFIG.hostname = device_info.hostname;
      DEVICE_CONFIG.port = device_info.port;
      DEVICE_CONFIG.protocol = splitProt[0];
      DEVICE_CONFIG.ClientIPAddress = device_info.ClientIPAddress;
      DEVICE_CONFIG.username = device_info.username;
      DEVICE_CONFIG.password = device_info.password;
    },
    get: function (
      uri,
      jsonData,
      SuccessFn,
      FailFn,
      $scope,
      isAsyncCall,
      isText
    ) {
      successFn = SuccessFn;
      errorFn = FailFn;
      return get(uri, jsonData, $scope, isAsyncCall, isText);
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
      successFn = SuccessFn;
      errorFn = FailFn;

      return post(uri, jsonData, $scope, fileData, specialHeaders);
    },
    join: function () {
      if (!promise_mode) {
        log.warning('this function is support only promise mode!!');
        return;
      }

      Promise.resolve(promise);
    },
    setTimeout: function (timeout) {
      if (timeout !== 'undefined') {
        DEVICE_CONFIG.timeout = timeout;
      }
    },
  };

  return new Constructor();
};
