import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert, StatusBar,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DeviceCard } from '../components/DeviceCard';
import { deviceStore } from '../store/deviceStore';
import { IDevice, RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [devices, setDevices] = useState<IDevice[]>([]);

  useFocusEffect(
    useCallback(() => {
      deviceStore.getAll().then(setDevices);
    }, []),
  );

  const handlePlay = (device: IDevice) => {
    navigation.navigate('Player', { device });
  };

  const handleEdit = (device: IDevice) => {
    navigation.navigate('AddDevice', { device });
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Device', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          await deviceStore.remove(id);
          setDevices(prev => prev.filter(d => d.id !== id));
        },
      },
    ]);
  };

  const handleMultiPlayer = () => {
    if (devices.length < 2) {
      Alert.alert('Multi Player', 'Add at least 2 devices first.');
      return;
    }
    navigation.navigate('MultiPlayer', { devices });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0b2948" />
      <View style={styles.header}>
        <Text style={styles.title}>Wisenet Player</Text>
        <Text style={styles.subtitle}>Hanwha Security Device</Text>
      </View>

      {devices.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No devices added yet.</Text>
          <Text style={styles.emptyHint}>Tap + to add a camera.</Text>
        </View>
      ) : (
        <FlatList
          data={devices}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <DeviceCard
              device={item}
              onPlay={handlePlay}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}

      <View style={styles.fab}>
        {devices.length >= 2 && (
          <TouchableOpacity style={[styles.fabBtn, styles.multiBtn]} onPress={handleMultiPlayer}>
            <Text style={styles.fabText}>⊞</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.fabBtn, styles.addBtn]}
          onPress={() => navigation.navigate('AddDevice', {})}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b2948' },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e3a5f',
  },
  title: { color: '#fff', fontSize: 22, fontWeight: '700' },
  subtitle: { color: '#59d0ff', fontSize: 13, marginTop: 2 },
  list: { paddingVertical: 8 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#8ba1b7', fontSize: 16 },
  emptyHint: { color: '#44596e', fontSize: 13, marginTop: 6 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  fabBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addBtn: { backgroundColor: '#0098e5' },
  multiBtn: { backgroundColor: '#44596e' },
  fabText: { color: '#fff', fontSize: 22, fontWeight: '300' },
});

export default HomeScreen;
