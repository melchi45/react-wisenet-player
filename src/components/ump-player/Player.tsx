import React, { useState, useEffect } from 'react';
// import { Line } from 'react-chartjs-2';
// import Chart from 'chart.js/auto';
// import { StreamingPlugin, RealTimeScale } from 'chartjs-plugin-streaming';

// import { appendScript } from '../common/appendScript';
// import { removeScript } from '../common/removeScript';
// import { importScript } from '../common/importScript';

// import { importScript } from 'components/common/importScripts';
// import log4javascript

// const log4javascript = require('log4javascript');

// window.log = window.log4javascript = log4javascript;
import { PlayerProps, UmpPlayState, Statistics, RTPStatistics, FPSStatistics, StatisticsType } from './Constant/Constant';

import './Logger';

import CryptoJS from 'crypto-js';
window.CryptoJS = CryptoJS;

import {
  Matrix,
  PRECISION,
  Vector
} from "sylvester-es6";
import '@melchi45/ump-player';
import { UmpPlayer } from '@melchi45/ump-player';
import './styles/Player.scss';

window.Matrix = Matrix;

import { RestClientConfig } from './sunapi/RestClientConfig';
import { UmpPlayState } from './Constant/Constant';

import { SunapiManager } from './sunapi/SunapiManager';
import { SunapiException } from './Exception/SunapiException';
import { AccountService } from './sunapi/AccountService';
import { AttributeService } from './sunapi/AttributeService';

// import { PasswordInput } from '../Controller/Input/PasswordInput';
// import { UsernameInput } from '../Controller/Input/UsernameInput';
import { LoginDialog } from '../Controller/Dialog/LoginDialog';
import { NavigationBar } from '../Controller/play/NavigationBar';

import { Controller } from '../Controller/play/Controller';

import { PlayerException } from './Exception/PlayerException';

const RESTCLIENT_CONFIG = RestClientConfig;
// const styles = (theme) => ({ hidden: { display: 'none' } });

