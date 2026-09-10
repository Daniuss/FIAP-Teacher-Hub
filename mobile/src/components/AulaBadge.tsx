import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { colors, fonts } from '../theme/colors';
import type { BadgeAula } from '../data/mock';

const map: Record<BadgeAula, { bg: string; color: string; label: string }> = {
  done: { bg: colors.badgeDoneBg, color: colors.badgeDoneText, label: 'Concluída' },
  now: { bg: colors.badgeNowBg, color: colors.badgeNowText, label: 'Agora' },
  next: { bg: colors.badgeNextBg, color: colors.badgeNextText, label: 'Próxima' },
};

export default function AulaBadge({ status }: { status: BadgeAula }) {
  const m = map[status];
  return (
    <Text style={[styles.badge, { backgroundColor: m.bg, color: m.color }]}>{m.label}</Text>
  );
}

const styles = StyleSheet.create({
  badge: {
    fontSize: 10,
    fontFamily: fonts.sansBold,
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 6,
    overflow: 'hidden',
  },
});
