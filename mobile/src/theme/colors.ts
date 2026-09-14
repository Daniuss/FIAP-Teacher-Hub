// Extraído 1:1 das variáveis CSS do preview/index.html
export const colors = {
  fiap: '#D81B60',

  backgroundPrimary: '#ffffff',
  backgroundSecondary: '#f5f5f5',
  backgroundTertiary: '#ebebeb',

  textPrimary: '#111111',
  textSecondary: '#666666',

  borderPrimary: '#cccccc',
  borderSecondary: '#dddddd',
  borderTertiary: '#eeeeee',

  black: '#000000',

  badgeNowBg: 'rgba(216,27,96,0.12)',
  badgeNowText: '#D81B60',
  badgeNextBg: '#E6F1FB',
  badgeNextText: '#185FA5',
  badgeDoneBg: '#F1EFE8',
  badgeDoneText: '#5F5E5A',

  ciAndamentoBg: '#FAEEDA',
  ciAndamentoText: '#854F0B',
  ciAbertoBg: 'rgba(216,27,96,0.1)',
  ciAbertoText: '#D81B60',
  ciResolvidoBg: '#EAF3DE',
  ciResolvidoText: '#3B6D11',

  riscoBg: '#FCEBEB',
  riscoText: '#A32D2D',

  coordBg: '#EEEDFE',
  coordText: '#534AB7',
} as const;

export const fonts = {
  logo: 'PlayfairDisplay_900Black_Italic',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemiBold: 'Inter_600SemiBold',
  sansBold: 'Inter_700Bold',
} as const;

export type SetorKey = 'TI' | 'Audiovisual' | 'Infraestrutura' | 'Coordenação';

export const setorMeta: Record<SetorKey, { icon: string; bg: string; color: string; sub: string }> = {
  TI: { icon: 'laptop-outline', bg: '#E6F1FB', color: '#185FA5', sub: 'Login, VMs, redes' },
  Audiovisual: { icon: 'tv-outline', bg: '#FAEEDA', color: '#854F0B', sub: 'Projetor, HDMI, som' },
  Infraestrutura: { icon: 'business-outline', bg: '#EAF3DE', color: '#3B6D11', sub: 'Ar-cond., portas' },
  'Coordenação': { icon: 'person-circle-outline', bg: '#EEEDFE', color: '#534AB7', sub: 'Acadêmico, notas' },
};
