import AsyncStorage from '@react-native-async-storage/async-storage';
import { IDevice } from '../types';

const DEVICES_KEY = 'wisenet_devices';

export const deviceStore = {
  async getAll(): Promise<IDevice[]> {
    const raw = await AsyncStorage.getItem(DEVICES_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  async save(devices: IDevice[]): Promise<void> {
    await AsyncStorage.setItem(DEVICES_KEY, JSON.stringify(devices));
  },

  async add(device: IDevice): Promise<void> {
    const devices = await this.getAll();
    const existing = devices.findIndex(d => d.id === device.id);
    if (existing >= 0) {
      devices[existing] = device;
    } else {
      devices.push(device);
    }
    await this.save(devices);
  },

  async remove(id: string): Promise<void> {
    const devices = await this.getAll();
    await this.save(devices.filter(d => d.id !== id));
  },
};
