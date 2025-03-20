/* eslint-disable eol-last */
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { Insight } from '../types';

interface BottomSheetProps {
  insights: Insight[];
  menstration: any;
  visible: boolean;
  onClose: () => void;
}

const { height } = Dimensions.get('window');

const BottomSheet: React.FC<BottomSheetProps> = ({ insights, menstration, visible, onClose }) => {
  // Başlangıçta sheet ekranın altındadır.
  const translateY = useSharedValue(height);

  useEffect(() => {
    if (visible) {
      // Açılış animasyonu: 300ms içerisinde yukarı kayarak 0 konumuna gelsin.
      translateY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
    } else {
      // Kapanış animasyonu: 300ms içerisinde aşağı kayarak ekran yüksekliğine ulaşsın.
      translateY.value = withTiming(height, { duration: 300, easing: Easing.in(Easing.cubic) });
    }
  }, [visible, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // visible false ise de animasyonun tamamlanması için Animated.View render edilebilir
  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Bilgi Kartları</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {menstration && menstration.note && (
          <View style={styles.noteContainer}>
            <Text style={styles.noteTitle}>Not:</Text>
            <Text style={styles.noteText}>{menstration.note}</Text>
          </View>
        )}
        {insights.map((insight) => (
          <View key={insight._id} style={styles.insightContainer}>
            <Text style={styles.insightTitle}>{insight.title}</Text>
            <Text style={styles.insightContent}>{insight.content}</Text>
          </View>
        ))}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '50%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // Ekstra gölge efektleri için:
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F28C38',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFD1B6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#F28C38',
  },
  noteContainer: {
    backgroundColor: '#FFF5F0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F28C38',
  },
  noteText: {
    fontSize: 14,
    color: '#333',
  },
  insightContainer: {
    backgroundColor: '#FFF5F0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F28C38',
  },
  insightContent: {
    fontSize: 14,
    color: '#333',
  },
});

export default BottomSheet;
