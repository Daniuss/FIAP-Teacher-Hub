import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors, fonts } from '../theme/colors';

interface Props {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}

export default function SelectField({ label, value, options, onChange }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.select} onPress={() => setOpen((v) => !v)}>
        <Text style={styles.selectTxt} numberOfLines={1}>{value}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={14} color={colors.textSecondary} />
      </TouchableOpacity>
      {open ? (
        <View style={styles.options}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={styles.option}
              onPress={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              <Text style={[styles.optionTxt, opt === value && { color: colors.fiap, fontFamily: fonts.sansSemiBold }]}>{opt}</Text>
              {opt === value ? <Ionicons name="checkmark" size={14} color={colors.fiap} /> : null}
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { marginBottom: 12 },
  label: { fontSize: 11, fontFamily: fonts.sansSemiBold, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  select: {
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 0.5,
    borderColor: colors.borderSecondary,
    borderRadius: 9,
    paddingVertical: 10,
    paddingHorizontal: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectTxt: { fontSize: 13, color: colors.textPrimary, flex: 1 },
  options: { backgroundColor: colors.backgroundPrimary, borderWidth: 0.5, borderColor: colors.borderTertiary, borderRadius: 9, marginTop: 4, overflow: 'hidden' },
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 0.5, borderBottomColor: colors.borderTertiary },
  optionTxt: { fontSize: 13, color: colors.textPrimary },
});
