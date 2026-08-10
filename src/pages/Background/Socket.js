import { Utils } from './Utils';
// var extensionApp = chrome.runtime.connect(extensionId);

export const Socket = function () {};

// constructor
// The ID of the extension we want to talk to.
// var extensionId = "loliolhohbdkfmiieliikgpdmohhfnhm";
Socket.extensionId = 'aleblbammdopgjlaainhggebjfgfkpdf';
// Socket.extensionId = 'knldjmfmopnpolahpmmgbagdohdnhkik';
Socket.extensionId2 = 'cgjnljkgkhlalpippgcamfefhfbkbnid';
Socket.extensionId3 = 'kffkaaidbnfhedampdhagmioedmfjdop';
Socket.listeningSocketId = null;
Socket.sendingSocketId = null;
// use node module
Socket.SENDPORT = 7701; // camera send port
Socket.RECEIVEPORT = 7711; // camera send port
Socket.BROADCAST_ADDR = '255.255.255.255';
Socket.LISTENING_ADDR = '0.0.0.0';
Socket.SENDING_ADDR = '127.0.0.1';
Socket.targetWindow = null;
Socket.appId = 'UDPBroadcastApp';
let id = 0;

Socket.lookupTargetWindow = function () {
  console.log('all: ' + chrome.app.window.getAll());
  this.targetWindow = chrome.app.window.get(Socket.appId);
  console.log('target window:' + Socket.targetWindow);
  // targetWindow.postMessage({data: {"message": "hello"}}, "*");
};

Socket.displayResult = function (data) {
  try {
    if (Socket.targetWindow != null) {
      // createdWindow.contentWindow.document.getElementById('init');
      // var resultTextarea =
      //   Socket.targetWindow.contentWindow.document.getElementById('result');

      var deviceName = data.chDeviceName;
      var macAddress = data.chMac;
      var ipAddress = data.chIP;
      var Gateway = data.chGateway;
      var SubnetMask = data.chSubnetMask;
      var SupportSunapi = data.isSupportSunapi;
      var MulticastPort = data.nMulticastPort;
      var port =
        typeof data.httpType !== 'undefined'
          ? data.httpType === 0
            ? data.nHttpPort
            : data.nHttpsPort
          : data.nPort;
      var url = data.DDNSURL;
      var model = data.modelType;
      var httpType = data.httpType;
      var svnp = data.nDevicePort;

      // var str = resultTextarea.value;
      id += 1;

      var result = {
        id: id,
        DeviceName: deviceName,
        IPAddress: ipAddress,
        MACAddress: macAddress,
        Port: port,
        Gateway: Gateway,
        SubnetMask: SubnetMask,
        SupportSunapi: SupportSunapi,
        MulticastPort: MulticastPort,
        URL: url,
        Model: model,
        Protocol:
          typeof data.httpType !== 'undefined'
            ? httpType === 0
              ? 'http'
              : 'https'
            : new URL(data.url).protocol.split(':')[0],
      };

      // str += JSON.stringify(result) + '\r\n';

      // // str += "onerror: " + fastJsonStringfy(error.message) + "\r\n";
      // resultTextarea.value = str;

      // var dataTable =
      //   Socket.targetWindow.contentWindow.document.getElementById('datatable');

      const event = new CustomEvent('discover', {
        detail: {
          device: result,
        },
      });
      // Dispatch the event.
      Socket.targetWindow.contentWindow.dispatchEvent(event);
      // dataTable.postMessage({ type: "FROM_PAGE", text: "Hello from the webpage!" }, "*");
      // this.targetWindow.contentWindow.postMessage({ type: "FROM_PAGE", text: "Hello from the webpage!" }, "*");
      // this.targetWindow.postMessage({ type: "FROM_PAGE", text: "Hello from the webpage!" }, "*");
    }
  } catch (error) {
    console.error(error);
  }
};

Socket.create = function () {
  chrome.sockets.udp.create({}, Socket.onCreate);

  // reference from:
  // https://stackoverflow.com/questions/24198322/how-to-launch-a-chrome-app-from-a-chrome-extension
  chrome.runtime.sendMessage(Socket.extensionId, { launch: true });
  chrome.runtime.sendMessage(Socket.extensionId2, { launch: true });
};

