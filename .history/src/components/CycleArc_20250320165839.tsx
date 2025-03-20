/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {MenstruationDayType} from '../redux/slices/menstruationSlice';
import Svg, {Circle} from 'react-native-svg';

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
// Stroke kalınlığı nedeniyle dairenin yarıçapını biraz küçük tutuyoruz
// Örneğin 350/2 = 175; strokeWidth=40 olduğu için 175 - 20 = 155 civarı bir yarıçap uygun.
const STROKE_WIDTH = 40;
const RADIUS = (CIRCLE_SIZE / 2) - (STROKE_WIDTH / 2); // 175 - 20 = 155

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
      <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
        {/* Arka plan daire */}
        <Circle
          cx={CIRCLE_SIZE / 2}   // Merkez X
          cy={CIRCLE_SIZE / 2}   // Merkez Y
          r={RADIUS}             // Yarıçap
          stroke="#f5f5f5"
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />

        {/* Noktaları yerleştiriyoruz */}
        {menstrationDays.map((day, index) => {
          // Açıyı hesapla
          const angle = (index / totalDays) * 360;
          const radian = (Math.PI / 180) * angle;

          // expanded modda hangi noktalar büyüyecek?
          const isBigDot = expanded && (index < first4Index || index >= last3Index);
          // expanded modda bigDot değilse görünmez
          const isHidden = expanded && !isBigDot;

          // Dot boyutu
          const dotSize = isBigDot ? BIG_DOT_SIZE : DOT_SIZE;

          // Noktaların tam daire kenarına denk gelmesi için
          // "etkin yarıçap" = RADIUS - (dotSize / 2)
          const effectiveRadius = RADIUS - (dotSize / 2);

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
                  // Dot'un sol/üst köşesini değil, merkezini hesapladığımız
                  // konuma yerleştirmek için yarıçapı kadar kaydırıyoruz.
                  transform: [
                    { translateX: dotCenterX - (dotSize / 2) },
                    { translateY: dotCenterY - (dotSize / 2) }
                  ],
                },
              ]}
              onPress={() => onDotPress && onDotPress(day.note)}
              activeOpacity={0.8}
            />
          );
        })}
      </Svg>
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
