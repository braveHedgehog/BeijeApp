/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MenstruationDayType } from '../redux/slices/menstruationSlice';
import Svg, { Circle } from 'react-native-svg';

interface Day {
  date: string;
  type?: MenstruationDayType;
  note?: string;
}

interface Props {
  menstrationDays: Day[];
  cycleInfo: {
    cycleStartDate: string;
    cycleEndDate: string;
  } | null;
  expanded: boolean;
  onDotPress?: (day: Day) => void;
}

// SVG boyutu (genişlik / yükseklik)
const CIRCLE_SIZE = 350;
const STROKE_WIDTH = 40;
const RADIUS = (CIRCLE_SIZE / 2) - (STROKE_WIDTH / 2);
const DOT_SIZE = 10;
const BIG_DOT_SIZE = 20;

const CycleArc: React.FC<Props> = ({
  menstrationDays = [],
  cycleInfo,
  expanded,
  onDotPress,
}) => {
  const totalDays = 28;
  const last3Index = totalDays - 3;
  const first4Index = 4;
  const effectiveRadius = RADIUS - (BIG_DOT_SIZE / 2);

  return (
    <View style={styles.container}>
      <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} pointerEvents="none">
        <Circle
          cx={CIRCLE_SIZE / 2}
          cy={CIRCLE_SIZE / 2}
          r={RADIUS}
          stroke="#ebebeb"
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
      </Svg>

      {menstrationDays.map((day, index) => {
        const angle = (index / totalDays) * 360;
        const radian = (Math.PI / 180) * angle;
        const isBigDot = expanded && (index < first4Index || index >= last3Index);
        const isHidden = expanded && !isBigDot;
        const dotSize = isBigDot ? BIG_DOT_SIZE : DOT_SIZE;
        const dotCenterX = (CIRCLE_SIZE / 2) + effectiveRadius * Math.cos(radian);
        const dotCenterY = (CIRCLE_SIZE / 2) + effectiveRadius * Math.sin(radian);
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
            onPress={() => onDotPress && onDotPress(day)}
            activeOpacity={0.8}
          />
        );
      })}
    </View>
  );
};

const getDotColor = (type?: MenstruationDayType) => {
  switch (type) {
    case 'BLEEDING':
      return '#FF7750';
    case 'FERTILITY':
      return '#C5E5C3';
    case 'OVULATION':
      return '#79C257';
    default:
      return '#D3D3D3';
  }
};

const styles = StyleSheet.create({
  container: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 335,
    marginTop: -335,
  },
  dot: {
    position: 'absolute',
  },
});

export default CycleArc;
