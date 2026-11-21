import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HapticPressable as Pressable } from './HapticPressable';
import type { Exercise } from './exercises';
import { libraryDose } from './library';
import { repRangeLabel, type RepRange } from './repRanges';
import { colors } from './theme';

type LandingStatus = 'ready' | 'loading' | 'unavailable' | 'empty';

export function LandingScreen({ deck, equipmentName, favoritesOnly, repRange, status, disabled, saving, onDraw, onChooseDeck }: {
  deck: readonly Exercise[];
  equipmentName: string;
  favoritesOnly: boolean;
  repRange: RepRange | null;
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
  const preview = ready ? deck[0] : undefined;
  const deckName = favoritesOnly ? 'Your favorites' : 'F3 Classics';
  const { count: dose, unit } = preview ? libraryDose(preview, repRange) : { count: '', unit: '' };
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
                : 'A fresh F3 move. Every draw.'}
          </Text>
        </View>

        {preview ? (
          <View style={[styles.stage, compact && styles.compactStage]} testID="landing-preview"
            accessible accessibilityRole="image" accessibilityLabel={`Example card from your deck: ${preview.name}. ${preview.plainName}. ${dose} ${unit}. Your first draw is random.`}
            pointerEvents="none">
            {deck.length > 2 && <View style={[styles.backCard, styles.farCard, compact && styles.compactCard]} />}
            {deck.length > 1 && <View style={[styles.backCard, styles.nearCard, compact && styles.compactCard]} />}
            <View style={[styles.previewCard, compact && styles.compactCard]}>
              <View style={styles.previewTop}>
                <Text style={styles.previewLabel}>EXAMPLE CARD</Text>
                <Text style={styles.previewBrand}>F3</Text>
              </View>
              <View style={styles.previewNameGroup}>
                <Text numberOfLines={compact ? 1 : 2} style={[styles.previewName, compact && styles.compactPreviewName]}>{preview.name}</Text>
                <Text numberOfLines={1} style={styles.previewPlainName}>{preview.plainName}</Text>
              </View>
              <View style={styles.previewDose}>
                <Text style={[styles.previewAmount, compact && styles.compactAmount, dose.length > 3 && styles.rangeAmount]}>{dose}</Text>
                <Text style={styles.previewUnit}>{unit.toUpperCase()}</Text>
                <View style={styles.doseRule} />
              </View>
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

        <View style={[styles.setup, compact && styles.compactSetup]}>
          {ready && <View style={styles.flow} accessibilityLabel="Draw a move, do the work, repeat.">
            <Text style={styles.flowText}><Text style={styles.flowNumber}>01</Text> DRAW</Text>
            <Text style={styles.flowArrow} accessible={false}>→</Text>
            <Text style={styles.flowText}><Text style={styles.flowNumber}>02</Text> WORK</Text>
            <Text style={styles.flowArrow} accessible={false}>→</Text>
            <Text style={styles.flowText}><Text style={styles.flowNumber}>03</Text> REPEAT</Text>
          </View>}
          <Pressable accessibilityRole="button" accessibilityLabel="Customize your workout deck"
            accessibilityHint="Choose equipment, rep range, favorites, or browse every workout."
            onPress={onChooseDeck} style={({ pressed }) => [styles.deck, compact && styles.compactDeck, pressed && styles.deckPressed]}>
            <View style={styles.deckCopy}>
              <View style={styles.deckTitleRow}>
                <Text style={styles.deckName}>{deckName}</Text>
                <Text style={styles.deckCount}>{status === 'loading' || status === 'unavailable' ? '…' : `${deck.length} ${deck.length === 1 ? 'move' : 'moves'}`}</Text>
              </View>
              <Text style={styles.deckDetails}>{equipmentName} · {repRange ? `${repRangeLabel(repRange)} reps` : 'Default reps'}</Text>
            </View>
            <Text style={styles.edit}>Edit</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Pressable accessibilityRole="button" accessibilityLabel={needsDeck ? 'Choose another deck' : 'Draw workout'}
        accessibilityHint={needsDeck ? 'Open deck settings and browse available moves.' : 'Draw your first exercise. Timers wait for you to press Start.'}
        accessibilityState={{ disabled: actionDisabled, busy: status === 'loading' }}
        disabled={actionDisabled} onPress={needsDeck ? onChooseDeck : onDraw}
        testID="landing-draw" style={({ pressed }) => [styles.primary, pressed && styles.primaryPressed, actionDisabled && styles.disabled]}>
        <Text style={styles.primaryText}>{needsDeck ? 'Choose your deck' : status === 'loading' ? 'Getting ready…' : 'Draw my first move'}</Text>
        <Text style={styles.primaryArrow} accessible={false}>→</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, minHeight: 0, gap: 12 },
  scroll: { flex: 1, minHeight: 0 },
  content: { flexGrow: 1, justifyContent: 'space-between', paddingTop: 22, paddingHorizontal: 6, paddingBottom: 4, gap: 16 },
  compactContent: { paddingTop: 8, gap: 8 },
  intro: { gap: 10 },
  headline: { color: colors.ink, fontSize: 48, lineHeight: 48, fontWeight: '900', letterSpacing: -1.7 },
  compactHeadline: { fontSize: 34, lineHeight: 35, letterSpacing: -1.2 },
  accent: { color: colors.accent },
  subtitle: { color: colors.muted, fontSize: 17, lineHeight: 24 },
  compactSubtitle: { fontSize: 15, lineHeight: 22 },
  stage: { height: 270, alignItems: 'center', justifyContent: 'center', marginHorizontal: 10 },
  compactStage: { height: 176, marginHorizontal: 8 },
  backCard: { position: 'absolute', width: '86%', height: 216, borderRadius: 18, borderWidth: 1 },
  farCard: { backgroundColor: '#26332A', borderColor: '#526744', transform: [{ rotate: '-12deg' }, { translateX: -7 }] },
  nearCard: { backgroundColor: colors.accent, borderColor: colors.accent, transform: [{ rotate: '9deg' }, { translateX: 5 }] },
  previewCard: { width: '86%', height: 216, borderRadius: 16, backgroundColor: colors.ink, padding: 18, justifyContent: 'space-between', transform: [{ rotate: '-3deg' }], boxShadow: '0 14px 28px rgba(0, 0, 0, 0.24)' },
  compactCard: { height: 148, padding: 14, borderRadius: 13 },
  previewTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  previewLabel: { color: '#4C5B52', fontSize: 10, lineHeight: 14, letterSpacing: 1.2, fontWeight: '800' },
  previewBrand: { color: colors.background, fontSize: 20, lineHeight: 23, fontWeight: '900', fontStyle: 'italic', letterSpacing: -1 },
  previewNameGroup: { gap: 2 },
  previewName: { color: colors.background, fontSize: 29, lineHeight: 31, fontWeight: '900', letterSpacing: -0.7 },
  compactPreviewName: { fontSize: 23, lineHeight: 25 },
  previewPlainName: { color: '#4C5B52', fontSize: 14, lineHeight: 19 },
  previewDose: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  previewAmount: { color: colors.background, fontSize: 58, lineHeight: 61, fontWeight: '900', letterSpacing: -2 },
  compactAmount: { fontSize: 43, lineHeight: 46 },
  rangeAmount: { fontSize: 34, lineHeight: 46, letterSpacing: -1.2 },
  previewUnit: { color: '#4C5B52', fontSize: 11, lineHeight: 16, fontWeight: '800' },
  doseRule: { height: 5, backgroundColor: colors.accent, flex: 1, alignSelf: 'center', marginLeft: 8 },
  setup: { gap: 16 },
  compactSetup: { gap: 12 },
  flow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 4, paddingHorizontal: 4 },
  flowText: { color: colors.ink, fontSize: 12, lineHeight: 18, fontWeight: '800', letterSpacing: 0.3 },
  flowNumber: { color: colors.accent },
  flowArrow: { color: colors.line, fontSize: 16, lineHeight: 20 },
  deck: { minHeight: 72, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, borderColor: '#3B4941', backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', gap: 8 },
  compactDeck: { minHeight: 64, paddingVertical: 8 },
  deckCopy: { flex: 1, gap: 3 },
  deckTitleRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', columnGap: 8 },
  deckName: { color: colors.ink, fontSize: 15, lineHeight: 21, fontWeight: '800' },
  deckCount: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  deckDetails: { color: colors.muted, fontSize: 13, lineHeight: 19 },
  edit: { color: colors.accent, fontSize: 14, lineHeight: 20, fontWeight: '800' },
  deckPressed: { backgroundColor: '#283322', borderColor: colors.accent },
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
