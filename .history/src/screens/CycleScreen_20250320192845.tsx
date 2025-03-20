import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { SafeAreaView } from 'react-native-safe-area-context';
import CycleArc from '../components/CycleArc';
import BottomSheet from '../components/BottomSheet';

const CycleScreen: React.FC = () => {
  const profile = useSelector((state: RootState) => state.profile.profileInfo);
  const menstruation = useSelector((state: RootState) => state.menstruation);
  const insights = useSelector((state: RootState) => state.insights.insights);

  // BottomSheet görünürlüğünü kontrol etmek için state
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  // Seçilen dot'un notunu tutmak için state
  const [selectedDayNote, setSelectedDayNote] = useState<string | null>(null);

  // CycleArc içerisindeki dot'lara tıklanınca çalışır
  const handleDotPress = (note?: string) => {
    setSelectedDayNote(note || null);
    setBottomSheetVisible(true);
  };

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

      {/* Insights Listesi (örneğin FlatList ile) */}
      <FlatList
        data={insights}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.insightItem}>
            <Text style={styles.insightTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
      />

      {/* BottomSheet Component */}
      <BottomSheet
        insights={insights}
        menstration={{ note: selectedDayNote }}
        visible={bottomSheetVisible}
        onClose={handleCloseSheet}
      />
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
