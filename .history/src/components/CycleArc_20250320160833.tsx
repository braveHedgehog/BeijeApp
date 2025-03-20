/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {View, StyleSheet, TouchableOpacity,Text} from 'react-native';
import {MenstruationDayType} from '../redux/slices/menstruationSlice';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';

interface Props {
  menstrationDays: {
    date: string;
    type?: MenstruationDayType;
    note?: string;
  }[];
  cycleInfo: {
    cycleStartDate: string;
    cycleEndDate: string;
  } | null;
  expanded: boolean;
  onDotPress?: (note?: string) => void;
}

const CIRCLE_RADIUS = 120; // yarıçap
const DOT_SIZE = 10; // normal dot boyutu
const BIG_DOT_SIZE = 20; // genişlemiş dot boyutu

const CycleArc: React.FC<Props> = ({
  menstrationDays=[],
  cycleInfo,
  expanded,
  onDotPress,
}) => {
  // Kaç gün var?
  const totalDays = 28; // varsayılan 28
  // Örnek: son 3 gün, ilk 4 gün
  // dayjs vb. kullanarak daha doğru hesaplamalar yapabilirsiniz
  const last3Index = totalDays - 3;
  const first4Index = 4;
  return (
    <View style={styles.container}>
      {menstrationDays.map((day, index) => {
        const angle = (index / totalDays) * 360; // her gün için açı
        const radian = (Math.PI / 180) * angle;

        // expanded modda hangi noktalar büyüyecek?
        const isBigDot =
          expanded && (index < first4Index || index >= last3Index);

        // expanded modda, bigDot değilse görünmez olabilir (örnek)
        const isHidden = expanded && !isBigDot;

        const x = CIRCLE_RADIUS + CIRCLE_RADIUS * Math.cos(radian);
        const y = CIRCLE_RADIUS + CIRCLE_RADIUS * Math.sin(radian);

        const backgroundColor = getDotColor(day.type);

        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor,
                width: isBigDot ? BIG_DOT_SIZE : DOT_SIZE,
                height: isBigDot ? BIG_DOT_SIZE : DOT_SIZE,
                borderRadius: isBigDot ? BIG_DOT_SIZE / 2 : DOT_SIZE / 2,
                transform: [{translateX: x}, {translateY: y}],
                opacity: isHidden ? 0 : 1,
              },
            ]}
            onPress={() => {
              onDotPress && onDotPress(day.note);
            }}
            activeOpacity={0.8}
          />
        );
      })}
    </View>
  );
};

// Gün tipine göre renk
const getDotColor = (type?: MenstruationDayType) => {
  switch (type) {
    case 'BLEEDING':
      return '#FF7750'; // Turuncu
    case 'FERTILITY':
      return '#C5E5C3'; // Açık yeşil
    case 'OVULATION':
      return '#79C257'; // Koyu yeşil
    default:
      return '#D3D3D3'; // Gri
  }
};

const styles = StyleSheet.create({
  container: {
    width: CIRCLE_RADIUS * 2 * 2, // Genişlik/ yükseklik çemberi sığdırmak için
    height: CIRCLE_RADIUS * 2 * 2,
    position: 'relative',
  },
  dot: {
    position: 'absolute',
  },
});

export default CycleArc;
