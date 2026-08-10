/**
 * @fileoverview A source file of the Rest Client Config in Rich Components.
 * @name Youngho Kim
 */

import React from 'react';

/**
 * The Config of Rest Client in Rich Components.
 *
 * @ngdoc constant
 * @name RESTCLIENT_CONFIG
 * @example
 *  kindFramework.constant('RESTCLIENT_CONFIG', {
 *    digest: {
       serverType: 'camera',    // 'grunt' or 'camera'
 *      hostName: '192.168.75.54',
 *      port: 80,
 *      protocol: 'http'
 *    }
 *  })
 */
export const RestClientConfig = {
  clientVersion: '1.1_20220817',
  /**
   * @param {String} pluginModel  ['normal', 'fisheye', 'lite']
   * @param {String} serverType   ['grunt', 'camera']
   * @param {String} specialType  ['tta', 's1'] : This should be set from SunapiClient.checkInitPw
   * @param {Boolean} debugMode   [true,false]  : serverType이 camera 일 때 동작'
   * @see /plugin/pluginModel.js
   */
  pluginModel: 'none',
  serverType: 'grunt', // 'grunt' or 'camera',
  specialType: 'browserAuth', //  null(default), 'browserAuth'(custom), 'tta', 's1',
  debugMode: false,
  minimizedMode: false, // true : minimized mode
  discoveryAppId: 'ihcdpceodailngfjicepeliafblopphg',
  digest: {
    hostName: '192.168.212.144', // 5M
    port: 80, // If null, port is 80('http') or 443('https').
    protocol: 'http',
    rtspIp: '',
    rtspPort: 554,
    ClientIPAddress: '127.0.0.1', //default client ip used for rtsp useragent will be replaced later
    macAddress: '',
  },
  oauth: {
    token: '',
  },
  basic: {
    username: '',
    password: '',
  },
};
//   config.digest.port =
//     config.digest.port || (config.digest.protocol === 'http' ? 80 : 443);
//   return config;
// };
