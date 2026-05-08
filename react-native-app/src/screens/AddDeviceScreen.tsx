import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Switch, Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { deviceStore } from '../store/deviceStore';
import { IDevice, RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'AddDevice'>;
type Route = RouteProp<RootStackParamList, 'AddDevice'>;

export const AddDeviceScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const existing = route.params?.device;

  const [hostname, setHostname] = useState(existing?.hostname ?? '');
  const [port, setPort] = useState(String(existing?.port ?? '80'));
  const [username, setUsername] = useState(existing?.username ?? 'admin');
  const [password, setPassword] = useState(existing?.password ?? '');
  const [profile, setProfile] = useState(existing?.profile ?? 'H.264');
  const [channel, setChannel] = useState(String(existing?.channel ?? '1'));
  const [deviceType, setDeviceType] = useState(existing?.device ?? 'camera');
  const [useHttps, setUseHttps] = useState(existing?.https ?? false);
  const [autoplay, setAutoplay] = useState(existing?.autoplay ?? true);
  const [statistics, setStatistics] = useState(existing?.statistics ?? false);

  const handleSave = async () => {
    if (!hostname.trim()) {
      Alert.alert('Validation', 'Hostname / IP is required.');
      return;
    }
    const portNum = parseInt(port, 10);
    if (isNaN(portNum) || portNum <= 0 || portNum > 65535) {
      Alert.alert('Validation', 'Invalid port number.');
      return;
    }

    const device: IDevice = {
      id: existing?.id ?? `ump-${hostname}-${Date.now()}`,
      hostname: hostname.trim(),
      port: portNum,
      username: username.trim(),
      password,
      profile,
      channel: parseInt(channel, 10) || 1,
      device: deviceType,
      autoplay,
      statistics,
      https: useHttps,
    };

    await deviceStore.add(device);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.form}>
        <Field label="Hostname / IP" value={hostname} onChangeText={setHostname} placeholder="192.168.1.100" />
        <Field label="Port" value={port} onChangeText={setPort} placeholder="80" keyboardType="numeric" />
        <Field label="Username" value={username} onChangeText={setUsername} placeholder="admin" />
        <Field label="Password" value={password} onChangeText={setPassword} placeholder="password" secureTextEntry />
        <Field label="Profile" value={profile} onChangeText={setProfile} placeholder="H.264" />
        <Field label="Channel" value={channel} onChangeText={setChannel} placeholder="1" keyboardType="numeric" />

        <PickerRow
          label="Device Type"
          options={['camera', 'nvr', 'iobox', 'aibox']}
          selected={deviceType}
          onSelect={setDeviceType}
        />

        <ToggleRow label="HTTPS" value={useHttps} onToggle={setUseHttps} />
        <ToggleRow label="Autoplay" value={autoplay} onToggle={setAutoplay} />
        <ToggleRow label="Statistics" value={statistics} onToggle={setStatistics} />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>{existing ? 'Update Device' : 'Add Device'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

interface FieldProps {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric';
  secureTextEntry?: boolean;
}

const Field: React.FC<FieldProps> = ({ label, value, onChangeText, placeholder, keyboardType = 'default', secureTextEntry }) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#44596e"
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      autoCapitalize="none"
    />
  </View>
);

interface ToggleRowProps {
  label: string;
  value: boolean;
  onToggle: (v: boolean) => void;
}

const ToggleRow: React.FC<ToggleRowProps> = ({ label, value, onToggle }) => (
  <View style={styles.toggleRow}>
    <Text style={styles.label}>{label}</Text>
    <Switch value={value} onValueChange={onToggle} trackColor={{ true: '#0098e5' }} />
  </View>
);

interface PickerRowProps {
  label: string;
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
}

const PickerRow: React.FC<PickerRowProps> = ({ label, options, selected, onSelect }) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.pickerRow}>
      {options.map(opt => (
        <TouchableOpacity
          key={opt}
          style={[styles.chip, selected === opt && styles.chipActive]}
          onPress={() => onSelect(opt)}>
          <Text style={[styles.chipText, selected === opt && styles.chipTextActive]}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b2948' },
  form: { padding: 20 },
  field: { marginBottom: 16 },
  label: { color: '#8ba1b7', fontSize: 12, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: '#1e2a3a',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2a3f57',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  pickerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#1e2a3a',
    borderWidth: 1,
    borderColor: '#2a3f57',
  },
  chipActive: { backgroundColor: '#0098e5', borderColor: '#0098e5' },
  chipText: { color: '#8ba1b7', fontSize: 13 },
  chipTextActive: { color: '#fff' },
  saveBtn: {
    backgroundColor: '#0098e5',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default AddDeviceScreen;
