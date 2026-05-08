import React, { useRef, useCallback } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { IDevice } from '../types';

interface UmpPlayerWebViewProps {
  device: IDevice;
  width?: number;
  height?: number;
  onStateChange?: (state: string) => void;
  onError?: (error: string) => void;
}

/**
 * Generates the self-contained HTML page that loads ump-player via CDN
 * and communicates with React Native via window.ReactNativeWebView.postMessage.
 */
function buildUmpHtml(device: IDevice): string {
  const protocol = device.https ? 'https' : 'http';
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; background: #000; overflow: hidden; }
    ump-player { width: 100%; height: 100%; display: block; }
    #loading {
      position: absolute; inset: 0;
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-family: sans-serif; font-size: 14px;
      background: rgba(0,0,0,0.7);
    }
  </style>
</head>
<body>
  <div id="loading">Connecting...</div>
  <ump-player
    id="ump-player-1"
    hostname="${device.hostname}"
    port="${device.port}"
    username="${device.username}"
    password="${device.password}"
    profile="${device.profile}"
    channel="${device.channel}"
    device="${device.device}"
    ${device.autoplay ? 'autoplay' : ''}
    ${device.statistics ? 'statistics' : ''}
    ${device.https ? 'https' : ''}
  ></ump-player>

  <script src="${protocol}://${device.hostname}:${device.port}/ump-player/ump-player.min.js"></script>
  <script>
    var player = document.getElementById('ump-player-1');
    var loading = document.getElementById('loading');

    function postToNative(type, data) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: type, data: data }));
      }
    }

    player.addEventListener('statechange', function(e) {
      var state = e.detail && e.detail.readyState;
      if (state === 1) { loading.style.display = 'none'; }
      else { loading.style.display = 'flex'; loading.innerText = state === 0 ? 'Stopped' : 'Buffering...'; }
      postToNative('statechange', { readyState: state });
    });

    player.addEventListener('error', function(e) {
      loading.style.display = 'flex';
      loading.innerText = 'Error: ' + JSON.stringify(e.detail);
      postToNative('error', e.detail);
    });

    player.addEventListener('close', function(e) {
      postToNative('close', {});
    });

    // receive commands from React Native
    document.addEventListener('message', handleMessage);
    window.addEventListener('message', handleMessage);
    function handleMessage(e) {
      try {
        var msg = JSON.parse(e.data);
        if (msg.command === 'play')  { player.play(); }
        if (msg.command === 'stop')  { player.stop(); }
        if (msg.command === 'pause') { player.pause(); }
        if (msg.command === 'capture') { player.capture(); }
      } catch (_) {}
    }
  </script>
</body>
</html>`;
}

export const UmpPlayerWebView: React.FC<UmpPlayerWebViewProps> = ({
  device,
  width,
  height,
  onStateChange,
  onError,
}) => {
  const webViewRef = useRef<WebView>(null);

  const sendCommand = useCallback((command: string) => {
    webViewRef.current?.postMessage(JSON.stringify({ command }));
  }, []);

  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const msg = JSON.parse(event.nativeEvent.data);
        if (msg.type === 'statechange' && onStateChange) {
          const states = ['STOPPED', 'PLAYING', 'PAUSED', 'STEP'];
          onStateChange(states[msg.data.readyState] ?? 'UNKNOWN');
        }
        if (msg.type === 'error' && onError) {
          onError(JSON.stringify(msg.data));
        }
      } catch (_) {}
    },
    [onStateChange, onError],
  );

  const html = buildUmpHtml(device);
  const proxyUrl = `${device.https ? 'https' : 'http'}://${device.hostname}:${device.port}`;

  return (
    <View style={[styles.container, width ? { width } : undefined, height ? { height } : undefined]}>
      <WebView
        ref={webViewRef}
        source={{ html, baseUrl: proxyUrl }}
        originWhitelist={['*']}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode="always"
        onMessage={onMessage}
        style={styles.webview}
        renderLoading={() => (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
});

export default UmpPlayerWebView;
