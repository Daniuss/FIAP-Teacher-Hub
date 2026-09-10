import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ChamadoDetalheSheet from '../components/ChamadoDetalheSheet';
import TopBar from '../components/TopBar';
import { useApp } from '../context/AppContext';
import { setores } from '../data/mock';
import { colors, fonts, setorMeta, SetorKey } from '../theme/colors';

export default function ChamadosScreen() {
  const { chamados, abrirChamado } = useApp();
  const [setorSelecionado, setSetorSelecionado] = useState<SetorKey | null>(null);
  const [descricao, setDescricao] = useState('');
  const [chamadoAberto, setChamadoAberto] = useState<string | null>(null);

  function enviar() {
    if (!setorSelecionado || !descricao.trim()) return;
    abrirChamado(setorSelecionado, descricao.trim());
    setDescricao('');
    setSetorSelecionado(null);
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <TopBar subtitle="Chamados" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Selecione o setor</Text>
          <View style={styles.grid}>
            {setores.map((s) => {
              const meta = setorMeta[s];
              const selected = setorSelecionado === s;
              return (
                <TouchableOpacity
                  key={s}
                  style={[styles.setorCard, selected && styles.setorCardSelected]}
                  onPress={() => setSetorSelecionado(s)}
                >
                  <View style={[styles.setorIcon, { backgroundColor: meta.bg }]}>
                    <Ionicons name={meta.icon as any} size={18} color={meta.color} />
                  </View>
                  <Text style={styles.setorName}>{s}</Text>
                  <Text style={styles.setorSub}>{meta.sub}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {setorSelecionado ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Chamado — {setorSelecionado}</Text>
            <TextInput
              style={styles.textarea}
              placeholder="Descreva o problema..."
              placeholderTextColor={colors.textSecondary}
              multiline
              value={descricao}
              onChangeText={setDescricao}
            />
            <TouchableOpacity style={styles.submitBtn} onPress={enviar}>
              <Text style={styles.submitBtnTxt}>Enviar chamado</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Meus chamados</Text>
          {chamados.map((c, i) => {
            const isAndamento = c.status === 'em_andamento';
            return (
              <TouchableOpacity key={c.id} style={[styles.chamadoItem, i === chamados.length - 1 && { borderBottomWidth: 0 }]} onPress={() => setChamadoAberto(c.id)}>
                <View style={[styles.chamadoIcon, { backgroundColor: isAndamento ? colors.ciAndamentoBg : colors.ciAbertoBg }]}>
                  <Ionicons name={c.icon as any} size={17} color={isAndamento ? colors.ciAndamentoText : colors.ciAbertoText} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.chamadoTitle}>{c.desc}</Text>
                  <Text style={styles.chamadoSub}>{c.numero} · {c.meta}</Text>
                </View>
                <Text style={[styles.chamadoStatus, { backgroundColor: isAndamento ? colors.ciAndamentoBg : colors.ciAbertoBg, color: isAndamento ? colors.ciAndamentoText : colors.ciAbertoText }]}>
                  {isAndamento ? 'Em andamento' : 'Aberto'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <ChamadoDetalheSheet chamadoId={chamadoAberto} onClose={() => setChamadoAberto(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.backgroundPrimary },
  scroll: { flex: 1, backgroundColor: colors.backgroundSecondary },
  scrollContent: { padding: 14, gap: 12 },
  card: { backgroundColor: colors.backgroundPrimary, borderWidth: 0.5, borderColor: colors.borderTertiary, borderRadius: 14, padding: 13 },
  cardTitle: { fontSize: 11, fontFamily: fonts.sansSemiBold, letterSpacing: 1, textTransform: 'uppercase', color: colors.textSecondary, marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  setorCard: { width: '47%', backgroundColor: colors.backgroundSecondary, borderWidth: 0.5, borderColor: colors.borderTertiary, borderRadius: 11, padding: 12, gap: 6 },
  setorCardSelected: { borderWidth: 1.5, borderColor: colors.fiap, backgroundColor: 'rgba(216,27,96,0.06)' },
  setorIcon: { width: 34, height: 34, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  setorName: { fontSize: 12, fontFamily: fonts.sansSemiBold, color: colors.textPrimary },
  setorSub: { fontSize: 10, color: colors.textSecondary, lineHeight: 13 },
  textarea: { backgroundColor: colors.backgroundSecondary, borderWidth: 0.5, borderColor: colors.borderSecondary, borderRadius: 9, fontSize: 13, padding: 11, height: 85, color: colors.textPrimary, textAlignVertical: 'top', marginBottom: 10 },
  submitBtn: { backgroundColor: colors.fiap, borderRadius: 11, paddingVertical: 12, alignItems: 'center' },
  submitBtnTxt: { color: '#fff', fontSize: 13, fontFamily: fonts.sansBold },
  chamadoItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9, borderBottomWidth: 0.5, borderBottomColor: colors.borderTertiary },
  chamadoIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  chamadoTitle: { fontSize: 13, fontFamily: fonts.sansMedium, color: colors.textPrimary },
  chamadoSub: { fontSize: 11, color: colors.textSecondary, marginTop: 1 },
  chamadoStatus: { fontSize: 10, fontFamily: fonts.sansBold, paddingVertical: 3, paddingHorizontal: 9, borderRadius: 6, overflow: 'hidden' },
});
