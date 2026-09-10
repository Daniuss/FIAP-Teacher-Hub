import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AulaBadge from '../components/AulaBadge';
import AulaDetalheSheet from '../components/AulaDetalheSheet';
import ChamadoDetalheSheet from '../components/ChamadoDetalheSheet';
import TopBar from '../components/TopBar';
import { useApp } from '../context/AppContext';
import { aulasHojePorUnidade } from '../data/mock';
import { colors, fonts } from '../theme/colors';

export default function DashboardScreen() {
  const { professor, chamados } = useApp();
  const navigation = useNavigation<any>();
  const [aulaAberta, setAulaAberta] = useState<string | null>(null);
  const [chamadoAberto, setChamadoAberto] = useState<string | null>(null);

  const totalAulas = aulasHojePorUnidade.reduce((acc, g) => acc + g.aulas.length, 0);
  const chamadosAbertos = chamados.filter((c) => c.status !== undefined).length;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <TopBar subtitle="Professor" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <Text style={styles.heroGreeting}>Bom dia,</Text>
          <Text style={styles.heroName}>{professor.nome}</Text>
          <View style={styles.heroStats}>
            <HeroStat val={String(totalAulas)} lbl="Aulas hoje" />
            <HeroStat val={String(chamadosAbertos)} lbl="Chamados" />
            <HeroStat val="3" lbl="Mensagens" />
          </View>
        </View>

        {aulasHojePorUnidade.map((grupo) => (
          <View key={grupo.unidade}>
            <View style={styles.unidadeLabelRow}>
              <Ionicons name="location-outline" size={11} color={colors.fiap} />
              <Text style={styles.unidadeLabel}>{grupo.unidade}</Text>
            </View>
            <View style={styles.card}>
              {grupo.aulas.map((aula, i) => (
                <TouchableOpacity
                  key={aula.id}
                  style={[styles.auRow, i === grupo.aulas.length - 1 && { borderBottomWidth: 0 }]}
                  onPress={() => setAulaAberta(aula.id)}
                >
                  <Text style={styles.auTime}>{aula.hora}</Text>
                  <View style={[styles.auBar, { backgroundColor: aula.cor }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.auName}>{aula.nome}</Text>
                    <Text style={styles.auMeta}>{aula.meta}</Text>
                  </View>
                  <AulaBadge status={aula.badge} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.cardTitle}>Meus chamados abertos</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Chamados')}>
              <Text style={styles.seeAll}>ver todos →</Text>
            </TouchableOpacity>
          </View>
          {chamados.map((c) => {
            const isAndamento = c.status === 'em_andamento';
            return (
              <TouchableOpacity key={c.id} style={styles.chamadoItem} onPress={() => setChamadoAberto(c.id)}>
                <View style={[styles.chamadoIcon, { backgroundColor: isAndamento ? colors.ciAndamentoBg : colors.ciAbertoBg }]}>
                  <Ionicons name={c.icon as any} size={17} color={isAndamento ? colors.ciAndamentoText : colors.ciAbertoText} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.chamadoTitle}>{c.desc}</Text>
                  <Text style={styles.chamadoSub}>{c.meta}</Text>
                </View>
                <Text style={[styles.chamadoStatus, { backgroundColor: isAndamento ? colors.ciAndamentoBg : colors.ciAbertoBg, color: isAndamento ? colors.ciAndamentoText : colors.ciAbertoText }]}>
                  {isAndamento ? 'Em andamento' : 'Aberto'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <AulaDetalheSheet turmaId={aulaAberta} onClose={() => setAulaAberta(null)} />
      <ChamadoDetalheSheet chamadoId={chamadoAberto} onClose={() => setChamadoAberto(null)} />
    </SafeAreaView>
  );
}

function HeroStat({ val, lbl }: { val: string; lbl: string }) {
  return (
    <View style={styles.heroStat}>
      <Text style={styles.heroStatVal}>{val}</Text>
      <Text style={styles.heroStatLbl}>{lbl}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.backgroundPrimary },
  scroll: { flex: 1, backgroundColor: colors.backgroundSecondary },
  scrollContent: { padding: 14, gap: 12 },
  hero: { backgroundColor: colors.black, borderRadius: 16, padding: 16, borderWidth: 0.5, borderColor: 'rgba(216,27,96,0.3)' },
  heroGreeting: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 },
  heroName: { fontSize: 18, fontFamily: fonts.sansBold, color: '#fff', marginBottom: 12 },
  heroStats: { flexDirection: 'row', gap: 8 },
  heroStat: { flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 9, paddingVertical: 8, alignItems: 'center' },
  heroStatVal: { fontSize: 20, fontFamily: fonts.sansBold, color: '#fff' },
  heroStatLbl: { fontSize: 10, color: 'rgba(255,255,255,0.4)' },
  unidadeLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingTop: 2, paddingBottom: 6 },
  unidadeLabel: { fontSize: 10, fontFamily: fonts.sansBold, color: 'rgba(216,27,96,0.8)', letterSpacing: 1, textTransform: 'uppercase' },
  card: { backgroundColor: colors.backgroundPrimary, borderWidth: 0.5, borderColor: colors.borderTertiary, borderRadius: 14, padding: 13 },
  auRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: colors.borderTertiary },
  auTime: { fontSize: 11, color: colors.textSecondary, minWidth: 40, textAlign: 'right' },
  auBar: { width: 3, borderRadius: 2, height: 34 },
  auName: { fontSize: 13, fontFamily: fonts.sansMedium, color: colors.textPrimary },
  auMeta: { fontSize: 11, color: colors.textSecondary, marginTop: 1 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  cardTitle: { fontSize: 11, fontFamily: fonts.sansSemiBold, letterSpacing: 1, textTransform: 'uppercase', color: colors.textSecondary },
  seeAll: { fontSize: 11, color: colors.fiap, fontFamily: fonts.sansMedium },
  chamadoItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9, borderBottomWidth: 0.5, borderBottomColor: colors.borderTertiary },
  chamadoIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  chamadoTitle: { fontSize: 13, fontFamily: fonts.sansMedium, color: colors.textPrimary },
  chamadoSub: { fontSize: 11, color: colors.textSecondary, marginTop: 1 },
  chamadoStatus: { fontSize: 10, fontFamily: fonts.sansBold, paddingVertical: 3, paddingHorizontal: 9, borderRadius: 6, overflow: 'hidden' },
});
