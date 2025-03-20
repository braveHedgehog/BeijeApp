/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

// Ekran boyutları
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const BOTTOM_SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.6; // Bottom sheet'in maksimum yüksekliği
const BOTTOM_SHEET_MIN_HEIGHT = SCREEN_HEIGHT * 0.3; // Bottom sheet'in minimum yüksekliği

const CycleScreen = () => {
  // Bottom sheet'in yüksekliği için animasyon değeri
  const bottomSheetHeight = useSharedValue(BOTTOM_SHEET_MIN_HEIGHT);
  // Arc'in yukarı hareketi için animasyon değeri
  const arcTranslateY = useSharedValue(0);
  // Noktaların animasyon değerleri
  const dotScale = useSharedValue(1);
  const dotOpacity = useSharedValue(1);

  // Döngü verileri (örnek)
  const cycleDays = 28;
  const bleedingDays = [1, 2, 3, 4]; // Kanama günleri
  const fertilityDays = [12, 13, 14]; // Doğurganlık günleri
  const ovulationDay = 14; // Ovülasyon günü
  const currentDay = 13; // Mevcut gün

  // Bottom sheet'in expanded/collapsed durumu
  const [isExpanded, setIsExpanded] = useState(false);
  // Seçili günün notları
  const [selectedDayNotes, setSelectedDayNotes] = useState(null);

  // Örnek ipuçları (insights)
  const insights = [
    'Adet öncesi dönemde vücutta değişiklikler olabilir. Şişkinlik...',
    'Adet sonrasında vücudunuzu temiz tutmak önemlidir...',
    'Adet kanaması genellikle 3-7 gün sürer. Kanama süresi...',
  ];

  // Bottom sheet'in kaydırma hareketini yönetme
  const onGestureEvent = (event: { nativeEvent: { translationY: any; }; }) => {
    const translationY = event.nativeEvent.translationY;
    bottomSheetHeight.value = BOTTOM_SHEET_MIN_HEIGHT - translationY;

    // Arc'in yukarı hareketi
    arcTranslateY.value = -translationY * 0.5;

    // Noktaların animasyonu
    if (bottomSheetHeight.value > BOTTOM_SHEET_MIN_HEIGHT + 50) {
      dotScale.value = withTiming(1.5, { duration: 400 }); // Son 3 ve ilk 4 gün büyüsün
      dotOpacity.value = withTiming(0, { duration: 300 }); // Diğer noktalar kaybolsun
      setIsExpanded(true);
    } else {
      dotScale.value = withTiming(1, { duration: 400 });
      dotOpacity.value = withTiming(1, { duration: 300 });
      setIsExpanded(false);
    }
  };

  // Kaydırma bittiğinde bottom sheet'in pozisyonunu sabitleme
  const onHandlerStateChange = (event: { nativeEvent: { state: number; }; }) => {
    if (event.nativeEvent.state === 5) {
      // Kaydırma bitti
      if (bottomSheetHeight.value > (BOTTOM_SHEET_MAX_HEIGHT + BOTTOM_SHEET_MIN_HEIGHT) / 2) {
        bottomSheetHeight.value = withSpring(BOTTOM_SHEET_MAX_HEIGHT);
        arcTranslateY.value = withSpring(-100);
        setIsExpanded(true);
      } else {
        bottomSheetHeight.value = withSpring(BOTTOM_SHEET_MIN_HEIGHT);
        arcTranslateY.value = withSpring(0);
        setIsExpanded(false);
      }
    }
  };

  // Bottom sheet'in animasyonlu stili
  const bottomSheetStyle = useAnimatedStyle(() => {
    return {
      height: bottomSheetHeight.value,
    };
  });

  // Arc'in animasyonlu stili
  const arcStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: arcTranslateY.value }],
    };
  });

  // Noktaların animasyonlu stili
  const dotStyle = (index: number) => useAnimatedStyle(() => {
    const isHighlighted =
      index <= 3 || index >= cycleDays - 2; // İlk 4 ve son 3 gün
    return {
      transform: [{ scale: isHighlighted ? dotScale.value : 1 }],
      opacity: isHighlighted ? 1 : dotOpacity.value,
    };
  });

  // Noktanın rengini belirleme
  const getDotColor = (day: number) => {
    if (bleedingDays.includes(day)) return '#FF6347'; // Turuncu (kanama)
    if (day === ovulationDay) return '#228B22'; // Koyu yeşil (ovülasyon)
    if (fertilityDays.includes(day)) return '#90EE90'; // Açık yeşil (doğurganlık)
    return '#D3D3D3'; // Gri (normal gün)
  };

  // Nokta tıklandığında notları gösterme
  const handleDotPress = (day: number) => {
    if (isExpanded) {
      //setSelectedDayNotes(() => `Notlar: ${day}. gün için notlar burada.`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Üst Kısım */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.userIcon}>
          <Text style={styles.userIconText}>B</Text>
        </TouchableOpacity>
        <Text style={styles.dateText}>13 Ekim</Text>
        <TouchableOpacity style={styles.notificationIcon}>
          <Text>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Döngü Görselleştirmesi (Arc) */}
      <Animated.View style={[styles.arcContainer, arcStyle]}>
        {[...Array(cycleDays)].map((_, index) => {
          const day = index + 1;
          const angle = (index * 360) / cycleDays; // Noktaları daire şeklinde yerleştirme
          const radius = SCREEN_WIDTH * 0.4;
          const x = radius * Math.cos((angle * Math.PI) / 180);
          const y = radius * Math.sin((angle * Math.PI) / 180);

          return (
            <TouchableOpacity
              key={day}
              onPress={() => handleDotPress(day)}
              disabled={!isExpanded}
            >
              <Animated.View
                style={[
                  styles.dot,
                  {
                    backgroundColor: getDotColor(day),
                    transform: [{ translateX: x }, { translateY: y }],
                  },
                  dotStyle(index),
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </Animated.View>

      {/* Bottom Sheet */}
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View style={[styles.bottomSheet, bottomSheetStyle]}>
          <Text style={styles.bottomSheetTitle}>Bugün Öne Çıkanlar</Text>

          {/* Notlar */}
          <View style={styles.notesContainer}>
            <Text style={styles.notesTitle}>Notlar</Text>
            <Text style={styles.notesText}>
              {selectedDayNotes || 'Şekeri iyiceceklerden kaçınmak, şişkinliği azaltabilir.'}
            </Text>
          </View>

          {/* İpuçları (Insights) */}
          {insights.map((insight, index) => (
            <View key={index} style={styles.insightContainer}>
              <View style={styles.insightDot} />
              <Text style={styles.insightText}>{insight}</Text>
            </View>
          ))}

          {/* Sekmeler */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>Döngü</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>Takvim</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>Analiz</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>Rehber</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE4E1',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userIconText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arcContainer: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.8,
    alignSelf: 'center',
    marginTop: 50,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
    left: SCREEN_WIDTH * 0.4 - 5,
    top: SCREEN_WIDTH * 0.4 - 5,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  notesContainer: {
    marginBottom: 20,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notesText: {
    fontSize: 14,
    color: '#666',
  },
  insightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  insightDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF6347',
    marginRight: 10,
  },
  insightText: {
    fontSize: 14,
    color: '#333',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  tab: {
    padding: 10,
  },
  tabText: {
    fontSize: 16,
    color: '#333',
  },
});

export default CycleScreen;