Socket.cleanup_socket = function () {
  // reference from:
  // https://stackoverflow.com/questions/28393684/not-getting-onreceive-callback-for-udp-socket-on-chrome-after-event-page-is-unlo
  chrome.sockets.udp.getSockets(function cleanup_create_cb(socketInfos) {
    console.log('Cleaning up existing sockets  ' + socketInfos.length);

    // chrome.sockets.udp.close(socket.listeningSocketId, function socket_close_cb(data) {
    //   socket.listeningSocketId = null;
    //     console.log(data);
    // });
    // chrome.sockets.udp.close(socket.sendingSocketId, function socket_close_cb(data) {
    //   socket.sendingSocketId = null;
    //   console.log(data);
    // });
    if (socketInfos.length > 0) {
      for (var i = 0; i < socketInfos.length; i++) {
        if (this.listeningSocketId === socketInfos[i].socketId) {
          console.log('close the listening socket: ' + socketInfos[i].socketId);
        }

        if (this.sendingSocketId === socketInfos[i].socketId) {
          console.log('close the sending socket: ' + socketInfos[i].socketId);
        }
        chrome.sockets.udp.close(
          socketInfos[i].socketId,
          function socket_close_cb() {
            console.log('socket closed.');
            // chrome.sockets.udp.getSockets(function cleanup_create_cb(socketInfos) {
            //   if (socketInfos.length === 0) {
            //     socket.listeningSocketId = null;
            //     socket.sendingSocketId = null;
            //     socket.create();
            //   }
            // });
          }
        ); // end socket close
      } // end for
    } else {
      // socket.create();
    } // end if
  });
};
Socket.cleanup_create = function () {
  // reference from:
  // https://stackoverflow.com/questions/28393684/not-getting-onreceive-callback-for-udp-socket-on-chrome-after-event-page-is-unlo
  chrome.sockets.udp.getSockets(Socket.cleanup_callback);
};

Socket.cleanup_callback = function (socketInfos) {
  console.log('Cleaning up existing sockets  ' + socketInfos.length);

  // chrome.sockets.udp.close(socket.listeningSocketId, function socket_close_cb(data) {
  //   socket.listeningSocketId = null;
  //     console.log(data);
  // });
  // chrome.sockets.udp.close(socket.sendingSocketId, function socket_close_cb(data) {
  //   socket.sendingSocketId = null;
  //   console.log(data);
  // });
  if (socketInfos.length > 0) {
    for (var i = 0; i < socketInfos.length; i++) {
      if (this.listeningSocketId === socketInfos[i].socketId) {
        console.log('close the listening socket: ' + socketInfos[i].socketId);
      }

      if (this.sendingSocketId === socketInfos[i].socketId) {
        console.log('close the sending socket: ' + socketInfos[i].socketId);
      }
      chrome.sockets.udp.close(
        socketInfos[i].socketId,
        function socket_close_cb() {
          console.log('socket closed.');
          chrome.sockets.udp.getSockets(function cleanup_create_cb(
            socketInfos
          ) {
            if (socketInfos.length === 0) {
              this.listeningSocketId = null;
              this.sendingSocketId = null;
              this.create();
            }
          });
        }
      ); // end socket close
    } // end for
  } else {
    Socket.create();
  } // end if
};

Socket.onCreate = function (socketInfo) {
  try {
    if (socketInfo.socketId < 0) {
      console.log(
        'Listening Bind failed with error: ' +
          // result +
          ', last error:' +
          chrome.runtime.lastError.message
      );
    }
    console.log('socket created: ' + socketInfo.socketId);
    if (
      typeof Socket.listeningSocketId !== 'undefined' &&
      Socket.listeningSocketId === null
    ) {
      Socket.listeningSocketId = socketInfo.socketId;
      console.log('listening socket Id: ' + Socket.listeningSocketId);
      chrome.sockets.udp.onReceive.addListener(Socket.onReceive);
      chrome.sockets.udp.onReceiveError.addListener(Socket.onReceiveError);
      chrome.sockets.udp.bind(
        Socket.listeningSocketId,
        Socket.LISTENING_ADDR,
        Socket.RECEIVEPORT,
        Socket.onBindListening
      );
    } else if (
      typeof Socket.sendingSocketId !== 'undefined' &&
      Socket.sendingSocketId === null
    ) {
      Socket.sendingSocketId = socketInfo.socketId;
      console.log('sending socket Id: ' + Socket.sendingSocketId);
      chrome.sockets.udp.bind(
        Socket.sendingSocketId,
        Socket.SENDING_ADDR,
        Socket.SENDPORT,
        Socket.onBindSending
      );
    } else {
      console.log('==========================');
    }
  } catch (error) {
    console.error(error);
  }
};

