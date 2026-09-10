import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '../context/AppContext';
import { colors, fonts } from '../theme/colors';

export default function LoginScreen() {
  const { login } = useApp();
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [erro, setErro] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    const res = await login(usuario.trim(), senha.trim());
    setLoading(false);
    setErro(!res.ok);
  }

  return (
    <SafeAreaView style={styles.bg} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Text style={styles.brand}>FIAP</Text>
        <Text style={styles.brandSub}>Professor</Text>

        <View style={styles.card}>
          <TextInput
            style={[styles.input, erro && styles.inputError]}
            placeholder="pf0000"
            placeholderTextColor="rgba(255,255,255,0.2)"
            autoCapitalize="none"
            autoCorrect={false}
            value={usuario}
            onChangeText={(v) => {
              setUsuario(v);
              setErro(false);
            }}
          />
          <View style={styles.passwordWrap}>
            <TextInput
              style={[styles.input, erro && styles.inputError, { paddingRight: 44 }]}
              placeholder="Senha"
              placeholderTextColor="rgba(255,255,255,0.2)"
              secureTextEntry={!showSenha}
              value={senha}
              onChangeText={(v) => {
                setSenha(v);
                setErro(false);
              }}
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowSenha((v) => !v)}>
              <Ionicons name={showSenha ? 'eye-outline' : 'eye-off-outline'} size={17} color="rgba(255,255,255,0.3)" />
            </TouchableOpacity>
          </View>

          {erro ? <Text style={styles.errorMsg}>Usuário ou senha incorretos.</Text> : null}

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginBtnTxt}>Conectar</Text>}
          </TouchableOpacity>
        </View>

        <Text style={styles.forgot}>Esqueceu a senha?</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.black },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  brand: { fontFamily: fonts.logo, fontSize: 56, color: colors.fiap, letterSpacing: 4, marginBottom: 6 },
  brandSub: { fontSize: 10, fontFamily: fonts.sansSemiBold, color: 'rgba(255,255,255,0.4)', letterSpacing: 5, textTransform: 'uppercase', marginBottom: 40 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    gap: 12,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 9,
    color: '#fff',
    fontSize: 15,
    fontFamily: fonts.sans,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  inputError: { borderColor: 'rgba(216,27,96,0.8)' },
  passwordWrap: { justifyContent: 'center' },
  eyeBtn: { position: 'absolute', right: 13 },
  errorMsg: {
    backgroundColor: 'rgba(216,27,96,0.1)',
    borderWidth: 0.5,
    borderColor: 'rgba(216,27,96,0.3)',
    borderRadius: 9,
    paddingVertical: 9,
    paddingHorizontal: 14,
    fontSize: 12,
    color: '#ff6b9d',
    textAlign: 'center',
  },
  loginBtn: { backgroundColor: colors.fiap, borderRadius: 9, paddingVertical: 14, alignItems: 'center' },
  loginBtnTxt: { color: '#fff', fontSize: 14, fontFamily: fonts.sansBold, letterSpacing: 2, textTransform: 'uppercase' },
  forgot: { fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 16 },
});
