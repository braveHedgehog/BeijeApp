/* eslint-disable eol-last */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Insight } from '../types';

interface MenstrationInfo {
  note?: string;
  date?: string;
}

interface BottomSheetProps {
  insights: Insight[];
  menstration: MenstrationInfo | null;
  visible: boolean;
  onClose: () => void;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ insights, menstration, visible, onClose }) => {
  if (!visible) return null;
  return (
    <View style={styles.container}>
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
            {menstration.date && (
              <Text style={styles.dateText}>Tarih: {menstration.date}</Text>
            )}
          </View>
        )}
        {insights.map((insight) => (
          <View key={insight._id} style={styles.insightContainer}>
            <Text style={styles.insightTitle}>{insight.title}</Text>
            <Text style={styles.insightContent}>{insight.content}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
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
  dateText: {
    marginTop: 4,
    fontSize: 12,
    color: '#555',
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
