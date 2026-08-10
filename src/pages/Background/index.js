import { Socket } from './Socket';

console.log('This is the background page.');
console.log('Put the background scripts here.');

const useWindow = true;
var targetWindow = null;

var apps = {
  onLaunched: function (launchData) {
    console.log('Discovery App onLaunched:' + JSON.stringify(launchData));
    if (useWindow) {
      // Center window on screen.
      var screenWidth = 800;
      var screenHeight = 600;
      var width = 800;
      var height = 600;

      chrome.app.window.create(
        'app.html',
        {
          id: 'UDPBroadcastApp',
          width: width,
          height: height,
          left: Math.round((screenWidth - width) / 2),
          top: Math.round((screenHeight - height) / 2),
          minWidth: 800,
          minHeight: 600,
          resizable: true,
          frame: { type: 'chrome' },
        },
        function (createdWindow) {
          // Check to see if I got a non-undefined appWindow.
          if (createdWindow !== null) {
            targetWindow = createdWindow;
            // socket.setTargetWindow(createdWindow);
            Socket.lookupTargetWindow();
            // chrome.app.window.postMessage(appId, {"message": "start"});
            createdWindow.contentWindow.addEventListener(
              'DOMContentLoaded',
              function () {
                console.log('app window complete!');
                // get init button element from windows.html
                const searchButton =
                  createdWindow.contentWindow.document.getElementById('search');
                // var disconnectButton =
                //   createdWindow.contentWindow.document.getElementById(
                //     'disconnect'
                //   );
                try {
                  searchButton.addEventListener('click', function () {
                    console.log('init button clicked');
                    //     // socket.cleanup_socket();
                    Socket.cleanup_create();
                    //     initButton.disabled = true;
                    //     disconnectButton.disabled = false;
                    //     // disconnectButton.addEventListener('click', onDisconnect);
                    //     // try{
                    //     //   console.log("Trying to post message");
                    //     //   initButton.contentWindow.postMessage("Message from Chrome APP!", "*");
                    //     // }catch(error){
                    //     //   console.log("postMessage error: " + error);
                    //     // }
                  });
                } catch (err) {
                  console.log('button button error: ' + err);
                }
              }
            );
          }
          // // Do stuff here, and no need for get()
          // // createdWindow.innerBounds.height = 50;
          // // createdWindow.innerBounds.width = 200;
          // console.log("all: " + chrome.app.window.getAll())
          // var targetWindow = chrome.app.window.get(appId);
          // targetWindow.innerBounds.height = 50;
          // targetWindow.innerBounds.width = 200;
          // // targetWindow.width = 10;
          // // targetWindow.postMessage(message, "*");
          // socket.setTargetWindow(targetWindow);
        }
      );
    } else {
      // socket.cleanup_socket();
      Socket.cleanup_create();
    }

    if (chrome.app.runtime.lastError)
      console.error(chrome.app.runtime.lastError);

    // Socket.cleanup_create();

    // if (chrome.app.runtime.lastError)
    //   console.error(chrome.app.runtime.lastError);
  },
  onRestarted: function () {
    // Do some simple clean-up tasks.
    console.log('Discovery App onRestarted');
  },
};

// chrome.app.* is the Chrome Apps platform-app API; it does not exist in a
// Manifest V3 extension service worker. Guarded so the crash it used to
// cause here doesn't prevent the onMessageExternal listener below (which
// receives discovery results) from ever being registered.
if (chrome.app && chrome.app.runtime) {
  chrome.app.runtime.onLaunched.addListener(apps.onLaunched());
  chrome.app.runtime.onRestarted.addListener(apps.onRestarted());
}

// ID of the WiseNetChromeIPInstaller extension, which performs UDP
// discovery (via its own native messaging host) and forwards each
// discovered device to this extension.
var WISENET_IP_INSTALLER_ID = 'ihcdpceodailngfjicepeliafblopphg';

chrome.runtime.onMessageExternal.addListener(function (
  message,
  sender,
  sendResponse
) {
  console.log('sender' + JSON.stringify(sender));
  console.log('message' + JSON.stringify(message));
  console.log('*************');
  if (sender.id === Socket.extensionId && message.discovery) {
    Socket.cleanup_create();
    return;
  }

  if (sender.id === WISENET_IP_INSTALLER_ID && message.chMac) {
    // A discovered device, forwarded from WiseNetChromeIPInstaller's
    // scripts/socket.js. Keep the latest result per MAC address.
    chrome.storage.local.get({ discoveredDevices: [] }, function (data) {
      var devices = data.discoveredDevices.filter(function (d) {
        return d.chMac !== message.chMac;
      });
      devices.push(message);
      chrome.storage.local.set({ discoveredDevices: devices });
    });
  }
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log('sender' + JSON.stringify(sender));
  console.log('message' + JSON.stringify(message));
  console.log('################');
});

// eventPage.js

chrome.runtime.onStartup.addListener(function () {
  console.log('I started up!');
  Socket.cleanup_create();
});

chrome.runtime.onSuspend.addListener(function () {
  console.log('I am being suspended!');
});

// // reference from:
// // https://stackoverflow.com/questions/24498821/how-to-handle-err-insecure-response-in-google-chrome-extension
// chrome.webRequest.onErrorOccurred.addListener(function(details) {
//   // if (details.error == 'net::ERR_INSECURE_RESPONSE') {
//       console.log('request error detected', details);
//   // }
// });
