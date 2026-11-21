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

  return (
    <View style={styles.root} testID="landing-screen">
      <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, compact && styles.compactContent]}
        showsVerticalScrollIndicator={false} testID="landing-scroll">
        <View style={styles.intro}>
          <Text accessibilityRole="header" style={[styles.headline, compact && styles.compactHeadline]}>
            {needsDeck ? 'YOUR DECK.\n' : 'SHOW UP.\n'}
            <Text style={styles.accent}>{needsDeck ? 'YOUR RULES.' : 'SHAKE IT UP.'}</Text>
          </Text>
          <Text style={[styles.subtitle, compact && styles.compactSubtitle]}>
            {status === 'empty'
              ? favoritesOnly ? 'Star a move in Browse to build your deck.' : 'Restore a move in Browse, or try another deck.'
              : status === 'unavailable' ? 'Open your deck to retry loading your saved moves.'
                : 'One tap. Your next F3 move.'}
          </Text>
        </View>

        {ready ? (
          <View style={[styles.stage, compact && styles.compactStage]} testID="landing-preview"
            aria-hidden accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
            pointerEvents="none">
            {deckCount > 2 && <View style={[styles.backCard, styles.farCard, compact && styles.compactCard]} />}
            {deckCount > 1 && <View style={[styles.backCard, styles.nearCard, compact && styles.compactCard]} />}
            <View style={[styles.previewCard, compact && styles.compactCard]}>
              <Text style={[styles.cardMark, compact && styles.compactCardMark]}>F3</Text>
              <Text style={styles.cardCaption}>ROULETTE</Text>
            </View>
          </View>
        ) : (
          <View style={[styles.messageCard, compact && styles.compactMessageCard]}>
            <Text style={styles.messageMark} accessible={false}>{needsDeck ? '☆' : '…'}</Text>
            <Text style={styles.messageTitle} accessibilityLiveRegion="polite">
              {status === 'loading' ? 'Getting your deck ready' : status === 'empty' ? 'No moves in this deck yet.' : 'Let’s get your deck back.'}
            </Text>
            {status === 'loading' && <Text style={styles.messageText}>Checking your saved moves.</Text>}
          </View>
        )}
      </ScrollView>

      <View style={styles.actions}>
        <Pressable accessibilityRole="button" accessibilityLabel={needsDeck ? 'Choose another deck' : 'Draw workout'}
          accessibilityHint={needsDeck ? 'Open deck settings and browse available moves.' : 'Draw your first exercise and start when you’re ready.'}
          accessibilityState={{ disabled: actionDisabled, busy: status === 'loading' }}
          disabled={actionDisabled} onPress={needsDeck ? onChooseDeck : onDraw}
          testID="landing-draw" style={({ pressed }) => [styles.primary, pressed && styles.primaryPressed, actionDisabled && styles.disabled]}>
          <Text style={styles.primaryText}>{needsDeck ? 'Choose your deck' : status === 'loading' ? 'Getting ready…' : 'Draw a move'}</Text>
          <Text style={styles.primaryArrow} accessible={false}>→</Text>
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
  content: { flexGrow: 1, paddingTop: 22, paddingHorizontal: 6, paddingBottom: 4, gap: 24 },
  compactContent: { paddingTop: 8, gap: 16 },
  intro: { gap: 10 },
  headline: { color: colors.ink, fontSize: 48, lineHeight: 48, fontWeight: '900', letterSpacing: -1.7 },
  compactHeadline: { fontSize: 34, lineHeight: 35, letterSpacing: -1.2 },
  accent: { color: colors.accent },
  subtitle: { color: colors.muted, fontSize: 17, lineHeight: 24 },
  compactSubtitle: { fontSize: 15, lineHeight: 22 },
  stage: { flexGrow: 1, minHeight: 270, alignItems: 'center', justifyContent: 'center', marginHorizontal: 10 },
  compactStage: { minHeight: 196, marginHorizontal: 8 },
  backCard: { position: 'absolute', width: '86%', height: 216, borderRadius: 18, borderWidth: 1 },
  farCard: { backgroundColor: '#26332A', borderColor: '#526744', transform: [{ rotate: '-12deg' }, { translateX: -7 }] },
  nearCard: { backgroundColor: colors.accent, borderColor: colors.accent, transform: [{ rotate: '9deg' }, { translateX: 5 }] },
  previewCard: { width: '86%', height: 216, borderRadius: 16, backgroundColor: colors.ink, padding: 18, justifyContent: 'center', alignItems: 'center', transform: [{ rotate: '-3deg' }], boxShadow: '0 14px 28px rgba(0, 0, 0, 0.24)' },
  compactCard: { height: 148, padding: 14, borderRadius: 13 },
  cardMark: { color: colors.background, fontSize: 108, lineHeight: 116, fontWeight: '900', fontStyle: 'italic', letterSpacing: -8, paddingRight: 8 },
  compactCardMark: { fontSize: 76, lineHeight: 84, letterSpacing: -5 },
  cardCaption: { color: '#4C5B52', fontSize: 11, lineHeight: 18, letterSpacing: 3, fontWeight: '800' },
  actions: { gap: 8 },
  changeDeck: { minHeight: 44, paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, borderRadius: 8 },
  changeDeckPressed: { backgroundColor: colors.surface },
  selection: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  separator: { color: colors.line, fontSize: 14, lineHeight: 20 },
  changeDeckText: { color: colors.muted, fontSize: 14, lineHeight: 20, fontWeight: '700', textDecorationLine: 'underline' },
  primary: { minHeight: 72, borderRadius: 14, backgroundColor: colors.accent, paddingVertical: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  primaryText: { flexShrink: 1, color: colors.background, fontSize: 20, lineHeight: 26, fontWeight: '900' },
  primaryArrow: { color: colors.background, fontSize: 29, lineHeight: 32, fontWeight: '700' },
  primaryPressed: { opacity: 0.85, transform: [{ scale: 0.985 }] },
  disabled: { opacity: 0.45 },
  messageCard: { minHeight: 216, borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 24, gap: 10, justifyContent: 'center', backgroundColor: colors.surface },
  compactMessageCard: { minHeight: 162, padding: 16 },
  messageMark: { color: colors.accent, fontSize: 38, lineHeight: 42 },
  messageTitle: { color: colors.ink, fontSize: 22, lineHeight: 28, fontWeight: '800' },
  messageText: { color: colors.muted, fontSize: 15, lineHeight: 21 },
});
