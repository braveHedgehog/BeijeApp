import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ visible, onClose, children }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      {/* Arka plan dokunma alanı; dokunulduğunda kapatır */}
      <TouchableOpacity style={styles.background} activeOpacity={1} onPress={onClose} />
      
      {/* BottomSheet içeriği */}
      <View style={styles.sheet}>
        <TouchableOpacity style={styles.dragIndicator} onPress={onClose}>
          <View style={styles.indicator} />
        </TouchableOpacity>
        {children}
      </View>
    </View>
  );
};

const { height } = Dimensions.get('window');
const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
  },
  background: {
    flex: 1,
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    // İstediğiniz yüksekliği verebilirsiniz; örneğin:
    maxHeight: height * 0.5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  dragIndicator: {
    alignItems: 'center',
    marginBottom: 8,
  },
  indicator: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ccc',
  },
});

export default BottomSheet;
