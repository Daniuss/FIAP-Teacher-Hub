import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useApp } from '../context/AppContext';
import { colors, fonts } from '../theme/colors';
import BottomSheet from './BottomSheet';

interface Props {
  subtitle: string;
}

const notificacoes = [
  { icon: 'construct-outline', bg: colors.ciAndamentoBg, color: colors.ciAndamentoText, titulo: 'Monitor respondeu seu chamado', sub: '#2341 · "Estou indo até a sala" · há 5min' },
  { icon: 'tv-outline', bg: colors.ciAbertoBg, color: colors.ciAbertoText, titulo: 'Chamado #2342 recebido', sub: 'Audiovisual · Projetor Sala 305' },
];

export default function TopBar({ subtitle }: Props) {
  const { professor, logout } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <View style={styles.bar}>
      <View>
        <Text style={styles.logo}>FIAP</Text>
        <Text style={styles.sub}>{subtitle}</Text>
      </View>
      <View style={styles.right}>
        <TouchableOpacity style={styles.notifBtn} onPress={() => setNotifOpen(true)}>
          <Ionicons name="notifications-outline" size={18} color="#fff" />
          <View style={styles.dot} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.avatar} onPress={() => setProfileOpen(true)}>
          <Text style={styles.avatarTxt}>{professor.iniciais}</Text>
        </TouchableOpacity>
      </View>

      <BottomSheet visible={notifOpen} onClose={() => setNotifOpen(false)} title="Notificações">
        {notificacoes.map((n, i) => (
          <View key={i} style={styles.notifRow}>
            <View style={[styles.notifIcon, { backgroundColor: n.bg }]}>
              <Ionicons name={n.icon as any} size={17} color={n.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.notifTitle}>{n.titulo}</Text>
              <Text style={styles.notifSub}>{n.sub}</Text>
            </View>
          </View>
        ))}
      </BottomSheet>

      <BottomSheet visible={profileOpen} onClose={() => setProfileOpen(false)}>
        <View style={styles.profileHeader}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarTxt}>{professor.iniciais}</Text>
          </View>
          <Text style={styles.profileName}>{professor.nome}</Text>
          <Text style={styles.profileRole}>{professor.curso}</Text>
        </View>
        <ProfileRow icon="mail-outline" label="E-mail" value={professor.email} />
        <ProfileRow icon="id-card-outline" label="Matrícula" value={professor.matricula} />
        <ProfileRow icon="notifications-outline" label="Notificações" value="Ativas" />
        <ProfileRow icon="lock-closed-outline" label="Alterar senha" chevron />
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            setProfileOpen(false);
            logout();
          }}
        >
          <Text style={styles.logoutTxt}>Sair da conta</Text>
        </TouchableOpacity>
      </BottomSheet>
    </View>
  );
}

function ProfileRow({ icon, label, value, chevron }: { icon: any; label: string; value?: string; chevron?: boolean }) {
  return (
    <Pressable style={styles.profileRow}>
      <Ionicons name={icon} size={18} color={colors.textSecondary} style={{ width: 24 }} />
      <Text style={styles.profileRowLabel}>{label}</Text>
      {value ? <Text style={styles.profileRowVal}>{value}</Text> : null}
      {chevron ? <Ionicons name="chevron-forward" size={14} color={colors.borderSecondary} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.black,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: { fontFamily: fonts.logo, fontSize: 24, color: colors.fiap, letterSpacing: 2 },
  sub: { fontSize: 9, fontFamily: fonts.sansMedium, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginTop: 1 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  notifBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', top: 6, right: 7, width: 7, height: 7, borderRadius: 4, backgroundColor: colors.fiap, borderWidth: 1, borderColor: colors.black },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.fiap, alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { fontSize: 12, fontFamily: fonts.sansBold, color: '#fff' },
  notifRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9, borderBottomWidth: 0.5, borderBottomColor: colors.borderTertiary },
  notifIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  notifTitle: { fontSize: 13, fontFamily: fonts.sansMedium, color: colors.textPrimary },
  notifSub: { fontSize: 11, color: colors.textSecondary, marginTop: 1 },
  profileHeader: { backgroundColor: colors.black, marginHorizontal: -16, marginTop: -14, paddingVertical: 22, alignItems: 'center', gap: 6, marginBottom: 8 },
  profileAvatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.fiap, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.15)' },
  profileAvatarTxt: { fontSize: 22, fontFamily: fonts.sansBold, color: '#fff' },
  profileName: { fontSize: 17, fontFamily: fonts.sansBold, color: '#fff' },
  profileRole: { fontSize: 11, color: 'rgba(255,255,255,0.4)' },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: colors.borderTertiary },
  profileRowLabel: { fontSize: 13, color: colors.textPrimary, flex: 1 },
  profileRowVal: { fontSize: 12, color: colors.textSecondary },
  logoutBtn: { marginTop: 16, backgroundColor: '#FCEBEB', borderRadius: 11, paddingVertical: 12, alignItems: 'center' },
  logoutTxt: { fontSize: 13, fontFamily: fonts.sansBold, color: '#A32D2D' },
});
