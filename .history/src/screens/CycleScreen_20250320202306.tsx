/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { SafeAreaView } from 'react-native-safe-area-context';
import CycleArc from '../components/CycleArc';
import BottomSheet from '../components/BottomSheet';
import { selectInsights } from '../redux/slices/insightsSlice';

const { width } = Dimensions.get('window');

const CycleScreen = () => {
  const profile = useSelector((state: RootState) => state.profile.profileInfo);
  const menstruation = useSelector((state: RootState) => state.menstruation);
  const insights = useSelector(selectInsights);

  // Sadece BottomSheet görünürlüğünü kontrol eden state kullanalım
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  // Tıklanan günün notunu saklamak için
  const [selectedDayNote, setSelectedDayNote] = useState<string | null>(null);

  const handleDotPress = (note?: string) => {
    setSelectedDayNote(note || null);
    setBottomSheetVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Üst Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.profileCircle}>
          <Text style={styles.profileInitial}>
            {profile?.firstName[0]}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.notificationButton}>
          <Text>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Tarih / Gün */}
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>13 Ekim</Text>
      </View>

      {/* Dairesel Cycle */}
      <View style={styles.cycleContainer}>
        <CycleArc
          menstrationDays={menstruation.menstrationDays}
          cycleInfo={menstruation.cycleInfo}
          expanded={false}
          onDotPress={handleDotPress}
        />
      </View>

      {/* Expand butonu da isteğe bağlı */}
      <TouchableOpacity
        onPress={() => setBottomSheetVisible(!bottomSheetVisible)}
        style={styles.expandButton}>
        <Text>{bottomSheetVisible ? 'Daralt' : 'Genişlet'}</Text>
      </TouchableOpacity>

      {/* BottomSheet */}
      {bottomSheetVisible && (
        <BottomSheet
          insights={insights}
          menstration={{ note: selectedDayNote }}
          onClose={() => {
            setBottomSheetVisible(false);
            setSelectedDayNote(null);
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default CycleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBEFEB',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 50,
  },
  expandButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FFD1B6',
    borderRadius: 5,
    alignSelf: 'center',
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF7750',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFEFEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  dateText: {
    fontSize: 20,
    fontWeight: '600',
  },
  cycleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -150,
  },
});
