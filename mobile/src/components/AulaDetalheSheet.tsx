import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { turmas } from '../data/mock';
import { colors, fonts } from '../theme/colors';
import BottomSheet from './BottomSheet';

interface Props {
  turmaId: string | null;
  onClose: () => void;
}

export default function AulaDetalheSheet({ turmaId, onClose }: Props) {
  const turma = turmas.find((t) => t.id === turmaId);
  return (
    <BottomSheet visible={!!turmaId} onClose={onClose} title={turma?.nome ?? 'Detalhes da Aula'}>
      {turma ? (
        <>
          <View style={styles.box}>
            {turma.detalhes.map((d, i) => (
              <View key={d.label} style={[styles.row, i === turma.detalhes.length - 1 && { borderBottomWidth: 0 }]}>
                <Text style={styles.label}>{d.label}</Text>
                <Text style={styles.val}>{d.valor}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.btn}>
            <Ionicons name="book-outline" size={14} color="#fff" />
            <Text style={styles.btnTxt}>Ver notas e frequência</Text>
          </TouchableOpacity>
        </>
      ) : null}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: colors.backgroundSecondary, borderRadius: 11, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11, paddingHorizontal: 12, borderBottomWidth: 0.5, borderBottomColor: colors.borderTertiary },
  label: { fontSize: 11, color: colors.textSecondary, width: 72 },
  val: { fontSize: 12, fontFamily: fonts.sansMedium, color: colors.textPrimary, flex: 1 },
  btn: { marginTop: 14, backgroundColor: colors.fiap, borderRadius: 11, paddingVertical: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  btnTxt: { color: '#fff', fontSize: 13, fontFamily: fonts.sansBold },
});
