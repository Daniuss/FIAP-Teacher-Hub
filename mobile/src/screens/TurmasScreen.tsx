import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AulaDetalheSheet from '../components/AulaDetalheSheet';
import TopBar from '../components/TopBar';
import { turmas } from '../data/mock';
import { colors, fonts } from '../theme/colors';

export default function TurmasScreen() {
  const [busca, setBusca] = useState('');
  const [turmaAberta, setTurmaAberta] = useState<string | null>(null);

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return turmas;
    return turmas.filter(
      (t) => t.nome.toLowerCase().includes(termo) || t.codigo.toLowerCase().includes(termo) || t.unidade.toLowerCase().includes(termo)
    );
  }, [busca]);

  const grupos = useMemo(() => {
    const porUnidade = new Map<string, typeof turmas>();
    filtradas.forEach((t) => {
      const arr = porUnidade.get(t.unidadeLabel) ?? [];
      arr.push(t);
      porUnidade.set(t.unidadeLabel, arr);
    });
    return Array.from(porUnidade.entries());
  }, [filtradas]);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <TopBar subtitle="Turmas" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={16} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar turma ou disciplina..."
            placeholderTextColor={colors.textSecondary}
            value={busca}
            onChangeText={setBusca}
          />
        </View>

        {grupos.length === 0 ? (
          <Text style={styles.empty}>Nenhuma turma encontrada</Text>
        ) : (
          grupos.map(([unidadeLabel, lista]) => (
            <View key={unidadeLabel}>
              <View style={styles.sectionLabelRow}>
                <Ionicons name="location-outline" size={11} color={colors.fiap} />
                <Text style={styles.sectionLabel}>{unidadeLabel}</Text>
              </View>
              {lista.map((t) => (
                <TouchableOpacity key={t.id} style={styles.turmaCard} onPress={() => setTurmaAberta(t.id)}>
                  <View style={[styles.iconWrap, { backgroundColor: t.iconBg }]}>
                    <Ionicons name={t.icon as any} size={20} color={t.iconColor} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.turmaNome}>{t.nome}</Text>
                    <Text style={styles.turmaSub}>{t.codigo} · {t.dias} · {t.horario} · Sala {t.sala}</Text>
                    <View style={styles.tagsRow}>
                      {t.tags.map((tag, i) => (
                        <Text key={i} style={[styles.pill, { backgroundColor: tag.bg, color: tag.cor }]}>{tag.texto}</Text>
                      ))}
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={14} color={colors.borderSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          ))
        )}
      </ScrollView>

      <AulaDetalheSheet turmaId={turmaAberta} onClose={() => setTurmaAberta(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.backgroundPrimary },
  scroll: { flex: 1, backgroundColor: colors.backgroundSecondary },
  scrollContent: { padding: 14, gap: 8 },
  searchWrap: { position: 'relative', justifyContent: 'center', marginBottom: 4 },
  searchIcon: { position: 'absolute', left: 12, zIndex: 1 },
  searchInput: {
    backgroundColor: colors.backgroundPrimary,
    borderWidth: 0.5,
    borderColor: colors.borderTertiary,
    borderRadius: 11,
    fontSize: 13,
    paddingVertical: 10,
    paddingLeft: 38,
    paddingRight: 12,
    color: colors.textPrimary,
  },
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingTop: 2, paddingBottom: 6, marginTop: 4 },
  sectionLabel: { fontSize: 10, fontFamily: fonts.sansBold, color: 'rgba(216,27,96,0.8)', letterSpacing: 1, textTransform: 'uppercase' },
  turmaCard: { backgroundColor: colors.backgroundPrimary, borderWidth: 0.5, borderColor: colors.borderTertiary, borderRadius: 14, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  iconWrap: { width: 42, height: 42, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  turmaNome: { fontSize: 14, fontFamily: fonts.sansSemiBold, color: colors.textPrimary },
  turmaSub: { fontSize: 11, color: colors.textSecondary, marginTop: 1 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 },
  pill: { fontSize: 10, fontFamily: fonts.sansBold, paddingVertical: 2, paddingHorizontal: 8, borderRadius: 20, overflow: 'hidden' },
  empty: { textAlign: 'center', padding: 24, fontSize: 13, color: colors.textSecondary },
});
