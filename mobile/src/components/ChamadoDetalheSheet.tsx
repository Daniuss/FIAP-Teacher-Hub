import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useApp } from '../context/AppContext';
import { colors, fonts } from '../theme/colors';
import BottomSheet from './BottomSheet';

interface Props {
  chamadoId: string | null;
  onClose: () => void;
}

export default function ChamadoDetalheSheet({ chamadoId, onClose }: Props) {
  const { chamados } = useApp();
  const chamado = chamados.find((c) => c.id === chamadoId);
  const isAndamento = chamado?.status === 'em_andamento';

  return (
    <BottomSheet visible={!!chamado} onClose={onClose} title={chamado ? `Chamado ${chamado.numero}` : 'Chamado'}>
      {chamado ? (
        <>
          <View style={styles.header}>
            <View style={[styles.icon, { backgroundColor: isAndamento ? colors.ciAndamentoBg : colors.ciAbertoBg }]}>
              <Ionicons name={chamado.icon as any} size={18} color={isAndamento ? colors.ciAndamentoText : colors.ciAbertoText} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.desc}>{chamado.desc}</Text>
              <Text style={styles.meta}>{chamado.meta}</Text>
            </View>
            <Text style={[styles.status, { backgroundColor: isAndamento ? colors.ciAndamentoBg : colors.ciAbertoBg, color: isAndamento ? colors.ciAndamentoText : colors.ciAbertoText }]}>
              {isAndamento ? 'Em andamento' : 'Aberto'}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Histórico</Text>
          {chamado.timeline.map((item, i) => (
            <View key={i} style={styles.tlItem}>
              <View style={styles.tlDotCol}>
                <View style={[styles.tlDot, { backgroundColor: item.dot }]} />
                {i !== chamado.timeline.length - 1 ? <View style={styles.tlLine} /> : null}
              </View>
              <View style={{ flex: 1, paddingBottom: 14 }}>
                <Text style={[styles.tlWho, item.me && { color: colors.fiap }]}>{item.who}</Text>
                <Text style={styles.tlMsg}>{item.msg}</Text>
                <Text style={styles.tlTime}>{item.time}</Text>
              </View>
            </View>
          ))}
        </>
      ) : null}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  icon: { width: 40, height: 40, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  desc: { fontSize: 14, fontFamily: fonts.sansSemiBold, color: colors.textPrimary },
  meta: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  status: { fontSize: 10, fontFamily: fonts.sansBold, paddingVertical: 3, paddingHorizontal: 9, borderRadius: 6, overflow: 'hidden' },
  sectionTitle: { fontSize: 11, fontFamily: fonts.sansSemiBold, letterSpacing: 1, textTransform: 'uppercase', color: colors.textSecondary, marginBottom: 10 },
  tlItem: { flexDirection: 'row', gap: 10 },
  tlDotCol: { alignItems: 'center', width: 10 },
  tlDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  tlLine: { flex: 1, width: 2, backgroundColor: colors.borderTertiary, marginTop: 2 },
  tlWho: { fontSize: 12, fontFamily: fonts.sansSemiBold, color: colors.textPrimary },
  tlMsg: { fontSize: 12, color: colors.textSecondary, marginTop: 2, lineHeight: 17 },
  tlTime: { fontSize: 10, color: colors.textSecondary, marginTop: 3 },
});
