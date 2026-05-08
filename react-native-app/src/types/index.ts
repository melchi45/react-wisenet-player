export interface IDevice {
  id: string;
  hostname: string;
  port: number;
  username: string;
  password: string;
  profile: string;
  channel: number;
  device: string;
  autoplay: boolean;
  statistics: boolean;
  https: boolean;
}

export interface ISearchDevice {
  id: string;
  Model: string;
  Type: number;
  Username: string;
  Password: string;
  IPAddress: string;
  MACAddress: string;
  Port: number;
  Channel: number;
  MaxChannel: number;
  HttpType: boolean;
  HttpPort: number;
  HttpsPort: number;
  Gateway: string;
  SubnetMask: string;
  SupportSunapi: boolean;
  URL: string;
}

export type RootStackParamList = {
  Home: undefined;
  AddDevice: { device?: IDevice };
  Player: { device: IDevice };
  MultiPlayer: { devices: IDevice[] };
};
