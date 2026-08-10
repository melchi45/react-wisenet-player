export enum UmpPlayType {
  LIVE = 0, // 0
  PLAYBACK = 1, // 1
  BACKUP = 2, // 2
  INSTANTPLAYBACK = 3, // 3
};

export enum UmpPlayState {
  STOPPED = 0, // 0
  PLAYING = 1, // 1
  PAUSED = 2, // 2
  STEP = 3, // 3
};

export enum UmpPlaybackControlType {
  NONE = 0, // 0
  RESUME = 1, // 1
  SEEK = 2, // 2
  FORWARD = 3, // 3
  BACKWARD = 4, // 4
  PAUSE = 5, // 5
  SPEED = 6, // 6
  BACKUP = 7, // 7
};

export const UmpPlaySpeed = {
  speed_0_125x: {
    value: 0.125,
    name: '0.125x',
  },
  speed_0_25x: {
    value: 0.25,
    name: '0.25x',
  },
  speed_0_50x: {
    value: 0.5,
    name: '0.50x',
  },
  speed_0_75x: {
    value: 0.75,
    name: '0.75x',
  },
  speed_0_0x: {
    value: +0.0,
    name: '+0.0x',
  },
  speed_1x: {
    value: 1,
    name: '1x',
  },
  speed_2x: {
    value: 2,
    name: '2x',
  },
  speed_4x: {
    value: 4,
    name: '4x',
  },
  speed_8x: {
    value: 8,
    name: '8x',
  },
  speed_16x: {
    value: 16,
    name: '16x',
  },
  speed_32x: {
    value: 32,
    name: '32x',
  },
  speed_64x: {
    value: 64,
    name: '64x',
  },
  speed_128x: {
    value: 128,
    name: '128x',
  },
  speed_256x: {
    value: 256,
    name: '256x',
  },
  seek_0_125x: {
    value: -0.125,
    name: '-0.125x',
  },
  seek_0_25x: {
    value: -0.25,
    name: '-0.25x',
  },
  seek_0_50x: {
    value: -0.5,
    name: '-0.50x',
  },
  seek_0_75x: {
    value: -0.75,
    name: '-0.75x',
  },
  seek_0_0x: {
    value: -0.0,
    name: '-0.0x',
  },
  seek_1x: {
    value: -1,
    name: '-1x',
  },
  seek_2x: {
    value: -2,
    name: '-2x',
  },
  seek_4x: {
    value: -4,
    name: '-4x',
  },
  seek_8x: {
    value: -8,
    name: '-8x',
  },
  seek_16x: {
    value: -16,
    name: '-16x',
  },
  seek_32x: {
    value: -32,
    name: '-32x',
  },
  seek_64x: {
    value: -64,
    name: '-64x',
  },
  seek_128x: {
    value: -128,
    name: '-128x',
  },
  seek_256x: {
    value: -256,
    name: '-256x',
  },
};

export const deviceTypeOptions = [
  { value: 0, type: 'camera', label: "Camera" },
  { value: 3, type: 'nvr', label: "NVR" },
  { value: 4, type: 'iobox', label: "IO Box" },
  { value: 8, type: 'aibox', label: "AI Box" }
];

export const deviceHttpOptions = [
  { value: false, label: "http" },
  { value: true, label: "https" }
];

