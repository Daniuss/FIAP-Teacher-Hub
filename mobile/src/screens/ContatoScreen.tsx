import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ChatSheet from '../components/ChatSheet';
import CoordSheet from '../components/CoordSheet';
import NovoAvisoSheet from '../components/NovoAvisoSheet';
import TopBar from '../components/TopBar';
import { useApp } from '../context/AppContext';
import { colors, fonts } from '../theme/colors';

type Tab = 'alunos' | 'avisos' | 'coord';

export default function ContatoScreen() {
  const { chats, avisos } = useApp();
  const [tab, setTab] = useState<Tab>('alunos');
  const [chatAberto, setChatAberto] = useState<string | null>(null);
  const [novoAvisoOpen, setNovoAvisoOpen] = useState(false);
  const [coordOpen, setCoordOpen] = useState(false);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <TopBar subtitle="Contato" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.tabs}>
          <TabBtn label="Alunos" active={tab === 'alunos'} onPress={() => setTab('alunos')} />
          <TabBtn label="Avisos" active={tab === 'avisos'} onPress={() => setTab('avisos')} />
          <TabBtn label="Coordenação" active={tab === 'coord'} onPress={() => setTab('coord')} />
        </View>

        {tab === 'alunos' && (
          <View style={styles.card}>
            {chats.map((c, i) => (
              <TouchableOpacity key={c.id} style={[styles.chatRow, i === chats.length - 1 && { borderBottomWidth: 0 }]} onPress={() => setChatAberto(c.id)}>
                <View style={[styles.chatAv, { backgroundColor: c.bg }]}>
                  <Text style={[styles.chatAvTxt, { color: c.cor }]}>{c.iniciais}</Text>
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.chatName}>
                    {c.nome} <Text style={styles.chatTurma}>· {c.turma}</Text>
                  </Text>
                  <Text style={styles.chatPrev} numberOfLines={1}>{c.msgs[c.msgs.length - 1]?.txt}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <Text style={styles.chatTime}>{c.ultimaHora}</Text>
                  {c.naoLidas > 0 ? (
                    <Text style={styles.unread}>{c.naoLidas}</Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {tab === 'avisos' && (
          <>
            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={16} color={colors.fiap} />
              <Text style={styles.infoTxt}>Avisos entregues em tempo real pelo portal do aluno FIAP.</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Avisos enviados</Text>
              {avisos.map((a, i) => (
                <View key={i} style={styles.avisoRow}>
                  <View style={styles.avisoHeader}>
                    <Text style={styles.avisoTurma}>{a.turma}</Text>
                    <Text style={styles.avisoMeta}>{a.quando} · {a.alunos} alunos</Text>
                  </View>
                  <Text style={styles.avisoTexto}>{a.texto}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.btn} onPress={() => setNovoAvisoOpen(true)}>
              <Ionicons name="send" size={14} color="#fff" />
              <Text style={styles.btnTxt}>Novo aviso para turma</Text>
            </TouchableOpacity>
          </>
        )}

        {tab === 'coord' && (
          <>
            <View style={styles.infoBox}>
              <Ionicons name="time-outline" size={16} color={colors.fiap} />
              <Text style={styles.infoTxt}>
                <Text style={{ fontFamily: fonts.sansSemiBold, color: colors.textPrimary }}>Hoje:</Text> 14h–18h na Paulista{'\n'}
                <Text style={{ fontFamily: fonts.sansSemiBold, color: colors.textPrimary }}>Próximo:</Text> Sex. 10h–12h (Remoto)
              </Text>
            </View>
            <TouchableOpacity style={styles.btn} onPress={() => setCoordOpen(true)}>
              <Ionicons name="calendar-outline" size={14} color="#fff" />
              <Text style={styles.btnTxt}>Abrir solicitação / ver horários</Text>
            </TouchableOpacity>
            <View style={[styles.card, { marginTop: 12 }]}>
              <Text style={styles.cardTitle}>Mensagens recentes</Text>
              <View style={styles.chatRow}>
                <View style={[styles.chatAv, { backgroundColor: colors.coordBg }]}>
                  <Text style={[styles.chatAvTxt, { color: colors.coordText, fontSize: 10 }]}>COORD</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.chatName}>Coordenação</Text>
                  <Text style={styles.chatPrev}>Sua solicitação de mudança de sala foi aprovada.</Text>
                </View>
                <Text style={styles.chatTime}>28/05</Text>
              </View>
              <View style={[styles.chatRow, { borderBottomWidth: 0 }]}>
                <View style={[styles.chatAv, { backgroundColor: colors.badgeDoneBg }]}>
                  <Text style={[styles.chatAvTxt, { color: colors.badgeDoneText, fontSize: 10 }]}>SEC</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.chatName}>Secretaria</Text>
                  <Text style={styles.chatPrev}>Entrega de atas: até dia 15/06.</Text>
                </View>
                <Text style={styles.chatTime}>Ontem</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <ChatSheet chatId={chatAberto} onClose={() => setChatAberto(null)} />
      <NovoAvisoSheet visible={novoAvisoOpen} onClose={() => setNovoAvisoOpen(false)} />
      <CoordSheet visible={coordOpen} onClose={() => setCoordOpen(false)} />
    </SafeAreaView>
  );
}

function TabBtn({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.tabBtn, active && styles.tabBtnActive]} onPress={onPress}>
      <Text style={[styles.tabBtnTxt, active && styles.tabBtnTxtActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.backgroundPrimary },
  scroll: { flex: 1, backgroundColor: colors.backgroundSecondary },
  scrollContent: { padding: 14, gap: 12 },
  tabs: { flexDirection: 'row', backgroundColor: colors.backgroundSecondary, borderRadius: 11, padding: 3 },
  tabBtn: { flex: 1, paddingVertical: 7, borderRadius: 9, alignItems: 'center' },
  tabBtnActive: { backgroundColor: colors.backgroundPrimary },
  tabBtnTxt: { fontSize: 11, fontFamily: fonts.sansMedium, color: colors.textSecondary },
  tabBtnTxtActive: { color: colors.textPrimary },
  card: { backgroundColor: colors.backgroundPrimary, borderWidth: 0.5, borderColor: colors.borderTertiary, borderRadius: 14, padding: 13 },
  cardTitle: { fontSize: 11, fontFamily: fonts.sansSemiBold, letterSpacing: 1, textTransform: 'uppercase', color: colors.textSecondary, marginBottom: 10 },
  chatRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: colors.borderTertiary },
  chatAv: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  chatAvTxt: { fontSize: 13, fontFamily: fonts.sansBold },
  chatName: { fontSize: 13, fontFamily: fonts.sansMedium, color: colors.textPrimary },
  chatTurma: { fontSize: 10, color: colors.textSecondary, fontFamily: fonts.sans },
  chatPrev: { fontSize: 11, color: colors.textSecondary, marginTop: 1 },
  chatTime: { fontSize: 10, color: colors.textSecondary },
  unread: { backgroundColor: colors.fiap, color: '#fff', fontSize: 10, fontFamily: fonts.sansBold, borderRadius: 10, paddingVertical: 1, paddingHorizontal: 7, overflow: 'hidden' },
  infoBox: { backgroundColor: 'rgba(216,27,96,0.06)', borderWidth: 0.5, borderColor: 'rgba(216,27,96,0.2)', borderRadius: 11, padding: 12, flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  infoTxt: { fontSize: 12, color: colors.textSecondary, lineHeight: 17, flex: 1 },
  avisoRow: { backgroundColor: colors.backgroundSecondary, borderRadius: 9, padding: 11, marginBottom: 8 },
  avisoHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 },
  avisoTurma: { fontSize: 10, fontFamily: fonts.sansBold, color: colors.fiap, textTransform: 'uppercase', letterSpacing: 0.5 },
  avisoMeta: { fontSize: 10, color: colors.textSecondary },
  avisoTexto: { fontSize: 12, color: colors.textPrimary },
  btn: { backgroundColor: colors.fiap, borderRadius: 11, paddingVertical: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  btnTxt: { color: '#fff', fontSize: 13, fontFamily: fonts.sansBold },
});
