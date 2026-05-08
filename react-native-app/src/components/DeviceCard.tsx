import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IDevice } from '../types';

interface DeviceCardProps {
  device: IDevice;
  onPlay: (device: IDevice) => void;
  onEdit: (device: IDevice) => void;
  onDelete: (id: string) => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, onPlay, onEdit, onDelete }) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.info} onPress={() => onPlay(device)}>
        <Text style={styles.hostname}>
          {device.https ? 'https' : 'http'}://{device.hostname}:{device.port}
        </Text>
        <Text style={styles.detail}>
          Channel {device.channel} · {device.device} · {device.profile}
        </Text>
        <Text style={styles.detail}>User: {device.username}</Text>
      </TouchableOpacity>
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.btn, styles.playBtn]} onPress={() => onPlay(device)}>
          <Text style={styles.btnText}>▶</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.editBtn]} onPress={() => onEdit(device)}>
          <Text style={styles.btnText}>✎</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.deleteBtn]} onPress={() => onDelete(device.id)}>
          <Text style={styles.btnText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#1e2a3a',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 6,
    overflow: 'hidden',
  },
  info: {
    flex: 1,
    padding: 14,
  },
  hostname: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  detail: {
    color: '#8ba1b7',
    fontSize: 12,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  btn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  playBtn: { backgroundColor: '#0098e5' },
  editBtn: { backgroundColor: '#44596e' },
  deleteBtn: { backgroundColor: '#c0392b' },
  btnText: { color: '#fff', fontSize: 14 },
});

export default DeviceCard;