export const deviceChannelOptions = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" },
  { value: 6, label: "6" },
  { value: 7, label: "7" },
  { value: 8, label: "8" },
  { value: 9, label: "9" },
  { value: 10, label: "10" },
  { value: 11, label: "11" },
  { value: 12, label: "12" },
  { value: 13, label: "13" },
  { value: 14, label: "14" },
  { value: 15, label: "15" },
  { value: 16, label: "16" },
  { value: 17, label: "17" },
  { value: 18, label: "18" },
  { value: 19, label: "19" },
  { value: 20, label: "20" },
  { value: 21, label: "21" },
  { value: 22, label: "22" },
  { value: 23, label: "23" },
  { value: 24, label: "24" },
  { value: 25, label: "25" },
  { value: 26, label: "26" },
  { value: 27, label: "27" },
  { value: 28, label: "28" },
  { value: 29, label: "29" },
  { value: 30, label: "30" },
  { value: 31, label: "31" },
  { value: 32, label: "32" },
  { value: 33, label: "33" },
  { value: 34, label: "34" },
  { value: 35, label: "35" },
  { value: 36, label: "36" },
  { value: 37, label: "37" },
  { value: 38, label: "38" },
  { value: 39, label: "39" },
  { value: 40, label: "40" },
  { value: 41, label: "41" },
  { value: 42, label: "42" },
  { value: 43, label: "43" },
  { value: 44, label: "44" },
  { value: 45, label: "45" },
  { value: 46, label: "46" },
  { value: 47, label: "47" },
  { value: 48, label: "48" },
  { value: 49, label: "49" },
  { value: 50, label: "50" },
  { value: 51, label: "51" },
  { value: 52, label: "52" },
  { value: 53, label: "53" },
  { value: 54, label: "54" },
  { value: 55, label: "55" },
  { value: 56, label: "56" },
  { value: 57, label: "57" },
  { value: 58, label: "58" },
  { value: 59, label: "59" },
  { value: 60, label: "60" },
  { value: 61, label: "61" },
  { value: 62, label: "62" },
  { value: 63, label: "63" },
  { value: 64, label: "64" }
];

export interface ISearchDevice {
  id: string,
  Model: string,
  Type: number,
  Username: string,
  Password: string,
  IPAddress: string,
  MACAddress: string,
  Port: number,
  Channel: number,
  MaxChannel: number,
  HttpType: boolean,
  HttpPort: number,
  HttpsPort: number,
  Gateway: string,
  SubnetMask: string,
  SupportSunapi: boolean,
  URL: string
};

export interface IDevice {
  id: string;
  hostname: string;
  port: number;
  username: string;
  profile: string;
  channel: number;
  device: string;
  password: String;
  autoplay: boolean;
  statistics: boolean;
  https: boolean;
};

export interface SearchDevicesProps {
  devices: ISearchDevice[];
};

export interface DeviceTableProps extends SearchDevicesProps {
  selectedDevicesFromParents: IDevice[];
};

export interface SingleDevicesProps {
  device: IDevice;
};

export interface MultiDevicesProps {
  devices: IDevice[];
};

export interface ResetClientProps {
  ClientIPAddress: String;
  cameraIp: String;
  captureName: String;
  username: String;
  user: String;
  password: String;
  port: Number;
  https: Boolean;
  protocol: String;
  hostname: String;
  deviceType: String;
  serverType: String; // 'grunt' or 'camera'
  timeout: Number;
  debug: Boolean;
  async: Boolean;
};

export interface IInitializedData {
  Initialized: boolean;
  Language: string;
  MaxChannel: number;
  MaxPasswordLength: number;
  NewPasswordPolicy: boolean;
}

export interface PlayerProps {
  device: IDevice;
  control: boolean;
};

export enum MediaType {
  Audio = 'audio',
  Video = 'video'
}

export enum StatisticsType {
  rtp = 'rtp',
  fps = 'fps',
  network = 'network'
}

export enum AudioCodecType {
  G711 = 'G.711',
  G726 = 'G.726',
  AAC = 'AAC'
}

export enum VideoCodecType {
  MJPEG = 'MJPEG',
  H264 = 'H.264',
  H265 = 'H.265'
}

export interface RTPStatistics {
  type: StatisticsType;
  channelId: number;
  interleavedId: number;
  codec: AudioCodecType | VideoCodecType;
  media: MediaType;
  fps: number;
  interval: number;
  receviedPacket: number;
  droppedPacket: number;
}

export interface FPSStatistics {
  type: StatisticsType;
  channelId: number;
  width: number;
  height: 2160;
  fps: number;
  decodedPerSec: number;
  decodedFrames: number;
  decodedFramesMean: number;
  decodedBytesDecodedPerSec: number;
  decodedBytesMean: number;
  dropFramesCount: number;
  dropFramesMean: number;
  bps: number;
  latency: number;
  limit: number;
  chunksize: number;
}

export interface Statistics {
  statistics: RTPStatistics | FPSStatistics;
  channelId: number;
  elementId: string;
}