export const Player: React.FC<PlayerProps> = (props: PlayerProps) => {
  const [umpClassName] = useState('ump-player');
  const [sunapi, useSunapi] = useState(true);
  // const [element, setElement] = useState<UmpPlayer>();
  // const [umpPlayer, setUmpPlayer] = useState<UmpPlayer>(() => {
  //   return document.createElement('ump-player');
  // });
  const umpPlayerRef = React.useRef<HTMLElement | null>();
  const [playState, setPlayState] = useState(UmpPlayState.STOPPED);

  const onError = (event: any) => {
    console.log('onError: ' + JSON.stringify(event.detail));

    switch (window.toHex(event.detail.error)) {
      case '0x0000':
        console.log('play started');
        break;
      case '0x0001':
        console.log('play stopped');
        break;
      case '0x0203':
        console.log('try reconnect');
        break;
      default:
        break;
    }
  };

  const onMeta = (event: any) => {
    console.log('onMeta: ' + event);
  };

  const onClose = (event: any) => {
    console.log('onClose: ' + event);
  };

  const onResize = (event: any) => {
    console.log('onResize: ' + event);
    if (umpPlayerRef.current) {
      umpPlayerRef.current.video.style.width = '100%';
      umpPlayerRef.current.video.style.height = '100%';
    }
  };

  const onStateChanged = (event: any) => {
    console.log('onStateChanged: ' + JSON.stringify(event));
    setPlayState(event.detail.readyState);

    switch (event.detail.readyState) {
      case UmpPlayState.PLAYING:
        console.log('Playing');
        break;
      case UmpPlayState.STOPPED:
        console.log('Stopped');

        // umpPlayerRef.current.removeEventListener('error', onError);
        // umpPlayerRef.current.removeEventListener('meta', onMeta);
        // umpPlayerRef.current.removeEventListener('close', onClose);
        // umpPlayerRef.current.removeEventListener('resize', onResize);
        // umpPlayerRef.current.removeEventListener('statechange', onStateChanged);
        // umpPlayerRef.current.removeEventListener('timestamp', onTimestamp);
        // umpPlayerRef.current.removeEventListener('capture', onCapture);
        // umpPlayerRef.current.removeEventListener('statistics', onStatistics);
        // umpPlayerRef.current.removeEventListener('backupstatechange', onBackupState);
        // umpPlayerRef.current.removeEventListener('changeplayermode', onPlayerModeChanged);
        // umpPlayerRef.current.removeEventListener('instantplayback', onInstantPlayback);
        // umpPlayerRef.current.removeEventListener('waiting', onWaiting);
        // umpPlayerRef.current.removeEventListener('networkstate', onNetworkState);
        // umpPlayerRef.current.removeEventListener('metaImage', onMetaImage);

        // // add the onchange method from element property
        // umpPlayerRef.current.removeEventListener('changeusername', onUsernameChanged);
        // umpPlayerRef.current.removeEventListener('changedevicetype', onDeviceTypeChanged);
        // umpPlayerRef.current.removeEventListener('changeprofilenumber', onProfileNumberChanged);
        // umpPlayerRef.current.removeEventListener('changeprofile', onProfileNameChanged);
        // umpPlayerRef.current.removeEventListener('changechannel', onChannelNumberChanged);
        // umpPlayerRef.current.removeEventListener('changehostname', onHostnameChanged);
        // umpPlayerRef.current.removeEventListener('changevolume', onVolumeLevelChanged);
        // umpPlayerRef.current.removeEventListener('changeport', onPortNumberChanged);
        // umpPlayerRef.current.removeEventListener('changefullscreen', onFullscreenModeChanged);
        // umpPlayerRef.current.removeEventListener('changesunapiclient', onSunapiClientChanged);
        // umpPlayerRef.current.removeEventListener('changebestshotfilter', onBestshotFileterChanged);
        // umpPlayerRef.current.removeEventListener('changebestshot', onBestshot);
        // umpPlayerRef.current.removeEventListener('stream', onStream);
        // umpPlayerRef.current.removeEventListener('changetimezone', onTimezoneChanged);
        break;
      default:
        break;
    }
  };

  const onTimestamp = (event: any) => {
    // console.log('onTimestamp: ' + event.detail.timestamp);
  };

  const onCapture = (event: any) => {
    console.log('onCapture: ' + event);
  };

  const onStatistics = (event: any) => {
    //   const statisticsTypeEnum = StatisticsType[event.detail.statistics.type];
    //   const statistics: Statistics;

    //   switch (statistics.type) {
    //     case StatisticsType.rtp:
    //       console.log('rtp statistics type.');
    //       const statistics: Statistics = JSON.parse(event.detail.statistics).statistics as FPSStatistics;
    //       break;
    //     case StatisticsType.fps:
    //       console.log('fps statistics type.');
    //       break;
    //     case StatisticsType.network:
    //       console.log('network statistics type.');
    //       break;
    //     default:
    //       console.log('Unknown statistics type.');
    //       break;
    //   }
    // console.log('onStatistics: ' + window.fastJsonStringfy(event.detail));
    //   // if (statistics.type === 'network') {
    //   //   console.log('network data');
    //   //   let bytes = event.detail.statistics.current / 8;
    //   //   // data.datasets[0].data.push({
    //   //   //   x: Date.now(),
    //   //   //   y: bytes / 1000,
    //   //   // });
    //   // }
  };

  const onBackupState = (event: any) => {
    console.log('onBackupState: ' + event.detail);
  };

  const onPlayerModeChanged = (event: any) => {
    console.log('onPlayerModeChanged: ' + event);
  };

  const onInstantPlayback = (event: any) => {
    console.log('onInstantPlayback: ' + event);
  };
  const onWaiting = (event: any) => {
    console.log('onWaiting: ' + event);
  };
  const onNetworkState = (event: any) => {
    console.log('onNetworkState: ' + event);
  };
  const onMetaImage = (event: any) => {
    console.log('onMetaImage: ' + event);
  };
  const onUsernameChanged = (event: any) => {
    console.log('onUsernameChanged: ' + event);
  };
  const onDeviceTypeChanged = (event: any) => {
    console.log('onDeviceTypeChanged: ' + event);
  };
  const onProfileNumberChanged = (event: any) => {
    console.log('onProfileNumberChanged: ' + event);
  };
  const onProfileNameChanged = (event: any) => {
    console.log('onProfileNameChanged: ' + event);
  };
  const onChannelNumberChanged = (event: any) => {
    console.log('onChannelNumberChanged: ' + JSON.stringify(event.detail));
    let player = event.target;
    if (player) {
      if (player.isplay) {
        player.stop();
      }
      player.play();
    }
  };
  const onHostnameChanged = (event: any) => {
    console.log('onHostnameChanged: ' + event);
    let player = event.target;
    if (player) {
      if (player.isplay) {
        player.stop();
      }
      player.play();
    }
  };
  const onVolumeLevelChanged = (event: any) => {
    console.log('onVolumeLevelChanged: ' + event);
  };
  const onPortNumberChanged = (event: any) => {
    console.log('onPortNumberChanged: ' + event);
  };
  const onFullscreenModeChanged = (event: any) => {
    console.log('onFullscreenModeChanged: ' + event);
  };
  const onSunapiClientChanged = (event: any) => {
    console.log('onSunapiClientChanged: ' + event);
  };
  const onBestshotFileterChanged = (event: any) => {
    console.log('onBestshotFileterChanged: ' + event);
  };
  const onBestshot = (event: any) => {
    console.log('onBestshot: ' + event);
  };
  const onStream = (event: any) => {
    console.log('onStream: ' + event);
  };
  const onTimezoneChanged = (event: any) => {
    console.log('onTimezoneChanged: ' + event);
  };
  // onLogin = (event) => {
  //   // AttributeService.setDeviceInfo(element.data);
  // };
  // // the method that will be used for both add and remove event
  const onUnload = (event: any) => {
    if (umpPlayerRef.current && umpPlayerRef.current.isplay) {
      umpPlayerRef.current.stop();
    }

    event.preventDefault();
    event.stopImmediatePropagation();
    event.returnValue = '';
  };

  useEffect(() => {
    // componentDidMount
    console.log('Player Component mounted!');
    window.addEventListener("beforeunload", onUnload);

    umpPlayerRef.current = document.getElementById(props.device.id) as UmpPlayer;
    if (umpPlayerRef.current === null) {
      throw new PlayerException({
        place: 'Player.tsx:useEffect',
        element: props.device.id,
        message: `Player with ID attribute ${props.device.id} not found`
      });
    }
    if (umpPlayerRef.current) {
      umpPlayerRef.current.addEventListener('error', onError);
      umpPlayerRef.current.addEventListener('meta', onMeta);
      umpPlayerRef.current.addEventListener('close', onClose);
      umpPlayerRef.current.addEventListener('resize', onResize);
      umpPlayerRef.current.addEventListener('statechange', onStateChanged);
      umpPlayerRef.current.addEventListener('timestamp', onTimestamp);
      umpPlayerRef.current.addEventListener('capture', onCapture);
      umpPlayerRef.current.addEventListener('statistics', onStatistics);
      umpPlayerRef.current.addEventListener('backupstatechange', onBackupState);
      umpPlayerRef.current.addEventListener('changeplayermode', onPlayerModeChanged);
      umpPlayerRef.current.addEventListener('instantplayback', onInstantPlayback);
      umpPlayerRef.current.addEventListener('waiting', onWaiting);
      umpPlayerRef.current.addEventListener('networkstate', onNetworkState);
      umpPlayerRef.current.addEventListener('networkstate', onNetworkState);
      umpPlayerRef.current.addEventListener('metaImage', onMetaImage);

      // add the onchange method from element property
      umpPlayerRef.current.addEventListener('changeusername', onUsernameChanged);
      umpPlayerRef.current.addEventListener('changedevicetype', onDeviceTypeChanged);
      umpPlayerRef.current.addEventListener('changeprofilenumber', onProfileNumberChanged);
      umpPlayerRef.current.addEventListener('changeprofile', onProfileNameChanged);
      umpPlayerRef.current.addEventListener('changechannel', onChannelNumberChanged);
      umpPlayerRef.current.addEventListener('changehostname', onHostnameChanged);
      umpPlayerRef.current.addEventListener('changevolume', onVolumeLevelChanged);
      umpPlayerRef.current.addEventListener('changeport', onPortNumberChanged);
      umpPlayerRef.current.addEventListener('changefullscreen', onFullscreenModeChanged);
      umpPlayerRef.current.addEventListener('changesunapiclient', onSunapiClientChanged);
      umpPlayerRef.current.addEventListener('changebestshotfilter', onBestshotFileterChanged);
      umpPlayerRef.current.addEventListener('changebestshot', onBestshot);
      umpPlayerRef.current.addEventListener('stream', onStream);
      umpPlayerRef.current.addEventListener('changetimezone', onTimezoneChanged);

      // initialize sunapi manager
      // this.sunapiMng = new SunapiManager();

      // if (
      //   typeof this.props.device === 'undefined' ||
      //   this.props.device === null ||
      //   this.props.device === ''
      // ) {
      // }

      // this.props.device.ClientIPAddress = '127.0.0.1';

      // const promise = [];
      // this.sunapiMng
      //   .init(this.props.device)
      //   .then((init) => {
      //     if (init.Initialized) {
      //       this.sunapiMng.login().then((accountInfo) => {
      //         AccountService.setAccount(accountInfo);
      //         this.ump.sunapiClient = this.sunapiMng.getSunapiClient();
      //       });
      //     } else {
      //       // TODO: redirect to login page
      //     }
      //   })
      //   .catch((error) => {
      //     console.error(error);
      //     if (error instanceof SunapiException) {
      //       // var strMessage =
      //       //   '<div><h4>Error Code: ' +
      //       //   toHex(error.errorCode) +
      //       //   '<br>Error: ' +
      //       //   error.message +
      //       //   '</h4></div>';
      //     }
      //   });
      // // this.ump.play();      
    }

    return () => {
      // componentWillUnmount
      console.log('Player Component unmounted!');
      if (umpPlayerRef.current === null) {
        throw new PlayerException({
          place: 'Player.tsx:useEffect',
          element: props.device.id,
          message: `Player with ID attribute ${props.device.id} not found`
        });
      }

      if (umpPlayerRef.current.isplay) {
        umpPlayerRef.current.stop();
      }

      window.removeEventListener("beforeunload", onUnload);
    };
  }, []);

  return (
    <div id={'container-' + props.device.id} className="container">
      <ump-player
        class={`${umpClassName} ${playState !== UmpPlayState.STOPPED ? 'active' : ''}`}
        {...props.device} />
      {/* <ump-player
        class={`${umpClassName} ${playState !== UmpPlayState.STOPPED ? 'active' : ''}`}
        // ref={umpPlayerRef}
        {...props.device}
      /> */}
    </div>
  );
}

export default Player;
