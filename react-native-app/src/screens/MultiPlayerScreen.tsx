import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView, StatusBar, Text, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UmpPlayerWebView } from '../components/UmpPlayerWebView';
import { RootStackParamList } from '../types';

type Route = RouteProp<RootStackParamList, 'MultiPlayer'>;
type Nav = NativeStackNavigationProp<RootStackParamList, 'MultiPlayer'>;

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export const MultiPlayerScreen: React.FC = () => {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { devices } = route.params;

  // 2-column grid; each cell is a square
  const cellSize = Math.floor(SCREEN_W / 2);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <View style={styles.titleBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.titleText}>Multi Player ({devices.length})</Text>
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        {devices.map(device => (
          <View key={device.id} style={[styles.cell, { width: cellSize, height: cellSize }]}>
            <UmpPlayerWebView device={device} width={cellSize} height={cellSize} />
            <View style={styles.label}>
              <Text style={styles.labelText} numberOfLines={1}>
                {device.hostname} CH{device.channel}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    borderWidth: 1,
    borderColor: '#1e2a3a',
    overflow: 'hidden',
    position: 'relative',
  },
  label: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  labelText: { color: '#fff', fontSize: 11 },
});

export default MultiPlayerScreen;
