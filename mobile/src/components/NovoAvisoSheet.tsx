import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useApp } from '../context/AppContext';
import { turmasParaAviso, turmas } from '../data/mock';
import { colors, fonts } from '../theme/colors';
import BottomSheet from './BottomSheet';
import SelectField from './SelectField';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function NovoAvisoSheet({ visible, onClose }: Props) {
  const { enviarAviso } = useApp();
  const [turmaLabel, setTurmaLabel] = useState(turmasParaAviso[0]);
  const [texto, setTexto] = useState('');

  function enviar() {
    if (!texto.trim()) return;
    const alvo = turmas.find((t) => turmaLabel.startsWith(t.codigo));
    const totalAlunos = alvo ? alvo.alunos : turmas.reduce((acc, t) => acc + t.alunos, 0);
    enviarAviso(alvo ? alvo.codigo : 'Todas as turmas', texto.trim(), totalAlunos);
    setTexto('');
    setTurmaLabel(turmasParaAviso[0]);
    onClose();
  }

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Novo aviso para turma">
      <View style={styles.info}>
        <Text style={styles.infoTxt}>Avisos entregues em tempo real pelo portal do aluno FIAP.</Text>
      </View>
      <SelectField label="Turma destinatária" value={turmaLabel} options={turmasParaAviso} onChange={setTurmaLabel} />
      <View style={styles.group}>
        <Text style={styles.label}>Mensagem</Text>
        <TextInput
          style={styles.textarea}
          placeholder="Ex: CP2 acontece na próxima aula..."
          placeholderTextColor={colors.textSecondary}
          multiline
          value={texto}
          onChangeText={setTexto}
        />
      </View>
      <TouchableOpacity style={styles.btn} onPress={enviar}>
        <Ionicons name="send" size={14} color="#fff" />
        <Text style={styles.btnTxt}>Enviar aviso</Text>
      </TouchableOpacity>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  info: { backgroundColor: 'rgba(216,27,96,0.06)', borderWidth: 0.5, borderColor: 'rgba(216,27,96,0.2)', borderRadius: 10, padding: 12, marginBottom: 14 },
  infoTxt: { fontSize: 12, color: colors.textSecondary, lineHeight: 17 },
  group: { marginBottom: 14 },
  label: { fontSize: 11, fontFamily: fonts.sansSemiBold, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  textarea: { backgroundColor: colors.backgroundSecondary, borderWidth: 0.5, borderColor: colors.borderSecondary, borderRadius: 9, fontSize: 13, padding: 11, height: 85, color: colors.textPrimary, textAlignVertical: 'top' },
  btn: { backgroundColor: colors.fiap, borderRadius: 11, paddingVertical: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  btnTxt: { color: '#fff', fontSize: 13, fontFamily: fonts.sansBold },
});
