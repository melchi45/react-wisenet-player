import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UmpPlayerWebView } from '../components/UmpPlayerWebView';
import { RootStackParamList } from '../types';

type Route = RouteProp<RootStackParamList, 'Player'>;
type Nav = NativeStackNavigationProp<RootStackParamList, 'Player'>;

export const PlayerScreen: React.FC = () => {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { device } = route.params;
  const [playState, setPlayState] = useState('CONNECTING');

  const handleStateChange = useCallback((state: string) => {
    setPlayState(state);
  }, []);

  const stateColor = () => {
    switch (playState) {
      case 'PLAYING': return '#27ae60';
      case 'PAUSED':  return '#f39c12';
      case 'STOPPED': return '#c0392b';
      default:        return '#59d0ff';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <View style={styles.titleBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.titleText} numberOfLines={1}>
          {device.hostname}:{device.port}
        </Text>
        <View style={[styles.stateDot, { backgroundColor: stateColor() }]} />
      </View>

      <UmpPlayerWebView
        device={device}
        onStateChange={handleStateChange}
        onError={err => console.warn('Player error:', err)}
      />

      <View style={styles.infoBar}>
        <Text style={styles.infoText}>
          CH {device.channel} · {device.device} · {device.profile}
        </Text>
        <Text style={[styles.stateText, { color: stateColor() }]}>{playState}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0b2948',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  backBtn: { marginRight: 12 },
  backText: { color: '#59d0ff', fontSize: 17 },
  titleText: { flex: 1, color: '#fff', fontSize: 15, fontWeight: '600' },
  stateDot: { width: 10, height: 10, borderRadius: 5, marginLeft: 8 },
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0b2948',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  infoText: { color: '#8ba1b7', fontSize: 12 },
  stateText: { fontSize: 12, fontWeight: '600' },
});

export default PlayerScreen;
