import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AulaBadge from '../components/AulaBadge';
import AulaDetalheSheet from '../components/AulaDetalheSheet';
import TopBar from '../components/TopBar';
import { aulasPorDia } from '../data/mock';
import { colors, fonts } from '../theme/colors';

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const DIAS_SEMANA = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
const DIAS_HEADER = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const HOJE = { y: 2026, m: 5, d: 9 };

// mapeia id de turma (usado nas aulas do dia) para poder abrir o detalhe
const nomeParaTurmaId: Record<string, string> = {
  'Eng. de Software': 'eng_lins',
  'DevOps & Cloud': 'devops_lins',
  'Arquitetura Java': 'java_paulista',
  'Mobile Dev.': 'mobile_paulista',
};

export default function AgendaScreen() {
  const [cY, setCY] = useState(HOJE.y);
  const [cM, setCM] = useState(HOJE.m);
  const [cS, setCS] = useState(HOJE.d);
  const [aulaAberta, setAulaAberta] = useState<string | null>(null);

  const label = `${MESES[cM]} ${cY}`;

  function mudarMes(dir: number) {
    let m = cM + dir;
    let y = cY;
    if (m > 11) {
      m = 0;
      y++;
    }
    if (m < 0) {
      m = 11;
      y--;
    }
    setCM(m);
    setCY(y);
    setCS(1);
  }

  const dias = useMemo(() => {
    const primeiroDiaSemana = new Date(cY, cM, 1).getDay();
    const totalDias = new Date(cY, cM + 1, 0).getDate();
    const celulas: (number | null)[] = Array(primeiroDiaSemana).fill(null);
    for (let d = 1; d <= totalDias; d++) celulas.push(d);
    return celulas;
  }, [cY, cM]);

  const chaveDia = (d: number) => `${cY}-${cM}-${d}`;
  const aulasDoDiaSelecionado = aulasPorDia[chaveDia(cS)] ?? [];
  const dataSelecionada = new Date(cY, cM, cS);
  const labelDia = DIAS_SEMANA[dataSelecionada.getDay()];
  const labelDiaFmt = `${labelDia.charAt(0).toUpperCase()}${labelDia.slice(1)}, ${String(cS).padStart(2, '0')}/${String(cM + 1).padStart(2, '0')}`;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <TopBar subtitle={label} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.calWrap}>
          <View style={styles.calNavRow}>
            <TouchableOpacity onPress={() => mudarMes(-1)}>
              <Ionicons name="chevron-back" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
            <Text style={styles.calTitle}>{label}</Text>
            <TouchableOpacity onPress={() => mudarMes(1)}>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.calGrid}>
            {DIAS_HEADER.map((h, i) => (
              <Text key={i} style={styles.calHeader}>{h}</Text>
            ))}
          </View>
          <View style={styles.calGrid}>
            {dias.map((d, i) => {
              if (d === null) return <View key={i} style={styles.calCell} />;
              const isToday = cY === HOJE.y && cM === HOJE.m && d === HOJE.d;
              const isSel = d === cS;
              const temAula = !!aulasPorDia[chaveDia(d)];
              return (
                <View key={i} style={styles.calCell}>
                  <TouchableOpacity
                    style={[styles.calDay, isToday && styles.calDayToday, isSel && styles.calDaySel]}
                    onPress={() => setCS(d)}
                  >
                    <Text style={[styles.calDayTxt, (isToday || isSel) && { color: '#fff', fontFamily: fonts.sansBold }]}>{d}</Text>
                    {temAula ? <View style={[styles.calDot, (isToday || isSel) && { backgroundColor: '#fff' }]} /> : null}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.dayTitle}>{labelDiaFmt}</Text>
          {aulasDoDiaSelecionado.length === 0 ? (
            <Text style={styles.empty}>Nenhuma aula neste dia</Text>
          ) : (
            aulasDoDiaSelecionado.map((a, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.aulaRow, i === aulasDoDiaSelecionado.length - 1 && { borderBottomWidth: 0 }]}
                onPress={() => {
                  const id = nomeParaTurmaId[a.n];
                  if (id) setAulaAberta(id);
                }}
              >
                <Text style={styles.aulaTime}>{a.h}</Text>
                <View style={[styles.aulaBar, { backgroundColor: a.c }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.aulaName}>{a.n}</Text>
                  <Text style={styles.aulaMeta}>{a.m}</Text>
                </View>
                <AulaBadge status={a.badge} />
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <AulaDetalheSheet turmaId={aulaAberta} onClose={() => setAulaAberta(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.backgroundPrimary },
  scroll: { flex: 1, backgroundColor: colors.backgroundSecondary },
  scrollContent: { padding: 14, gap: 12 },
  calWrap: { backgroundColor: colors.backgroundPrimary, borderWidth: 0.5, borderColor: colors.borderTertiary, borderRadius: 14, padding: 10 },
  calNavRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, paddingHorizontal: 4 },
  calTitle: { fontSize: 13, fontFamily: fonts.sansSemiBold, color: colors.textPrimary },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calHeader: { width: `${100 / 7}%`, textAlign: 'center', fontSize: 9, color: colors.textSecondary, fontFamily: fonts.sansMedium, paddingVertical: 3 },
  calCell: { width: `${100 / 7}%`, alignItems: 'center', justifyContent: 'center', paddingVertical: 2 },
  calDay: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  calDayToday: { backgroundColor: '#333' },
  calDaySel: { backgroundColor: colors.fiap },
  calDayTxt: { fontSize: 11, color: colors.textSecondary },
  calDot: { position: 'absolute', bottom: 2, width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.fiap },
  card: { backgroundColor: colors.backgroundPrimary, borderWidth: 0.5, borderColor: colors.borderTertiary, borderRadius: 14, padding: 13 },
  dayTitle: { fontSize: 13, fontFamily: fonts.sansSemiBold, color: colors.textPrimary, marginBottom: 10 },
  empty: { textAlign: 'center', fontSize: 13, color: colors.textSecondary, paddingVertical: 10 },
  aulaRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', paddingVertical: 9, borderBottomWidth: 0.5, borderBottomColor: colors.borderTertiary },
  aulaTime: { fontSize: 11, color: colors.textSecondary, minWidth: 40, textAlign: 'right', paddingTop: 2 },
  aulaBar: { width: 3, borderRadius: 2, minHeight: 36 },
  aulaName: { fontSize: 13, fontFamily: fonts.sansMedium, color: colors.textPrimary },
  aulaMeta: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
});
