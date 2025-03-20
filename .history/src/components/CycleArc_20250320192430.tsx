/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MenstruationDayType } from '../redux/slices/menstruationSlice';
import Svg, { Circle } from 'react-native-svg';

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

// SVG boyutu (genişlik / yükseklik)
const CIRCLE_SIZE = 350;
// Çizilen dairenin stroke genişliği
const STROKE_WIDTH = 40;
// Orijinalde RADIUS: (CIRCLE_SIZE/2) - (STROKE_WIDTH/2)
// Ancak, noktaların tam iç bölgede kalması için, merkezden stroke genişliği kadar içeride kalan bölgeyi kullanıyoruz:
const BASE_RADIUS = (CIRCLE_SIZE / 2) - STROKE_WIDTH; // Örneğin: 175 - 40 = 135

const DOT_SIZE = 10;  // Normal nokta boyutu
const BIG_DOT_SIZE = 20; // Büyümüş nokta boyutu

const CycleArc: React.FC<Props> = ({
  menstrationDays = [],
  cycleInfo,
  expanded,
  onDotPress,
}) => {
  // Sabit 28 gün varsayıyoruz
  const totalDays = 28;
  // Son 3 gün, ilk 4 gün büyüyecek
  const last3Index = totalDays - 3;
  const first4Index = 4;

  return (
    <View style={styles.container}>
      {/* SVG'yi dokunmaları almayacak şekilde ayarlıyoruz */}
      <Svg
        width={CIRCLE_SIZE}
        height={CIRCLE_SIZE}
        pointerEvents="none"  // SVG dokunma olaylarını engeller
      >
        {/* Arka plan daire */}
        <Circle
          cx={CIRCLE_SIZE / 2}
          cy={CIRCLE_SIZE / 2}
          r={(CIRCLE_SIZE / 2) - (STROKE_WIDTH / 2)}
          stroke="#ebebeb"
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
      </Svg>

      {/* Noktaları SVG'nin üstünde, ayrı bir katman olarak render ediyoruz */}
      {menstrationDays.map((day, index) => {
        // Açıyı hesapla
        const angle = (index / totalDays) * 360;
        const radian = (Math.PI / 180) * angle;

        // expanded modda hangi noktalar büyüyecek?
        const isBigDot = expanded && (index < first4Index || index >= last3Index);
        // expanded modda, bigDot değilse görünmez
        const isHidden = expanded && !isBigDot;

        // Dot boyutu
        const dotSize = isBigDot ? BIG_DOT_SIZE : DOT_SIZE;

        // Noktaların tam daire kenarına (stroke'un iç kısmında) denk gelmesi için;
        // efektif yarıçap = (CIRCLE_SIZE/2 - STROKE_WIDTH) - (dotSize/2)
        const effectiveRadius = (CIRCLE_SIZE / 2) - STROKE_WIDTH - (dotSize / 2);

        // Dot merkezinin koordinatları
        const dotCenterX = (CIRCLE_SIZE / 2) + effectiveRadius * Math.cos(radian);
        const dotCenterY = (CIRCLE_SIZE / 2) + effectiveRadius * Math.sin(radian);

        // Renk
        const backgroundColor = getDotColor(day.type);

        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor,
                width: dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
                opacity: isHidden ? 0 : 1,
                transform: [
                  { translateX: dotCenterX - (dotSize / 2) },
                  { translateY: dotCenterY - (dotSize / 2) },
                ],
              },
            ]}
            onPress={() => onDotPress && onDotPress(day.note)}
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
    // Container, SVG boyutuna eşit
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
  },
});

export default CycleArc;