Socket.onBindListening = function (result) {
  //   chrome.test.assertEq(0, result, "Bind failed with error: " + result);
  if (result < 0) {
    console.log(
      'Listening Bind failed with error: ' +
        result +
        ', last error:' +
        chrome.runtime.lastError.message
    );
    chrome.sockets.udp.close(Socket.listeningSocketId, function () {
      Socket.listeningSocketId = null;
    });

    return;
  }

  chrome.sockets.udp.setBroadcast(
    Socket.listeningSocketId,
    true,
    Socket.onSetBroadcastListening
  );
};

Socket.onBindSending = function (result) {
  //   chrome.test.assertEq(0, result, "Bind failed with error: " + result);
  if (result < 0) {
    console.log(
      'socketId: [' +
        Socket.sendingSocketId +
        ']\r\n,Sending Bind failed with error: ' +
        result +
        ', last error: ' +
        chrome.runtime.lastError.message
    );
    chrome.sockets.udp.close(Socket.sendingSocketId, function () {
      Socket.sendingSocketId = null;
    });
    return;
  }

  chrome.sockets.udp.setBroadcast(
    Socket.sendingSocketId,
    true,
    Socket.onSetBroadcastSending
  );
};

Socket.onSetBroadcastListening = function (result) {
  //   chrome.test.assertEq(0, result, "Failed to enable broadcast: " + result);
  if (result < 0) {
    console.log(
      'Failed to enable broadcast: ' +
        result +
        ', last error: ' +
        chrome.runtime.lastError.message
    );
    return;
  }

  // Create the sending socket.
  chrome.sockets.udp.create({}, Socket.onCreate);
};

Socket.onSetBroadcastSending = function (result) {
  //   chrome.test.assertEq(0, result, "Failed to enable broadcast: " + result);
  if (result < 0) {
    console.log(
      'Failed to enable broadcast: ' +
        result +
        ', last error: ' +
        chrome.runtime.lastError.message
    );
    return;
  }

  var buf =
    '018750735306465625ef6da75b047d7bcd1c3c001800000000000000f0eacf00000000000000000000000000faf8ec76000000000000000050ea18001a01ec76f0e9180000000000e4ea18008000ec76f0eacf0000000000f00000000000000000000000fc3841007226881300000000b972c1746121c274881310272e2724271a2742270000000000000000b10200000100000000000000f00000000100000001000000f0eacf00d00b20000000000074ea18007a61c274f0eacf0000000000fc38410000000000000000000100000078f418008cea180076784100d00b2000f00000000000000001000000a4ea18000e7f4000c4ea18000904000050fe180078f41800f0ea';
  //   var message = hexStringToArrayBuffer(buf);
  // var message = str2ab(str);
  var message = new Uint8Array(
    buf.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16);
    })
  );

  chrome.sockets.udp.send(
    Socket.listeningSocketId,
    message,
    Socket.BROADCAST_ADDR,
    Socket.SENDPORT,
    function (sendInfo) {
      // chrome.test.assertEq(0, sendInfo.resultCode);
      console.log('send result: ' + sendInfo.resultCode);
      // chrome.test.assertEq(sendInfo.bytesSent, arrayBuffer.byteLength);
    }
  );
};

