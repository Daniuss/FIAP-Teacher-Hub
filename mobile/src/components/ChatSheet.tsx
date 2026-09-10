import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useApp } from '../context/AppContext';
import { colors, fonts } from '../theme/colors';

interface Props {
  chatId: string | null;
  onClose: () => void;
}

export default function ChatSheet({ chatId, onClose }: Props) {
  const { chats, responderChat } = useApp();
  const [texto, setTexto] = useState('');
  const chat = chats.find((c) => c.id === chatId);

  function enviar() {
    if (!texto.trim() || !chat) return;
    responderChat(chat.id, texto.trim());
    setTexto('');
  }

  return (
    <Modal visible={!!chat} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.wrap}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.sheet}>
          <View style={styles.handle} />
          {chat ? (
            <>
              <View style={styles.header}>
                <View style={[styles.av, { backgroundColor: chat.bg }]}>
                  <Text style={[styles.avTxt, { color: chat.cor }]}>{chat.iniciais}</Text>
                </View>
                <View>
                  <Text style={styles.name}>{chat.nome}</Text>
                  <Text style={styles.turma}>{chat.turma}</Text>
                </View>
              </View>

              <ScrollView style={styles.msgs} contentContainerStyle={{ paddingVertical: 14, paddingHorizontal: 16 }}>
                {chat.msgs.map((m, i) => (
                  <View key={i} style={{ alignItems: m.me ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
                    <View style={[styles.bubble, m.me ? styles.bubbleMe : styles.bubbleThem]}>
                      <Text style={{ color: m.me ? '#fff' : colors.textPrimary, fontSize: 13, lineHeight: 18 }}>{m.txt}</Text>
                    </View>
                    <Text style={styles.msgTime}>{m.t}</Text>
                  </View>
                ))}
              </ScrollView>

              <View style={styles.inputRow}>
                <TouchableOpacity style={styles.attachBtn}>
                  <Ionicons name="attach-outline" size={17} color={colors.textSecondary} />
                </TouchableOpacity>
                <TextInput
                  style={styles.input}
                  placeholder="Responder..."
                  placeholderTextColor={colors.textSecondary}
                  value={texto}
                  onChangeText={setTexto}
                  onSubmitEditing={enviar}
                />
                <TouchableOpacity style={styles.sendBtn} onPress={enviar}>
                  <Ionicons name="send" size={15} color="#fff" />
                </TouchableOpacity>
              </View>
            </>
          ) : null}
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.55)' },
  sheet: { backgroundColor: colors.backgroundPrimary, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '92%' },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.borderSecondary, alignSelf: 'center', marginTop: 10, marginBottom: 12 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 0.5, borderBottomColor: colors.borderTertiary },
  av: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  avTxt: { fontSize: 13, fontFamily: fonts.sansBold },
  name: { fontSize: 15, fontFamily: fonts.sansSemiBold, color: colors.textPrimary },
  turma: { fontSize: 11, color: colors.textSecondary },
  msgs: { backgroundColor: colors.backgroundSecondary },
  bubble: { maxWidth: '82%', paddingVertical: 10, paddingHorizontal: 13, borderRadius: 16 },
  bubbleMe: { backgroundColor: colors.fiap, borderBottomRightRadius: 4 },
  bubbleThem: { backgroundColor: colors.backgroundPrimary, borderWidth: 0.5, borderColor: colors.borderTertiary, borderBottomLeftRadius: 4 },
  msgTime: { fontSize: 10, color: colors.textSecondary, marginTop: 3 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 0.5, borderTopColor: colors.borderTertiary },
  attachBtn: { width: 36, height: 36, borderRadius: 9, backgroundColor: 'rgba(0,0,0,0.06)', alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, backgroundColor: colors.backgroundPrimary, borderWidth: 0.5, borderColor: colors.borderTertiary, borderRadius: 20, paddingVertical: 10, paddingHorizontal: 15, fontSize: 13, color: colors.textPrimary },
  sendBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.fiap, alignItems: 'center', justifyContent: 'center' },
});
