import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HapticPressable as Pressable } from './HapticPressable';
import { colors } from './theme';

type LandingStatus = 'ready' | 'loading' | 'unavailable' | 'empty';

export function LandingScreen({ deckCount, equipmentName, favoritesOnly, status, disabled, saving, onDraw, onChooseDeck }: {
  deckCount: number;
  equipmentName: string;
  favoritesOnly: boolean;
  status: LandingStatus;
  disabled: boolean;
  saving: boolean;
  onDraw: () => void;
  onChooseDeck: () => void;
}) {
  const { width, height, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const compact = height - insets.top - insets.bottom < 810 || width < 350 || fontScale > 1.2;
  const ready = status === 'ready';
  const needsDeck = status === 'empty' || status === 'unavailable';
  const actionDisabled = needsDeck ? saving : disabled;
  const heading = ready ? 'Your next\nmove.'
    : status === 'loading' ? 'Loading\nyour deck.'
      : status === 'empty' ? 'No moves\nyet.' : 'Deck\nunavailable.';
  const detail = ready
    ? `${favoritesOnly ? 'Favorites' : 'F3 Classics'} · ${deckCount} ${deckCount === 1 ? 'move' : 'moves'}`
    : status === 'empty'
      ? favoritesOnly ? 'Star a move in Browse to build your deck.' : 'Restore a move in Browse, or try another deck.'
      : status === 'unavailable' ? 'Open deck settings to retry loading your saved moves.' : 'Checking your saved moves.';

  return (
    <View style={styles.root} testID="landing-screen">
      <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, compact && styles.compactContent]}
        showsVerticalScrollIndicator={false} testID="landing-scroll">
        <View style={styles.intro}>
          <Text accessibilityRole="header" style={[styles.headline, compact && styles.compactHeadline]}>
            {heading}
          </Text>
          <Text style={styles.detail} accessibilityLiveRegion="polite" testID="landing-detail">
            {detail}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <Pressable accessibilityRole="button" accessibilityLabel={needsDeck ? 'Choose another deck' : 'Draw workout'}
          accessibilityHint={needsDeck ? 'Open deck settings and browse available moves.' : 'Draw your first exercise and start when you’re ready.'}
          accessibilityState={{ disabled: actionDisabled, busy: status === 'loading' }}
          disabled={actionDisabled} onPress={needsDeck ? onChooseDeck : onDraw}
          testID="landing-draw" style={({ pressed }) => [styles.primary, pressed && styles.primaryPressed, actionDisabled && styles.disabled]}>
          <Text style={styles.primaryText}>{needsDeck ? 'Choose your deck' : status === 'loading' ? 'Getting ready…' : 'Draw a move'}</Text>
        </Pressable>
        {!needsDeck && <Pressable accessibilityRole="button" accessibilityLabel="Change workout deck"
          accessibilityHint={`Currently ${equipmentName}${favoritesOnly ? ', favorites' : ''}. Choose equipment, rep range, favorites, or browse workouts.`}
          onPress={onChooseDeck} style={({ pressed }) => [styles.changeDeck, pressed && styles.changeDeckPressed]}>
          <Text style={styles.selection}>{equipmentName}</Text>
          <Text style={styles.separator} accessible={false}>·</Text>
          <Text style={styles.changeDeckText}>Change deck</Text>
        </Pressable>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, minHeight: 0, gap: 12 },
  scroll: { flex: 1, minHeight: 0 },
  content: { flexGrow: 1, justifyContent: 'center', paddingVertical: 40, paddingHorizontal: 12 },
  compactContent: { paddingVertical: 24, paddingHorizontal: 6 },
  intro: { gap: 24 },
  headline: { color: colors.ink, fontSize: 68, lineHeight: 70, fontWeight: '800', letterSpacing: -2.5 },
  compactHeadline: { fontSize: 52, lineHeight: 55, letterSpacing: -1.8 },
  detail: { color: colors.muted, fontSize: 16, lineHeight: 24, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 16 },
  actions: { gap: 8 },
  changeDeck: { minHeight: 44, paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, borderRadius: 8 },
  changeDeckPressed: { backgroundColor: colors.surface },
  selection: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  separator: { color: colors.line, fontSize: 14, lineHeight: 20 },
  changeDeckText: { color: colors.muted, fontSize: 14, lineHeight: 20, fontWeight: '700', textDecorationLine: 'underline' },
  primary: { minHeight: 72, borderRadius: 10, backgroundColor: colors.accent, paddingVertical: 16, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: colors.onAccent, fontSize: 20, lineHeight: 26, fontWeight: '800', textAlign: 'center' },
  primaryPressed: { backgroundColor: colors.accentPressed },
  disabled: { opacity: 0.45 },
});