Socket.onReceive = function (info) {
  try {
    // console.log("Received data on socket" + "(" + info.socketId + ")");
    // console.log("received:", ab2str(info.data));
    var byteData = new Uint8Array(info.data);

    // Make a simple request:
    // chrome.runtime.sendMessage(editorExtensionId, {data: byteData},
    //   function(response) {
    //     if (typeof response !== 'undefined' &&
    //         !response.success)
    //       handleError(data);
    // });

    // reference from:
    // https://developer.chrome.com/extensions/messaging#external
    // Start a long-running conversation:
    // var port = chrome.runtime.connect(laserExtensionId);
    // port.postMessage(...);

    chrome.runtime.onMessageExternal.addListener(function (
      request,
      sender,
      sendResponse
    ) {
      if (typeof sender.data !== 'undefined') {
      }
      // if (request.openUrlInEditor) openUrl(request.openUrlInEditor);
    });
    // chrome.runtime.sendMessage(editorExtensionId, {openUrlInEditor: "chrome-extension://loliolhohbdkfmiieliikgpdmohhfnhm/newtab.html"},
    //   function(response) {
    //     if (typeof response !== 'undefined' &&
    //         !response.success)
    //       handleError(url);
    // });

    var nModeLength = 1,
      nPacketIDLength = 18,
      nMacAddressLength = 18,
      nIPAddressLength = 16,
      nSubnetMaskLength = 16,
      nGatewayLength = 16,
      nChangePasswordLgenth = 20,
      nReservedLegnth = 1,
      nPortLength = 2,
      nStatusLength = 1,
      nDeviceNameLength = 10,
      nDeviceNameNewLength = 32,
      nNetworkModeLength = 1,
      nIsSupportSunapiLength = 1,
      nDDNSURLLength = 128,
      nAlasLength = 32,
      nModelType = 1,
      nVersionLength = 2,
      nHttpType = 1,
      noPassword = 1;

    var result = {};

    var index = 0;
    result.nMode = byteData.subarray(index, 1)[0];
    // console.log("mode:", result.nMode);
    index += nModeLength;

    result.chPacketId = byteData.subarray(index, index + nPacketIDLength);
    // console.log("packet id:", result.chPacketId);
    index += nPacketIDLength;

    result.chMac = String.fromCharCode
      .apply(null, byteData.subarray(index, index + nMacAddressLength))
      .replace(/\0/g, '');
    // console.log("mac address:", result.chMac);
    index += nMacAddressLength;

    // result.chIP = String.fromCharCode.apply(null, byteData.subarray(index, index + nIPAddressLength)).replace(/\s$/gi, "");// 문자열 맨 뒤의 공백만 제거;
    result.chIP = String.fromCharCode
      .apply(null, byteData.subarray(index, index + nIPAddressLength))
      .replace(/\0/g, '');
    // console.log("IP address:", result.chIP);
    index += nIPAddressLength;

    result.chSubnetMask = String.fromCharCode
      .apply(null, byteData.subarray(index, index + nSubnetMaskLength))
      .replace(/\0/g, '');
    // console.log("subnet mask:", result.chSubnetMask);
    index += nSubnetMaskLength;

    result.chGateway = String.fromCharCode
      .apply(null, byteData.subarray(index, index + nGatewayLength))
      .replace(/\0/g, '');
    // console.log("gateway:", result.chGateway);
    index += nGatewayLength;

    result.chPassword = String.fromCharCode
      .apply(null, byteData.subarray(index, index + nChangePasswordLgenth))
      .replace(/\0/g, '');
    // console.log("chPassword:", result.chPassword);
    index += nChangePasswordLgenth;

    result.isSupportSunapi = Utils.bytes2int(
      byteData.subarray(index, index + nIsSupportSunapiLength)
    );
    // console.log("isSupportSunapi:", result.isSupportSunapi);
    index += nIsSupportSunapiLength;

    result.nPort = Utils.ntohs(
      byteData.subarray(index, index + nPortLength),
      true
    );
    // console.log("port:", result.nPort);
    index += nPortLength;

    result.nStatus = Utils.bytes2int(
      byteData.subarray(index, index + nStatusLength)
    );
    // console.log("status:", result.nStatus);
    index += nStatusLength;

    // result.chDeviceName = String.fromCharCode.apply(null, byteData.subarray(index, index + nDeviceNameLength)).replace(/\0/g, '');
    result.chDeviceName = Utils.ab2str(
      byteData.subarray(index, index + nDeviceNameLength)
    ).split('\u0000')[0];
    // console.log("status:", result.chDeviceName);
    index += nDeviceNameLength;

    result.Reserved2 = byteData.subarray(index, index + nReservedLegnth);
    index += nReservedLegnth;

    result.nHttpPort = Utils.ntohs(
      byteData.subarray(index, index + nPortLength),
      true
    );
    // console.log("http port:", result.nHttpPort);
    index += nPortLength;

    result.nDevicePort = Utils.ntohs(
      byteData.subarray(index, index + nPortLength),
      true
    );
    // console.log("device port:", result.nDevicePort);
    index += nPortLength;

    result.nTcpPort = Utils.ntohs(
      byteData.subarray(index, index + nPortLength),
      true
    );
    // console.log("tcp port:", result.nTcpPort);
    index += nPortLength;

    result.nUdpPort = Utils.ntohs(
      byteData.subarray(index, index + nPortLength),
      true
    );
    // console.log("udp port:", result.nUdpPort);
    index += nPortLength;

    result.nUploadPort = Utils.ntohs(
      byteData.subarray(index, index + nPortLength),
      true
    );
    // console.log("upload port:", result.nUploadPort);
    index += nPortLength;

    result.nMulticastPort = Utils.ntohs(
      byteData.subarray(index, index + nPortLength),
      true
    );
    // console.log("multicast port:", result.nMulticastPort);
    index += nPortLength;
    // network mode
    result.nNetworkMode = Utils.bytes2int(
      byteData.subarray(index, index + nNetworkModeLength)
    );
    // console.log("network mode:", result.nNetworkMode);
    index += nNetworkModeLength;

    // result.DDNSURL = String.fromCharCode.apply(null, byteData.subarray(index, index + nDDNSURLLength)).replace(/\0/g, '');
    result.DDNSURL = Utils.ab2str(
      byteData.subarray(index, index + nDDNSURLLength)
    ).split('\u0000')[0];
    // console.log("ddns url:", result.DDNSURL);
    index += nDDNSURLLength;

    if (byteData.length >= 261) {
      result.alias = String.fromCharCode
        .apply(null, byteData.subarray(index, index + nAlasLength))
        .replace(/\0/g, '');
      // console.log("alias:", result.alias);
      index += nAlasLength;

      result.chDeviceNameNew = String.fromCharCode.apply(
        null,
        byteData.subarray(index, index + nDeviceNameNewLength)
      );
      // console.log("device name new:", result.chDeviceNameNew);
      index += nDeviceNameNewLength;

      result.modelType = Utils.bytes2int(
        byteData.subarray(index, index + nModelType)
      );
      // console.log("model type:", result.modelType);
      index += nModelType;

      result.version = Utils.ntohs(
        byteData.subarray(index, index + nVersionLength)
      );
      // console.log("version:", result.version);
      index += nVersionLength;

      result.httpType = Utils.bytes2int(
        byteData.subarray(index, index + nHttpType)
      );
      // console.log("http type:", result.httpType);
      index += nHttpType;

      result.Reserved3 = byteData.subarray(index, index + nReservedLegnth);
      index += nReservedLegnth;

      result.nHttpsPort = Utils.ntohs(
        byteData.subarray(index, index + nPortLength),
        true
      );
      // console.log("https port:", result.nHttpsPort);
      index += nPortLength;

      result.noPassword = Utils.bytes2int(
        byteData.subarray(index, index + noPassword)
      );
      // console.log("nopassword:", result.noPassword);
      index += noPassword;
    }

    chrome.runtime.sendMessage(Socket.extensionId, result);
    chrome.runtime.sendMessage(Socket.extensionId2, result);
    Socket.displayResult(result);
    // chrome.runtime.sendMessage(Socket.extensionId3, result);
    // chrome.tabs.query({}, (tabs) =>
    //   tabs.forEach((tab) => chrome.tabs.sendMessage(tab.id, result))
    // );
    // Socket.displayResult(result);
    // chrome.runtime.sendMessage(
    //   {
    //     type: 'DISCOVER',
    //     data: result
    //   }
    // );
    // chrome.extension.sendMessage({action:'open_dialog_box'}, function(){});
    // notifyReady(result);
    console.log('result', result);
  } catch (error) {
    console.error(error);
  }
};
Socket.onReceiveError = function (info) {
  //   chrome.test.fail("Socket receive error: " + info.resultCode);
};
