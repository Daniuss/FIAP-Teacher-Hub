import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useApp } from '../context/AppContext';
import { horariosCoord, motivosCoord, StatusSolicitacao } from '../data/mock';
import { colors, fonts } from '../theme/colors';
import BottomSheet from './BottomSheet';
import SelectField from './SelectField';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const statusMap: Record<StatusSolicitacao, { label: string; bg: string; color: string }> = {
  pendente: { label: 'Pendente', bg: colors.backgroundTertiary, color: colors.textSecondary },
  em_analise: { label: 'Em análise', bg: colors.ciAndamentoBg, color: colors.ciAndamentoText },
  aprovada: { label: 'Aprovada', bg: colors.ciResolvidoBg, color: colors.ciResolvidoText },
  negada: { label: 'Negada', bg: colors.riscoBg, color: colors.riscoText },
};

export default function CoordSheet({ visible, onClose }: Props) {
  const { solicitacoes, enviarSolicitacao } = useApp();
  const [motivo, setMotivo] = useState(motivosCoord[0]);
  const [detalhes, setDetalhes] = useState('');

  function enviar() {
    if (!detalhes.trim()) {
      Alert.alert('Descreva os detalhes da solicitação.');
      return;
    }
    enviarSolicitacao(motivo, detalhes.trim());
    Alert.alert('✅ Solicitação enviada!', `Motivo: ${motivo}\n\nA coordenação responderá em até 1 dia útil.`);
    setDetalhes('');
  }

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Coordenação">
      <Text style={styles.sectionTitle}>Horários de atendimento</Text>
      <View style={styles.horariosBox}>
        {horariosCoord.map((h, i) => (
          <View key={h.dia} style={[styles.horarioRow, i === horariosCoord.length - 1 && { borderBottomWidth: 0 }]}>
            <Text style={styles.horarioDia}>{h.dia}</Text>
            <View>
              <Text style={styles.horarioInfo}>{h.horario}</Text>
              <Text style={styles.horarioLocal}>{h.local}</Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Solicitar à coordenação</Text>
      <SelectField label="Motivo" value={motivo} options={motivosCoord} onChange={setMotivo} />
      <View style={{ marginBottom: 14 }}>
        <Text style={styles.label}>Detalhes</Text>
        <TextInput
          style={styles.textarea}
          placeholder="Descreva sua solicitação..."
          placeholderTextColor={colors.textSecondary}
          multiline
          value={detalhes}
          onChangeText={setDetalhes}
        />
      </View>
      <TouchableOpacity style={styles.btn} onPress={enviar}>
        <Ionicons name="send" size={14} color="#fff" />
        <Text style={styles.btnTxt}>Enviar solicitação</Text>
      </TouchableOpacity>

      <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Solicitações anteriores</Text>
      <View style={styles.horariosBox}>
        {solicitacoes.map((s, i) => {
          const st = statusMap[s.status];
          return (
            <View key={i} style={[styles.solRow, i === solicitacoes.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={styles.solHeader}>
                <Text style={styles.solMotivo}>{s.motivo}</Text>
                <Text style={[styles.solStatus, { backgroundColor: st.bg, color: st.color }]}>{st.label}</Text>
              </View>
              <Text style={styles.solDetalhes}>{s.detalhes} · {s.data}</Text>
            </View>
          );
        })}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 11, fontFamily: fonts.sansSemiBold, letterSpacing: 1, textTransform: 'uppercase', color: colors.textSecondary, marginBottom: 10 },
  horariosBox: { backgroundColor: colors.backgroundSecondary, borderRadius: 11, overflow: 'hidden', marginBottom: 16 },
  horarioRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 0.5, borderBottomColor: colors.borderTertiary },
  horarioDia: { fontSize: 11, fontFamily: fonts.sansSemiBold, color: colors.fiap, width: 32 },
  horarioInfo: { fontSize: 12, color: colors.textPrimary },
  horarioLocal: { fontSize: 11, color: colors.textSecondary, marginTop: 1 },
  label: { fontSize: 11, fontFamily: fonts.sansSemiBold, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  textarea: { backgroundColor: colors.backgroundSecondary, borderWidth: 0.5, borderColor: colors.borderSecondary, borderRadius: 9, fontSize: 13, padding: 11, height: 85, color: colors.textPrimary, textAlignVertical: 'top' },
  btn: { backgroundColor: colors.fiap, borderRadius: 11, paddingVertical: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  btnTxt: { color: '#fff', fontSize: 13, fontFamily: fonts.sansBold },
  solRow: { padding: 11, borderBottomWidth: 0.5, borderBottomColor: colors.borderTertiary },
  solHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  solMotivo: { fontSize: 12, fontFamily: fonts.sansMedium, color: colors.textPrimary },
  solStatus: { fontSize: 10, fontFamily: fonts.sansBold, paddingVertical: 2, paddingHorizontal: 8, borderRadius: 5, overflow: 'hidden' },
  solDetalhes: { fontSize: 11, color: colors.textSecondary, marginTop: 3 },
});
