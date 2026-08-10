import { XmlParser } from './XmlParser';
import { AccountService } from './AccountService';
import { SunapiClient } from './SunapiClient';
import { RestClientConfig } from './RestClientConfig';
import { ProfileConfig } from './ProfileConfig';

import { AuthException } from '../Exception/AuthException';
import { AttributeException } from '../Exception/AttributeException';

const fromHex = window.fromHex;

/* global isPhone */
export const AttributeService = function (sunapiClient) {
  'use strict';
  var _version = '0.0.2';
  var isPhone = false;
  var TIMEOUT = 500;
  var RETRY_COUNT = 999;
  var mAttributes = {};
  var readyStatusCallbacks = [];
  var i = 0;
  var restSpecialTypeList = ['tta'];
  var SunapiClient = null;
  var xmlParser = new XmlParser();

  mAttributes.Ready = false;
  mAttributes.GetFail = false;
  mAttributes.CgiSectionReady = false;
  mAttributes.AttributeSectionReady = false;
  mAttributes.DeviceInfoReady = false;
  mAttributes.WebHiddenInfoReady = false;
  mAttributes.EventSourceOptionsReady = false;
  mAttributes.setupProfileInfoReady = false;
  mAttributes.DeviceTypeChange = false;
  mAttributes.CurrentLanguage = 'English';

  mAttributes.DefaultAlarmIndex = 0;
  mAttributes.DefaultPresetNumber = 0;
  mAttributes.DefaultPresetSpeed = 64;
  mAttributes.DefaultDwellTime = 3;

  mAttributes.MaxIPV4Len = 15;
  mAttributes.MaxIPV6Len = 45;
  mAttributes.MaxSequences = 5;
  mAttributes.MaxHours = 24;
  mAttributes.MaxMinutes = 60;

  mAttributes.EnableOptions = [true, false];
  mAttributes.EnableDropdownOptions = [
    {
      text: 'lang_on',
      value: true,
    },
    {
      text: 'lang_off',
      value: false,
    },
  ];
  mAttributes.UseOptions = ['On', 'Off'];
  mAttributes.PTLimitModes = ['PanLimit', 'TiltLimit'];
  mAttributes.BwOptions = ['Mbps', 'Kbps'];
  mAttributes.VideoAnalyticTypes = ['Passing', 'EnterExit', 'AppearDisapper'];
  mAttributes.AlarmoutModes = ['Pulse', 'ActiveInactive'];
  mAttributes.AutoManualOptions = ['Auto', 'Manual'];
  mAttributes.WeekDays = [
    'lang_sun',
    'lang_mon',
    'lang_tue',
    'lang_wed',
    'lang_thu',
    'lang_fri',
    'lang_sat',
  ];
  mAttributes.PTZModeOptions = ['ExternalPTZ', 'DigitalPTZ'];

  mAttributes.sliderEnableColor = 'orange';
  mAttributes.sliderDisableColor = 'grey';

  mAttributes.MAX_RESOL_ONE_MEGA = 1;
  mAttributes.MAX_RESOL_TWO_MEGA = 2;
  mAttributes.MAX_RESOL_THREE_MEGA = 3;
  mAttributes.MAX_RESOL_8_MEGA = 4;
  mAttributes.MAX_RESOL_12_MEGA = 5;

  mAttributes.FriendlyNameCharSet = new RegExp(
    /^[a-zA-Z0-9-\s~!@$_-|{},./?\[\]]*$/
  );
  mAttributes.FriendlyNameCharSetExpanded = new RegExp(
    /^[a-zA-Z0-9-\s~`!@()$^_-|{};,./?\[\]]*$/
  );
  mAttributes.AlphaNumeric = new RegExp(/^[a-zA-Z0-9]*$/);
  mAttributes.AlphaNumericWithHiphen = new RegExp(/^[a-zA-Z0-9-]*$/);
  mAttributes.AlphaNumericWithHiphenSpace = new RegExp(/^[a-zA-Z0-9-\s]*$/);
  mAttributes.AlphaNumericWithSpace = new RegExp(/[^\s:\\,a-zA-Z0-9]/);
  mAttributes.IPv4 = new RegExp(
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  );
  mAttributes.IPv6 = new RegExp(/([A-Fa-f0-9]{1,4}::?){1,7}[A-Fa-f0-9]{1,4}/);
  mAttributes.UpperAlpha = new RegExp(/[A-Z]/);
  mAttributes.LowerAlpha = new RegExp(/[a-z]/);
  mAttributes.OnlyNumber = new RegExp(/\d+/);
  mAttributes.AlphaNumericWithFirstAlpha = new RegExp(/^[a-zA-Z][a-zA-Z0-9]*$/);
  mAttributes.SpecialSymbol = new RegExp(
    /[`~!@#$%^&*()_|+\-=?;:\'",.<>\{\}\[\]\\\/]/
  );
  mAttributes.ConstantSymbol1 = new RegExp(/(\w)\1\1/);
  mAttributes.ConstantSymbol2 = new RegExp(/(\d)\1\1/);
  mAttributes.CannotNumberDashFirst = new RegExp(/^[0-9-]{1}$/);
  mAttributes.OSDCharSet = '^[a-zA-Z0-9-.]*$';
  mAttributes.OSDCharSet2 = '^[a-zA-Z0-9- ]*$';
  mAttributes.OnlyNumStr = '^[0-9]*$';
  mAttributes.AlphaNumericStr = '^[a-zA-Z0-9]*$';
  mAttributes.AlphaNumericDashDotStr = '^[a-zA-Z0-9-_.]*$';
  mAttributes.AlphaNumericDashStr = '^[a-zA-Z0-9-]*$';
  mAttributes.IPv4PatternStr = '^[0-9.]*$';
  mAttributes.IPv6PatternStr = '^[a-fA-F0-9:]*$';
  mAttributes.AddressPatternStr = '^[a-zA-Z0-9\\-:.]*?$';
  mAttributes.SIPAddressPatternStr =
    '^[a-zA-Z0-9~`!@$()^_\\-|\\[\\]{};:,./?=+&]*$';
  mAttributes.ServerNameCharSet = '^[a-zA-Z0-9\\-./_]*?$';
  mAttributes.HostNameCharSet = '^[a-zA-Z0-9~`!@$^()_\\-|{}\\[\\];,./?]*?$';
  mAttributes.SSL802XIDPWSet =
    '^[a-zA-Z0-9`~!@#$%^*()_|+\\-=?.{}\\[\\]/:;&"<>,]*$';
  mAttributes.FriendlyNameCharSetStr = '^[a-zA-Z0-9- ~!@$_\\-|{},./?\\[\\]]*$';
  mAttributes.FriendlyNameCharSetNoSpaceStr =
    '^[a-zA-Z0-9-~!@$_\\-|{},./?\\[\\]]*$';
  mAttributes.FriendlyNameCharSetExpandedStr =
    '^[a-zA-Z0-9~`!@$()^ _\\-|\\[\\]{};,./?]*$';
  mAttributes.FriendlyNameCharSetExpandedStr2 =
    '^[a-zA-Z0-9~*#!%&@$()^_\\-|\\[\\]{};,./?]*$';
  mAttributes.FriendlyNameCharSetExpandedStr3 =
    '^[a-zA-Z0-9~`!@$()^_\\-|\\[\\]{};,./?]*$';
  mAttributes.FriendlyNameCharSetNoNewLineStr =
    '^[a-zA-Z0-9~`!@%&*#<>+=:\'$()^ _\\-|\\[\\]{};,./?"]*$';
  mAttributes.FriendlyNameCharSetSupportedStr =
    '^[\\r\\na-zA-Z0-9~`!@%&*#<>+=:\'$()^ _\\-|\\[\\]{};,./?"]*$';
  // .을 사용해 다국어(한글, 중국어, 러시아, 스페이, etc.) 를 포함한 모든 문자 허용하지만, [^#%&*+=:\"'<> ]로 []내 문자는 입력 제외
  // FriendlyNameCharSetStr와 반대로 FriendlyNameCharSetExpandedMultigulStr 허용하지 않을 문자를 지정하는 방식임.
  // reference from: https://stackoverflow.com/questions/26520367/validate-utf-8-names-with-angularjs-and-ngpattern
  mAttributes.FriendlyNameCharSetExpandedMultigulStr =
    '((^[a-zA-Z0-9-~!`@$^_\\-|()\\[\\]{};,./?]*$)|(^[^#%&*+=:<>\\\\"\'\u00A9\t\r\n ]+$)|(^[^#%&*+=:<>\\\\"\'\u00A9\t\r\n ]*$))';
  mAttributes.URLSet = '^[a-zA-Z0-9\\-.:\\[\\]{}/]*$';
  mAttributes.PasswordCharSet = '^[a-zA-Z0-9~*`!@#$%()^_\\-\\+=|{}\\[\\].?/]*$';
  mAttributes.SnmpComunityCharSet = '^[\\r\\na-zA-Z0-9~*<>+:^_\\-\\[\\],.]*$';
  mAttributes.China = new RegExp(
    /[\u4E00-\u9FFF\u2FF0-\u2FFF\u31C0-\u31EF\u3200-\u9FBF\uF900-\uFAFF]/
  );
  mAttributes.Hangul = new RegExp(/[가-힣]/);
  mAttributes.NotSupportMotionDetectionCommon = false; // 초저가 L-Series 등의 구버전 카메라를 위해 추가된 변수로 default false 이며,
  // Motion detection 의 Common Tab 을 지원하지 않는 경우 true 로 설정

  var parseAttributeSectionByChannel = function (data, inputStr, maxChannel) {
    if (maxChannel === 1) {
      var response = Array(1);
      response[0] = xmlParser.parseAttributeSection(data, inputStr) || false;
      return response;
    } else {
      return xmlParser.parseAttributeSectionByChannel(
        data,
        inputStr,
        maxChannel
      );
    }
  };

  var paserXML = function (obj, target) {
    return paserXML(obj, target);
  };

  var version = function () {
    return _version;
  };

  const getIsSupport = (val) => {
    if (typeof val === 'boolean') {
      return val === true;
    } else if (typeof val === 'number') {
      return val !== 0;
    }
  };

  const notZero = (value) => {
    return value !== 0;
  };

  const range = (start, end) => {
    return Array.apply(null, { length: end - start + 1 }).map(function (
      _,
      index
    ) {
      return start + index;
    });
  };

  const getDeviceInfo = () => {
    var getData = {};
    return new Promise((resolve, reject) => {
      SunapiClient.get(
        '/stw-cgi/system.cgi?msubmenu=deviceinfo&action=view',
        getData,
        function (response) {
          try {
            mAttributes.ModelName = response.data.Model;
            mAttributes.DeviceType = response.data.DeviceType;
            mAttributes.FirmwareVersion = response.data.FirmwareVersion;
            mAttributes.CurrentLanguage = response.data.Language;

            if (typeof response.data.ActualDeviceType !== 'undefined') {
              mAttributes.ActualDeviceType = response.data.ActualDeviceType;
            }

            if (typeof response.data.ISPVersion !== 'undefined') {
              mAttributes.ISPVersion = response.data.ISPVersion;
            }
            if (typeof response.data.PTZISPVersion !== 'undefined') {
              mAttributes.PTZISPVersion = response.data.PTZISPVersion;
            }

            if (typeof response.data.CGIVersion !== 'undefined') {
              mAttributes.CGIVersion = response.data.CGIVersion;
            }

            if (typeof response.data.OpenSSLVersion !== 'undefined') {
              mAttributes.OpenSSLVersion = response.data.OpenSSLVersion;
            }

            if (typeof response.data.TrackingVersion !== 'undefined') {
              mAttributes.TrackingVersion = response.data.TrackingVersion;
            }

            if (typeof response.data.BuildDate !== 'undefined') {
              mAttributes.BuildDate = response.data.BuildDate;
            }

            if (typeof response.data.ONVIFVersion !== 'undefined') {
              mAttributes.ONVIFVersion = response.data.ONVIFVersion;
            }

            if (typeof response.data.OpenSDKVersion !== 'undefined') {
              mAttributes.OpenSDKVersion = response.data.OpenSDKVersion;
            }

            if (typeof response.data.AIModelDetectionVersion !== 'undefined') {
              mAttributes.AIModelDetectionVersion =
                response.data.AIModelDetectionVersion;
            }

            console.log('Device Info Ready');

            //Temp
            var modelName = response.data.Model;
            mAttributes.SupportMinimap = modelName === 'TNB-9000';
            mAttributes.LiteModel = false;
            mAttributes.X_LiteModel = false;
            mAttributes.rectMasking = false;
            try {
              mAttributes.LiteModel = /^(L)/.test(mAttributes.ModelName);
              mAttributes.X_LiteModel = /^(X)..-[L]/g.test(
                mAttributes.ModelName
              );
            } catch (e) {
              console.error(e);
              throw new AttributeException({
                errorCode: fromHex('0x1200'),
                place: 'attributes.js:getDeviceInfo',
                message: 'Attribute parsing error on Model name.',
              });
            }

            mAttributes.DeviceInfoReady = true;
            resolve('getDeviceInfo');
          } catch (error) {
            console.error(error);
            throw new AttributeException({
              errorCode: fromHex('0x1200'),
              place: 'attributes.js:getDeviceInfo',
              message: 'Attribute parsing error.',
            });
          }
        },
        function (error) {
          mAttributes.GetFail = true;
          console.error('Device Info : ', error);
          reject(error);
        },
        '',
        false
      );
    });
  };

  const getWebHiddenInfo = () => {
    return new Promise(function (resolve, reject) {
      return SunapiClient.get(
        '/stw-cgi/system.cgi?msubmenu=webhiddenmenu&action=view',
        {},
        function (response) {
          try {
            if (response && response.data) {
              mAttributes.AIOpenApp = response.data.AIOpenApp;
            }
            mAttributes.WebHiddenInfoReady = true;
            resolve('getWebHiddenInfo');
          } catch (error) {
            console.error(error);
            throw new AttributeException({
              errorCode: fromHex('0x1200'),
              place: 'attributes.js:getWebHiddenInfo',
              message: 'Attribute parsing error.',
            });
          }
        },
        function (error) {
          mAttributes.WebHiddenInfoReady = false;
          console.error('Web Hidden Info:', error);
          reject(error);
        },
        '',
        false
      );
    });
  };

  const getAiVersionInfo = () => {
    return new Promise(function (resolve, reject) {
      return SunapiClient.get(
        '/stw-cgi/system.cgi?msubmenu=aiversioninfo&action=view',
        {},
        function (response) {
          try {
            if (response && response.data) {
              mAttributes.AiVersionInfo = response.data;
            }
            resolve('getAiVersionInfo');
          } catch (error) {
            console.error(error);
            throw new AttributeException({
              errorCode: fromHex('0x1200'),
              place: 'attributes.js:getAiVersionInfo',
              message: 'Attribute parsing error.',
            });
          }
        },
        function (error) {
          console.error('AI Version Info:', error);
          reject(error);
        },
        '',
        false
      );
    });
  };

  const getEventSourceOptions = () => {
    var getData = {};
    return new Promise(function (resolve, reject) {
      return SunapiClient.get(
        '/stw-cgi/eventsources.cgi?msubmenu=sourceoptions&action=view',
        getData,
        function (response) {
          try {
            mAttributes.EventSourceOptions = response.data.EventSources;
            console.log('EventSourceOptions Ready');
            mAttributes.EventSourceOptionsReady = true;
            resolve('getEventSourceOptions');
          } catch (error) {
            console.error(error);
            throw new AttributeException({
              errorCode: fromHex('0x1200'),
              place: 'attributes.js:getEventSourceOptions',
              message: 'Attribute parsing error.',
            });
          }
        },
        function (error) {
          if (mAttributes.DeviceType === 'NWC') {
            if (!(error.Code === 609 || error.Code === 'Not Authorized')) {
              mAttributes.GetFail = true;
              console.log('EventSourceOptions : ', error.message);
            }
          } else {
            mAttributes.EventSourceOptionsReady = false;
          }
          reject(error);
        },
        '',
        false
      );
    });
  };

  const getAttributeSection = () => {
    var getData = {};
    return new Promise(function (resolve, reject) {
      return SunapiClient.get(
        '/stw-cgi/attributes.cgi/attributes',
        getData,
        function (response) {
          try {
            mAttributes.MicomSupport = xmlParser.parseAttributeSection(
              response.data,
              'System/Property/MicomVersion'
            );
            mAttributes.LogServerSupport = xmlParser.parseAttributeSection(
              response.data,
              'System/Support/LogServer'
            );
            mAttributes.ModelType = xmlParser.parseAttributeSection(
              response.data,
              'System/Property/ModelType'
            );
            mAttributes.IsAdminUse = mAttributes.FWUpdateSupport =
              xmlParser.parseAttributeSection(
                response.data,
                'System/Support/FWUpdate'
              );
            mAttributes.ConfigBackupSupport = xmlParser.parseAttributeSection(
              response.data,
              'System/Support/ConfigBackup'
            );
            mAttributes.OneOpenAppPerChannel =
              xmlParser.parseAttributeSection(
                response.data,
                'System/Support/OneOpenAppPerChannel'
              ) || false;
            mAttributes.DASEncryptSupport =
              xmlParser.parseAttributeSection(
                response.data,
                'System/Support/SDCardEncryption'
              ) || false;
            mAttributes.IOBoxConnection =
              xmlParser.parseAttributeSection(
                response.data,
                'System/Support/IOBoxConnection'
              ) || false;
            mAttributes.HybridThermal = !!xmlParser.parseAttributeSection(
              response.data,
              'System/Support/HybridThermal'
            );
            mAttributes.IsAndroid =
              xmlParser.parseAttributeSection(
                response.data,
                'System/Support/APNCCamera'
              ) || false;
            mAttributes.DynamicEventRule =
              xmlParser.parseAttributeSection(
                response.data,
                'Eventsource/Support/DynamicRule'
              ) || false;
            mAttributes.MaxDynamicRule = xmlParser.parseAttributeSection(
              response.data,
              'Eventsource/Limit/MaxDynamicRule'
            );
            mAttributes.MaxChannel = xmlParser.parseAttributeSection(
              response.data,
              'System/Limit/MaxChannel'
            );
            mAttributes.MaxHDMIOut = xmlParser.parseAttributeSection(
              response.data,
              'System/Limit/MaxHDMIOut'
            );
            mAttributes.DeviceTypeChange = xmlParser.parseAttributeSection(
              response.data,
              'System/Support/DeviceTypeChange'
            );
            mAttributes.SupportChannelExpansionFeature =
              xmlParser.parseAttributeSection(
                response.data,
                'System/Support/SupportChannelExpansionFeature'
              );
            mAttributes.VirtualCropChannel = xmlParser.parseAttributeSection(
              response.data,
              'System/Support/VirtualCropChannel'
            );
            mAttributes.WiFiSupport = xmlParser.parseAttributeSection(
              response.data,
              'Network/Support/WiFi'
            );
            mAttributes.BLESupport = xmlParser.parseAttributeSection(
              response.data,
              'Network/Support/BLE'
            );
            mAttributes.TUTKSupport = xmlParser.parseAttributeSection(
              response.data,
              'Network/Support/TUTK'
            );
            mAttributes.ChannelExpansionLimit = xmlParser.parseAttributeSection(
              response.data,
              'System/Limit/ChannelExpansionLimit'
            );
            mAttributes.MTUSupport = xmlParser.parseAttributeSection(
              response.data,
              'Network/Support/MTUSize'
            );
            mAttributes.PoESupport = xmlParser.parseAttributeSection(
              response.data,
              'Network/Support/POEExtender'
            );
            mAttributes.SIPSupport =
              xmlParser.parseAttributeSection(
                response.data,
                'Network/Support/SIP'
              ) || false;
            if (mAttributes.SIPSupport) {
              mAttributes.MaxSIPAccountCount = xmlParser.parseAttributeSection(
                response.data,
                'Network/Limit/MaxSIPAccountCount'
              );
              mAttributes.MaxRecipientCount = xmlParser.parseAttributeSection(
                response.data,
                'Network/Limit/MaxRecipientCount'
              );
              mAttributes.MaxRecipientInGroup = xmlParser.parseAttributeSection(
                response.data,
                'Network/Limit/MaxRecipientInGroup'
              );
            }
            mAttributes.TamperingDetectionSupportByChannel =
              parseAttributeSectionByChannel(
                response.data,
                'Eventsource/Support/TamperingDetection',
                mAttributes.MaxChannel
              );
            mAttributes.TamperingDetectionSupport =
              mAttributes.TamperingDetectionSupportByChannel.some(getIsSupport);
            mAttributes.FaceDetectionSupportByChannel =
              parseAttributeSectionByChannel(
                response.data,
                'Eventsource/Support/FaceDetection',
                mAttributes.MaxChannel
              );
            mAttributes.FaceDetectionSupport =
              mAttributes.FaceDetectionSupportByChannel.some(getIsSupport);
            mAttributes.HeadDetectionSupportByChannel =
              parseAttributeSectionByChannel(
                response.data,
                'Eventsource/Support/HeadDetection',
                mAttributes.MaxChannel
              );
            mAttributes.HeadDetectionSupport =
              mAttributes.HeadDetectionSupportByChannel.some(getIsSupport);
            mAttributes.DynamicAreaOptionsByChannel =
              parseAttributeSectionByChannel(
                response.data,
                'Eventsource/Support/DynamicArea',
                mAttributes.MaxChannel
              );
            mAttributes.AudioDetectionByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Eventsource/Support/AudioDetection',
                mAttributes.MaxChannel
              );
            mAttributes.AudioDetection =
              mAttributes.AudioDetectionByChannel.some(getIsSupport) ||
              xmlParser.parseAttributeSection(
                response.data,
                'Eventsource/Support/AudioDetection'
              );
            mAttributes.AudioAnalysisByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Eventsource/Support/AudioAnalysis',
                mAttributes.MaxChannel
              );
            mAttributes.AudioAnalysis =
              mAttributes.AudioAnalysisByChannel.some(getIsSupport) ||
              xmlParser.parseAttributeSection(
                response.data,
                'Eventsource/Support/AudioAnalysis'
              );
            mAttributes.NetworkDisconnect = xmlParser.parseAttributeSection(
              response.data,
              'Eventsource/Support/NetworkDisconnect'
            );
            mAttributes.VideoLoss = xmlParser.parseAttributeSection(
              response.data,
              'Eventsource/Support/VideoLoss'
            );
            mAttributes.OpenSDKSupport = xmlParser.parseAttributeSection(
              response.data,
              'Eventsource/Support/OpenSDK'
            );
            mAttributes.ShockDetectionSupportByChannel =
              parseAttributeSectionByChannel(
                response.data,
                'Eventsource/Support/ShockDetection',
                mAttributes.MaxChannel
              );
            mAttributes.ShockDetectionSupport =
              mAttributes.ShockDetectionSupportByChannel.some(getIsSupport);
            mAttributes.ParkingDetectionSupportByChannel =
              parseAttributeSectionByChannel(
                response.data,
                'Eventsource/Support/ParkingDetection',
                mAttributes.MaxChannel
              );
            mAttributes.ParkingDetectionSupport =
              mAttributes.ParkingDetectionSupportByChannel.some(getIsSupport);
            mAttributes.DarknessDetectionByChannel =
              parseAttributeSectionByChannel(
                response.data,
                'Eventsource/Support/TamperingDetection.DarknessDetection',
                mAttributes.MaxChannel
              );
            mAttributes.BoxTemperatureDetectionSupportByChannel =
              parseAttributeSectionByChannel(
                response.data,
                'Eventsource/Support/BoxTemperatureDetection',
                mAttributes.MaxChannel
              );
            mAttributes.BoxTemperatureDetection =
              mAttributes.BoxTemperatureDetectionSupportByChannel.some(
                getIsSupport
              );
            mAttributes.TemperatureChangeDetectionSupportByChannel =
              parseAttributeSectionByChannel(
                response.data,
                'Eventsource/Support/TemperatureChangeDetection',
                mAttributes.MaxChannel
              );
            mAttributes.TemperatureChangeDetectionSupport =
              mAttributes.TemperatureChangeDetectionSupportByChannel.some(
                getIsSupport
              ) ||
              xmlParser.parseAttributeSection(
                response.data,
                'Eventsource/Support/TemperatureChangeDetection'
              );
            mAttributes.OpenSDKMaxApps = xmlParser.parseAttributeSection(
              response.data,
              'System/Limit/OpenSDK.MaxApps'
            );
            mAttributes.DefocusDetectionSupportByChannel =
              parseAttributeSectionByChannel(
                response.data,
                'Eventsource/Support/DefocusDetection',
                mAttributes.MaxChannel
              );
            mAttributes.DefocusDetectionSupport =
              mAttributes.DefocusDetectionSupportByChannel.some(getIsSupport);
            mAttributes.FogDetectionSupportByChannel =
              parseAttributeSectionByChannel(
                response.data,
                'Eventsource/Support/FogDetection',
                mAttributes.MaxChannel
              );
            mAttributes.FogDetectionSupport =
              mAttributes.FogDetectionSupportByChannel.some(getIsSupport);
            mAttributes.MaxROI = xmlParser.parseAttributeSection(
              response.data,
              'Eventsource/Limit/MaxROI'
            );
            mAttributes.MaxROICoordinateX = xmlParser.parseAttributeSection(
              response.data,
              'Eventsource/Limit/ROICoordinate.MaxX'
            );
            mAttributes.MaxROICoordinateY = xmlParser.parseAttributeSection(
              response.data,
              'Eventsource/Limit/ROICoordinate.MaxY'
            );
            mAttributes.MaxROICoordinateXbyChannel =
              parseAttributeSectionByChannel(
                response.data,
                'Eventsource/Limit/ROICoordinate.MaxX',
                mAttributes.MaxChannel
              );
            mAttributes.MaxROICoordinateYbyChannel =
              parseAttributeSectionByChannel(
                response.data,
                'Eventsource/Limit/ROICoordinate.MaxY',
                mAttributes.MaxChannel
              );
            mAttributes.MaxROIInclude = parseAttributeSectionByChannel(
              response.data,
              'Eventsource/Limit/MaxROI.Include',
              mAttributes.MaxChannel
            );
            mAttributes.MaxROIExclude = parseAttributeSectionByChannel(
              response.data,
              'Eventsource/Limit/MaxROI.Include',
              mAttributes.MaxChannel
            );
            mAttributes.MaxTemperatureChangeDetectionArea =
              xmlParser.parseAttributeSection(
                response.data,
                'Eventsource/Limit/MaxTemperatureChangeDetectionArea'
              );
            mAttributes.MaxIVRule = xmlParser.parseAttributeSection(
              response.data,
              'Eventsource/Limit/MaxIVRule'
            );
            mAttributes.MaxParkingAreabyChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Eventsource/Limit/MaxParkingArea',
                mAttributes.MaxChannel
              );
            mAttributes.MaxExcludeParkingAreabyChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Eventsource/Limit/MaxExcludeParkingArea',
                mAttributes.MaxChannel
              );
            mAttributes.IVRuleSupportByChannel = parseAttributeSectionByChannel(
              response.data,
              'Eventsource/Support/IVRule',
              mAttributes.MaxChannel
            );
            mAttributes.IVRuleSupport =
              mAttributes.IVRuleSupportByChannel.some(getIsSupport);
            mAttributes.objectDetectionSupportByChannel =
              parseAttributeSectionByChannel(
                response.data,
                'Eventsource/Support/ObjectDetection',
                mAttributes.MaxChannel
              );
            mAttributes.objectDetectionSupport =
              mAttributes.objectDetectionSupportByChannel.some(getIsSupport);
            mAttributes.maskDetectionSupportByChannel =
              parseAttributeSectionByChannel(
                response.data,
                'Eventsource/Support/MaskDetection',
                mAttributes.MaxChannel
              );
            mAttributes.maskDetectionSupport =
              mAttributes.maskDetectionSupportByChannel.some(getIsSupport);
            mAttributes.socialDistancingSupportByChannel =
              parseAttributeSectionByChannel(
                response.data,
                'Eventsource/Support/SocialDistancingViolation',
                mAttributes.MaxChannel
              );
            mAttributes.socialDistancingSupport =
              mAttributes.socialDistancingSupportByChannel.some(getIsSupport);
            mAttributes.MaxIVRuleLine = parseAttributeSectionByChannel(
              response.data,
              'Eventsource/Limit/MaxIVRule.Line',
              mAttributes.MaxChannel
            );
            mAttributes.MaxIVRuleArea = parseAttributeSectionByChannel(
              response.data,
              'Eventsource/Limit/MaxIVRule.Area.Include',
              mAttributes.MaxChannel
            );
            mAttributes.MaxFaceDetectionArea = xmlParser.parseAttributeSection(
              response.data,
              'Eventsource/Limit/MaxFaceDetectionArea'
            );
            mAttributes.VAPassing = xmlParser.parseAttributeSection(
              response.data,
              'Eventsource/Support/VA.Passing'
            );
            mAttributes.VAEnter = xmlParser.parseAttributeSection(
              response.data,
              'Eventsource/Support/VA.Enter'
            );
            mAttributes.VAExit = xmlParser.parseAttributeSection(
              response.data,
              'Eventsource/Support/VA.Exit'
            );
            mAttributes.VAAppear = xmlParser.parseAttributeSection(
              response.data,
              'Eventsource/Support/VA.Appear'
            );
            mAttributes.VADisappear = xmlParser.parseAttributeSection(
              response.data,
              'Eventsource/Support/VA.Disappear'
            );
            mAttributes.MotionDetectionSupportByChannel =
              parseAttributeSectionByChannel(
                response.data,
                'Eventsource/Support/VA.MotionDetection',
                mAttributes.MaxChannel
              );
            mAttributes.MotionDetectionSupport =
              mAttributes.MotionDetectionSupportByChannel.some(getIsSupport);
            if (
              mAttributes.VAPassing === true ||
              mAttributes.VAEnter === true ||
              mAttributes.VAExit === true ||
              mAttributes.VAAppear === true ||
              mAttributes.VADisappear === true
            ) {
              mAttributes.VideoAnalyticsSupport = true;
            } else {
              mAttributes.VideoAnalyticsSupport = false;
            }
            mAttributes.MotionDetectionOverlay =
              xmlParser.parseAttributeSection(
                response.data,
                'Eventsource/Support/VA.MotionDetection.Overlay'
              );
            mAttributes.AdjustMDIVRuleOnFlipMirror =
              xmlParser.parseAttributeSection(
                response.data,
                'Eventsource/Support/AdjustMDIVRuleOnFlipMirror'
              );
            mAttributes.AdjustMDIVRuleOnFlipMirrorByChannel =
              parseAttributeSectionByChannel(
                response.data,
                'Eventsource/Support/AdjustMDIVRuleOnFlipMirror'
              );
            mAttributes.ROIType = xmlParser.parseAttributeSection(
              response.data,
              'Eventsource/Support/ROIType'
            );
            mAttributes.MaxAlarmInput = xmlParser.parseAttributeSection(
              response.data,
              'Eventsource/Limit/MaxAlarmInput'
            );
            mAttributes.MaxAlarmInputOriginal = mAttributes.MaxAlarmInput;
            mAttributes.MaxTrackingArea = xmlParser.parseAttributeSection(
              response.data,
              'Eventsource/Limit/MaxTrackingArea'
            );

            mAttributes.MaxConfigurableIO = xmlParser.parseAttributeSection(
              response.data,
              'IO/Limit/MaxConfigurableIO'
            );
            mAttributes.MaxAlarmOutput = xmlParser.parseAttributeSection(
              response.data,
              'IO/Limit/MaxAlarmOutput'
            );
            mAttributes.RS485Support = xmlParser.parseAttributeSection(
              response.data,
              'IO/Support/RS485'
            );
            mAttributes.RS422Support = xmlParser.parseAttributeSection(
              response.data,
              'IO/Support/RS422'
            );
            mAttributes.ConfigurableIO = xmlParser.parseAttributeSection(
              response.data,
              'IO/Support/ConfigurableIO'
            );
            mAttributes.PowerRelayIndices = xmlParser.parseAttributeSection(
              response.data,
              'IO/Support/PowerRelayIndices'
            );

            mAttributes.MaxUser = xmlParser.parseAttributeSection(
              response.data,
              'Security/Limit/MaxUser'
            );

            mAttributes.AdminIDChange = xmlParser.parseAttributeSection(
              response.data,
              'Security/Support/AdminIDChangeable'
            );
            mAttributes.AdminAccess = xmlParser.parseAttributeSection(
              response.data,
              'Security/Support/AdminAccess'
            );
            mAttributes.ClientCertificateAuthentication =
              xmlParser.parseAttributeSection(
                response.data,
                'Security/Support/ClientCertificateAuthentication'
              );
            mAttributes.CurrentPasswordVerification =
              xmlParser.parseAttributeSection(
                response.data,
                'Security/Support/CurrentPasswordVerification'
              );

            mAttributes.MaxSelfSignedCertificates =
              xmlParser.parseAttributeSection(
                response.data,
                'Security/Limit/MaxSelfSignedCertificates'
              );
            mAttributes.MaxAdminFilterNumber = xmlParser.parseAttributeSection(
              response.data,
              'Security/Limit/MaxAdminFilterNumber'
            );
            mAttributes.GlobalAudioDetection = xmlParser.parseAttributeSection(
              response.data,
              'Eventsource/Support/GlobalAudioDetection'
            );
            mAttributes.GlobalAudioAnalysis = xmlParser.parseAttributeSection(
              response.data,
              'Eventsource/Support/GlobalAudioAnalysis'
            );

            mAttributes.MaxAudioInputCount = xmlParser.parseAttributeSection(
              response.data,
              'Media/Limit/MaxAudioInput'
            );
            mAttributes.SupportAudioInputByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Media/Limit/MaxAudioInput',
                mAttributes.MaxChannel
              );
            mAttributes.SupportAudioInput =
              mAttributes.SupportAudioInputByChannel.some(getIsSupport);
            mAttributes.MaxAudioInput =
              mAttributes.SupportAudioInputByChannel.filter(function (value) {
                return value === 1;
              }).length;

            mAttributes.SupportAudioOutputByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Media/Support/DeviceAudioOutput',
                mAttributes.MaxChannel
              );
            mAttributes.SupportAudioOutput =
              mAttributes.SupportAudioOutputByChannel.some(getIsSupport);
            mAttributes.MaxAudioOutput =
              mAttributes.SupportAudioOutputByChannel.filter(function (value) {
                return value;
              }).length;

            mAttributes.MaxProfile = xmlParser.parseAttributeSection(
              response.data,
              'Media/Limit/MaxProfile'
            );
            // mAttributes.CropSupport = xmlParser.parseAttributeSection(response.data, 'Media/Support/Crop');
            mAttributes.CropSupportByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Media/Support/Crop',
                mAttributes.MaxChannel
              );
            mAttributes.CropSupport =
              mAttributes.CropSupportByChannel.some(getIsSupport);
            mAttributes.VideoOutSupportByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Media/Support/VideoOut',
                mAttributes.MaxChannel
              );
            mAttributes.VideoOutSupport =
              mAttributes.VideoOutSupportByChannel.some(getIsSupport);
            mAttributes.FlexibleCropEncoding = xmlParser.parseAttributeSection(
              response.data,
              'Media/Support/FlexibleCropEncoding'
            );
            mAttributes.MaxResolution = xmlParser.parseAttributeSection(
              response.data,
              'Media/Limit/MaxResolution'
            );
            if (typeof mAttributes.MaxResolution !== 'undefined') {
              mAttributes.MaxResolution = mAttributes.MaxResolution[0];
            }
            mAttributes.MaxResolutionByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Media/Limit/MaxResolution',
                mAttributes.MaxChannel
              );

            // 2018.07.09. DSKIM: 와이즈스트림 설정 채널 분기
            mAttributes.WiseStreamSupportByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Media/Support/WiseStream'
              );
            if (
              typeof mAttributes.WiseStreamSupportByChannel !== 'undefined' &&
              mAttributes.WiseStreamSupportByChannel.constructor === Array
            ) {
              mAttributes.WiseStreamSupport =
                mAttributes.WiseStreamSupportByChannel.some(getIsSupport);
            }
            mAttributes.WiseCodecSupport = xmlParser.parseAttributeSection(
              response.data,
              'Media/Support/WiseCodec'
            );
            mAttributes.DynamicGOVSupportByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Media/Support/DynamicGOV'
              );
            mAttributes.DynamicGOVSupport =
              mAttributes.DynamicGOVSupportByChannel.some(getIsSupport);
            // mAttributes.DynamicGOVSupport = xmlParser.parseAttributeSection(response.data, 'Media/Support/DynamicGOV');
            mAttributes.DynamicFPSSupportByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Media/Support/DynamicFPS',
                mAttributes.MaxChannel
              );
            mAttributes.DynamicFPSSupport =
              mAttributes.DynamicFPSSupportByChannel.some(getIsSupport);
            mAttributes.FixedProfileCodecChange =
              xmlParser.parseAttributeSection(
                response.data,
                'Media/Support/FixedProfileCodecChange'
              );
            mAttributes.GlobalSensorModeSupport =
              xmlParser.parseAttributeSection(
                response.data,
                'Media/Support/GlobalSensorMode'
              );
            mAttributes.SensorCaptureModeSupportByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Media/Support/SensorCaptureMode',
                mAttributes.MaxChannel
              );

            mAttributes.MetashareSupport = xmlParser.parseAttributeSection(
              response.data,
              'Media/Support/MetadataShare'
            );

            mAttributes.MaxIPv4Filter = xmlParser.parseAttributeSection(
              response.data,
              'Network/Limit/MaxIPv4Filter'
            );
            mAttributes.MaxIPv6Filter = xmlParser.parseAttributeSection(
              response.data,
              'Network/Limit/MaxIPv6Filter'
            );
            mAttributes.MaxIPv4QoS = xmlParser.parseAttributeSection(
              response.data,
              'Network/Limit/MaxIPv4QoS'
            );
            mAttributes.MaxIPv6QoS = xmlParser.parseAttributeSection(
              response.data,
              'Network/Limit/MaxIPv6QoS'
            );
            mAttributes.CamSpecialModel = false; //Need for S1 model kept for future reference.

            mAttributes.SMTPSupport = xmlParser.parseAttributeSection(
              response.data,
              'Transfer/Support/SMTP'
            );
            mAttributes.FTPSupport = xmlParser.parseAttributeSection(
              response.data,
              'Transfer/Support/FTP'
            );

            mAttributes.PrivacyMaskGlobalColorByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Image/Support/Privacy.MaskColor.Global',
                mAttributes.MaxChannel
              );
            mAttributes.PrivacyMaskGlobalColor =
              mAttributes.PrivacyMaskGlobalColorByChannel.some(getIsSupport);
            mAttributes.PrivacyIndexReorderByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Image/Support/PrivacyIndexReorder',
                mAttributes.MaxChannel
              );
            mAttributes.PrivacyIndexReorder =
              mAttributes.PrivacyIndexReorderByChannel.some(getIsSupport);
            mAttributes.SimpleFocusByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Image/Support/SimpleFocus',
                mAttributes.MaxChannel
              );
            mAttributes.SimpleFocus =
              mAttributes.SimpleFocusByChannel.some(getIsSupport);
            mAttributes.IRLedSupportByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Image/Support/IRLED',
                mAttributes.MaxChannel
              );
            mAttributes.IRLedSupport =
              mAttributes.IRLedSupportByChannel.some(getIsSupport);
            mAttributes.MultiImager = xmlParser.parseAttributeSection(
              response.data,
              'Image/Support/MultiImager'
            );
            mAttributes.NormalizedOSDRange =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Image/Support/NormalizedOSDRange',
                mAttributes.MaxChannel
              );
            mAttributes.SupportPIrisByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Image/Support/P-Iris',
                mAttributes.MaxChannel
              );
            mAttributes.ZoomAdjust = xmlParser.parseAttributeSection(
              response.data,
              'Image/Support/ZoomAdjust'
            );
            mAttributes.DISSupportByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Image/Support/DIS',
                mAttributes.MaxChannel
              );
            mAttributes.DISSupport =
              mAttributes.DISSupportByChannel.some(getIsSupport);

            mAttributes.IrisSupport = xmlParser.parseAttributeSectionByChannel(
              response.data,
              'Image/Support/Iris',
              mAttributes.MaxChannel
            );
            mAttributes.IrisFnoSupport =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Image/Support/Iris-Fno',
                mAttributes.MaxChannel
              );
            mAttributes.IrisDCAutoSupport = xmlParser.parseAttributeSection(
              response.data,
              'Image/Support/IrisDCAuto'
            );
            mAttributes.AutoFocusSupportByCh =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Image/Support/AutoFocus',
                mAttributes.MaxChannel
              );
            mAttributes.OSDArrowSupport = xmlParser.parseAttributeSection(
              response.data,
              'Image/Support/OSDArrow'
            );
            mAttributes.LDCIncompatibleSupport =
              xmlParser.parseAttributeSection(
                response.data,
                'Image/Support/PrivacyAndLDCIncompatible'
              );
            mAttributes.EFLensSupport = xmlParser.parseAttributeSection(
              response.data,
              'Image/Support/EFLens'
            );
            mAttributes.FocusPresetSupportByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Image/Support/FocusPreset',
                mAttributes.MaxChannel
              );
            mAttributes.FocusPresetSupport =
              mAttributes.FocusPresetSupportByChannel.some(getIsSupport);
            mAttributes.MaxSmartCodecArea = xmlParser.parseAttributeSection(
              response.data,
              'Image/Limit/MaxSmartCodecArea'
            );
            mAttributes.MaxSmartCodecAreaByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Image/Limit/MaxSmartCodecArea',
                mAttributes.MaxChannel
              );
            // mAttributes.MaxPrivacyMask = xmlParser.parseAttributeSection(response.data, 'Image/Limit/MaxPrivacyMask');
            mAttributes.MaxPrivacyMaskByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Image/Limit/MaxPrivacyMask',
                mAttributes.MaxChannel
              );
            mAttributes.PrivacyMaskRectangle = xmlParser.parseAttributeSection(
              response.data,
              'Image/Limit/MaxPrivacyMask.Rectangle'
            );
            mAttributes.PrivacyMaskRectangleByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Image/Limit/MaxPrivacyMask.Rectangle',
                mAttributes.MaxChannel
              );
            mAttributes.PrivacyMaskPolygon = xmlParser.parseAttributeSection(
              response.data,
              'Image/Limit/MaxPrivacyMask.Polygon'
            );
            mAttributes.PrivacyMaskPolygonByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Image/Limit/MaxPrivacyMask.Polygon',
                mAttributes.MaxChannel
              );
            mAttributes.ZoneBasedIRLEDByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Image/Support/ZoneBasedIRLED',
                mAttributes.MaxChannel
              );
            mAttributes.IRLedSupportByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Image/Support/IRLED',
                mAttributes.MaxChannel
              );
            mAttributes.MaxIRZoneCountInCeilingMode =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Image/Limit/MaxIRZoneCountInCeilingMode'
              );
            mAttributes.MaxIRZoneCountInWallMode =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Image/Limit/MaxIRZoneCountInWallMode'
              );
            mAttributes.MaxIRZoneCount = xmlParser.parseAttributeSection(
              response.data,
              'Image/Limit/MaxIRZoneCount'
            );
            mAttributes.GlobalRotateViewSupport =
              xmlParser.parseAttributeSection(
                response.data,
                'Image/Support/GlobalRotateView'
              );
            mAttributes.GlobalLDCModeSupport = xmlParser.parseAttributeSection(
              response.data,
              'Image/Support/GlobalLDCMode'
            );
            mAttributes.GlobalMaskPatternSupport =
              xmlParser.parseAttributeSection(
                response.data,
                'Image/Support/GlobalMaskPattern'
              );
            mAttributes.GlobalMultiImageOSDSupport =
              xmlParser.parseAttributeSection(
                response.data,
                'Image/Support/GlobalMultiImageOSD'
              );

            mAttributes.LCESupportByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Image/Support/LCE',
                mAttributes.MaxChannel
              );
            mAttributes.LCESupport =
              mAttributes.LCESupportByChannel.some(getIsSupport);

            mAttributes.BackLightSupportByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Image/Support/BackLight',
                mAttributes.MaxChannel
              );
            mAttributes.WhiteBalanceSupportByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Image/Support/WhiteBalance',
                mAttributes.MaxChannel
              );
            mAttributes.DayNightSupportByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Image/Support/DayNight',
                mAttributes.MaxChannel
              );
            mAttributes.ShutterControlSupportByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Image/Support/ShutterControl',
                mAttributes.MaxChannel
              );
            mAttributes.AntiFlickerSupportByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Image/Support/AntiFlicker',
                mAttributes.MaxChannel
              );
            mAttributes.AGCSupportByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Image/Support/AGC',
                mAttributes.MaxChannel
              );

            mAttributes.MaxOSDTitles = xmlParser.parseAttributeSectionByChannel(
              response.data,
              'Image/Limit/MaxOSDTitles'
            );
            mAttributes.MaxFocusPreset =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Image/Limit/MaxFocusPreset',
                mAttributes.MaxFocusPreset
              );

            mAttributes.AbsolutePan = xmlParser.parseAttributeSection(
              response.data,
              'PTZSupport/Support/Absolute.Pan'
            );
            mAttributes.AbsoluteTilt = xmlParser.parseAttributeSection(
              response.data,
              'PTZSupport/Support/Absolute.Tilt'
            );
            mAttributes.AbsoluteZoom = xmlParser.parseAttributeSection(
              response.data,
              'PTZSupport/Support/Absolute.Zoom'
            );
            mAttributes.RealPTZByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'PTZSupport/Support/RealPTZ',
                mAttributes.MaxChannel
              );
            mAttributes.RealPTZ = mAttributes.RealPTZByChannel.some(function (
              support
            ) {
              return support;
            });
            mAttributes.ExternalPTZByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'PTZSupport/Support/ExternalPTZ',
                mAttributes.MaxChannel
              );
            mAttributes.ExternalPTZ =
              mAttributes.ExternalPTZByChannel.some(getIsSupport);
            mAttributes.GlobalPTZMode = xmlParser.parseAttributeSection(
              response.data,
              'PTZSupport/Support/GlobalPTZMode'
            );
            mAttributes.ZoomOnly = xmlParser.parseAttributeSection(
              response.data,
              'PTZSupport/Support/ZoomOnly'
            );
            mAttributes.PanTiltOnly = xmlParser.parseAttributeSection(
              response.data,
              'PTZSupport/Support/PanTiltOnly'
            );
            mAttributes.HomeSupport = xmlParser.parseAttributeSection(
              response.data,
              'PTZSupport/Support/Home'
            );
            mAttributes.PanZeroPositionSupport =
              xmlParser.parseAttributeSection(
                response.data,
                'PTZSupport/Support/PanZeroPosition'
              );
            mAttributes.PTCorrectionSupport = xmlParser.parseAttributeSection(
              response.data,
              'PTZSupport/Support/PTCorrection'
            );

            mAttributes.RecordStreamLimitation =
              xmlParser.parseAttributeSection(
                response.data,
                'Recording/Support/RecordStreamLimitation'
              );
            mAttributes.RecordingByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Recording/Support/Backup',
                mAttributes.MaxChannel
              );
            mAttributes.RecordingSupportByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Recording/Support/Recording',
                mAttributes.MaxChannel
              );
            mAttributes.Recording = mAttributes.RecordingByChannel.some(
              function (support) {
                return support;
              }
            );
            mAttributes.PlaybackSpeed = xmlParser.parseAttributeSection(
              response.data,
              'Recording/Support/PlaybackSpeed'
            );
            mAttributes.QueueManagement = xmlParser.parseAttributeSection(
              response.data,
              'Recording/Support/QueueManagement'
            );
            mAttributes.NAS = xmlParser.parseAttributeSection(
              response.data,
              'Recording/Support/NAS'
            );
            mAttributes.GlobalRecordFileTypeSupport =
              xmlParser.parseAttributeSection(
                response.data,
                'Recording/Support/GlobalRecordFileType'
              );
            // 9000QB에서 default record type codec h.264 로 어트리뷰트 추가됨.
            // 이후 신규에서 default codec정보 반영될 예정
            mAttributes.PreferRecordingCodec = xmlParser.parseAttributeSection(
              response.data,
              'Recording/Limit/PreferRecordingCodec'
            );
            mAttributes.RecordingGOVLengthMultiplierFactor =
              xmlParser.parseAttributeSection(
                response.data,
                'Recording/Limit/RecordingGOVLengthMultiplierFactor'
              );

            mAttributes.AuxCommands = xmlParser.parseAttributeSection(
              response.data,
              'PTZSupport/Support/AuxCommands'
            );
            mAttributes.AuxCommandsbyChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'PTZSupport/Support/AuxCommands',
                mAttributes
              );
            // Support PTZ AI Auto Tracking
            mAttributes.AIAutoTracking = xmlParser.parseAttributeSection(
              response.data,
              'PTZSupport/Support/AIAutoTracking'
            );

            // Attribute by Channel
            mAttributes.isDigitalPTZbyChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'PTZSupport/Support/DigitalPTZ',
                mAttributes.MaxChannel
              );
            mAttributes.isDigitalPTZ =
              mAttributes.isDigitalPTZbyChannel.some(getIsSupport);
            mAttributes.isProfileBasedDigitalPTZByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'PTZSupport/Support/ProfileBasedDigitalPTZ',
                mAttributes.MaxChannel
              );
            mAttributes.isProfileBasedDigitalPTZ =
              mAttributes.isDigitalPTZbyChannel.some(getIsSupport);
            mAttributes.DigitalAutoTrackingByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'PTZSupport/Support/DigitalAutoTracking',
                mAttributes.MaxChannel
              );
            mAttributes.DigitalAutoTracking =
              mAttributes.DigitalAutoTrackingByChannel.some(getIsSupport);
            mAttributes.MaxPresetbyChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'PTZSupport/Limit/MaxPreset',
                mAttributes.MaxChannel
              );
            mAttributes.MaxPreset =
              mAttributes.MaxPresetbyChannel.find(notZero);
            mAttributes.MaxGroupCountbyChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'PTZSupport/Limit/MaxGroupCount',
                mAttributes.MaxChannel
              );
            mAttributes.MaxGroupCount =
              mAttributes.MaxGroupCountbyChannel.find(notZero);
            mAttributes.MaxPresetsPerGroupbyChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'PTZSupport/Limit/MaxPresetCountPerGroup',
                mAttributes.MaxChannel
              );
            mAttributes.MaxPresetsPerGroup =
              mAttributes.MaxPresetsPerGroupbyChannel.find(notZero);

            mAttributes.FisheyeLensbyChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Image/Support/FisheyeLens',
                mAttributes.MaxChannel
              );
            mAttributes.FisheyeLens =
              mAttributes.FisheyeLensbyChannel.some(getIsSupport);
            if (mAttributes.FisheyeLens) {
              UniversialManagerService.setFisheyeLens(mAttributes.FisheyeLens);
              this.$getViewModes();
            }

            mAttributes.AbsolutePanbyChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'PTZSupport/Support/Absolute.Pan',
                mAttributes.MaxChannel
              );
            mAttributes.AbsoluteTiltbyChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'PTZSupport/Support/Absolute.Tilt',
                mAttributes.MaxChannel
              );
            mAttributes.AbsoluteZoombyChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'PTZSupport/Support/Absolute.Zoom',
                mAttributes.MaxChannel
              );
            mAttributes.HomeSupportbyChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'PTZSupport/Support/Home',
                mAttributes.MaxChannel
              );

            mAttributes.PTZSupportbyChannel = [];
            for (i = 0; i < mAttributes.MaxChannel; i++) {
              mAttributes.PTZSupportbyChannel[i] = {};
              if (
                mAttributes.AbsolutePanbyChannel[i] === true &&
                mAttributes.AbsoluteTiltbyChannel[i] === true &&
                mAttributes.AbsoluteZoombyChannel[i] === true &&
                mAttributes.FisheyeLensbyChannel[i] === false &&
                mAttributes.isDigitalPTZbyChannel[i] === false
              ) {
                mAttributes.PTZSupportbyChannel[i].PTZModel = true;
                mAttributes.AbsolutePan = mAttributes.AbsolutePanbyChannel[i];
                mAttributes.AbsoluteTilt = mAttributes.AbsoluteTiltbyChannel[i];
                mAttributes.AbsoluteZoom = mAttributes.AbsoluteZoombyChannel[i];
              } else {
                mAttributes.PTZSupportbyChannel[i].PTZModel = false;
              }
              if (mAttributes.isDigitalPTZbyChannel[i]) {
                mAttributes.isDigitalPTZ = true;
              }
            }

            mAttributes.PTZModel = mAttributes.RealPTZ || false;
            mAttributes.ZoomOnlyModel = mAttributes.ZoomOnly || false;
            mAttributes.ExternalPTZModel = mAttributes.ExternalPTZ || false;
            mAttributes.PanTiltOnlyModel = mAttributes.PanTiltOnly || false;

            if (
              mAttributes.PTZModel ||
              mAttributes.FisheyeLens ||
              mAttributes.ExternalPTZModel ||
              mAttributes.ZoomOnlyModel ||
              mAttributes.PanTiltOnlyModel ||
              mAttributes.isDigitalPTZ
            ) {
              mAttributes.PresetTypes = ['Global', 'Preset'];

              mAttributes.ContinousZoombyChannel =
                xmlParser.parseAttributeSectionByChannel(
                  response.data,
                  'PTZSupport/Support/Continuous.Zoom',
                  mAttributes.MaxChannel
                );
              mAttributes.ContinousTiltbyChannel =
                xmlParser.parseAttributeSectionByChannel(
                  response.data,
                  'PTZSupport/Support/Continuous.Tilt',
                  mAttributes.MaxChannel
                );
              mAttributes.SupportContinousTilt =
                mAttributes.ContinousTiltbyChannel.some(getIsSupport);
              mAttributes.ContinousFocusbyChannel =
                xmlParser.parseAttributeSectionByChannel(
                  response.data,
                  'PTZSupport/Support/Continuous.Focus',
                  mAttributes.MaxChannel
                );
              mAttributes.PresetSupportbyChannel =
                xmlParser.parseAttributeSectionByChannel(
                  response.data,
                  'PTZSupport/Support/Preset',
                  mAttributes.MaxChannel
                );
              mAttributes.SwingSupportbyChannel =
                xmlParser.parseAttributeSectionByChannel(
                  response.data,
                  'PTZSupport/Support/Swing',
                  mAttributes.MaxChannel
                );
              mAttributes.GroupSupportbyChannel =
                xmlParser.parseAttributeSectionByChannel(
                  response.data,
                  'PTZSupport/Support/Group',
                  mAttributes.MaxChannel
                );
              mAttributes.TourSupportbyChannel =
                xmlParser.parseAttributeSectionByChannel(
                  response.data,
                  'PTZSupport/Support/Tour',
                  mAttributes.MaxChannel
                );
              mAttributes.TraceSupportbyChannel =
                xmlParser.parseAttributeSectionByChannel(
                  response.data,
                  'PTZSupport/Support/Trace',
                  mAttributes.MaxChannel
                );
              mAttributes.AutorunSupportbyChannel =
                xmlParser.parseAttributeSectionByChannel(
                  response.data,
                  'PTZSupport/Support/AutoRun',
                  mAttributes.MaxChannel
                );
              mAttributes.DigitalZoomSupportbyChannel =
                xmlParser.parseAttributeSectionByChannel(
                  response.data,
                  'PTZSupport/Support/DigitalZoom',
                  mAttributes.MaxChannel
                );
              mAttributes.TrackingSupportbyChannel =
                xmlParser.parseAttributeSectionByChannel(
                  response.data,
                  'Eventsource/Support/Tracking',
                  mAttributes.MaxChannel
                );
              mAttributes.AreaZoomSupportbyChannel =
                xmlParser.parseAttributeSectionByChannel(
                  response.data,
                  'PTZSupport/Support/AreaZoom',
                  mAttributes.MaxChannel
                );
              mAttributes.MaxTourCountbyChannel =
                xmlParser.parseAttributeSectionByChannel(
                  response.data,
                  'PTZSupport/Limit/MaxTourCount',
                  mAttributes.MaxChannel
                );
              mAttributes.MaxTraceCountbyChannel =
                xmlParser.parseAttributeSectionByChannel(
                  response.data,
                  'PTZSupport/Limit/MaxTraceCount',
                  mAttributes.MaxChannel
                );

              mAttributes.DigitalRTZRotatebyChannel =
                xmlParser.parseAttributeSectionByChannel(
                  response.data,
                  'PTZSupport/Support/DigitalRTZ.Rotate',
                  mAttributes.MaxChannel
                );
              mAttributes.DigitalRTZTiltbyChannel =
                xmlParser.parseAttributeSectionByChannel(
                  response.data,
                  'PTZSupport/Support/DigitalRTZ.Tilt',
                  mAttributes.MaxChannel
                );
              mAttributes.DigitalRTZZoombyChannel =
                xmlParser.parseAttributeSectionByChannel(
                  response.data,
                  'PTZSupport/Support/DigitalRTZ.Zoom',
                  mAttributes.MaxChannel
                );

              mAttributes.isDigitalRTZ =
                mAttributes.DigitalRTZRotatebyChannel.some(getIsSupport);

              mAttributes.RTZSupportbyChannel = [];
              for (i = 0; i < mAttributes.MaxChannel; i++) {
                mAttributes.RTZSupportbyChannel[i] = {};
                if (
                  typeof mAttributes.DigitalRTZRotatebyChannel[i] !==
                    'undefined' &&
                  typeof mAttributes.DigitalRTZTiltbyChannel[i] !==
                    'undefined' &&
                  typeof mAttributes.DigitalRTZZoombyChannel[i] !== 'undefined'
                ) {
                  mAttributes.RTZSupportbyChannel[i].RTZModel = true;
                  mAttributes.RTZSupportbyChannel[i].RTZRotate =
                    mAttributes.DigitalRTZRotatebyChannel[i];
                  mAttributes.RTZSupportbyChannel[i].RTZTile =
                    mAttributes.DigitalRTZTiltbyChannel[i];
                  mAttributes.RTZSupportbyChannel[i].RTZZoom =
                    mAttributes.DigitalRTZZoombyChannel[i];
                } else {
                  mAttributes.RTZSupportbyChannel[i].RTZModel = false;
                }
              }

              mAttributes.ContinousZoom = xmlParser.parseAttributeSection(
                response.data,
                'PTZSupport/Support/Continuous.Zoom'
              );
              mAttributes.ContinousFocus = xmlParser.parseAttributeSection(
                response.data,
                'PTZSupport/Support/Continuous.Focus'
              );
              mAttributes.PresetSupport = xmlParser.parseAttributeSection(
                response.data,
                'PTZSupport/Support/Preset'
              );
              mAttributes.SwingSupport = xmlParser.parseAttributeSection(
                response.data,
                'PTZSupport/Support/Swing'
              );
              mAttributes.GroupSupport =
                mAttributes.GroupSupportbyChannel.some(getIsSupport);
              mAttributes.TourSupport = xmlParser.parseAttributeSection(
                response.data,
                'PTZSupport/Support/Tour'
              );
              mAttributes.TraceSupport = xmlParser.parseAttributeSection(
                response.data,
                'PTZSupport/Support/Trace'
              );
              mAttributes.AutorunSupport = xmlParser.parseAttributeSection(
                response.data,
                'PTZSupport/Support/AutoRun'
              );
              mAttributes.DigitalZoomSupport = xmlParser.parseAttributeSection(
                response.data,
                'PTZSupport/Support/DigitalZoom'
              );
              mAttributes.TrackingSupport = xmlParser.parseAttributeSection(
                response.data,
                'Eventsource/Support/Tracking'
              );
              mAttributes.AreaZoomSupport = xmlParser.parseAttributeSection(
                response.data,
                'PTZSupport/Support/AreaZoom'
              );
              mAttributes.MaxTourCount = xmlParser.parseAttributeSection(
                response.data,
                'PTZSupport/Limit/MaxTourCount'
              );
              mAttributes.MaxTraceCount = xmlParser.parseAttributeSection(
                response.data,
                'PTZSupport/Limit/MaxTraceCount'
              );

              this.setPresetOption();
            } else {
              mAttributes.PresetTypes = ['Global'];
            }

            mAttributes.dayNightSupportbyChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Image/Support/DayNight'
              );
            mAttributes.dayNightSupport =
              mAttributes.dayNightSupportbyChannel.some(getIsSupport);
            mAttributes.thermalModelbyChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Image/Support/ThermalFeatures'
              );
            mAttributes.thermalModel =
              mAttributes.thermalModelbyChannel.some(getIsSupport);

            mAttributes.thermalNUCSupportbyChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Image/Support/ThermalNUC'
              );
            mAttributes.thermalNUCSupport =
              mAttributes.thermalNUCSupportbyChannel.some(getIsSupport);

            // 2018.04.12. DSKIM: Calibration 지원 여부
            mAttributes.HandoverCalibration = xmlParser.parseAttributeSection(
              response.data,
              'Eventrules/Support/HandoverCalibration'
            );
            if (mAttributes.HandoverCalibration === true) {
              mAttributes.MaxHandoverCalibrationPointCountbyChannel =
                xmlParser.parseAttributeSectionByChannel(
                  response.data,
                  'Eventrules/Limit/MaxHandoverCalibrationPointCount',
                  mAttributes.MaxChannel
                );
            }

            // 2018.06.12. DSKIM: Auto Image Alignment 지원 여부
            mAttributes.AutoImageAlignmentSupportByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Image/Support/AutoImageAlignmentSupport'
              );
            if (
              typeof mAttributes.AutoImageAlignmentSupportByChannel !==
                'undefined' &&
              mAttributes.AutoImageAlignmentSupportByChannel.constructor ===
                Array
            ) {
              mAttributes.SupportAutoImageAlignment =
                mAttributes.AutoImageAlignmentSupportByChannel.some(
                  getIsSupport
                );
              mAttributes.panoramicSupport =
                mAttributes.AutoImageAlignmentSupportByChannel.some(
                  getIsSupport
                );
            }

            // 2018.07.18. DSKIM: Camera Setup 지원 채널
            mAttributes.ImageSettingsByChannel =
              xmlParser.parseAttributeSectionByChannel(
                response.data,
                'Image/Support/ImageSettings'
              );
            if (
              typeof mAttributes.ImageSettingsByChannel !== 'undefined' &&
              mAttributes.ImageSettingsByChannel.constructor === Array &&
              typeof mAttributes.ImageSettingsByChannel[0] !== 'undefined'
            ) {
              mAttributes.SupportCameraSetup =
                mAttributes.ImageSettingsByChannel.some(getIsSupport);
            } else {
              mAttributes.SupportCameraSetup =
                typeof mAttributes.imageEQ === 'undefined';
            }

            mAttributes.NotSupportMultiview = false;
            if (mAttributes.MaxChannel > 1) {
              if (
                AccountService.isAdmin() &&
                mAttributes.ImageSettingsByChannel.some(function (val) {
                  return typeof val == 'undefined';
                })
              ) {
                if (mAttributes.MaxResolutionByChannel.length > 0) {
                  var maxSize = 0;
                  var minSize = Number.POSITIVE_INFINITY;
                  mAttributes.MaxResolutionByChannel.forEach(function (val) {
                    var token = val[0].split('x');
                    if (token.length >= 2) {
                      var width = parseInt(token[0], 10) || 0;
                      var height = parseInt(token[1], 10) || 0;
                      var size = width * height;
                      maxSize = Math.max(maxSize, size);
                      minSize = Math.min(minSize, size);
                    }
                  });
                  var size = {
                    '4K': 3840 * 2160,
                    FHD: 1920 * 1080,
                  };
                  if (maxSize >= size['4K'] && minSize <= size['FHD']) {
                    mAttributes.NotSupportMultiview = true;
                  }
                }
              } else if (mAttributes.DeviceType === 'Encoder') {
                mAttributes.NotSupportMultiview = false;
              } else {
                mAttributes.NotSupportMultiview =
                  mAttributes.ImageSettingsByChannel.some(function (val) {
                    return val == false;
                  });
              }
            }

            if (
              typeof mAttributes.VirtualCropChannel !== 'undefined' &&
              mAttributes.VirtualCropChannel
            ) {
              mAttributes.NotSupportMultiview = true;
            }

            console.log('Attributes Section Ready');
            mAttributes.AttributeSectionReady = true;
            resolve('getAttributeSection');
          } catch (error) {
            console.error(error);
            throw new AttributeException({
              errorCode: fromHex('0x1200'),
              place: 'attributes.js:getAttributeSection',
              message: 'Attribute parsing error.',
            });
          }
        },
        function (error) {
          mAttributes.GetFail = true;
          console.log('Attributes Section : ', error);
          reject(error);
        },
        '',
        false
      );
    });
  };

  const getCgiSection = () => {
    mAttributes.systemCgiAttrReady = false;
    mAttributes.mediaCgiAttrReady = false;
    mAttributes.networkCgiAttrReady = false;
    mAttributes.transferCgiAttrReady = false;
    mAttributes.secuirityCgiAttrReady = false;
    mAttributes.eventstatusCgiAttrReady = false;
    mAttributes.ioCgiAttrReady = false;
    mAttributes.eventsourceCgiAttrReady = false;
    mAttributes.recordingCgiAttrReady = false;
    mAttributes.eventrulesCgiAttrReady = false;
    mAttributes.eventactionsCgiAttrReady = false;
    mAttributes.imageCgiAttrReady = false;
    mAttributes.ptzCgiAttrReady = false;
    mAttributes.openSDKCgiAttrReady = false;
    mAttributes.stratocastCgiAttrReady = false;
    mAttributes.VideoCgiAttrReady = false;

    var getData = {};
    return new Promise(function (resolve, reject) {
      return SunapiClient.get(
        '/stw-cgi/attributes.cgi/cgis',
        getData,
        function (response) {
          try {
            mAttributes.cgiSection =
              typeof response.data !== 'undefined' ? response.data : response;
            mAttributes.CgiSectionReady = true;
            console.log('Cgi Section Ready');
            resolve('getCgiSection');
          } catch (error) {
            console.error(error);
            throw new AttributeException({
              errorCode: fromHex('0x1200'),
              place: 'attributes.js:getCgiSection',
              message: 'Attribute parsing error.',
            });
          }
        },
        function (error) {
          mAttributes.GetFail = true;
          console.log('Cgi Section : ', error);
          reject(error);
        },
        '',
        false
      );
    });
  };

  const cameraView = () => {
    var getData = {
      Channel: 0,
    };
    return new Promise(function (resolve, reject) {
      return SunapiClient.get(
        '/stw-cgi/image.cgi?msubmenu=camera&action=view',
        getData,
        function (response) {
          try {
            if (
              typeof response.data.Camera !== 'undefined' &&
              response.data.Camera[0].DayNightMode === 'ExternalBW'
            ) {
              mAttributes.MaxAlarmInput = 0;
              mAttributes.cameraCommandResponse = response.data.Camera[0];
            }
            resolve('cameraView');
          } catch (error) {
            console.log(error);
            throw new AttributeException({
              errorCode: fromHex('0x1200'),
              place: 'attributes.js:cameraView',
              message: 'Attribute parsing error.',
            });
          }
        },
        function (error) {
          console.log('Attributes Section : ', error);
          reject(error);
        },
        '',
        false
      );
    });
  };

  const openAppView = () => {
    var getData = {};
    mAttributes.isInstalledWiseAI = false;
    return new Promise(function (resolve, reject) {
      return SunapiClient.get(
        '/stw-cgi/opensdk.cgi?msubmenu=apps&action=view',
        getData,
        function (response) {
          try {
            var appList = response.data.Apps;

            if (response.data.InstalledApps !== 0) {
              mAttributes.isInstalledWiseAI = appList.some(function (app) {
                return app.AppID.toUpperCase() === 'WISEAI';
              });
            }
            resolve('openAppView');
          } catch (error) {
            console.log(error);
            throw new AttributeException({
              errorCode: fromHex('0x1200'),
              place: 'attributes.js:openAppView',
              message: 'Attribute parsing error.',
            });
          }
        },
        function (error) {
          mAttributes.isInstalledWiseAI = false;
          reject(error);
        },
        '',
        false
      );
    });
  };

  const getSetupProfileInfo = () => {
    var getData = {
      Type: 'DIS_SETTING_PROFILE_NUM',
    };
    var profileIndexBase = 11; // legacy camera base index
    return new Promise(function (resolve, reject) {
      return SunapiClient.get(
        '/stw-cgi/media.cgi?msubmenu=hiddenprofile&action=view',
        getData,
        function (response) {
          try {
            profileIndexBase =
              response.data && response.data.ProfileIndex
                ? response.data.ProfileIndex
                : 33;
            mAttributes.supportHiddenProfile = true;
            mAttributes.setupProfileInfoReady = true;
            // set preview profile for wn7 camera
            Object.keys(ProfileConfig).map(function (key) {
              var item = ProfileConfig[key];
              item.NUM = profileIndexBase + item.index;
              item.NAME = 'profile' + item.NUM;
            });
            resolve('getSetupProfileInfo');
          } catch (error) {
            console.error(error);
            throw new AttributeException({
              errorCode: fromHex('0x1200'),
              place: 'attributes.js:getSetupProfileInfo',
              message: 'Attribute parsing error.',
            });
          }
        },
        function (error) {
          mAttributes.supportHiddenProfile = false;
          console.error('Profile Info : ', error);
          reject(error);
        },
        '',
        false
      );
    });
  };
  const getPTZModeInfo = () => {
    return new Promise(function (resolve, reject) {
      SunapiClient.get(
        '/stw-cgi/ptzconfig.cgi?msubmenu=ptzmode&action=view',
        {},
        function (response) {
          try {
            mAttributes.PTZModeInfoReady = true;
            mAttributes.PTZModeByChannel = Array(mAttributes.maxChannel);
            if (response.data && response.data.PtzMode) {
              response.data.PtzMode.forEach(function (data) {
                mAttributes.PTZModeByChannel[data.Channel] = data.Mode;
              });
            }
            resolve('getPTZModeInfo');
          } catch (error) {
            console.error(error);
            throw new AttributeException({
              errorCode: fromHex('0x1200'),
              place: 'attributes.js:getPTZModeInfo',
              message: 'Attribute parsing error.',
            });
          }
        },
        function (error) {
          mAttributes.PTZModeInfoReady = false;
          console.error('PTZ Info : ', error);
          reject(error);
        },
        '',
        false
      );
    });
  };

  const getCropChannelOptions = () => {
    return new Promise(function (resolve, reject) {
      return SunapiClient.get(
        '/stw-cgi/media.cgi?msubmenu=cropchanneloptions&action=view',
        {},
        function (response) {
          try {
            mAttributes.CropChannelOptions =
              response.data.CropChannelOptions[0].ResolutionSet;
            resolve('getCropChannelOptions');
          } catch (error) {
            console.error(error);
            throw new AttributeException({
              errorCode: fromHex('0x1200'),
              place: 'attributes.js:getCropChannelOptions',
              message: 'Attribute parsing error.',
            });
          }
        },
        function (error) {
          reject(error);
        },
        '',
        false
      );
    });
  };

  function Constructor(sunapiClient) {
    Constructor.prototype.version = version();
    SunapiClient = sunapiClient;
  }

  /**********************************************************/
  Constructor.prototype = {
    getSunapiClient: () => {
      return this._sunapiClient;
    },
    setDefaultAlarmIndex: (newAlarmIndex) => {
      mAttributes.DefaultAlarmIndex = newAlarmIndex;
    },
    setDefaultPresetNumber: (newPreset) => {
      mAttributes.DefaultPresetNumber = newPreset;
    },
    parseSystemCgiAttributes: () => {
      if (!mAttributes.systemCgiAttrReady) {
        mAttributes.Languages = paserXML(
          mAttributes.cgiSection,
          'system/deviceinfo/Language/enum'
        );
        mAttributes.DeviceName = paserXML(
          mAttributes.cgiSection,
          'system/deviceinfo/DeviceName/string'
        );
        mAttributes.DeviceLoc = paserXML(
          mAttributes.cgiSection,
          'system/deviceinfo/DeviceLocation/string'
        );
        mAttributes.DeviceDesc = paserXML(
          mAttributes.cgiSection,
          'system/deviceinfo/DeviceDescription/string'
        );
        mAttributes.Memo = paserXML(
          mAttributes.cgiSection,
          'system/deviceinfo/Memo/string'
        );
        mAttributes.YearOptions = paserXML(
          mAttributes.cgiSection,
          'system/date/Year/int'
        );
        mAttributes.MonthOptions = paserXML(
          mAttributes.cgiSection,
          'system/date/Month/int'
        );
        mAttributes.DayOptions = paserXML(
          mAttributes.cgiSection,
          'system/date/Day/int'
        );
        mAttributes.HourOptions = paserXML(
          mAttributes.cgiSection,
          'system/date/Hour/int'
        );
        mAttributes.MinuteOptions = paserXML(
          mAttributes.cgiSection,
          'system/date/Minute/int'
        );
        mAttributes.SecondOptions = paserXML(
          mAttributes.cgiSection,
          'system/date/Second/int'
        );
        mAttributes.ExcludeSettings = paserXML(
          mAttributes.cgiSection,
          'system/factoryreset/ExcludeSettings/csv'
        );
        mAttributes.FirmwareModule = paserXML(
          mAttributes.cgiSection,
          'system/firmwareupdate/FirmwareModule/enum'
        );
        mAttributes.ambaSpecial =
          typeof mAttributes.FirmwareModule === 'undefined';
        mAttributes.RestoreExclusions = paserXML(
          mAttributes.cgiSection,
          'system/configrestore/ExcludeSettings/csv'
        );
        mAttributes.StorageEnable = paserXML(
          mAttributes.cgiSection,
          'system/storageinfo/Enable/bool'
        );
        mAttributes.FileSystemTypeOptions = paserXML(
          mAttributes.cgiSection,
          'system/storageinfo/Storage.#.FileSystem/enum'
        );
        mAttributes.DefaultFolderMaxLen = paserXML(
          mAttributes.cgiSection,
          'system/storageinfo/DefaultFolder/string'
        );
        mAttributes.NASIPMaxLen = paserXML(
          mAttributes.cgiSection,
          'system/storageinfo/NASIP/string'
        );
        mAttributes.NASUserIDMaxLen = paserXML(
          mAttributes.cgiSection,
          'system/storageinfo/NASUserID/string'
        );
        mAttributes.NASPasswordMaxLen = paserXML(
          mAttributes.cgiSection,
          'system/storageinfo/NASPassword/string'
        );
        mAttributes.DASPasswordMaxLen = paserXML(
          mAttributes.cgiSection,
          'system/storageinfo/DASPassword/string'
        );
        mAttributes.SystemLogTypes = paserXML(
          mAttributes.cgiSection,
          'system/systemlog/Type/enum'
        );
        mAttributes.AccessLogTypes = paserXML(
          mAttributes.cgiSection,
          'system/accesslog/Type/enum'
        );
        mAttributes.EventLogTypes = paserXML(
          mAttributes.cgiSection,
          'system/eventlog/Type/enum'
        );
        mAttributes.EventLogChannel = paserXML(
          mAttributes.cgiSection,
          'system/eventlog/Channel/csv'
        );
        mAttributes.BaudRateOptions = paserXML(
          mAttributes.cgiSection,
          'system/serial/BaudRate/enum'
        );
        mAttributes.ParityBitOptions = paserXML(
          mAttributes.cgiSection,
          'system/serial/ParityBit/enum'
        );
        mAttributes.StopBitOptions = paserXML(
          mAttributes.cgiSection,
          'system/serial/StopBits/enum'
        );
        mAttributes.DataBitOptions = paserXML(
          mAttributes.cgiSection,
          'system/serial/DataBits/enum'
        );
        mAttributes.SerialInterfaceOptions = paserXML(
          mAttributes.cgiSection,
          'system/serial/SerialInterface/enum'
        );
        mAttributes.TerminationSupport = paserXML(
          mAttributes.cgiSection,
          'system/serial/SignalTermination/bool'
        );
        mAttributes.OnvifFocusControlSupport = paserXML(
          mAttributes.cgiSection,
          'system/onviffeature/FocusControl/bool'
        );
        mAttributes.UsbConfigEnable = paserXML(
          mAttributes.cgiSection,
          'system/usbconfig/set/Enable/bool'
        );
        mAttributes.PeerConnectionInfoClientHttpsStatus = paserXML(
          mAttributes.cgiSection,
          'system/peerconnectioninfo/view/Client.#.ClientHttpsStatus/enum'
        );
        mAttributes.systemCgiAttrReady = true;
      }
    },
    parseStoratocastCgiAttribute: () => {
      if (!mAttributes.stratocastCgiAttrReady) {
        mAttributes.StratocastSupport =
          typeof paserXML(
            mAttributes.cgiSection,
            'system/stratocast/set/CameraProbeEnable/bool'
          ) !== 'undefined'
            ? true
            : false;
        mAttributes.StratocastActivationCode =
          typeof paserXML(
            mAttributes.cgiSection,
            'system/stratocastregister/ActivationCode/string'
          ) !== 'undefined'
            ? true
            : false;
        mAttributes.StratocastActivationCode = paserXML(
          mAttributes.cgiSection,
          'system/stratocastregister/set/ActivationCode/string'
        );
        mAttributes.StratocastRegistrationPhase = paserXML(
          mAttributes.cgiSection,
          'system/stratocastregister/check/RegistrationPhase/enum'
        );
        mAttributes.StratocastDetail = paserXML(
          mAttributes.cgiSection,
          'system/stratocastregister/set/Detail/string'
        );
        mAttributes.StratocastServiceURL = paserXML(
          mAttributes.cgiSection,
          'system/stratocast/set/ServiceURL/string'
        );
        mAttributes.StratocastDeviceEntryUrl = paserXML(
          mAttributes.cgiSection,
          'system/stratocast/set/DeviceEntryUrl/string'
        );
        mAttributes.StratocastProbeServiceUrl = paserXML(
          mAttributes.cgiSection,
          'system/stratocast/set/ProbeServiceUrl/string'
        );
        mAttributes.StratocastCameraProbeEnable = paserXML(
          mAttributes.cgiSection,
          'system/stratocast/set/CameraProbeEnable/bool'
        );
        mAttributes.StratocasProbeInterval = paserXML(
          mAttributes.cgiSection,
          'system/stratocast/set/ProbeInterval/int'
        );
        mAttributes.StratocasSimplifiedEnrolmentEnable = paserXML(
          mAttributes.cgiSection,
          'system/stratocast/set/SimplifiedEnrolmentEnable/bool'
        );
        mAttributes.stratocastCgiAttrReady = true;
      }
    },
    parseSIPCgiAttribute: () => {
      if (!mAttributes.SIPCgiAttrReady) {
        mAttributes.SIPAccountStatusType = paserXML(
          mAttributes.cgiSection,
          'network/sipaccount/Accounts.#.Status/enum'
        );
        mAttributes.SIPAccountNameLength = paserXML(
          mAttributes.cgiSection,
          'network/sipaccount/Name/string'
        );
        mAttributes.SIPAccountType = paserXML(
          mAttributes.cgiSection,
          'network/sipaccount/Accounts.#.Type/enum'
        );
        mAttributes.SIPAccountConnectionTypeInUse = paserXML(
          mAttributes.cgiSection,
          'network/sipaccount/Accounts.#.ConnectionTypeInUse/enum'
        );
        mAttributes.SIPAccountUserIDLength = paserXML(
          mAttributes.cgiSection,
          'network/sipaccount/UserID/string'
        );
        mAttributes.SIPAccountAuthenticationIDLength = paserXML(
          mAttributes.cgiSection,
          'network/sipaccount/AuthenticationID/string'
        );
        mAttributes.SIPAccountPasswordLength = paserXML(
          mAttributes.cgiSection,
          'network/sipaccount/Password/string'
        );
        mAttributes.SIPAccountCallerIDLength = paserXML(
          mAttributes.cgiSection,
          'network/sipaccount/CallerID/string'
        );
        mAttributes.SIPAccountDomainNameLength = paserXML(
          mAttributes.cgiSection,
          'network/sipaccount/DomainName/string'
        );
        mAttributes.SIPAccountDomainPortLimit = paserXML(
          mAttributes.cgiSection,
          'network/sipaccount/DomainPort/int'
        );
        mAttributes.SIPAccountRegistrarAddressLength = paserXML(
          mAttributes.cgiSection,
          'network/sipaccount/RegistrarAddress/string'
        );
        mAttributes.SIPAccountRegistrarPortLimit = paserXML(
          mAttributes.cgiSection,
          'network/sipaccount/RegistrarPort/int'
        );
        mAttributes.SIPAccountBackupDomainNameLength = paserXML(
          mAttributes.cgiSection,
          'network/sipaccount/BackupDomainName/string'
        );
        mAttributes.SIPAccountBackupDomainPortLimit = paserXML(
          mAttributes.cgiSection,
          'network/sipaccount/BackupDomainPort/int'
        );
        mAttributes.SIPAccountBackupRegistrarAddressLength = paserXML(
          mAttributes.cgiSection,
          'network/sipaccount/BackupRegistrarAddress/string'
        );
        mAttributes.SIPAccountBackupRegistrarPortLimit = paserXML(
          mAttributes.cgiSection,
          'network/sipaccount/BackupRegistrarPort/int'
        );
        mAttributes.SIPAccountTransportMode = paserXML(
          mAttributes.cgiSection,
          'network/sipaccount/TransportMode/enum'
        );
        mAttributes.SIPCallRequestOptions = paserXML(
          mAttributes.cgiSection,
          'network/siprecipients/CallRequestType/enum'
        );
        mAttributes.SIPRecipientNameLength = paserXML(
          mAttributes.cgiSection,
          'network/siprecipients/Name/string'
        );
        mAttributes.SIPRecipientAddressLength = paserXML(
          mAttributes.cgiSection,
          'network/siprecipients/Address/string'
        );
        mAttributes.SIPRecipientTransportMode = paserXML(
          mAttributes.cgiSection,
          'network/siprecipients/TransportMode/enum'
        );
        mAttributes.SIPRecipientInMultipleMode = paserXML(
          mAttributes.cgiSection,
          'network/siprecipients/RecipientInMultipleMode/enum'
        );
        mAttributes.SIPRecipientGroup = paserXML(
          mAttributes.cgiSection,
          'network/siprecipients/Group/csv'
        );
        mAttributes.SIPCgiAttrReady = true;
      }
    },
    parseMediaCgiAttributes: () => {
      if (!mAttributes.mediaCgiAttrReady) {
        mAttributes.EncodingTypes = paserXML(
          mAttributes.cgiSection,
          'media/videoprofile/EncodingType/enum'
        );
        mAttributes.ProfileName = paserXML(
          mAttributes.cgiSection,
          'media/videoprofile/Name/string'
        );
        mAttributes.ATCModes = paserXML(
          mAttributes.cgiSection,
          'media/videoprofile/ATCMode/enum'
        );
        mAttributes.ATCSensitivityOptions = paserXML(
          mAttributes.cgiSection,
          'media/videoprofile/ATCSensitivity/enum'
        );
        mAttributes.ATCLimit = paserXML(
          mAttributes.cgiSection,
          'media/videoprofile/ATCLimit/enum'
        );
        mAttributes.ATCTrigger = paserXML(
          mAttributes.cgiSection,
          'media/videoprofile/ATCTrigger/enum'
        );
        mAttributes.ATCEventType = paserXML(
          mAttributes.cgiSection,
          'media/videoprofile/ATCEventType/enum'
        );
        mAttributes.FrameRateLimit = paserXML(
          mAttributes.cgiSection,
          'media/videoprofile/FrameRate/int'
        );
        mAttributes.CompressionLevel = paserXML(
          mAttributes.cgiSection,
          'media/videoprofile/CompressionLevel/int'
        );
        mAttributes.Bitrate = paserXML(
          mAttributes.cgiSection,
          'media/videoprofile/Bitrate/int'
        );
        mAttributes.SVNPMulticastPort = paserXML(
          mAttributes.cgiSection,
          'media/videoprofile/SVNPMulticastPort/int'
        );
        mAttributes.SVNPMulticastTTL = paserXML(
          mAttributes.cgiSection,
          'media/videoprofile/SVNPMulticastTTL/int'
        );
        mAttributes.RTPMulticastPort = paserXML(
          mAttributes.cgiSection,
          'media/videoprofile/RTPMulticastPort/int'
        );
        mAttributes.RTPMulticastTTL = paserXML(
          mAttributes.cgiSection,
          'media/videoprofile/RTPMulticastTTL/int'
        );
        mAttributes.FixedFramerateProfile =
          paserXML(
            mAttributes.cgiSection,
            'media/videoprofile/IsFixedFrameRateProfile/bool'
          ) || false;
        mAttributes.SensorCaptureSize = paserXML(
          mAttributes.cgiSection,
          'media/videosource/SensorCaptureSize/enum'
        );
        mAttributes.AudioInSourceOptions = paserXML(
          mAttributes.cgiSection,
          'media/audioinput/Source/enum'
        );
        mAttributes.AudioInEncodingOptions = paserXML(
          mAttributes.cgiSection,
          'media/audioinput/EncodingType/enum'
        );
        mAttributes.AudioInBitrateOptions = paserXML(
          mAttributes.cgiSection,
          'media/audioinput/Bitrate/enum'
        );
        mAttributes.AudioInGainOptions = paserXML(
          mAttributes.cgiSection,
          'media/audioinput/Gain/int'
        );
        mAttributes.AudioInSensitivityOptions = paserXML(
          mAttributes.cgiSection,
          'media/audioinput/Sensitivity/int'
        );
        mAttributes.AudioInNoiseReduction = paserXML(
          mAttributes.cgiSection,
          'media/audioinput/NoiseReduction/bool'
        );
        mAttributes.AudioInNoiseReductionSensitivityOptions = paserXML(
          mAttributes.cgiSection,
          'media/audioinput/NoiseReductionSensitivity/int'
        );
        mAttributes.AudioOutGainOptions = paserXML(
          mAttributes.cgiSection,
          'media/audiooutput/Gain/int'
        );
        mAttributes.VideoTypeOptions = paserXML(
          mAttributes.cgiSection,
          'media/videooutput/Type/enum'
        );
        mAttributes.VideoInputOptions = paserXML(
          mAttributes.cgiSection,
          'media/videoinput/Format/enum'
        );
        mAttributes.VideooutputEnableHide =
          typeof paserXML(
            mAttributes.cgiSection,
            'media/videooutput/Enable/bool'
          ) === 'undefined';
        if (mAttributes.ModelName !== 'TNB-9000') {
          mAttributes.SensorModeOptions = paserXML(
            mAttributes.cgiSection,
            'media/videosource/SensorCaptureFrameRate/enum'
          );
        }
        mAttributes.VideoMode = paserXML(
          mAttributes.cgiSection,
          'media/videosource/VideoMode/enum'
        );
        mAttributes.BitrateControlType = {};
        mAttributes.BitrateControlType.H264 = paserXML(
          mAttributes.cgiSection,
          'media/videoprofile/H264.BitrateControlType/enum'
        );

        mAttributes.PriorityType = {};
        mAttributes.PriorityType.H264 = paserXML(
          mAttributes.cgiSection,
          'media/videoprofile/H264.PriorityType/enum'
        );
        mAttributes.PriorityType.MJPEG = paserXML(
          mAttributes.cgiSection,
          'media/videoprofile/MJPEG.PriorityType/enum'
        );

        mAttributes.EnocoderProfile = {};
        mAttributes.EnocoderProfile.H264 = paserXML(
          mAttributes.cgiSection,
          'media/videoprofile/H264.Profile/enum'
        );

        mAttributes.EntropyCoding = {};
        mAttributes.EntropyCoding.H264 = paserXML(
          mAttributes.cgiSection,
          'media/videoprofile/H264.EntropyCoding/enum'
        );

        mAttributes.SmartCodecEnable = {};
        mAttributes.SmartCodecEnable.H264 = paserXML(
          mAttributes.cgiSection,
          'media/videoprofile/H264.SmartCodecEnable/enum'
        );

        mAttributes.GOVLength = {};
        mAttributes.GOVLength.H264 = paserXML(
          mAttributes.cgiSection,
          'media/videoprofile/H264.GOVLength/int'
        );

        mAttributes.WiseStreamOptions = paserXML(
          mAttributes.cgiSection,
          'media/wisestream/Mode/enum'
        );
        mAttributes.WiseStreamAISupport = paserXML(
          mAttributes.cgiSection,
          'media/wisestream/AISupportEnable/bool'
        );

        mAttributes.DynamicGOV = {};
        mAttributes.DynamicGOV.H264 = paserXML(
          mAttributes.cgiSection,
          'media/videoprofile/H264.DynamicGOVLength/int'
        );
        mAttributes.DynamicFPS = {};
        mAttributes.DynamicFPS.H264 = paserXML(
          mAttributes.cgiSection,
          'media/videoprofile/H264.DynamicFPSEnable/bool'
        );
        mAttributes.MinDynamicFPS = {};
        mAttributes.MinDynamicFPS.H264 = paserXML(
          mAttributes.cgiSection,
          'media/videoprofile/H264.MinDynamicFPS/int'
        );

        mAttributes.Resolution = paserXML(
          mAttributes.cgiSection,
          'media/videoprofile/Resolution/enum'
        );

        if (typeof mAttributes.EncodingTypes !== 'undefined') {
          if (mAttributes.EncodingTypes.indexOf('H265') !== -1) {
            mAttributes.BitrateControlType.H265 = paserXML(
              mAttributes.cgiSection,
              'media/videoprofile/H265.BitrateControlType/enum'
            );
            mAttributes.PriorityType.H265 = paserXML(
              mAttributes.cgiSection,
              'media/videoprofile/H265.PriorityType/enum'
            );
            mAttributes.EnocoderProfile.H265 = paserXML(
              mAttributes.cgiSection,
              'media/videoprofile/H265.Profile/enum'
            );
            mAttributes.EntropyCoding.H265 = paserXML(
              mAttributes.cgiSection,
              'media/videoprofile/H265.EntropyCoding/enum'
            );
            mAttributes.SmartCodecEnable.H265 = paserXML(
              mAttributes.cgiSection,
              'media/videoprofile/H265.SmartCodecEnable/enum'
            );
            mAttributes.GOVLength.H265 = paserXML(
              mAttributes.cgiSection,
              'media/videoprofile/H265.GOVLength/int'
            );
            mAttributes.DynamicGOV.H265 = paserXML(
              mAttributes.cgiSection,
              'media/videoprofile/H265.DynamicGOVLength/int'
            );
            mAttributes.DynamicFPS.H265 = paserXML(
              mAttributes.cgiSection,
              'media/videoprofile/H265.DynamicFPSEnable/bool'
            );
            mAttributes.MinDynamicFPS.H265 = paserXML(
              mAttributes.cgiSection,
              'media/videoprofile/H265.MinDynamicFPS/int'
            );
          }
        }

        mAttributes.viewModeIndex = paserXML(
          mAttributes.cgiSection,
          'media/videoprofile/ViewModeIndex/int'
        );
        mAttributes.profileViewModeType = paserXML(
          mAttributes.cgiSection,
          'media/videoprofile/ViewModeType/enum',
          { parseRequest: true }
        );
        mAttributes.profileBasedDPTZ = paserXML(
          mAttributes.cgiSection,
          'media/videoprofile/IsDigitalPTZProfile/bool'
        );
        if (
          mAttributes.isDigitalPTZbyChannel.length > 1 &&
          typeof mAttributes.profileBasedDPTZ === 'undefined'
        ) {
          mAttributes.channelBasedDPTZ = true;
        }

        mAttributes.sensorCaptureFrameRate = paserXML(
          mAttributes.cgiSection,
          'media/videosource/SensorCaptureFrameRate/enum'
        );
        mAttributes.ViewType = paserXML(
          mAttributes.cgiSection,
          'media/videosource/ViewType/enum'
        );

        mAttributes.imageEQ = paserXML(
          mAttributes.cgiSection,
          'media/eqsettings/Channel/int'
        );
        if (
          mAttributes.DeviceType === 'Encoder' ||
          mAttributes.ActualDeviceType === 'Encoder'
        ) {
          mAttributes.SupportDeviceType = 'Encoder';
        }
        mAttributes.mediaCgiAttrReady = true;
      }
    },
    parseNetworkCgiAttributes: () => {
      if (!mAttributes.networkCgiAttrReady) {
        mAttributes.InterfaceOptions = paserXML(
          mAttributes.cgiSection,
          'network/interface/InterfaceName/csv'
        );
        mAttributes.IPv4TypeOptions = paserXML(
          mAttributes.cgiSection,
          'network/interface/IPv4Type/enum'
        );
        mAttributes.IPv6TypeOptions = paserXML(
          mAttributes.cgiSection,
          'network/interface/IPv6Type/enum'
        );
        mAttributes.PrefixLength = paserXML(
          mAttributes.cgiSection,
          'network/interface/IPv6PrefixLength/int'
        );
        mAttributes.HostNameOptions = paserXML(
          mAttributes.cgiSection,
          'network/interface/HostName/int'
        );
        mAttributes.MTUsize = paserXML(
          mAttributes.cgiSection,
          'network/interface/MTUSize/int'
        );
        mAttributes.ICMPEnable = paserXML(
          mAttributes.cgiSection,
          'network/interface/ICMPEnable/bool'
        );
        mAttributes.DnsTypeOptions = paserXML(
          mAttributes.cgiSection,
          'network/dns/Type/enum'
        );
        mAttributes.RtspTimeoutOptions = paserXML(
          mAttributes.cgiSection,
          'network/rtsp/Timeout/enum'
        );
        mAttributes.AdminTimeout = paserXML(
          mAttributes.cgiSection,
          'network/portconf/AdminTimeout/int'
        );
        mAttributes.Http = paserXML(
          mAttributes.cgiSection,
          'network/http/Port/int'
        );
        mAttributes.Https = paserXML(
          mAttributes.cgiSection,
          'network/https/Port/int'
        );
        mAttributes.Rtsp = paserXML(
          mAttributes.cgiSection,
          'network/rtsp/Port/int'
        );
        mAttributes.ProfileSessionPolicy = paserXML(
          mAttributes.cgiSection,
          'network/rtsp/ProfileSessionPolicy/enum'
        );
        mAttributes.Svnp = paserXML(
          mAttributes.cgiSection,
          'network/svnp/Port/int'
        );
        mAttributes.PPPoEUserName = paserXML(
          mAttributes.cgiSection,
          'network/interface/PPPoEUserName/string'
        );
        mAttributes.PPPoEPassword = paserXML(
          mAttributes.cgiSection,
          'network/interface/PPPoEPassword/string'
        );
        mAttributes.Zeroconf = paserXML(
          mAttributes.cgiSection,
          'network/zeroconf/IPAddress/string'
        );
        mAttributes.Upnp = paserXML(
          mAttributes.cgiSection,
          'network/upnpdiscovery/FriendlyName/string'
        );
        mAttributes.Bonjour = paserXML(
          mAttributes.cgiSection,
          'network/bonjour/FriendlyName/string'
        );
        mAttributes.QoSIndexRange = paserXML(
          mAttributes.cgiSection,
          'network/qos/Index/int'
        );
        mAttributes.DSCPRange = paserXML(
          mAttributes.cgiSection,
          'network/qos/DSCP/int'
        );
        mAttributes.QOSIPType = paserXML(
          mAttributes.cgiSection,
          'network/qos/IPType/enum'
        );
        mAttributes.SNMPVersion1 = paserXML(
          mAttributes.cgiSection,
          'network/snmp/Version1/bool'
        );
        mAttributes.SNMPVersion2 = paserXML(
          mAttributes.cgiSection,
          'network/snmp/Version2/bool'
        );
        mAttributes.SNMPVersion3 = paserXML(
          mAttributes.cgiSection,
          'network/snmp/Version3/bool'
        );
        mAttributes.ReadCommunity = paserXML(
          mAttributes.cgiSection,
          'network/snmp/ReadCommunity/string'
        );
        mAttributes.WriteCommunity = paserXML(
          mAttributes.cgiSection,
          'network/snmp/WriteCommunity/string'
        );
        mAttributes.UserPassword = paserXML(
          mAttributes.cgiSection,
          'network/snmp/UserPassword/string'
        );
        mAttributes.SNMPTrapEnable = paserXML(
          mAttributes.cgiSection,
          'network/snmptrap/Enable/bool'
        );
        mAttributes.TrapCommunity = paserXML(
          mAttributes.cgiSection,
          'network/snmptrap/Trap.#.Community/string'
        );
        mAttributes.TrapAuthentificationFailure = paserXML(
          mAttributes.cgiSection,
          'network/snmptrap/Trap.#.AuthenticationFailure/bool'
        );
        mAttributes.TrapLinkUp = paserXML(
          mAttributes.cgiSection,
          'network/snmptrap/Trap.#.LinkUp/bool'
        );
        mAttributes.TrapLinkDown = paserXML(
          mAttributes.cgiSection,
          'network/snmptrap/Trap.#.LinkDown/bool'
        );
        mAttributes.TrapWarmStart = paserXML(
          mAttributes.cgiSection,
          'network/snmptrap/Trap.#.WarmStart/bool'
        );
        mAttributes.TrapColdStart = paserXML(
          mAttributes.cgiSection,
          'network/snmptrap/Trap.#.ColdStart/bool'
        );
        mAttributes.TrapAlarmInput = paserXML(
          mAttributes.cgiSection,
          'network/snmptrap/Trap.#.AlarmInput.#/bool'
        );
        mAttributes.TrapAlarmOutput = paserXML(
          mAttributes.cgiSection,
          'network/snmptrap/Trap.#.AlarmOutput.#/bool'
        );
        mAttributes.TrapTamperingDetection = paserXML(
          mAttributes.cgiSection,
          'network/snmptrap/Trap.#.TamperingDetection/bool'
        );
        mAttributes.SamsungServerNameRange = paserXML(
          mAttributes.cgiSection,
          'network/dynamicdns/SamsungServerName/string'
        );
        mAttributes.SamsungProductIDRange = paserXML(
          mAttributes.cgiSection,
          'network/dynamicdns/SamsungProductID/string'
        );
        mAttributes.PublicServiceEntryOptions = paserXML(
          mAttributes.cgiSection,
          'network/dynamicdns/PublicServiceEntry/enum'
        );
        mAttributes.PublicHostNameRange = paserXML(
          mAttributes.cgiSection,
          'network/dynamicdns/PublicHostName/string'
        );
        mAttributes.PublicUserNameRange = paserXML(
          mAttributes.cgiSection,
          'network/dynamicdns/PublicUserName/string'
        );
        mAttributes.PublicPasswordRange = paserXML(
          mAttributes.cgiSection,
          'network/dynamicdns/PublicPassword/string'
        );
        mAttributes.IPv6DefaultAddress = paserXML(
          mAttributes.cgiSection,
          'network/interface/IPv6DefaultAddress/string'
        );
        if (mAttributes.TUTKSupport) {
          mAttributes.TutkEnable = paserXML(
            mAttributes.cgiSection,
            'network/tutk/Enable/bool'
          );
        }

        if (mAttributes.SIPSupport) {
          mAttributes.STUNAddressStringLen = paserXML(
            mAttributes.cgiSection,
            'network/nattraversal/STUNAddress/string'
          );
          mAttributes.TURNAddressStringLen = paserXML(
            mAttributes.cgiSection,
            'network/nattraversal/TURNAddress/string'
          );
          mAttributes.TURNUserIDStringLen = paserXML(
            mAttributes.cgiSection,
            'network/nattraversal/TURNUserID/string'
          );
          mAttributes.TURNUserPasswordStringLen = paserXML(
            mAttributes.cgiSection,
            'network/nattraversal/TURNUserPassword/string'
          );
          mAttributes.SIPPortRange = paserXML(
            mAttributes.cgiSection,
            'network/sipsetup/SIPPort/int'
          );
          mAttributes.SIPTLSPortRange = paserXML(
            mAttributes.cgiSection,
            'network/sipsetup/SIPTLSPort/int'
          );
          mAttributes.RTPStartPortRange = paserXML(
            mAttributes.cgiSection,
            'network/sipsetup/RTPStartPort/int'
          );

          mAttributes.STUNPortRange = paserXML(
            mAttributes.cgiSection,
            'network/nattraversal/STUNPort/int'
          );
          mAttributes.TURNPortRange = paserXML(
            mAttributes.cgiSection,
            'network/nattraversal/TURNPort/int'
          );

          mAttributes.CallDurationLimit = paserXML(
            mAttributes.cgiSection,
            'network/sipsetup/CallDurationLimit/int'
          );
          mAttributes.RegistrationIntervalLimit = paserXML(
            mAttributes.cgiSection,
            'network/sipsetup/RegistrationInterval/int'
          );
          mAttributes.AudioDirectionList = paserXML(
            mAttributes.cgiSection,
            'network/sipsetup/AudioDirection/enum'
          );
        }
        mAttributes.networkCgiAttrReady = true;
      }
    },
    parseTransferCgiAttributes: () => {
      if (!mAttributes.transferCgiAttrReady) {
        mAttributes.FTPPortRange = paserXML(
          mAttributes.cgiSection,
          'transfer/ftp/Port/int'
        );
        mAttributes.FTPHostStringLen = paserXML(
          mAttributes.cgiSection,
          'transfer/ftp/Host/string'
        );
        mAttributes.FTPUsernameStringLen = paserXML(
          mAttributes.cgiSection,
          'transfer/ftp/Username/string'
        );
        mAttributes.FTPPasswordStringLen = paserXML(
          mAttributes.cgiSection,
          'transfer/ftp/Password/string'
        );
        mAttributes.FTPPathStringLen = paserXML(
          mAttributes.cgiSection,
          'transfer/ftp/Path/string'
        );
        mAttributes.FTPModeOptions = paserXML(
          mAttributes.cgiSection,
          'transfer/ftp/Mode/enum'
        );
        mAttributes.FTPReportFileType = paserXML(
          mAttributes.cgiSection,
          'transfer/ftp/ReportFileType/enum'
        );
        mAttributes.FTPPreEventDuration = paserXML(
          mAttributes.cgiSection,
          'transfer/ftp/PreEventDuration/enum'
        );
        mAttributes.FTPPostEventDuration = paserXML(
          mAttributes.cgiSection,
          'transfer/ftp/PostEventDuration/enum'
        );
        mAttributes.SMTPPortRange = paserXML(
          mAttributes.cgiSection,
          'transfer/smtp/Port/int'
        );
        mAttributes.SMTPHostStringLen = paserXML(
          mAttributes.cgiSection,
          'transfer/smtp/Host/string'
        );
        mAttributes.SMTPUsernameStringLen = paserXML(
          mAttributes.cgiSection,
          'transfer/smtp/Username/string'
        );
        mAttributes.SMTPPasswordStringLen = paserXML(
          mAttributes.cgiSection,
          'transfer/smtp/Password/string'
        );
        mAttributes.SMTPSenderStringLen = paserXML(
          mAttributes.cgiSection,
          'transfer/smtp/Sender/string'
        );
        mAttributes.SMTPRecipientStringLen = paserXML(
          mAttributes.cgiSection,
          'transfer/smtp/Recipient/string'
        );
        mAttributes.SMTPSubjectStringLen = paserXML(
          mAttributes.cgiSection,
          'transfer/smtp/Subject/string'
        );
        mAttributes.SMTPMessageStringLen = paserXML(
          mAttributes.cgiSection,
          'transfer/smtp/Message/string'
        );
        mAttributes.DataServerStoreNameLen = paserXML(
          mAttributes.cgiSection,
          'transfer/dataserver/StoreName/string'
        );

        mAttributes.transferCgiAttrReady = true;
      }
    },
    parseSecurityCgiAttributes: () => {
      if (!mAttributes.secuirityCgiAttrReady) {
        mAttributes.IpFilterAccessType = paserXML(
          mAttributes.cgiSection,
          'security/ipfilter/AccessType/enum'
        );
        mAttributes.IpFilterIndexRange = paserXML(
          mAttributes.cgiSection,
          'security/ipfilter/IPIndex/int'
        );
        mAttributes.IpFilterIPType = paserXML(
          mAttributes.cgiSection,
          'security/ipfilter/IPType/enum'
        );
        mAttributes.SSLPolicyOptions = paserXML(
          mAttributes.cgiSection,
          'security/ssl/Policy/enum'
        );
        mAttributes.PublicCertificateNameRange = paserXML(
          mAttributes.cgiSection,
          'security/ssl/PublicCertificateName/string'
        );

        mAttributes.UpdateDeviceHostname = paserXML(
          mAttributes.cgiSection,
          'security/ssl/UpdateDeviceHostname/bool'
        );
        mAttributes.CAcertificateUse = paserXML(
          mAttributes.cgiSection,
          'security/cacertificate/Certificate.#.CertificateName/string'
        );
        mAttributes.CommonNameRange = paserXML(
          mAttributes.cgiSection,
          'security/ssl/CommonName/string'
        );
        mAttributes.SANRange = paserXML(
          mAttributes.cgiSection,
          'security/ssl/SubjectAlternativeName/string'
        );
        mAttributes.CountryRange = paserXML(
          mAttributes.cgiSection,
          'security/ssl/Country/string'
        );
        mAttributes.ProvinceRange = paserXML(
          mAttributes.cgiSection,
          'security/ssl/Province/string'
        );
        mAttributes.LocationRange = paserXML(
          mAttributes.cgiSection,
          'security/ssl/Location/string'
        );
        mAttributes.OrganizationRange = paserXML(
          mAttributes.cgiSection,
          'security/ssl/Organization/string'
        );
        mAttributes.DivisionRange = paserXML(
          mAttributes.cgiSection,
          'security/ssl/Division/string'
        );
        mAttributes.EmailIDRange = paserXML(
          mAttributes.cgiSection,
          'security/ssl/EmailID/string'
        );

        mAttributes.ClientCertificateAuthenticationEnable = paserXML(
          mAttributes.cgiSection,
          'security/ssl/ClientCertificateAuthenticationEnable/bool'
        );
        mAttributes.ClientCertificateAuthenticationMode = paserXML(
          mAttributes.cgiSection,
          'security/ssl/ClientCertificateAuthenticationMode/enum'
        );

        mAttributes.EAPOLTypeOptions = paserXML(
          mAttributes.cgiSection,
          'security/802Dot1x/EAPOLType/enum'
        );
        mAttributes.EAPOLVersionOptions = paserXML(
          mAttributes.cgiSection,
          'security/802Dot1x/EAPOLVersion/enum'
        );
        mAttributes.CertificateTypeOptions = paserXML(
          mAttributes.cgiSection,
          'security/802Dot1x/CertificateType/enum'
        );
        mAttributes.EAPOLIDRange = paserXML(
          mAttributes.cgiSection,
          'security/802Dot1x/EAPOLId/string'
        );
        mAttributes.EAPOLPasswordRange = paserXML(
          mAttributes.cgiSection,
          'security/802Dot1x/EAPOLPassword/string'
        );
        mAttributes.IEEE802Dot1xInterfaceOptions = paserXML(
          mAttributes.cgiSection,
          'security/802Dot1x/InterfaceName/csv'
        );
        mAttributes.UserIDLen = paserXML(
          mAttributes.cgiSection,
          'security/users/UserID/string'
        );
        mAttributes.PasswordLen = paserXML(
          mAttributes.cgiSection,
          'security/users/Password/string'
        );
        mAttributes.VideoProfileAccess = paserXML(
          mAttributes.cgiSection,
          'security/users/VideoProfileAccess/bool'
        );
        mAttributes.PTZAccess = paserXML(
          mAttributes.cgiSection,
          'security/users/PTZAccess/bool'
        );
        mAttributes.PrivacyAreaAccess =
          paserXML(
            mAttributes.cgiSection,
            'security/users/PrivacyAreaAccess/bool'
          ) || false;
        mAttributes.AudioInAccess = paserXML(
          mAttributes.cgiSection,
          'security/users/AudioInAccess/bool'
        );
        mAttributes.AudioOutAccess = paserXML(
          mAttributes.cgiSection,
          'security/users/AudioOutAccess/bool'
        );
        mAttributes.AlarmOutputAccess = paserXML(
          mAttributes.cgiSection,
          'security/users/AlarmOutputAccess/bool'
        );
        mAttributes.RSASupport = paserXML(
          mAttributes.cgiSection,
          'security/rsa/PublicKey/string'
        );
        mAttributes.AdminFilterSupport = paserXML(
          mAttributes.cgiSection,
          'security/adminfilter/Enable/bool'
        );
        mAttributes.OnvifTTADigestOptions = paserXML(
          mAttributes.cgiSection,
          'security/onvifTTA/DigestAlgorithm/enum'
        );
        mAttributes.IPInstallerSettingEnable = paserXML(
          mAttributes.cgiSection,
          'security/onvifTTA/IPInstallerSettingEnable/enum'
        );
        mAttributes.guestUserAccessPrivilegeSupport = paserXML(
          mAttributes.cgiSection,
          'security/guest/Enable/bool'
        );
        mAttributes.RTSPAuthenticationPrivilegeSupport = paserXML(
          mAttributes.cgiSection,
          'security/rtsp/RTSPAuthentication/enum'
        );
        mAttributes.addUserSupport = paserXML(
          mAttributes.cgiSection,
          'security/users/Enable/bool'
        );

        mAttributes.secuirityCgiAttrReady = true;
      }
    },
    parseEventStatusCgiAttributes: () => {
      if (!mAttributes.eventstatusCgiAttrReady) {
        mAttributes.SystemEvents = paserXML(
          mAttributes.cgiSection,
          'eventstatus/eventstatus/SystemEvent/csv'
        );
        mAttributes.ChannelEvents = paserXML(
          mAttributes.cgiSection,
          'eventstatus/eventstatus/Channel.#.EventType/csv'
        );

        mAttributes.eventstatusCgiAttrReady = true;
      }
    },
    parseIOCgiAttributes: () => {
      if (!mAttributes.ioCgiAttrReady) {
        mAttributes.AlarmOutputIdleStateOptions = paserXML(
          mAttributes.cgiSection,
          'io/alarmoutput/AlarmOutput.#.IdleState/enum'
        );
        mAttributes.AlarmoutManualDurations = paserXML(
          mAttributes.cgiSection,
          'io/alarmoutput/AlarmOutput.#.ManualDuration/enum'
        );

        mAttributes.ioCgiAttrReady = true;
      }
    },
    parseEventSourceCgiAttributes: () => {
      if (!mAttributes.eventsourceCgiAttrReady) {
        var va2support = paserXML(
          mAttributes.cgiSection,
          'eventsources/videoanalysis2/DetectionType/enum'
        );
        var vaCmd = '';
        if (typeof va2support !== 'undefined') {
          mAttributes.VideoAnalysis2Support = true;
          vaCmd = 'videoanalysis2';
        } else {
          mAttributes.VideoAnalysis2Support = false;
          vaCmd = 'videoanalysis';
        }
        mAttributes.AlarmInputStateOptions = paserXML(
          mAttributes.cgiSection,
          'eventsources/alarminput/AlarmInput.#.State/enum'
        );
        mAttributes.ScheduleIntervalOptions = paserXML(
          mAttributes.cgiSection,
          'eventsources/timer/ScheduleInterval/enum'
        );
        mAttributes.TamperDetectSensitivityTypes = paserXML(
          mAttributes.cgiSection,
          'eventsources/tamperingdetection/Sensitivity/enum'
        );
        mAttributes.TamperDetectSensitivityLevelRange = paserXML(
          mAttributes.cgiSection,
          'eventsources/tamperingdetection/SensitivityLevel/int'
        );
        mAttributes.DarknessDetection = paserXML(
          mAttributes.cgiSection,
          'eventsources/tamperingdetection/DarknessDetection/bool'
        );
        mAttributes.DefocusDetectSensitivityLevelRange = paserXML(
          mAttributes.cgiSection,
          'eventsources/defocusdetection/Sensitivity/int'
        );
        mAttributes.MotionDetectSensitivityTypes = paserXML(
          mAttributes.cgiSection,
          'eventsources/' + vaCmd + '/Sensitivity/enum'
        );
        mAttributes.MotionDetectThreshold = paserXML(
          mAttributes.cgiSection,
          'eventsources/' + vaCmd + '/ROI.#.ThresholdLevel/int'
        );
        mAttributes.MotionDetectSensitivityLevel = paserXML(
          mAttributes.cgiSection,
          'eventsources/' + vaCmd + '/ROI.#.SensitivityLevel/int'
        );
        mAttributes.MotionDetectionDuration = paserXML(
          mAttributes.cgiSection,
          'eventsources/' + vaCmd + '/ROI.#.Duration/int'
        );
        mAttributes.FaceDetectSensitivityTypes = paserXML(
          mAttributes.cgiSection,
          'eventsources/facedetection/Sensitivity/int'
        );
        mAttributes.DynamicAreaOptions = paserXML(
          mAttributes.cgiSection,
          'eventsources/facedetection/DynamicArea/bool'
        );
        mAttributes.ScheduleIntervalUnits = paserXML(
          mAttributes.cgiSection,
          'eventsources/timer/ScheduleIntervalUnit/enum'
        );
        mAttributes.MotionDetectModes = paserXML(
          mAttributes.cgiSection,
          'eventsources/' + vaCmd + '/DetectionType/enum'
        );
        mAttributes.InputThresholdLevelRange = paserXML(
          mAttributes.cgiSection,
          'eventsources/audiodetection/InputThresholdLevel/int'
        );
        mAttributes.CameraHeights = paserXML(
          mAttributes.cgiSection,
          'eventsources/autotracking/CameraHeight/enum'
        );
        mAttributes.AutoTrackObjectSize = paserXML(
          mAttributes.cgiSection,
          'eventsources/autotracking/ObjectSize/enum'
        );
        mAttributes.DetectionAreaModes = paserXML(
          mAttributes.cgiSection,
          'eventsources/facedetection/DetectionAreaMode/enum'
        );
        mAttributes.OverlayColorOptions = paserXML(
          mAttributes.cgiSection,
          'eventsources/facedetection/OverlayColor/enum'
        );
        mAttributes.DisplayRules = paserXML(
          mAttributes.cgiSection,
          'eventsources/' + vaCmd + '/DisplayRules/bool'
        );
        mAttributes.DetectionResultOverlay = paserXML(
          mAttributes.cgiSection,
          'eventsources/' + vaCmd + '/DetectionResultOverlay/bool'
        );
        mAttributes.CameraHeight = paserXML(
          mAttributes.cgiSection,
          'eventsources/peoplecount/CameraHeight/int'
        );
        mAttributes.CalibrationMode = paserXML(
          mAttributes.cgiSection,
          'eventsources/peoplecount/CalibrationMode/enum'
        );

        mAttributes.PeopleCount =
          typeof paserXML(
            mAttributes.cgiSection,
            'eventsources/peoplecount/Enable/bool'
          ) !== 'undefined';
        mAttributes.HeatMap =
          typeof paserXML(
            mAttributes.cgiSection,
            'eventsources/heatmap/Enable/bool'
          ) !== 'undefined';
        mAttributes.ManualReference = paserXML(
          mAttributes.cgiSection,
          'eventsources/heatmap/ManualReference/int'
        );

        if (
          mAttributes.PeopleCount === true ||
          mAttributes.QueueManagement === true ||
          mAttributes.HeatMap === true
        ) {
          mAttributes.EnableStatistics = true;
        }

        mAttributes.VirtualAreaModeOptions = paserXML(
          mAttributes.cgiSection,
          'eventsources/' + vaCmd + '/DefinedArea.#.Mode/csv'
        );
        mAttributes.LoiteringDuration = paserXML(
          mAttributes.cgiSection,
          'eventsources/' + vaCmd + '/DefinedArea.#.LoiteringDuration/int'
        );
        mAttributes.AppearanceDuration = paserXML(
          mAttributes.cgiSection,
          'eventsources/' + vaCmd + '/DefinedArea.#.AppearanceDuration/int'
        );
        mAttributes.IntrusionDuration = paserXML(
          mAttributes.cgiSection,
          'eventsources/' + vaCmd + '/DefinedArea.#.IntrusionDuration/int'
        );
        mAttributes.AreaObjectTypeFilter = paserXML(
          mAttributes.cgiSection,
          'eventsources/' + vaCmd + '/DefinedArea.#.ObjectTypeFilter/csv'
        );
        mAttributes.LineObjectTypeFilter = paserXML(
          mAttributes.cgiSection,
          'eventsources/' + vaCmd + '/Line.#.ObjectTypeFilter/csv'
        );
        mAttributes.IVARuleNameOptions = paserXML(
          mAttributes.cgiSection,
          'eventsources/' + vaCmd + '/Line.#.RuleName/string'
        );
        mAttributes.VaDetectionResultOverlay = paserXML(
          mAttributes.cgiSection,
          'eventsources/' +
            vaCmd +
            '/DetectionType.#.DetectionResultOverlay/bool'
        );

        mAttributes.TamperDetectThreshold = paserXML(
          mAttributes.cgiSection,
          'eventsources/tamperingdetection/ThresholdLevel/int'
        );
        mAttributes.TamperDetectDuration = paserXML(
          mAttributes.cgiSection,
          'eventsources/tamperingdetection/Duration/int'
        );
        mAttributes.TamperDetectSensitivityLevel = paserXML(
          mAttributes.cgiSection,
          'eventsources/tamperingdetection/SensitivityLevel/int'
        );

        mAttributes.ShockDetectSensitivityLevel = paserXML(
          mAttributes.cgiSection,
          'eventsources/shockdetection/SensitivityLevel/int'
        );

        mAttributes.AudioDetectInputThresholdLevel = paserXML(
          mAttributes.cgiSection,
          'eventsources/audiodetection/InputThresholdLevel/int'
        );

        mAttributes.DefocusDetectThreshold = paserXML(
          mAttributes.cgiSection,
          'eventsources/defocusdetection/Threshold/int'
        );
        mAttributes.DefocusDetectDuration = paserXML(
          mAttributes.cgiSection,
          'eventsources/defocusdetection/Duration/int'
        );
        mAttributes.DefocusDetectSimpleFocus = paserXML(
          mAttributes.cgiSection,
          'eventsources/defocusdetection/AutoSimpleFocus/bool'
        );

        mAttributes.ParkingDetectSensitivityLevelRange = paserXML(
          mAttributes.cgiSection,
          'eventsources/parkingdetection/Sensitivity/int'
        );
        mAttributes.ParkingDetectionMaxDetectionCount = paserXML(
          mAttributes.cgiSection,
          'eventsources/parkingdetection/Area.#.MaxDetectionCount/int'
        );
        mAttributes.ParkingDetectionMinimumObjectSize = paserXML(
          mAttributes.cgiSection,
          'eventsources/parkingdetection/MinimumObjectSize/string'
        );
        mAttributes.ParkingDetectionMaximumObjectSize = paserXML(
          mAttributes.cgiSection,
          'eventsources/parkingdetection/MaximumObjectSize/string'
        );

        mAttributes.LEDUsage = paserXML(
          mAttributes.cgiSection,
          'eventsources/ledindicator/LEDUsage/int'
        );
        mAttributes.LEDEventOnColror = paserXML(
          mAttributes.cgiSection,
          'eventsources/ledindicator/LED.#.EventOn.Color/string'
        );
        mAttributes.LEDEventOnTextMaxLen = paserXML(
          mAttributes.cgiSection,
          'eventsources/ledindicator/LED.#.EventOn.Text/string'
        );
        mAttributes.LEDEventOffColror = paserXML(
          mAttributes.cgiSection,
          'eventsources/ledindicator/LED.#.EventOff.Color/string'
        );
        mAttributes.LEDEventOffTextMaxLen = paserXML(
          mAttributes.cgiSection,
          'eventsources/ledindicator/LED.#.EventOff.Text/string'
        );
        mAttributes.LEDUsageIndex = paserXML(
          mAttributes.cgiSection,
          'eventsources/ledindicator/SourceChannel.#.LEDUsageIndex/int'
        );

        mAttributes.FogDetectThreshold = paserXML(
          mAttributes.cgiSection,
          'eventsources/fogdetection/Threshold/int'
        );
        mAttributes.FogDetectDuration = paserXML(
          mAttributes.cgiSection,
          'eventsources/fogdetection/Duration/int'
        );
        mAttributes.FogDetectSensitivityLevel = paserXML(
          mAttributes.cgiSection,
          'eventsources/fogdetection/SensitivityLevel/int'
        );

        mAttributes.QueueMaxPeople = paserXML(
          mAttributes.cgiSection,
          'eventsources/queuemanagementsetup/Queue.#.MaxPeople/int'
        );
        mAttributes.QueueHighPeople = paserXML(
          mAttributes.cgiSection,
          'eventsources/queuemanagementsetup/Queue.#.Level.High.Count/int'
        );
        mAttributes.QueueDurations = paserXML(
          mAttributes.cgiSection,
          'eventsources/queuemanagementsetup/Queue.#.Level.#.Threshold/int'
        );

        //TCD => TemperatureChangeDetection
        mAttributes.TCDMode = paserXML(
          mAttributes.cgiSection,
          'eventsources/temperaturechangedetection/TemperatureChange.ROI.#.Mode/enum'
        );
        mAttributes.TCDDetectionPeriod = paserXML(
          mAttributes.cgiSection,
          'eventsources/temperaturechangedetection/TemperatureChange.ROI.#.DetectionPeriod/int'
        );
        mAttributes.TCDCelsiusGapOptions = paserXML(
          mAttributes.cgiSection,
          'eventsources/temperaturechangedetectionoptions/Celsius.SupportedGap/csv'
        );
        mAttributes.TCDFahrenheitGapOptions = paserXML(
          mAttributes.cgiSection,
          'eventsources/temperaturechangedetectionoptions/Fahrenheit.SupportedGap/csv'
        );

        //BTD => BoxTemperatureDetection
        mAttributes.BTDTemperatureType = paserXML(
          mAttributes.cgiSection,
          'eventsources/boxtemperaturedetection/ROI.#.TemperatureType/enum'
        );
        mAttributes.BTDDetectionType = paserXML(
          mAttributes.cgiSection,
          'eventsources/boxtemperaturedetection/ROI.#.DetectionType/enum'
        );
        mAttributes.BTDDuration = paserXML(
          mAttributes.cgiSection,
          'eventsources/boxtemperaturedetection/ROI.#.Duration/int'
        );
        mAttributes.objectDetectionTypes = paserXML(
          mAttributes.cgiSection,
          'eventsources/objectdetection/ObjectTypes/csv'
        );
        mAttributes.objectDetectionDurationOptions = paserXML(
          mAttributes.cgiSection,
          'eventsources/objectdetection/Duration/int'
        );
        mAttributes.maskDetectionDurationOptions = paserXML(
          mAttributes.cgiSection,
          'eventsources/maskdetection/Duration/int'
        );
        if (mAttributes.socialDistancingSupport) {
          mAttributes.socialDistancingOptions = {
            CameraHeight: paserXML(
              mAttributes.cgiSection,
              'eventsources/socialdistancingviolation/CameraHeight/float'
            ),
            LensFocal: paserXML(
              mAttributes.cgiSection,
              'eventsources/socialdistancingviolation/LensFocal/float'
            ),
            Tilt: paserXML(
              mAttributes.cgiSection,
              'eventsources/socialdistancingviolation/Tilt/float'
            ),
            Rotation: paserXML(
              mAttributes.cgiSection,
              'eventsources/socialdistancingviolation/Rotation/float'
            ),
            MinimumAllowedDistance: paserXML(
              mAttributes.cgiSection,
              'eventsources/socialdistancingviolation/MinimumAllowedDistance/float'
            ),
            Sensitivity: paserXML(
              mAttributes.cgiSection,
              'eventsources/socialdistancingviolation/Sensitivity/int'
            ),
            Duration: paserXML(
              mAttributes.cgiSection,
              'eventsources/socialdistancingviolation/Duration/int'
            ),
          };
        }
        mAttributes.bestshotObjectTypes = paserXML(
          mAttributes.cgiSection,
          'eventsources/metaimagetransfer/ObjectTypes/csv'
        );

        // Estimated body temperature
        mAttributes.ThermalModeOptions = paserXML(
          mAttributes.cgiSection,
          'eventsources/thermaldetectionmode/ThermalMode/enum'
        );
        if (mAttributes.ThermalModeOptions) {
          SunapiClient.get(
            '/stw-cgi/eventsources.cgi?msubmenu=thermaldetectionmode&action=view',
            {},
            function (response) {
              mAttributes.ThermalMode =
                response.data.ThermalDetectionMode[0].ThermalMode;
            },
            function () {},
            '',
            false
          );
        }
        mAttributes.bodyTempDetectDuration = paserXML(
          mAttributes.cgiSection,
          'eventsources/bodytemperaturedetection/Duration/enum'
        );
        mAttributes.bodyTempDetectSensitivity = paserXML(
          mAttributes.cgiSection,
          'eventsources/bodytemperaturedetection/Sensitivity/enum'
        );
        mAttributes.RadiometrySettingsOptions = {
          RelativeHumidity: paserXML(
            mAttributes.cgiSection,
            'image/radiometrysettings/RelativeHumidity/enum'
          ),
          DistanceToObject: paserXML(
            mAttributes.cgiSection,
            'image/radiometrysettings/DistanceToObject/enum'
          ),
        };
        mAttributes.BlackbodyConfigOptions = {
          BlackBodyEmissivity: paserXML(
            mAttributes.cgiSection,
            'image/blackbodyconfig/BlackBodyEmissivity/enum'
          ),
          BlackBodyDistance: paserXML(
            mAttributes.cgiSection,
            'image/blackbodyconfig/BlackBodyDistance/enum'
          ),
          BlackBodyHeight: paserXML(
            mAttributes.cgiSection,
            'image/blackbodyconfig/BlackBodyHeight/enum'
          ),
          CameraHeight: paserXML(
            mAttributes.cgiSection,
            'image/blackbodyconfig/CameraHeight/enum'
          ),
          CameraAngle: paserXML(
            mAttributes.cgiSection,
            'image/blackbodyconfig/CameraAngle/enum'
          ),
        };
        mAttributes.CalibrationOffsetOptions = paserXML(
          mAttributes.cgiSection,
          'image/stereosensorcalibration/CalibrationOffset/string'
        );
        mAttributes.TemperatureMeasurementRegionOptions = {
          HorizontalRatio: paserXML(
            mAttributes.cgiSection,
            'eventsources/temperaturemeasurementregion/HorizontalRatio/enum'
          ),
          VerticalRatio: paserXML(
            mAttributes.cgiSection,
            'eventsources/temperaturemeasurementregion/VerticalRatio/enum'
          ),
        };

        if (mAttributes.SIPSupport) {
          mAttributes.CallingTimeoutRange = paserXML(
            mAttributes.cgiSection,
            'eventsources/callrequest/CallingTimeout/int'
          );
        }
        mAttributes.eventsourceCgiAttrReady = true;
      }
    },
    parseRecordingCgiAttributes: () => {
      if (!mAttributes.recordingCgiAttrReady) {
        mAttributes.RecVideoFileTypeOptions = paserXML(
          mAttributes.cgiSection,
          'recording/general/RecordedVideoFileType/enum'
        );
        mAttributes.RecNormalModeOptions = paserXML(
          mAttributes.cgiSection,
          'recording/general/NormalMode/enum'
        );
        mAttributes.RecEventModeOptions = paserXML(
          mAttributes.cgiSection,
          'recording/general/EventMode/enum'
        );
        mAttributes.RecPreEventDurationOptions = paserXML(
          mAttributes.cgiSection,
          'recording/general/PreEventDuration/enum'
        );
        mAttributes.RecPostEventDurationOptions = paserXML(
          mAttributes.cgiSection,
          'recording/general/PostEventDuration/enum'
        );
        mAttributes.AutoDeleteDayOptions = paserXML(
          mAttributes.cgiSection,
          'recording/storage/AutoDeleteDays/int'
        );
        mAttributes.TimelineViewType = paserXML(
          mAttributes.cgiSection,
          'recording/timeline/view/Type/enum'
        );

        mAttributes.recordingCgiAttrReady = true;
      }
    },
    parseEventActionsCgiAttributes: () => {
      if (!mAttributes.eventactionsCgiAttrReady) {
        mAttributes.EventActionSupport = paserXML(
          mAttributes.cgiSection,
          'eventactions/complexaction/EventType/enum'
        );
        if (
          typeof mAttributes.EventActionSupport !== 'undefined' &&
          mAttributes.EventActionSupport !== null
        ) {
          mAttributes.EventActionSupport = true;
          mAttributes.EventActions = paserXML(
            mAttributes.cgiSection,
            'eventactions/complexaction/EventAction/enum'
          ); // 추후 sourceoptions로 변경
          mAttributes.ActivateOptions = paserXML(
            mAttributes.cgiSection,
            'eventactions/complexaction/ScheduleType/enum'
          );
          mAttributes.PresetNumberRange = paserXML(
            mAttributes.cgiSection,
            'eventrules/rules/PresetNumber/int'
          );
          mAttributes.AlarmoutDurationOptions = paserXML(
            mAttributes.cgiSection,
            'eventactions/complexaction/AlarmOutput.#.Duration/enum'
          );
          if (
            typeof mAttributes.AlarmoutDurationOptions !== 'undefined' &&
            mAttributes.AlarmoutDurationOptions !== null
          ) {
            mAttributes.AlarmoutDurationOptions =
              mAttributes.AlarmoutDurationOptions.map(function (val) {
                return val !== 'None' ? val : 'Off';
              });
          }
        } else {
          mAttributes.EventActionSupport = false;
        }
        mAttributes.eventactionsCgiAttrReady = true;
      }
    },
    parseEventRulesCgiAttributes: () => {
      if (!mAttributes.eventrulesCgiAttrReady) {
        //mAttributes.EventSources = paserXML(mAttributes.cgiSection, 'eventrules/rules/EventSource/enum');
        mAttributes.EventActions = paserXML(
          mAttributes.cgiSection,
          'eventrules/rules/EventAction/enum'
        );
        mAttributes.ActivateOptions = paserXML(
          mAttributes.cgiSection,
          'eventrules/rules/ScheduleType/enum'
        );
        mAttributes.PresetNumberRange = paserXML(
          mAttributes.cgiSection,
          'eventrules/rules/PresetNumber/int'
        );
        mAttributes.HandoverChannelRange = paserXML(
          mAttributes.cgiSection,
          'eventrules/handover2/Channel/int'
        );
        mAttributes.HandoverV2 =
          typeof mAttributes.HandoverChannelRange !== 'undefined';
        mAttributes.HandoverV2IndexRange = paserXML(
          mAttributes.cgiSection,
          'eventrules/handover2/HandoverIndex/int'
        );
        mAttributes.ConnectionMode = paserXML(
          mAttributes.cgiSection,
          'eventrules/handover2/ConnectionMode/enum'
        );
        mAttributes.HandoverActions = paserXML(
          mAttributes.cgiSection,
          'eventrules/handover2/HandoverAction/enum'
        );

        mAttributes.HandoverQueryRange = paserXML(
          mAttributes.cgiSection,
          'eventrules/handover2/Query/string'
        );
        mAttributes.HandoverMessageRange = paserXML(
          mAttributes.cgiSection,
          'eventrules/handover2/Message/string'
        );

        mAttributes.HandoverV2UserRange = paserXML(
          mAttributes.cgiSection,
          'eventrules/handover2/HandoverIndex/int'
        );
        mAttributes.HandoverV2UserMaxLen = paserXML(
          mAttributes.cgiSection,
          'eventrules/handover2/Username/string'
        );
        mAttributes.HandoverV2PwdMaxLen = paserXML(
          mAttributes.cgiSection,
          'eventrules/handover2/Password/string'
        );
        mAttributes.HandoverV2PresetRange = paserXML(
          mAttributes.cgiSection,
          'eventrules/handover2/PresetNumber/int'
        );

        mAttributes.HandoverRange = paserXML(
          mAttributes.cgiSection,
          'eventrules/handover/ROIIndex/int'
        );
        mAttributes.AlarmoutDurationOptions = ['Off'];
        mAttributes.AlarmoutDurationOptions.push.apply(
          mAttributes.AlarmoutDurationOptions,
          paserXML(
            mAttributes.cgiSection,
            'eventrules/rules/AlarmOutput.#.Duration/enum'
          )
        );

        if (typeof mAttributes.HandoverRange !== 'undefined') {
          mAttributes.HandoverUserRange = paserXML(
            mAttributes.cgiSection,
            'eventrules/handover/HandoverIndex/int'
          );
          mAttributes.HandoverUserMaxLen = paserXML(
            mAttributes.cgiSection,
            'eventrules/handover/Username/string'
          );
          mAttributes.HandoverPwdMaxLen = paserXML(
            mAttributes.cgiSection,
            'eventrules/handover/Password/string'
          );
          mAttributes.HandoverPresetRange = paserXML(
            mAttributes.cgiSection,
            'eventrules/handover/PresetNumber/int'
          );
        }
        mAttributes.AudioClipsGain = paserXML(
          mAttributes.cgiSection,
          'eventrules/audiooutfiles/Gain/int'
        );
        mAttributes.AudioClipNameLengthRange = paserXML(
          mAttributes.cgiSection,
          'eventrules/audiooutfiles/Name/int'
        );
        mAttributes.AudioClipCountRange = paserXML(
          mAttributes.cgiSection,
          'eventrules/audiooutfiles/control/Index/int'
        );
        mAttributes.AudioClipScheduleType = paserXML(
          mAttributes.cgiSection,
          'eventrules/audiooutfilesschedule/ScheduleType/enum'
        );
        mAttributes.AudioClipScheduleDayList = paserXML(
          mAttributes.cgiSection,
          'eventrules/audiooutfilesschedule/WeekDay/enum'
        );
        mAttributes.eventrulesCgiAttrReady = true;

        mAttributes.IOBoxIPTypeOptions = paserXML(
          mAttributes.cgiSection,
          'eventrules/ioboxregister/IPType/bool'
        );
        mAttributes.IOBoxPort = paserXML(
          mAttributes.cgiSection,
          'eventrules/ioboxregister/Port/int'
        );
        mAttributes.IOBoxRTSPPort = paserXML(
          mAttributes.cgiSection,
          'eventrules/ioboxregister/RTSPPort/int'
        );
        mAttributes.IOBoxConnectionModeOptions = paserXML(
          mAttributes.cgiSection,
          'eventrules/ioboxregister/ConnectionMode/enum'
        );
        mAttributes.IOBoxUsernameLen = paserXML(
          mAttributes.cgiSection,
          'eventrules/ioboxregister/Username/string'
        );
        mAttributes.IOBoxPasswordLen = paserXML(
          mAttributes.cgiSection,
          'eventrules/ioboxregister/Password/string'
        );

        if (mAttributes.DynamicEventRule) {
          mAttributes.EventRuleNameOptions = paserXML(
            mAttributes.cgiSection,
            'eventrules/dynamicrules/Rule.#.RuleName/string'
          );
          mAttributes.DynamicEventActions = paserXML(
            mAttributes.cgiSection,
            'eventrules/dynamicrules/Rule.#.EventAction.#.Type/enum'
          );
        }
      }
    },
    parseImageCgiAttributes: () => {
      if (!mAttributes.imageCgiAttrReady) {
        mAttributes.FlipMirrorSupportByChannel = paserXML(
          mAttributes.cgiSection,
          'image/flip/Channel/int'
        );
        mAttributes.FlipMirrorSupport =
          !!mAttributes.FlipMirrorSupportByChannel;
        mAttributes.RotateOptions = paserXML(
          mAttributes.cgiSection,
          'image/flip/Rotate/enum'
        );
        mAttributes.SmartCodecOptions = paserXML(
          mAttributes.cgiSection,
          'image/smartcodec/Mode/enum'
        );
        mAttributes.SmartCodecSupportByChannel = paserXML(
          mAttributes.cgiSection,
          'image/smartcodec/Channel/csv'
        );
        mAttributes.SmartCodecQualityOptions = paserXML(
          mAttributes.cgiSection,
          'image/smartcodec/QualityLevel/enum'
        );
        mAttributes.ImagePresetModeOptions = paserXML(
          mAttributes.cgiSection,
          'image/imagepreset2/Mode/enum'
        );
        mAttributes.ImagePresetSchedModeOptions = paserXML(
          mAttributes.cgiSection,
          'image/imagepresetschedule/<ddd>.<hourIndex>.Mode/csv'
        );
        mAttributes.ImagePresetOptionsSupport = paserXML(
          mAttributes.cgiSection,
          'image/imagepresetoptions/ImagePresetMode/enum'
        );
        mAttributes.SSDRLevel = paserXML(
          mAttributes.cgiSection,
          'image/ssdr/Level/int'
        );
        mAttributes.SSDRDynamicRangeOptions = paserXML(
          mAttributes.cgiSection,
          'image/ssdr/DynamicRange/enum'
        );
        mAttributes.WhiteBalanceModeOptions = paserXML(
          mAttributes.cgiSection,
          'image/whitebalance/WhiteBalanceMode/enum'
        );
        mAttributes.WhiteBalanceManualRedLevel = paserXML(
          mAttributes.cgiSection,
          'image/whitebalance/WhiteBalanceManualRedLevel/int'
        );
        mAttributes.WhiteBalanceManualBlueLevel = paserXML(
          mAttributes.cgiSection,
          'image/whitebalance/WhiteBalanceManualBlueLevel/int'
        );
        mAttributes.CameraLensCgiSupportByChannel = paserXML(
          mAttributes.cgiSection,
          'image/camera/view/Channel/csv'
        );
        mAttributes.CompensationModeOptions = paserXML(
          mAttributes.cgiSection,
          'image/camera/CompensationMode/enum'
        );
        mAttributes.WDRLevelOptions = paserXML(
          mAttributes.cgiSection,
          'image/camera/WDRLevel/enum'
        );
        mAttributes.WDRControlModeOptions = paserXML(
          mAttributes.cgiSection,
          'image/camera/WDRControlMode/enum'
        );
        mAttributes.BLCLevelOptions = paserXML(
          mAttributes.cgiSection,
          'image/camera/BLCLevel/enum'
        );
        mAttributes.NormalizedBLCLevel = paserXML(
          mAttributes.cgiSection,
          'image/camera/NormalizedBLCLevel/int'
        );
        mAttributes.NormalizedHLCLevel = paserXML(
          mAttributes.cgiSection,
          'image/camera/NormalizedHLCLevel/int'
        );
        mAttributes.HLCModeOptions = paserXML(
          mAttributes.cgiSection,
          'image/camera/HLCMode/enum'
        );
        mAttributes.HLCLevelOptions = paserXML(
          mAttributes.cgiSection,
          'image/camera/HLCLevel/enum'
        );
        mAttributes.HLCMaskTone = paserXML(
          mAttributes.cgiSection,
          'image/camera/HLCMaskTone/int'
        );
        mAttributes.HLCMaskColorOptions = paserXML(
          mAttributes.cgiSection,
          'image/camera/HLCMaskColor/enum'
        );
        mAttributes.HLCDimmingOptions = paserXML(
          mAttributes.cgiSection,
          'image/camera/HLCDimming/enum'
        );
        mAttributes.HLCAreaTop = paserXML(
          mAttributes.cgiSection,
          'image/camera/HLCAreaTop/int'
        );
        mAttributes.HLCAreaBottom = paserXML(
          mAttributes.cgiSection,
          'image/camera/HLCAreaBottom/int'
        );
        mAttributes.HLCAreaLeft = paserXML(
          mAttributes.cgiSection,
          'image/camera/HLCAreaLeft/int'
        );
        mAttributes.HLCAreaRight = paserXML(
          mAttributes.cgiSection,
          'image/camera/HLCAreaRight/int'
        );
        mAttributes.BLCAreaTop = paserXML(
          mAttributes.cgiSection,
          'image/camera/BLCAreaTop/int'
        );
        mAttributes.BLCAreaBottom = paserXML(
          mAttributes.cgiSection,
          'image/camera/BLCAreaBottom/int'
        );
        mAttributes.BLCAreaLeft = paserXML(
          mAttributes.cgiSection,
          'image/camera/BLCAreaLeft/int'
        );
        mAttributes.BLCAreaRight = paserXML(
          mAttributes.cgiSection,
          'image/camera/BLCAreaRight/int'
        );
        mAttributes.WDRSeamlessTransitionOptions = paserXML(
          mAttributes.cgiSection,
          'image/camera/WDRSeamlessTransition/enum'
        );
        mAttributes.WDRLowLightOptions = paserXML(
          mAttributes.cgiSection,
          'image/camera/WDRLowLight/enum'
        );
        mAttributes.WDRIRLEDEnableOptions = paserXML(
          mAttributes.cgiSection,
          'image/camera/WDRIRLEDEnable/enum'
        );
        mAttributes.LCEModeOptions = paserXML(
          mAttributes.cgiSection,
          'image/camera/LCEMode/enum'
        );
        mAttributes.LCETop = paserXML(
          mAttributes.cgiSection,
          'image/camera/LCETop/int'
        );
        mAttributes.LCEBottom = paserXML(
          mAttributes.cgiSection,
          'image/camera/LCEBottom/int'
        );
        mAttributes.LCELeft = paserXML(
          mAttributes.cgiSection,
          'image/camera/LCELeft/int'
        );
        mAttributes.LCERight = paserXML(
          mAttributes.cgiSection,
          'image/camera/LCERight/int'
        );
        mAttributes.MinShutterOptions = paserXML(
          mAttributes.cgiSection,
          'image/camera/AutoShortShutterSpeed/enum'
        );
        mAttributes.MaxShutterOptions = paserXML(
          mAttributes.cgiSection,
          'image/camera/AutoLongShutterSpeed/enum'
        );
        mAttributes.PreferShutterOptions = paserXML(
          mAttributes.cgiSection,
          'image/camera/PreferShutterSpeed/enum'
        );
        mAttributes.PreferShutterAISupport = paserXML(
          mAttributes.cgiSection,
          'image/camera/PreferShutterAISupportEnable/bool'
        );
        mAttributes.SubShutterAdjustOptions = paserXML(
          mAttributes.cgiSection,
          'image/camera/SubShutterSpeedRatio/enum'
        );
        mAttributes.AFLKModeOptions = paserXML(
          mAttributes.cgiSection,
          'image/camera/AFLKMode/enum'
        );
        mAttributes.SSNRModeOptions = paserXML(
          mAttributes.cgiSection,
          'image/camera/SSNRMode/enum'
        );
        mAttributes.SSNRLevel = paserXML(
          mAttributes.cgiSection,
          'image/camera/SSNRLevel/int'
        );
        mAttributes.SSNR2DLevel = paserXML(
          mAttributes.cgiSection,
          'image/camera/SSNR2DLevel/int'
        );
        mAttributes.SSNR3DLevel = paserXML(
          mAttributes.cgiSection,
          'image/camera/SSNR3DLevel/int'
        );
        mAttributes.IrisModeOptions = paserXML(
          mAttributes.cgiSection,
          'image/camera/IrisMode/enum'
        );
        mAttributes.IrisFnoOptions = paserXML(
          mAttributes.cgiSection,
          'image/camera/IrisFno/enum'
        );
        mAttributes.PIrisModeOptions = paserXML(
          mAttributes.cgiSection,
          'image/camera/PIrisMode/enum'
        );
        mAttributes.PIrisPosition = paserXML(
          mAttributes.cgiSection,
          'image/camera/PIrisPosition/int'
        );
        mAttributes.AGCModeOptions = paserXML(
          mAttributes.cgiSection,
          'image/camera/AGCMode/enum'
        );
        mAttributes.AGCLevel = paserXML(
          mAttributes.cgiSection,
          'image/camera/AGCLevel/int'
        );
        mAttributes.AGCMaxGainLevel = paserXML(
          mAttributes.cgiSection,
          'image/camera/AGCMaxGainLevel/int'
        );
        mAttributes.DayNightModeOptions = paserXML(
          mAttributes.cgiSection,
          'image/camera/DayNightMode/enum'
        );
        mAttributes.DayNightSwitchingTimeOptions = paserXML(
          mAttributes.cgiSection,
          'image/camera/DayNightSwitchingTime/enum'
        );
        mAttributes.DayNightSwitchingModeOptions = paserXML(
          mAttributes.cgiSection,
          'image/camera/DayNightSwitchingMode/enum'
        );
        mAttributes.DayNightAlarmInOptions = paserXML(
          mAttributes.cgiSection,
          'image/camera/DayNightAlarmIn/enum'
        );
        mAttributes.DNSwitchColorToBWThreshold = paserXML(
          mAttributes.cgiSection,
          'image/camera/DNSwitchColorToBWThreshold/int'
        );
        mAttributes.DNSwitchBWToColorThreshold = paserXML(
          mAttributes.cgiSection,
          'image/camera/DNSwitchBWToColorThreshold/int'
        );
        mAttributes.SimpleFocusAfterDayNight = paserXML(
          mAttributes.cgiSection,
          'image/camera/SimpleFocus/enum'
        );

        mAttributes.ExposureControlSpeed = paserXML(
          mAttributes.cgiSection,
          'image/camera/ExposureControlSpeed/int'
        );

        var imaenhance2Support = paserXML(
          mAttributes.cgiSection,
          'image/imageenhancements2/SharpnessLevel/int'
        );
        var imaenhanceCmd = '';
        if (typeof imaenhance2Support !== 'undefined') {
          mAttributes.imageenhancements2Support = true;
          imaenhanceCmd = 'imageenhancements2';
        } else {
          mAttributes.imageenhancements2Support = false;
          imaenhanceCmd = 'imageenhancements';
        }
        mAttributes.Brightness = paserXML(
          mAttributes.cgiSection,
          'image/' + imaenhanceCmd + '/Brightness/int'
        );
        mAttributes.SharpnessLevel = paserXML(
          mAttributes.cgiSection,
          'image/' + imaenhanceCmd + '/SharpnessLevel/int'
        );
        mAttributes.VerticalPosition = paserXML(
          mAttributes.cgiSection,
          'image/' + imaenhanceCmd + '/VerticalPosition/int'
        );
        mAttributes.HorizontalPosition = paserXML(
          mAttributes.cgiSection,
          'image/' + imaenhanceCmd + '/HorizontalPosition/int'
        );
        mAttributes.DISFocalLength = paserXML(
          mAttributes.cgiSection,
          'image/' + imaenhanceCmd + '/DISFocalLength/int'
        );
        mAttributes.Gamma = paserXML(
          mAttributes.cgiSection,
          'image/' + imaenhanceCmd + '/Gamma/int'
        );
        mAttributes.GammaControl = paserXML(
          mAttributes.cgiSection,
          'image/' + imaenhanceCmd + '/GammaControl/enum'
        );
        mAttributes.Saturation = paserXML(
          mAttributes.cgiSection,
          'image/' + imaenhanceCmd + '/Saturation/int'
        );
        mAttributes.DefogModeOptions = paserXML(
          mAttributes.cgiSection,
          'image/' + imaenhanceCmd + '/DefogMode/enum'
        );
        mAttributes.DefogLevel = paserXML(
          mAttributes.cgiSection,
          'image/' + imaenhanceCmd + '/DefogLevel/int'
        );
        mAttributes.LDCModeOptions = paserXML(
          mAttributes.cgiSection,
          'image/' + imaenhanceCmd + '/LDCMode/enum'
        );
        mAttributes.LDCLevel = paserXML(
          mAttributes.cgiSection,
          'image/' + imaenhanceCmd + '/LDCLevel/int'
        );
        mAttributes.Contrast = paserXML(
          mAttributes.cgiSection,
          'image/' + imaenhanceCmd + '/Contrast/int'
        );
        mAttributes.CAROptions = paserXML(
          mAttributes.cgiSection,
          'image/' + imaenhanceCmd + '/CAR/enum'
        );
        mAttributes.DefogFilterOptions = paserXML(
          mAttributes.cgiSection,
          'image/' + imaenhanceCmd + '/OpticalDefogFilterEnable/bool'
        );
        mAttributes.XCELevel = paserXML(
          mAttributes.cgiSection,
          'image/' + imaenhanceCmd + '/XCELevel/int'
        );
        /** OSD Start  */
        mAttributes.PositionX = paserXML(
          mAttributes.cgiSection,
          'image/multilineosd/PositionX/int'
        );
        mAttributes.PositionY = paserXML(
          mAttributes.cgiSection,
          'image/multilineosd/PositionY/int'
        );
        mAttributes.TimeFormatOptions = paserXML(
          mAttributes.cgiSection,
          'image/multilineosd/DateFormat/enum'
        );
        mAttributes.FontSizeOptions = paserXML(
          mAttributes.cgiSection,
          'image/multilineosd/FontSize/enum'
        );
        mAttributes.OSDColorOptions = paserXML(
          mAttributes.cgiSection,
          'image/multilineosd/OSDColor/enum'
        );
        mAttributes.OSDTransparencyOptions = paserXML(
          mAttributes.cgiSection,
          'image/multilineosd/Transparency/enum'
        );
        mAttributes.OSDBlinkOptions = paserXML(
          mAttributes.cgiSection,
          'image/multilineosd/OSDBlink/enum'
        );
        mAttributes.MultilineOSDTitle = paserXML(
          mAttributes.cgiSection,
          'image/multilineosd/OSD/string'
        );
        mAttributes.MultiImageIndex = paserXML(
          mAttributes.cgiSection,
          'image/multiimageosd/Index/int'
        );
        mAttributes.ImageOverlayMaxResolution = paserXML(
          mAttributes.cgiSection,
          'image/multiimageosd/MaxResolution/string'
        );
        mAttributes.OSDTypes = paserXML(
          mAttributes.cgiSection,
          'image/multilineosd/OSDType/enum'
        );
        /** OSD End  */

        mAttributes.FocusSupportChannel = paserXML(
          mAttributes.cgiSection,
          'image/focus/Channel/csv'
        );
        if (
          mAttributes.FocusSupportChannel &&
          !Array.isArray(mAttributes.FocusSupportChannel)
        ) {
          mAttributes.FocusSupportChannel = range(
            mAttributes.FocusSupportChannel.minValue,
            mAttributes.FocusSupportChannel.maxValue
          ).map(String);
        }
        mAttributes.SimpleFocusOptions = paserXML(
          mAttributes.cgiSection,
          'image/focus/Focus/enum'
        );
        mAttributes.FastAutoFocusEnable = paserXML(
          mAttributes.cgiSection,
          'image/focus/FastAutoFocus/bool'
        );
        mAttributes.SimpleZoomOptions = paserXML(
          mAttributes.cgiSection,
          'image/focus/Zoom/enum'
        );
        mAttributes.FocusModeOptions = paserXML(
          mAttributes.cgiSection,
          'image/focus/Mode/enum'
        );
        mAttributes.FocusControlModeOptions = paserXML(
          mAttributes.cgiSection,
          'image/focus/control/Mode/enum'
        );
        mAttributes.ZoomTrackingModeOptions = paserXML(
          mAttributes.cgiSection,
          'image/focus/ZoomTrackingMode/enum'
        );
        mAttributes.ZoomTrackingSpeedOptions = paserXML(
          mAttributes.cgiSection,
          'image/focus/ZoomTrackingSpeed/enum'
        );
        mAttributes.IRShiftOptions = paserXML(
          mAttributes.cgiSection,
          'image/focus/IRShift/enum'
        );
        mAttributes.FocusContinuous = paserXML(
          mAttributes.cgiSection,
          'image/focus/FocusContinuous/enum'
        );
        mAttributes.ZoomContinuous = paserXML(
          mAttributes.cgiSection,
          'image/focus/ZoomContinuous/enum'
        );

        /** Overlay Start */
        mAttributes.PTZPositionEnable = paserXML(
          mAttributes.cgiSection,
          'image/overlay/PTZPositionEnable/bool'
        );
        mAttributes.PresetNameEnable = paserXML(
          mAttributes.cgiSection,
          'image/overlay/PresetNameEnable/bool'
        );
        mAttributes.CameraIDEnable = paserXML(
          mAttributes.cgiSection,
          'image/overlay/CameraIDEnable/bool'
        );
        mAttributes.AzimuthEnable = paserXML(
          mAttributes.cgiSection,
          'image/overlay/AzimuthEnable/bool'
        );
        mAttributes.IPAddressEnable = paserXML(
          mAttributes.cgiSection,
          'image/overlay/IPAddressEnable/bool'
        );
        /** Overlay End */

        mAttributes.LensResetScheduleOptions = paserXML(
          mAttributes.cgiSection,
          'image/focus/LensResetSchedule/enum'
        );
        mAttributes.IRledModeOptions = paserXML(
          mAttributes.cgiSection,
          'image/irled/Mode/enum'
        );
        mAttributes.IRledLevel = paserXML(
          mAttributes.cgiSection,
          'image/irled/Level/enum'
        );
        mAttributes.IRledZoneLevel = paserXML(
          mAttributes.cgiSection,
          'image/irled/Zone.#.Level/enum'
        );
        mAttributes.LEDOnLevel = paserXML(
          mAttributes.cgiSection,
          'image/irled/LEDOnLevel/int'
        );
        mAttributes.LEDOffLevel = paserXML(
          mAttributes.cgiSection,
          'image/irled/LEDOffLevel/int'
        );
        mAttributes.LEDPowerControlModeOptions = paserXML(
          mAttributes.cgiSection,
          'image/irled/LEDPowerControlMode/enum'
        );
        mAttributes.LEDMaxPowerOptions = paserXML(
          mAttributes.cgiSection,
          'image/irled/LEDMaxPower/enum'
        );
        mAttributes.LEDMaxPowerLevel = paserXML(
          mAttributes.cgiSection,
          'image/irled/LEDMaxPowerLevel/int'
        );
        mAttributes.ScheduleEveryDay = paserXML(
          mAttributes.cgiSection,
          'image/irled/Schedule.EveryDay.FromTo/string'
        );
        mAttributes.ColorOptions = paserXML(
          mAttributes.cgiSection,
          'image/privacy/MaskColor/enum'
        );
        mAttributes.MaskCoordinate = paserXML(
          mAttributes.cgiSection,
          'image/privacy/MaskCoordinate/string'
        );
        mAttributes.PrivacyMaskMaxLen = paserXML(
          mAttributes.cgiSection,
          'image/privacy/MaskName/string'
        );
        mAttributes.PrivacyMaskPattern = paserXML(
          mAttributes.cgiSection,
          'image/privacy/MaskPattern/enum'
        );

        mAttributes.LensModel = paserXML(
          mAttributes.cgiSection,
          'image/fisheyesetup/LensModel/enum'
        );
        mAttributes.CameraPosition = paserXML(
          mAttributes.cgiSection,
          'image/fisheyesetup/CameraPosition/enum'
        );
        mAttributes.ViewModeIndex = paserXML(
          mAttributes.cgiSection,
          'image/fisheyesetup/ViewModeIndex/int'
        );
        mAttributes.ViewModeType = paserXML(
          mAttributes.cgiSection,
          'image/fisheyesetup/ViewModeType/enum'
        );

        mAttributes.PtrPanOptions = paserXML(
          mAttributes.cgiSection,
          'image/ptr/Pan/int'
        );
        mAttributes.PtrTiltOptions = paserXML(
          mAttributes.cgiSection,
          'image/ptr/Tilt/int'
        );
        mAttributes.PtrRotateOptions = paserXML(
          mAttributes.cgiSection,
          'image/ptr/Rotate/int'
        );
        mAttributes.PtrAutoRotateSupport = paserXML(
          mAttributes.cgiSection,
          'image/ptr/AutoRotate/bool'
        );

        mAttributes.LensModelOptions = paserXML(
          mAttributes.cgiSection,
          'image/camera/set/LensModel/enum'
        );
        mAttributes.LensModelViewOptions = paserXML(
          mAttributes.cgiSection,
          'image/camera/view/LensModel/enum'
        );
        mAttributes.IrisModeOptions = paserXML(
          mAttributes.cgiSection,
          'image/camera/set/IrisMode/enum'
        );
        mAttributes.EFIrisPositionOptions = paserXML(
          mAttributes.cgiSection,
          'image/camera/set/EFIrisPosition/enum'
        );
        mAttributes.MaximumIrisOptions = paserXML(
          mAttributes.cgiSection,
          'image/camera/set/MaximumIris/enum'
        );
        mAttributes.PreferIrisOptions = paserXML(
          mAttributes.cgiSection,
          'image/camera/set/PreferIris/enum'
        );

        if (
          mAttributes.PtrRotateOptions &&
          mAttributes.PtrTiltOptions &&
          mAttributes.PtrPanOptions
        ) {
          mAttributes.PTRZModel = true;
        }

        mAttributes.whiteBalanceSupport = paserXML(
          mAttributes.cgiSection,
          'image/whitebalance/Channel/int'
        );
        mAttributes.thermalColorPaletteOptions = paserXML(
          mAttributes.cgiSection,
          'image/camera/ThermalColorPalette/enum'
        );
        mAttributes.thermalCorrectionIntervalOptions = paserXML(
          mAttributes.cgiSection,
          'image/camera/ThermalCorrectionInterval/enum'
        );
        mAttributes.TemperatureSetupSupport =
          typeof paserXML(
            mAttributes.cgiSection,
            'image/thermalpalettesetting/Channel/int'
          ) !== 'undefined';
        mAttributes.emissivityRange = paserXML(
          mAttributes.cgiSection,
          'image/thermalpalettesetting/NormalizedEmissivity/int'
        );
        mAttributes.minimumTemperatureLevel = {
          Celsius: paserXML(
            mAttributes.cgiSection,
            'image/thermalpalettesettingoptions/MinimumTemperatureLevel.Celsius/int'
          ),
          Fahrenheit: paserXML(
            mAttributes.cgiSection,
            'image/thermalpalettesettingoptions/MinimumTemperatureLevel.Fahrenheit/int'
          ),
        };
        mAttributes.maximumTemperatureLevel = {
          Celsius: paserXML(
            mAttributes.cgiSection,
            'image/thermalpalettesettingoptions/MaximumTemperatureLevel.Celsius/int'
          ),
          Fahrenheit: paserXML(
            mAttributes.cgiSection,
            'image/thermalpalettesettingoptions/MaximumTemperatureLevel.Fahrenheit/int'
          ),
        };
        mAttributes.temperatureUnit = paserXML(
          mAttributes.cgiSection,
          'image/camera/TemperatureUnit/enum'
        );
        mAttributes.thermalVariationSensitivity = paserXML(
          mAttributes.cgiSection,
          'image/thermalpalettesetting/ThermalVariationSensitivity/int'
        );

        mAttributes.spotTemperatureSupport =
          typeof paserXML(
            mAttributes.cgiSection,
            'image/spottemperaturereading/Channel/init'
          ) !== 'undefined';

        mAttributes.thermalIamgeVariationSensitivity = paserXML(
          mAttributes.cgiSection,
          'image/camera/ThermalVariationSensitivity/int'
        );

        //NUC
        mAttributes.DisplayPosition = paserXML(
          mAttributes.cgiSection,
          'image/thermalnuc/DisplayPosition/enum'
        );
        mAttributes.IntervalMode = paserXML(
          mAttributes.cgiSection,
          'image/thermalnuc/IntervalMode/enum'
        );
        mAttributes.EveryDay = paserXML(
          mAttributes.cgiSection,
          'image/thermalnuc/EveryDay/enum'
        );
        mAttributes.dddh = paserXML(
          mAttributes.cgiSection,
          'image/thermalnuc/<dddh>/int'
        );
        mAttributes.NUCSchedModeOptions = paserXML(
          mAttributes.cgiSection,
          'image/thermalnuc/<ddd>.<hourIndex>.Mode/csv'
        );

        // XNP-6371RH Focus Attributes
        mAttributes.globalAutoFocusRange = paserXML(
          mAttributes.cgiSection,
          'image/focus/AutoFocusRange/enum'
        );
        mAttributes.presetAutoFocusRange = paserXML(
          mAttributes.cgiSection,
          'ptzconfig/presetimageconfig/AutoFocusRange/enum'
        );

        // PNM-9030V Image Alignment 관련(autoimagealignment)
        //{ maxValue: 100, minValue: 1.5 }
        mAttributes.FovDistanceRange = paserXML(
          mAttributes.cgiSection,
          'image/autoimagealignment/FovDistance/float'
        );
        // ["180Degree", "220Degree"]
        mAttributes.FovAngleRange = paserXML(
          mAttributes.cgiSection,
          'image/autoimagealignment/FovAngle/enum'
        );
        if (typeof mAttributes.FovAngleRange === 'undefined') {
          mAttributes.FovAngleRange = paserXML(
            mAttributes.cgiSection,
            'image/imagealignment/FovAngle/enum'
          );
        }
        mAttributes.ManualCorrectionRange = paserXML(
          mAttributes.cgiSection,
          'image/autoimagealignment/ManualCorrection/int'
        );
        mAttributes.imageCgiAttrReady = true;

        mAttributes.DirectionPositionX = paserXML(
          mAttributes.cgiSection,
          'image/directionindicator/Direction.#.PositionX/int'
        );
        mAttributes.DirectionPositionY = paserXML(
          mAttributes.cgiSection,
          'image/directionindicator/Direction.#.PositionY/int'
        );

        //XNP-6320/6250RH SpecialOSD Attr
        mAttributes.SupportSpecialOSD = paserXML(
          mAttributes.cgiSection,
          'image/imageoptions/SupportedSpecialCharacters/csv'
        );
        //XNZ-L6320 이 후 전 모델 추가된 Attr
        mAttributes.SupportWDRFrameRate = paserXML(
          mAttributes.cgiSection,
          'image/imageoptions/MaxWDRSensorFrameRate/enum'
        );
        mAttributes.ptrpresetSupport = !!paserXML(
          mAttributes.cgiSection,
          'image/ptrpreset/Preset/int'
        );
        mAttributes.supportSmartcodec = paserXML(
          mAttributes.cgiSection,
          'image/smartcodec/Channel/csv'
        );

        mAttributes.focuspresetNameMaxLen = paserXML(
          mAttributes.cgiSection,
          'image/focuspreset/Name/int'
        );
        mAttributes.IrShiftLevel = paserXML(
          mAttributes.cgiSection,
          'image/focuspreset/IRShiftValue/int'
        );

        mAttributes.isBefore_WN7_MODEL = false; // 전 모델 공통 적용요청으로 인해 분기처리 삭제
      }
    },
    parsePTZCgiAttributes: () => {
      if (!mAttributes.ptzCgiAttrReady) {
        if (
          mAttributes.PTZModel ||
          mAttributes.ExternalPTZModel ||
          mAttributes.ZoomOnlyModel ||
          mAttributes.PanTiltOnlyModel
        ) {
          mAttributes.MaxZoom = paserXML(
            mAttributes.cgiSection,
            'ptzcontrol/absolute/Zoom/float'
          );
          mAttributes.AreaZoomProfile = paserXML(
            mAttributes.cgiSection,
            'ptzcontrol/areazoom/Profile/int'
          );
          mAttributes.DaysAfterReboot = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/ptlimits/DaysAfterReboot/int'
          );
          mAttributes.PTLimitInitTime = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/ptlimits/StartTime/int'
          );
          mAttributes.DigitalZoomEnable = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/ptzsettings/DigitalZoomEnable/bool'
          );
          mAttributes.AutoFlipEnable = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/ptzsettings/AutoFlipEnable/bool'
          );
          mAttributes.MaxDigitalZoomOptions = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/ptzsettings/MaxDigitalZoom/enum'
          );
          mAttributes.RememberLastPosition = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/ptzsettings/RememberLastPosition/bool'
          );
          mAttributes.RememberLastPositionDuration = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/ptzsettings/RememberLastPositionDuration/int'
          );
          mAttributes.PresetSSDRLevel = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/presetimageconfig/SSDRLevel/int'
          );
          mAttributes.PresetDynamicRangeOptions = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/presetimageconfig/DynamicRange/enum'
          );
          mAttributes.PresetWhiteBalanceModeOptions = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/presetimageconfig/WhiteBalanceMode/enum'
          );
          mAttributes.PresetWhiteBalanceManualRedLevel = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/presetimageconfig/WhiteBalanceManualRedLevel/int'
          );
          mAttributes.PresetWhiteBalanceManualBlueLevel = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/presetimageconfig/WhiteBalanceManualBlueLevel/int'
          );
          mAttributes.PresetBrightness = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/presetimageconfig/Brightness/int'
          );
          mAttributes.PresetAFLKModeOptions = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/presetimageconfig/AFLKMode/enum'
          );
          mAttributes.PresetSSNRLevel = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/presetimageconfig/SSNRLevel/int'
          );
          mAttributes.PresetIrisModeOptions = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/presetimageconfig/IrisMode/enum'
          );
          mAttributes.PresetIrisFnoOptions = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/presetimageconfig/IrisFno/enum'
          );
          mAttributes.PresetAGCModeOptions = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/presetimageconfig/AGCMode/enum'
          );
          mAttributes.PresetAGCLevel = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/presetimageconfig/AGCLevel/int'
          );
          mAttributes.PresetAGCMaxGainLevel = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/presetimageconfig/AGCMaxGainLevel/int'
          );
          mAttributes.PresetDefogModeOptions = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/presetimageconfig/DefogMode/enum'
          );
          mAttributes.PresetDefogLevel = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/presetimageconfig/DefogLevel/int'
          );
          mAttributes.PresetDayNightModeOptions = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/presetimageconfig/DayNightMode/enum'
          );
          mAttributes.PresetDayNightSwitchingTimeOptions = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/presetimageconfig/DayNightSwitchingTime/enum'
          );
          mAttributes.PresetDayNightSwitchingModeOptions = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/presetimageconfig/DayNightSwitchingMode/enum'
          );
          mAttributes.PresetSharpnessLevel = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/presetimageconfig/SharpnessLevel/int'
          );
          mAttributes.PresetXCEEnable = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/presetimageconfig/XCEEnable/enum'
          );
          mAttributes.PresetXCELevel = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/presetimageconfig/XCELevel/int'
          );
          mAttributes.PresetSaturation = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/presetimageconfig/Saturation/int'
          );
          mAttributes.PresetFocusModeOptions = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/presetimageconfig/FocusMode/enum'
          );
          mAttributes.PresetMaxDigitalZoomOptions = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/presetimageconfig/MaxDigitalZoom/enum'
          );
          mAttributes.PresetContrast = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/presetimageconfig/contrast/enum'
          );
          mAttributes.PTZPresetOptions = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/preset/Preset/int'
          );
          mAttributes.PresetNameMaxLen = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/preset/Name/string'
          );
          mAttributes.PresetActions = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/presetimageconfig/AfterAction/enum'
          );
          mAttributes.PresetTrackingTime = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/presetimageconfig/AfterActionTrackingTime/enum'
          );
          mAttributes.SwingModes = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/swing/Mode/enum'
          );
          mAttributes.AutoRunModes = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/autorun/Mode/enum'
          );
          mAttributes.AutoRunActiveTimeOptions = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/autorun/ActivationTime/enum'
          );
          mAttributes.AutoRunScheduleModes = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/autorun/ScheduleMode/enum'
          );
          mAttributes.AutoPanSpeed = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/autorun/AutoPanSpeed/int'
          );
          mAttributes.AutoPanTiltAngle = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/autorun/AutoPanTiltAngle/int'
          );
          mAttributes.ProportionalPTSpeedModes = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/ptzsettings/ProportionalPTSpeedMode/enum'
          );
          mAttributes.ProportionalPTSpeedLevel = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/ptzsettings/ProportionalPTSpeed/int'
          );
          mAttributes.PTLimitControlModes = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/ptlimits/Mode/enum'
          );
          mAttributes.PTLimitSpeedTypeOptions = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/ptzsettings/SpeedType/enum'
          );
          mAttributes.TiltRangeOptions = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/ptlimits/TiltRange/enum'
          );
          mAttributes.PTZProtocolOptions = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/ptzprotocol/Protocol/enum'
          );
          mAttributes.CameraIDOptions = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/ptzprotocol/CameraID/int'
          );
          mAttributes.ConnectionPortOptions = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/ptzprotocol/ConnectionPortType/enum'
          );
          mAttributes.CoaxProtocolOptions = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/ptzprotocol/CoaxProtocol/enum'
          );
          mAttributes.TraceStatusOptions = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/trace/check/Status/enum'
          );
          mAttributes.OpticalMaxZoom = paserXML(
            mAttributes.cgiSection,
            'ptzcontrol/relative/Zoom/float'
          );
          mAttributes.PresetDNSwitchColorToBWThreshold = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/presetimageconfig/DNSwitchColorToBWThreshold/int'
          );
          mAttributes.PresetDNSwitchBWToColorThreshold = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/presetimageconfig/DNSwitchBWToColorThreshold/int'
          );
        }

        if (mAttributes.isDigitalRTZ) {
          mAttributes.RTZRotate = paserXML(
            mAttributes.cgiSection,
            'ptzcontrol/digitalrtz/Rotate/float'
          );
          mAttributes.RTZTilt = paserXML(
            mAttributes.cgiSection,
            'ptzcontrol/digitalrtz/Tilt/float'
          );
          mAttributes.RTZViewmode = paserXML(
            mAttributes.cgiSection,
            'ptzcontrol/digitalrtz/ViewModeIndex/int'
          );
          mAttributes.RTZSubViewIndex = paserXML(
            mAttributes.cgiSection,
            'ptzcontrol/digitalrtz/SubViewIndex/int'
          );
        }

        if (mAttributes.isDigitalPTZ) {
          mAttributes.DigitalAutoTrackingOptions = paserXML(
            mAttributes.cgiSection,
            'ptzcontrol/digitalautotracking/Mode/enum'
          );
          mAttributes.DigitalAutoTrackingObjectTypeFilter = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/digitalautotracking/ObjectTypeFilter/enum'
          );
          mAttributes.supporedDPTZActions = paserXML(
            mAttributes.cgiSection,
            'ptzcontrol/supportedptzactions/Support.ViewMode/enum'
          );
        }

        if (mAttributes.GroupSupport) {
          mAttributes.PresetDwellTimeLimits = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/group/DwellTime/int'
          );
          mAttributes.PresetSpeedLimits = paserXML(
            mAttributes.cgiSection,
            'ptzconfig/group/Speed/int'
          );
        }
        mAttributes.ExclusivePTZEnable = paserXML(
          mAttributes.cgiSection,
          'ptzconfig/exclusiveptzcontrol/Enable/bool'
        );

        mAttributes.ptzCgiAttrReady = true;
      }
    },
    parseOpenSDKCgiAttributes: () => {
      if (!mAttributes.openSDKCgiAttrReady) {
        mAttributes.OpenSDKPriorityOptions = paserXML(
          mAttributes.cgiSection,
          'opensdk/apps/<AppID>.Priority/enum'
        );

        mAttributes.openSDKCgiAttrReady = true;
      }
    },
    parseVideoCgiAttributes: () => {
      if (!mAttributes.VideoCgiAttrReady) {
        mAttributes.SlideShowOptions = paserXML(
          mAttributes.cgiSection,
          'video/slideshow/Status/enum'
        );

        mAttributes.VideoCgiAttrReady = true;
      }
    },
    getAttributes: () => {
      return mAttributes;
    },
    setPresetOption: () => {
      mAttributes.PresetOptions = ['Off'];
      for (var preset = 1; preset <= mAttributes.MaxPreset; preset++) {
        mAttributes.PresetOptions.push(preset);
      }
      if (mAttributes.SupportDeviceType === 'Encoder') {
        mAttributes.PresetOptions.splice(16, 69);
        mAttributes.PresetOptions.splice(19, 7);
        mAttributes.PresetOptions.splice(20, 1);
      }
    },
    LoginRedirect: () => {
      if (
        RestClientConfig.serverType === 'grunt' ||
        RestClientConfig.specialType !== 'browserAuth'
      ) {
        $location.path('/login');
      }
    },
    //workaround till arribute is updated after daynight mode change
    getAppStatus: (appId) => {
      var getData = {};
      var AppId = 'WiseAI';
      var appIDEncode = encodeURIComponent(AppId);
      getData.AppID = appIDEncode;

      return new Promise(function (resolve, reject) {
        SunapiClient.get(
          '/stw-cgi/opensdk.cgi?msubmenu=apps&action=view',
          getData,
          function (response) {
            try {
              var appStatus = response.data.Apps[0].Status;
              mAttributes.WiseAIAppStatus = appStatus;
              deferred.resolve(appStatus);
            } catch (error) {
              console.error(error);
              throw new AttributeException({
                errorCode: fromHex('0x1200'),
                place: 'attributes.js:getAppStatus',
                message: 'Attribute parsing error.',
              });
            }
          },
          function (error) {
            console.log(error);
            reject(error);
          },
          '',
          false
        );
      });
    },
    getViewModes: () => {
      return new Promise(function (resolve, reject) {
        return SunapiClient.get(
          '/stw-cgi/image.cgi?msubmenu=viewmodes&action=view',
          {},
          function (response) {
            try {
              mAttributes.ViewModes = new Array(mAttributes.MaxChannel);
              response.data.Viewmodes.forEach(function (value) {
                mAttributes.ViewModes[value.Channel] = value.Type;
              });
              resolve();
            } catch (error) {
              console.error(error);
              throw new AttributeException({
                errorCode: fromHex('0x1200'),
                place: 'attributes.js:getViewModes',
                message: 'Attribute parsing error.',
              });
            }
          },
          function (error) {
            console.log(error);
            reject(error);
          },
          '',
          false
        );
      });
    },
    setDeviceInfo: (deviceInfo) => {
      try {
        mAttributes.ModelName = deviceInfo.Model;
        mAttributes.DeviceType = deviceInfo.DeviceType;
        mAttributes.FirmwareVersion = deviceInfo.FirmwareVersion;
        mAttributes.CurrentLanguage = deviceInfo.Language;

        if (typeof deviceInfo.ActualDeviceType !== 'undefined') {
          mAttributes.ActualDeviceType = deviceInfo.ActualDeviceType;
        }

        if (typeof deviceInfo.ISPVersion !== 'undefined') {
          mAttributes.ISPVersion = deviceInfo.ISPVersion;
        }
        if (typeof deviceInfo.PTZISPVersion !== 'undefined') {
          mAttributes.PTZISPVersion = deviceInfo.PTZISPVersion;
        }

        if (typeof deviceInfo.CGIVersion !== 'undefined') {
          mAttributes.CGIVersion = deviceInfo.CGIVersion;
        }

        if (typeof deviceInfo.OpenSSLVersion !== 'undefined') {
          mAttributes.OpenSSLVersion = deviceInfo.OpenSSLVersion;
        }

        if (typeof deviceInfo.TrackingVersion !== 'undefined') {
          mAttributes.TrackingVersion = deviceInfo.TrackingVersion;
        }

        if (typeof deviceInfo.BuildDate !== 'undefined') {
          mAttributes.BuildDate = deviceInfo.BuildDate;
        }

        if (typeof deviceInfo.ONVIFVersion !== 'undefined') {
          mAttributes.ONVIFVersion = deviceInfo.ONVIFVersion;
        }

        if (typeof deviceInfo.OpenSDKVersion !== 'undefined') {
          mAttributes.OpenSDKVersion = deviceInfo.OpenSDKVersion;
        }

        if (typeof deviceInfo.AIModelDetectionVersion !== 'undefined') {
          mAttributes.AIModelDetectionVersion =
            deviceInfo.AIModelDetectionVersion;
        }

        console.log('Device Info Ready');

        //Temp
        var modelName = deviceInfo.Model;
        mAttributes.SupportMinimap = modelName === 'TNB-9000';
        mAttributes.LiteModel = false;
        mAttributes.X_LiteModel = false;
        mAttributes.rectMasking = false;
        try {
          mAttributes.LiteModel = /^(L)/.test(mAttributes.ModelName);
          mAttributes.X_LiteModel = /^(X)..-[L]/g.test(mAttributes.ModelName);
        } catch (e) {
          console.error(e);
          throw new AttributeException({
            errorCode: fromHex('0x1200'),
            place: 'attributes.js:getDeviceInfo',
            message: 'Attribute parsing error on Model name.',
          });
        }

        mAttributes.DeviceInfoReady = true;
      } catch (error) {
        console.error(error);
        throw new AttributeException({
          errorCode: fromHex('0x1200'),
          place: 'attributes.js:getDeviceInfo',
          message: 'Attribute parsing error.',
        });
      }
    },
    initialize: () => {
      if (!isPhone) {
        const functionList = [];
        mAttributes.GetFail = false;

        if (!mAttributes.DeviceInfoReady) {
          functionList.push(getDeviceInfo());
        }
        if (!mAttributes.WebHiddenInfoReady) {
          functionList.push(getWebHiddenInfo());
          functionList.push(getAiVersionInfo());
        }
        if (!mAttributes.EventSourceOptionsReady) {
          functionList.push(getEventSourceOptions());
        }
        if (!mAttributes.AttributeSectionReady) {
          functionList.push(getAttributeSection());
        }
        if (!mAttributes.CgiSectionReady) {
          functionList.push(getCgiSection());
        }
        if (AccountService.isAdmin) {
          functionList.push(cameraView());
          if (mAttributes.OpenSDKSupport) {
            functionList.push(openAppView());
          }
        }
        if (!mAttributes.setupProfileInfoReady) {
          functionList.push(getSetupProfileInfo());
        }
        if (!mAttributes.PTZModeInfoReady) {
          functionList.push(this.getPTZModeInfo);
        }
        if (!mAttributes.mediaCgiAttrReady) {
          functionList.push(this.getCropChannelOptions);
        }
        if (functionList.length === 0) {
          return;
        }

        const catchHandler = (error) => ({ payload: error, resolved: false });

        try {
          // https://dmitripavlutin.com/promise-all/
          // const allPromise = Promise.all(functionList);
          // return Promise.all([
          //   new Promise((resolve) => setTimeout(() => resolve(1), 3000)), // 1
          //   new Promise((resolve) => setTimeout(() => resolve(2), 2000)), // 2
          //   new Promise((resolve) => setTimeout(() => resolve(3), 1000)), // 3
          // ]); //.then(alert); // 프라미스 전체가 처리되면 1, 2, 3이 반환됩니다. 각 프라미스는 배열을 구성하는 요소가 됩니다.
          return Promise.all(functionList);
        } catch (error) {
          console.log(error.message); // 'Out of fruits!'
          catchHandler(error);
        }
        // skip the error occur because of cgi did not support.
        // reference from:
        // https://stackoverflow.com/questions/57981712/function-call-inside-promise-all
        // return Promise.all(functionList)
        //   .then(() => {
        //     console.log('Complte function list on Attributes::initialize:');
        //     const test = () => {
        //       mAttributes.retryCount = 0;
        //       (function wait() {
        //         if (!mAttributes.Ready && !mAttributes.GetFail) {
        //           setTimeout(function () {
        //             if (
        //               mAttributes.DeviceInfoReady &&
        //               mAttributes.CgiSectionReady &&
        //               mAttributes.AttributeSectionReady
        //             ) {
        //               if (
        //                 AccountService.isAdmin &&
        //                 mAttributes.EventSourceOptionsReady === false
        //               ) {
        //                 console.log(
        //                   'event sources Waiting ..',
        //                   mAttributes.retryCount
        //                 );
        //                 mAttributes.retryCount++;

        //                 if (mAttributes.retryCount >= RETRY_COUNT) {
        //                   mAttributes.GetFail = true;
        //                 }
        //               } else {
        //                 mAttributes.Ready = true;
        //                 this.runHookReadyStatus();
        //               }
        //             } else {
        //               console.log('Waiting ..', mAttributes.retryCount);
        //               mAttributes.retryCount++;

        //               if (mAttributes.retryCount >= RETRY_COUNT) {
        //                 mAttributes.GetFail = true;
        //               }
        //             }
        //             wait();
        //           }, timeOutValue);
        //         } else {
        //           // var changedUrl = $location.absUrl();
        //           // if (changedUrl.indexOf('login') === -1 && mAttributes.GetFail) {
        //           //   if ((RestClientConfig.serverType === 'grunt' || RestClientConfig.specialType !== 'browserAuth') && !mAttributes.isBypass) {
        //           //     console.log("Logging out");
        //           //     SessionOfUserManager.unSetLogin();
        //           //     LoginRedirect(); // jshint ignore:line
        //           //   } else {
        //           //     console.log("Retry Call attributes");
        //           //     initialize(TIMEOUT);
        //           //   }
        //           // }
        //         }
        //       })();
        //     };
        //     const test1 = () => {
        //       if (
        //         (RestClientConfig.serverType === 'grunt' ||
        //           RestClientConfig.specialType !== 'browserAuth') &&
        //         !mAttributes.isBypass
        //       ) {
        //         console.log('Logging out');
        //         // SessionOfUserManager.unSetLogin();
        //         LoginRedirect(); // jshint ignore:line
        //       } else {
        //         console.log('Retry Call attributes');
        //         this.initialize(TIMEOUT);
        //       }
        //     };
        //     test();
        //   })
        //   .catch((error) => {
        //     console.error(error);
        //     throw error;
        //   });
      }
    },
    fetchData: () => {
      console.log('Complte function list on Attributes::fetchData:');
      mAttributes.retryCount = 0;
      (function wait() {
        if (!mAttributes.Ready && !mAttributes.GetFail) {
          setTimeout(function () {
            if (
              mAttributes.DeviceInfoReady &&
              mAttributes.CgiSectionReady &&
              mAttributes.AttributeSectionReady
            ) {
              if (
                AccountService.isAdmin &&
                mAttributes.EventSourceOptionsReady === false
              ) {
                console.log('event sources Waiting ..', mAttributes.retryCount);
                mAttributes.retryCount++;

                if (mAttributes.retryCount >= RETRY_COUNT) {
                  mAttributes.GetFail = true;
                }
              } else {
                mAttributes.Ready = true;
                this.runHookReadyStatus();
              }
            } else {
              console.log('Waiting ..', mAttributes.retryCount);
              mAttributes.retryCount++;

              if (mAttributes.retryCount >= RETRY_COUNT) {
                mAttributes.GetFail = true;
              }
            }
            wait();
          }, TIMEOUT);
        } else {
          // var changedUrl = $location.absUrl();
          // if (changedUrl.indexOf('login') === -1 && mAttributes.GetFail) {
          //   if ((RestClientConfig.serverType === 'grunt' || RestClientConfig.specialType !== 'browserAuth') && !mAttributes.isBypass) {
          //     console.log("Logging out");
          //     SessionOfUserManager.unSetLogin();
          //     LoginRedirect(); // jshint ignore:line
          //   } else {
          //     console.log("Retry Call attributes");
          //     initialize(TIMEOUT);
          //   }
          // }
        }
      })();
    },
    get: (cgiName) => {
      var heightWithoutNavbar = $('body').height() - (17 + 71);
      $('#page-wrapper').css('min-height', heightWithoutNavbar + 'px');

      if (
        mAttributes.CgiSectionReady === true &&
        mAttributes.AttributeSectionReady === true
      ) {
        if (typeof cgiName === 'undefined') {
          this.parseSystemCgiAttributes();
          this.parseMediaCgiAttributes();
          this.parseNetworkCgiAttributes();
          this.parseTransferCgiAttributes();
          this.parseSecurityCgiAttributes();
          this.parseEventStatusCgiAttributes();
          this.parseIOCgiAttributes();
          this.parseEventSourceCgiAttributes();
          this.parseRecordingCgiAttributes();
          this.parseEventRulesCgiAttributes();
          this.parseEventActionsCgiAttributes();
          this.parseImageCgiAttributes();
          this.parsePTZCgiAttributes();
          this.parseOpenSDKCgiAttributes();
          this.parseVideoCgiAttributes();
          this.parseStoratocastCgiAttribute();
          this.parseSIPCgiAttribute();
        } else {
          switch (cgiName) {
            case 'system':
              this.parseSystemCgiAttributes();
              break;
            case 'media':
              this.parseMediaCgiAttributes();
              break;
            case 'network':
              this.parseNetworkCgiAttributes();
              break;
            case 'transfer':
              this.parseTransferCgiAttributes();
              break;
            case 'security':
              this.parseSecurityCgiAttributes();
              break;
            case 'eventstatus':
              this.parseEventStatusCgiAttributes();
              break;
            case 'io':
              this.parseIOCgiAttributes();
              break;
            case 'eventsources':
              this.parseEventSourceCgiAttributes();
              break;
            case 'recording':
              this.parseRecordingCgiAttributes();
              break;
            case 'eventrules':
              this.parseEventRulesCgiAttributes();
              break;
            case 'eventactions':
              this.parseEventActionsCgiAttributes();
              break;
            case 'image':
              this.parseImageCgiAttributes();
              break;
            case 'ptz':
              this.parsePTZCgiAttributes();
              break;
            case 'opensdk':
              this.parseOpenSDKCgiAttributes();
              break;
            case 'stratocast':
              this.parseStoratocastCgiAttribute();
              break;
            case 'video':
              this.parseVideoCgiAttributes();
              break;
            case 'sip':
              this.parseSIPCgiAttribute();
              break;
            default:
          }
        }
      }
      return mAttributes;
    },
    hookReadyStatus: (callback) => {
      if (mAttributes.Ready === true) {
        callback();
      } else {
        readyStatusCallbacks.push(callback);
      }
    },
    runHookReadyStatus: () => {
      readyStatusCallbacks.forEach(function (callback) {
        callback();
      });

      readyStatusCallbacks = [];
    },
    reset: () => {
      mAttributes = {};
    },
    isSupportGoToPreset: () => {
      return typeof mAttributes.EventLogTypes !== 'undefined';
    },
    getPresetOptions: () => {
      var returnVal = false;
      try {
        if (this.isSupportGoToPreset()) {
          if (mAttributes.EventActions.indexOf('GoToPreset') >= 0) {
            this.setPresetOption();
            returnVal = mAttributes.PresetOptions;
          }
        } else {
          console.error('mAttributes.EventLogTypes is undefined');
        }
      } catch (err) {
        returnVal = mAttributes.PresetOptions;
        console.error(err);
      }

      return returnVal;
    },
    loginBypass: (ref) => {
      // Set NVR Network Info
      mAttributes.isBypass = true;
      var elem = document.createElement('a');
      elem.href = document.referrer;
      if (elem.hostname !== '127.0.0.1') {
        var splitProtocol = elem.protocol.split(':');
        SessionOfUserManager.setBypassProtocol(splitProtocol[0]);
        SessionOfUserManager.setBypassIP(elem.hostname);
        SessionOfUserManager.setBypassPort(elem.port);
      }

      // Set NVR Channel
      var strPath = $location.$$path.split('/');
      if (strPath[strPath.length - 2].match(mAttributes.OnlyNumber)) {
        var bypassChannel = strPath[strPath.length - 2];
        SessionOfUserManager.setBypassChannel(bypassChannel);
      } else {
        console.error('Wrong Bypass Channel');
        return;
      }

      if (!strPath[strPath.length - 1].match(mAttributes.OnlyNumber)) {
        console.error('Wrong Camera Channel');
        return;
      }

      console.log('Login Bypass... ' + elem.href);

      SunapiClient.get(
        '/stw-cgi/system.cgi?msubmenu=deviceinfo&action=view',
        '',
        function (Response) {
          SessionOfUserManager.addSession(
            'admin',
            '',
            CAMERA_STATUS.WEB_APP_TYPE.IPOLIS_WEB
          );
          SessionOfUserManager.setLogin();
          this.initialize(TIMEOUT);
        },
        function () {},
        '',
        true
      );
    },
    login: () => {
      var deferred = $q.defer();

      SunapiClient.get(
        '/stw-cgi/system.cgi?msubmenu=deviceinfo&action=view',
        {},
        function (response) {
          MultiLanguage.setLanguage(response.data.Language);
          SunapiClient.get(
            '/stw-cgi/security.cgi?msubmenu=users&action=view',
            {},
            function (response) {
              var accountInfo = {};
              var data = response.data.Users;

              if (data.length === 1) {
                //user
                accountInfo = data[0];
              } else if (data.length === 0) {
                //guest
                accountInfo.UserID = 'guest';
              } else {
                //admin or user(adminAccess)
                if (typeof data[0].AdminAccess === 'undefined') {
                  accountInfo = data[0];
                } else {
                  for (var idx = 0; idx < data.length; idx++) {
                    if (data[idx].AdminAccess) {
                      accountInfo = data[idx];
                      break;
                    }
                  }
                }
              }

              if (
                RestClientConfig.serverType === 'camera' &&
                RestClientConfig.specialType === 'browserAuth'
              ) {
                SessionOfUserManager.addSession(
                  accountInfo.UserID,
                  '',
                  CAMERA_STATUS.WEB_APP_TYPE.IPOLIS_WEB
                );
              }

              UniversialManagerService.setUserId(accountInfo.UserID);
              AccountService.setAccount(accountInfo);
              SessionOfUserManager.setLogin();
              deferred.resolve();
            },
            function (error) {
              deferred.reject(error);
            },
            '',
            false
          );
        },
        function (errorData, errorCode) {
          deferred.reject(errorCode);
        },
        '',
        false
      );

      return deferred.promise;
    },
    checkInitPw: (isRedirect) => {
      var _self = this.self;
      return new Promise(function (resolve, reject) {
        try {
          //NVR은 pw_init 미지원으로 처리
          // if ($location.$$path.indexOf('mashup') !== -1) {
          //   deferred.resolve(404);
          //   return deferred.promise;
          // }
          var xmlHttp = new XMLHttpRequest();
          var reqUrl = '';
          var restClientConfig = RestClientConfig.digest;
          var server =
            restClientConfig.protocol + '://' + restClientConfig.hostName;
          if (
            typeof restClientConfig.port !== 'undefined' &&
            restClientConfig.port !== null &&
            restClientConfig.port !== ''
          ) {
            server += ':' + restClientConfig.port;
          }

          if (RestClientConfig.serverType === 'grunt') {
            reqUrl = server;
          } else {
            reqUrl = '..';
          }

          reqUrl += '/init-cgi/pw_init.cgi?msubmenu=statuscheck&action=view';
          reqUrl += '&date=' + new Date().getTime();
          xmlHttp.open('GET', reqUrl, true);
          xmlHttp.setRequestHeader('Accept', 'application/json');
          xmlHttp.timeout = 5000;
          xmlHttp.send(null);

          xmlHttp.onreadystatechange = function () {
            var responseData = null;
            if (this.readyState === 4) {
              if (this.status === 200) {
                //OK
                responseData = JSON.parse(xmlHttp.response);

                if (
                  typeof responseData.SpecialType !== 'undefined' &&
                  responseData.SpecialType !== 'none'
                ) {
                  if (
                    restSpecialTypeList.indexOf(responseData.SpecialType) >= 0
                  ) {
                    RestClientConfig.specialType = responseData.SpecialType;
                  } else {
                    // dt: dual thermal camera, nosd: FFGroupd open app
                    mAttributes.SupportDeviceType = responseData.SpecialType;
                  }
                }

                if (typeof responseData.Language !== 'undefined') {
                  MultiLanguage.setLanguage(responseData.Language);
                }

                if (responseData.Initialized) {
                  if (
                    RestClientConfig.serverType === 'camera' &&
                    RestClientConfig.specialType === 'browserAuth'
                  ) {
                    //To detect caller from module.js
                    if (
                      (_self && _self.url === '/login') ||
                      SessionOfUserManager.isLoggedin()
                    ) {
                      resolve(responseData);
                    } else {
                      _self
                        .login()
                        .then(function () {
                          _self.initialize(TIMEOUT);
                          resolve(responseData);
                        })
                        .catch(function (error) {
                          reject(error);
                        });
                    }
                  } else {
                    //To detect caller from module.js
                    if (_self && _self.url === '/login') {
                      resolve(responseData);
                    } else {
                      SessionOfUserManager.isLoggedin();
                      _self
                        .login()
                        .then(function () {
                          _self.initialize(TIMEOUT);
                          resolve(responseData);
                        })
                        .catch(function (error) {
                          reject(error);
                        });
                    }
                  }
                } else {
                  reject();
                  if (isRedirect) {
                    if (typeof responseData.Initialized === 'undefined') {
                      window.open('about:blank', '_self');
                      !!document.documentMode && window.location.reload();
                    }
                    $state.go('change_password', {
                      rsaPubKey: responseData.PublicKey,
                    });
                  }
                }
              } else if (this.status === 401) {
                //Unauth
                reject(this.status);
              } else if (this.status === 490) {
                //Accout block
                reject(this.status);
              } else if (this.status === 404) {
                console.log('Not support init-cgi');
                resolve(this.status);
              } else {
                reject(this.status);
              }
            }
          };
        } catch (e) {
          reject(e);
          console.error(e);
        }
      });
    },
    initReadyStatus: () => {
      mAttributes.Ready = false;
      mAttributes.CgiSectionReady = false;
      mAttributes.AttributeSectionReady = false;
      mAttributes.DeviceInfoReady = false;
      mAttributes.WebHiddenInfoReady = false;
      mAttributes.EventSourceOptionsReady = false;
      mAttributes.setupProfileInfoReady = false;
    },
    reGet: () => {
      return new Promise(function (resolve, reject) {
        if (mAttributes.Ready) {
          this.initReadyStatus();
          this.initialize(TIMEOUT);
        }

        (function checkCompleted() {
          if (mAttributes.Ready) {
            resolve();
          } else if (mAttributes.GetFail) {
            reject();
          } else {
            setTimeout(checkCompleted, TIMEOUT);
          }
        })();
      });
    },
  };
  return new Constructor(sunapiClient);
};
