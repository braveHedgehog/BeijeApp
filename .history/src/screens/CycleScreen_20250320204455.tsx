/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
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
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const CycleScreen = () => {
  const profile = useSelector((state: RootState) => state.profile.profileInfo);
  const menstruation = useSelector((state: RootState) => state.menstruation);
  const insights = useSelector(selectInsights);

  // BottomSheet görünürlüğünü kontrol eden state
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  // Tıklanan günün notunu saklamak için
  const [selectedDayNote, setSelectedDayNote] = useState<string | null>(null);
  const [selectedDayDate, setSelectedDayDate] = useState<string | null>(null);
  // Daire (CycleArc) için scale animasyonunu kontrol eden shared value
  const circleScale = useSharedValue(1);

  // BottomSheet görünürlüğü değiştikçe dairenin ölçeğini güncelleyelim
  useEffect(() => {
    if (bottomSheetVisible) {
      circleScale.value = withTiming(0.9, { duration: 300, easing: Easing.out(Easing.cubic) });
    } else {
      circleScale.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) });
    }
  }, [bottomSheetVisible, circleScale]);

  const circleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale.value }],
  }));

  // Dot'a tıklanınca çalışır
  const handleDotPress = (day: { note?: string; date: string }) => {
    setSelectedDayNote(day.note || null);
    setSelectedDayDate(day.date);
    setBottomSheetVisible(true);
  };

  // BottomSheet kapatıldığında çalışır
  const handleCloseSheet = () => {
    setBottomSheetVisible(false);
    setSelectedDayNote(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Üst Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.profileCircle}>
          <Text style={styles.profileInitial}>{profile?.firstName[0]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.notificationButton}>
          <Text>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Tarih / Gün */}
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>28 Şubat</Text>
      </View>

      {/* Dairesel Cycle (Animasyonlu) */}
      <View style={styles.cycleContainer}>
        <Animated.View style={circleAnimatedStyle}>
          <CycleArc
            menstrationDays={menstruation.menstrationDays}
            cycleInfo={menstruation.cycleInfo}
            expanded={false}
            onDotPress={handleDotPress}
          />
        </Animated.View>
      </View>

      {/* (Opsiyonel) Expand Butonu */}
      <TouchableOpacity
        onPress={() => setBottomSheetVisible(!bottomSheetVisible)}
        style={styles.expandButton}>
        <Text>{bottomSheetVisible ? 'Daralt' : 'Genişlet'}</Text>
      </TouchableOpacity>

      {/* BottomSheet */}
      {bottomSheetVisible && (
        <BottomSheet
          insights={insights}
          menstration={{ note: selectedDayNote, date: selectedDayDate }}
          visible={bottomSheetVisible}
          onClose={handleCloseSheet}
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
