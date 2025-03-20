/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
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

  // BottomSheet görünürlüğünü kontrol etmek için state
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Tıklanan günün notunu saklamak için
  const [selectedDayNote, setSelectedDayNote] = useState<string | null>(null);

  const handleDotPress = (note?: string) => {
    setSelectedDayNote(note || null);
    setBottomSheetVisible(true);
  };
  // Örnek: Insights listesinde de BottomSheet açmak için
  const handleInsightPress = (content: string) => {
    setSelectedDayNote(content);
    setBottomSheetVisible(true);
  };
  console.log(insights);
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

      {/* Insights Listesi */}
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={styles.expandButton}>
        <Text>{expanded ? 'Daralt' : 'Genişlet'}</Text>
      </TouchableOpacity>
      {expanded && (
        <BottomSheet
          insights={insights}
          menstration={menstruation}
          onClose={() => setExpanded(false)}
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
  insightItem: {
    backgroundColor: '#FFF5F0',
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    marginHorizontal: 16,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F28C38',
  },
});
