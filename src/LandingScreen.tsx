import { Animated, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HapticPressable as Pressable } from './HapticPressable';
import { colors } from './theme';
import { useDrawSpin } from './useDrawSpin';

type LandingStatus = 'ready' | 'loading' | 'unavailable' | 'empty';

const dialTicks = Array.from({ length: 24 }, (_, index) => index);

function DrawDial({ compact, rotation }: { compact: boolean; rotation: Animated.Value }) {
  return (
    <View style={styles.dialWindow} pointerEvents="none"
      aria-hidden accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Animated.View testID="roulette-dial" style={[styles.dial, compact && styles.compactDial,
        { transform: [{ rotate: rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }]}>
        <View style={styles.dialInner} />
        {dialTicks.map((tick) => (
          <View key={tick} style={[styles.tickOrbit, { transform: [{ rotate: `${tick * 15}deg` }] }]}>
            <View style={[styles.tick, tick % 3 === 0 && styles.majorTick, tick === 21 && styles.selectedTick]} />
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

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
  // Let enlarged text and narrow viewports use the freely wrapping heading.
  const displayHeading = ready && width >= 320 && fontScale <= 1;
  const needsDeck = status === 'empty' || status === 'unavailable';
  const { rotation, spinning, start } = useDrawSpin(onDraw, ready && !disabled, displayHeading);
  const actionUnavailable = needsDeck ? saving : disabled;
  const actionDisabled = actionUnavailable || spinning;
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
          {displayHeading ? (
            <View style={[styles.hero, compact && styles.compactHero]}>
              <DrawDial compact={compact} rotation={rotation} />
              <View style={styles.title} accessible accessibilityRole="header" accessibilityLabel="Your next move.">
                <Text style={styles.lead}>Your next</Text>
                <Text style={[styles.move, compact && styles.compactMove]}>move.</Text>
              </View>
            </View>
          ) : (
            <Text accessibilityRole="header" style={[styles.headline, compact && styles.compactHeadline]}>
              {heading}
            </Text>
          )}
          <Text style={styles.detail} accessibilityLiveRegion="polite" testID="landing-detail">
            {detail}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <Pressable accessibilityRole="button" accessibilityLabel={needsDeck ? 'Choose another deck' : 'Draw workout'}
          accessibilityHint={needsDeck ? 'Open deck settings and browse available moves.' : 'Draw your first exercise and start when you’re ready.'}
          accessibilityState={{ disabled: actionDisabled, busy: spinning || status === 'loading' }}
          aria-busy={spinning || status === 'loading'}
          disabled={actionDisabled} onPress={needsDeck ? onChooseDeck : start}
          testID="landing-draw" style={({ pressed }) => [styles.primary, (pressed || spinning) && styles.primaryPressed, actionUnavailable && styles.disabled]}>
          <Text style={styles.primaryText}>{needsDeck ? 'Choose your deck' : status === 'loading' ? 'Getting ready…' : 'Draw a move'}</Text>
        </Pressable>
        {!needsDeck && <Pressable accessibilityRole="button" accessibilityLabel="Change workout deck"
          accessibilityHint={`Currently ${equipmentName}${favoritesOnly ? ', favorites' : ''}. Choose equipment, rep range, favorites, or browse workouts.`}
          accessibilityState={{ disabled: spinning }} disabled={spinning}
          onPress={onChooseDeck} style={({ pressed }) => [styles.changeDeck, pressed && styles.changeDeckPressed, spinning && styles.disabled]}>
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
  intro: { gap: 20 },
  hero: { minHeight: 240, justifyContent: 'center' },
  compactHero: { minHeight: 150 },
  title: { alignSelf: 'flex-start', paddingRight: 8 },
  lead: { color: colors.muted, fontSize: 22, lineHeight: 30, fontWeight: '600' },
  move: { color: colors.ink, fontSize: 124, lineHeight: 128, fontWeight: '900', fontStyle: 'italic', letterSpacing: -6, paddingRight: 8 },
  compactMove: { fontSize: 98, lineHeight: 104, letterSpacing: -5 },
  dialWindow: { position: 'absolute', inset: 0, overflow: 'hidden' },
  dial: { position: 'absolute', width: 290, height: 290, borderRadius: 145, borderWidth: 1, borderColor: colors.line, right: -105, top: -16, opacity: 0.65 },
  compactDial: { width: 222, height: 222, borderRadius: 111, right: -76, top: -28 },
  dialInner: { position: 'absolute', inset: 28, borderRadius: 999, borderWidth: 1, borderColor: colors.line, opacity: 0.45 },
  tickOrbit: { position: 'absolute', inset: 0 },
  tick: { position: 'absolute', top: 8, left: '50%', marginLeft: -1, width: 2, height: 7, backgroundColor: colors.line },
  majorTick: { height: 14 },
  selectedTick: { height: 22, width: 4, marginLeft: -2, backgroundColor: colors.accent },
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
