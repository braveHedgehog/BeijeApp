import React, {useCallback, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {SafeAreaView} from 'react-native-safe-area-context';
import CycleArc from '../components/CycleArc'; // Arc çizen bileşen (aşağıda örnek)
import BottomSheet from '@gorhom/bottom-sheet'; // veya kendi animasyon yaklaşımınız
import Animated, {useSharedValue, withTiming} from 'react-native-reanimated';

const {width} = Dimensions.get('window');

const CycleScreen = () => {
  const profile = useSelector((state: RootState) => state.profile.profileInfo);
  const menstruation = useSelector((state: RootState) => state.menstruation);
  const insights = useSelector((state: RootState) => state.insights.insights);

  // Bottom sheet ref vb.
  const [expanded, setExpanded] = useState(false);

  // Tıklanan günün notunu saklamak için
  const [selectedDayNote, setSelectedDayNote] = useState<string | null>(null);

  const handleDotPress = (note?: string) => {
    setSelectedDayNote(note || null);
  };

  // BottomSheet SnapPoints
  const snapPoints = useMemo(() => ['20%', '70%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    setExpanded(index === 1);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Üst Bar */}
      <View style={styles.topBar}>
        {/* Sol üstte ilk harf */}
        <TouchableOpacity style={styles.profileCircle}>
          <Text style={styles.profileInitial}>
            {profile?.firstName
              ? profile.firstName.charAt(0).toUpperCase()
              : 'B'}
          </Text>
        </TouchableOpacity>
        {/* Sağ üstte bildirim ikonu */}
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
          menstruationDays={menstruation.menstruationDays}
          cycleInfo={menstruation.cycleInfo}
          expanded={expanded}
          onDotPress={handleDotPress}
        />
      </View>

      {/* Bottom Sheet */}
      <BottomSheet
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}>
        <View style={styles.bottomSheetContainer}>
          {/* Seçilen günün notu */}
          {selectedDayNote ? (
            <Text style={styles.selectedNote}>{selectedDayNote}</Text>
          ) : (
            <Text style={styles.selectedNote}>Bugün Öne Çıkanlar</Text>
          )}

          {/* Insights listesi */}
          <FlatList
            data={insights}
            keyExtractor={item => item._id}
            renderItem={({item}) => (
              <View style={styles.insightItem}>
                <Text style={styles.insightTitle}>{item.title}</Text>
                <Text style={styles.insightContent}>{item.content}</Text>
              </View>
            )}
          />
        </View>
      </BottomSheet>
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
  },
  bottomSheetContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  selectedNote: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  insightItem: {
    marginVertical: 8,
  },
  insightTitle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  insightContent: {
    fontSize: 13,
    color: '#333',
  },
});
