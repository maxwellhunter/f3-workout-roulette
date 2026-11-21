import { useRef, useState } from 'react';
import { AccessibilityInfo, Platform, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { HapticPressable as Pressable } from './src/HapticPressable';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { DEFAULT_EQUIPMENT_FILTER, drawExercise, exercises, filterExercises, reconcileExercise, type EquipmentFilter, type Exercise } from './src/exercises';
import { useExclusions, useFavorites } from './src/useFavorites';
import { PreferenceNotice } from './src/PreferenceNotice';
import { RepRangePicker } from './src/RepRangePicker';
import { Sheet } from './src/Sheet';
import { WorkoutLibrary } from './src/WorkoutLibrary';
import { countingText, doseUnitLabel, repAmount, repRangeLabel, sameRepRange, type RepRange } from './src/repRanges';
import { colors } from './src/theme';
import { LandingScreen } from './src/LandingScreen';
import './src/mobile.css';

const equipmentOptions: readonly { value: EquipmentFilter; label: string; accessibilityLabel: string }[] = [
  { value: 'all', label: 'All', accessibilityLabel: 'All equipment' },
  { value: 'bodyweight', label: 'Bodyweight', accessibilityLabel: 'Bodyweight equipment' },
  { value: 'block', label: 'Block', accessibilityLabel: 'Block equipment' },
];

function Instructions({ exercise, onClose }: { exercise: Exercise; onClose: () => void }) {
  return (
    <Sheet title="How to" onClose={onClose}>
      <View testID="how-to-steps" style={styles.instructions}>
        <Text style={styles.sheetExercise}>{exercise.name}</Text>
        <Text style={styles.sheetMeta}>{exercise.plainName} · {exercise.category}</Text>
        <Text style={styles.instructionText}>{exercise.description}</Text>
        {exercise.equipment === 'block' && <Text style={styles.sheetNote}>Use one intact block you can control, with a secure two-hand grip.</Text>}
        {exercise.steps.map((step, index) => (
          <View key={step} style={styles.step}>
            <Text style={styles.stepNumber}>{index + 1}</Text>
            <Text style={styles.instructionText}>{step}</Text>
          </View>
        ))}
        <Text style={styles.counting}>{countingText(exercise)}</Text>
      </View>
    </Sheet>
  );
}

function NextButton({ disabled, onlyMove, onPress }: {
  disabled: boolean; onlyMove: boolean; onPress: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Draw workout"
      accessibilityHint={onlyMove ? 'This is your only available move. Restore a move in Browse or choose another deck.' : 'Shows a different exercise from your selected deck.'}
      accessibilityState={{ disabled }} disabled={disabled} onPress={onPress}
      style={({ pressed }) => [styles.action, styles.primaryAction, pressed && styles.actionPressed, disabled && styles.disabled]}>
      <Text style={styles.actionText}>{onlyMove ? 'Only move' : 'Next move'}</Text>
    </Pressable>
  );
}

function Workout({ exercise, saved, favoriteDisabled, saving, onlyMove, drawDisabled, onFavorite, onDraw }: {
  exercise: Exercise; saved: boolean; favoriteDisabled: boolean; saving: boolean;
  onlyMove: boolean; drawDisabled: boolean; onFavorite: () => void; onDraw: () => void;
}) {
  const { height, width } = useWindowDimensions();
  const compact = height < 700 || width < 350;
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  return (
    <View style={styles.workout}>
      {/* Scrolling is a fallback for enlarged text / landscape, never a prerequisite for the actions. */}
      <ScrollView style={styles.workoutScroll} contentContainerStyle={styles.workoutContent} testID="workout-scroll">
        <View style={[styles.card, compact && styles.compactCard]} testID="workout-card">
          <View style={styles.cardTools}>
            <Text style={styles.equipmentBadge}>{exercise.equipment === 'block' ? 'CINDER BLOCK' : 'BODYWEIGHT'}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Show how-to instructions" accessibilityState={{ expanded: instructionsOpen }}
              onPress={() => setInstructionsOpen(true)} style={({ pressed }) => [styles.howToButton, pressed && styles.pressed]}>
              <Text style={styles.howToText}>How to</Text>
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel={saved ? 'Remove from favorites' : 'Save to favorites'}
              accessibilityState={{ selected: saved, disabled: favoriteDisabled, busy: saving }} disabled={favoriteDisabled} onPress={onFavorite}
              style={({ pressed }) => [styles.favoriteButton, saved && styles.favoriteSelected, pressed && styles.pressed, favoriteDisabled && styles.disabled]}>
              <Text accessible={false} style={[styles.star, saved && styles.selectedText]}>{saved ? '★' : '☆'}</Text>
            </Pressable>
          </View>
          <View style={styles.moveContent}>
            <View style={styles.moveHeading}>
              <Text accessibilityRole="header" accessibilityLiveRegion="polite" style={[styles.exerciseName, compact && styles.compactName]} testID="exercise-name">{exercise.name}</Text>
              <Text style={styles.plainName} testID="exercise-plain-name">{exercise.plainName}</Text>
            </View>
            {exercise.unit === 'distance' ? (
              <Text style={[styles.distance, compact && styles.compactDistance]} testID="exercise-distance">Pick your distance</Text>
            ) : (
              <View style={styles.dose}>
                <Text style={[styles.amount, compact && styles.compactAmount]} testID="exercise-amount">{exercise.amount}</Text>
                <View style={styles.doseLabel}>
                  <Text style={styles.unit} testID="exercise-unit">{doseUnitLabel(exercise.unit).toUpperCase()}</Text>
                </View>
              </View>
            )}
            {!compact && <Text style={styles.description} testID="exercise-description">{exercise.description}</Text>}
          </View>
        </View>
      </ScrollView>
      <View style={styles.actions} testID="workout-actions">
        <NextButton disabled={drawDisabled} onlyMove={onlyMove} onPress={onDraw} />
      </View>
      {instructionsOpen && <Instructions exercise={exercise} onClose={() => setInstructionsOpen(false)} />}
    </View>
  );
}

export default function App() {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [equipment, setEquipment] = useState<EquipmentFilter>(DEFAULT_EQUIPMENT_FILTER);
  const [repRange, setRepRange] = useState<RepRange | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [panel, setPanel] = useState<'deck' | 'library' | null>(null);
  const favorites = useFavorites();
  const exclusions = useExclusions();
  const preferenceBusy = useRef(false);
  const previousId = useRef<string | undefined>(undefined);
  const equipmentDeck = filterExercises(equipment, undefined, exclusions.ids);
  const excludedCount = exercises.filter(({ id }) => exclusions.ids.includes(id)).length;
  const savedDeck = filterExercises(equipment, favorites.ids, exclusions.ids);
  const deck = favoritesOnly ? savedDeck : equipmentDeck;
  const saving = favorites.phase === 'saving' || exclusions.phase === 'saving';
  const favoritesUnavailable = favorites.phase === 'loading' || favorites.phase === 'load-error';
  const exclusionsUnavailable = exclusions.phase === 'loading' || exclusions.phase === 'load-error';
  const selectionDisabled = saving || exclusionsUnavailable;
  const onlyMove = deck.length === 1 && deck[0].id === exercise?.id;
  const drawDisabled = selectionDisabled || deck.length === 0 || onlyMove || (favoritesOnly && favoritesUnavailable);
  const emptyDeck = deck.length === 0 && !exclusionsUnavailable;
  const equipmentName = equipment === 'all' ? 'All equipment' : equipment === 'block' ? 'Block' : 'Bodyweight';
  const displayedExercise = exercise && exercise.unit !== 'distance' && amount !== null ? { ...exercise, amount } : exercise;

  function show(next: Exercise | undefined) {
    if (next?.id === exercise?.id) return;
    const nextAmount = next ? repAmount(next, repRange) : null;
    if (next) previousId.current = next.id;
    setExercise(next ?? null);
    setAmount(nextAmount);
    if (next && Platform.OS !== 'web') {
      const dose = next.unit === 'distance' ? 'Pick your distance' : `${nextAmount} ${doseUnitLabel(next.unit)}`;
      AccessibilityInfo.announceForAccessibility(`${next.name}. ${dose}. ${next.description}`);
    }
  }
  function changeRepRange(nextRange: RepRange | null) {
    if (saving || sameRepRange(repRange, nextRange)) return;
    setRepRange(nextRange);
    if (exercise) setAmount(repAmount(exercise, nextRange));
  }
  function draw() { if (!drawDisabled) show(drawExercise(previousId.current, Math.random, deck)); }
  function changeSelection(nextEquipment: EquipmentFilter, onlyFavorites: boolean) {
    if (selectionDisabled || (onlyFavorites && favoritesUnavailable)) return;
    const nextDeck = filterExercises(nextEquipment, onlyFavorites ? favorites.ids : undefined, exclusions.ids);
    setEquipment(nextEquipment);
    setFavoritesOnly(onlyFavorites);
    if (exercise || onlyFavorites) show(reconcileExercise(exercise, nextDeck, previousId.current));
  }
  async function togglePreference(kind: 'favorite' | 'exclude', id: string) {
    if (preferenceBusy.current || saving) return;
    preferenceBusy.current = true;
    try {
      const saved = await (kind === 'favorite' ? favorites : exclusions).toggle(id);
      if (!saved || exclusionsUnavailable) return;
      const nextFavorites = kind === 'favorite' ? saved : favorites.ids;
      const nextExclusions = kind === 'exclude' ? saved : exclusions.ids;
      const nextDeck = filterExercises(equipment, favoritesOnly ? nextFavorites : undefined, nextExclusions);
      if (exercise || favoritesOnly) show(reconcileExercise(exercise, nextDeck, previousId.current));
    } finally {
      preferenceBusy.current = false;
    }
  }
  function chooseFromLibrary(next: Exercise) {
    if (selectionDisabled || exclusions.ids.includes(next.id)) return;
    if (equipment !== 'all' && equipment !== next.equipment) setEquipment(next.equipment);
    if (favoritesOnly && !favorites.ids.includes(next.id)) setFavoritesOnly(false);
    show(next);
    setPanel(null);
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />
        <View style={styles.screen}>
          <View style={styles.header}>
            <View style={styles.brand} accessibilityLabel="F3 Workout Roulette">
              <Text style={styles.logo}>F3</Text><Text style={styles.brandName}>ROULETTE</Text>
            </View>
            {displayedExercise && <Pressable accessibilityRole="button" accessibilityLabel="Choose workout deck"
              accessibilityHint={`${equipmentName}, ${favoritesOnly ? 'favorites' : 'F3 Classics'}, ${deck.length} moves, ${repRangeLabel(repRange)} reps`}
              accessibilityState={{ expanded: panel === 'deck' }} onPress={() => setPanel('deck')}
              style={({ pressed }) => [styles.deckButton, pressed && styles.pressed]}>
              <Text style={styles.deckButtonText}>{favoritesOnly ? '★ ' : ''}{equipmentName}</Text>
              <View style={styles.chevronIcon} accessible={false} pointerEvents="none">
                <View style={styles.chevron} />
              </View>
            </Pressable>}
          </View>
          {favorites.phase === 'save-error' && <PreferenceNotice label="favorites" list={favorites} />}
          <PreferenceNotice label="exclusions" list={exclusions} />
          {displayedExercise ? (
            <Workout key={displayedExercise.id} exercise={displayedExercise} saved={favorites.ids.includes(displayedExercise.id)}
              favoriteDisabled={saving || favoritesUnavailable} saving={saving} onlyMove={onlyMove}
              drawDisabled={drawDisabled} onFavorite={() => void togglePreference('favorite', displayedExercise.id)} onDraw={draw} />
          ) : (
            <LandingScreen deckCount={deck.length} equipmentName={equipmentName} favoritesOnly={favoritesOnly}
              status={exclusions.phase === 'loading' || (favoritesOnly && favorites.phase === 'loading') ? 'loading'
                : exclusions.phase === 'load-error' || (favoritesOnly && favorites.phase === 'load-error') ? 'unavailable'
                  : emptyDeck ? 'empty' : 'ready'}
              disabled={drawDisabled} saving={saving} onDraw={draw} onChooseDeck={() => setPanel('deck')} />
          )}
        </View>
        {panel !== null && (
          <Sheet title={panel === 'deck' ? 'Choose your deck' : 'Browse workouts'}
            onClose={() => setPanel(panel === 'library' ? 'deck' : null)} scrollable={panel === 'deck'} fullHeight={panel === 'library'} compactHeader={panel === 'library'}
            closeLabel={panel === 'library' ? 'Back' : 'Done'} closeAccessibilityLabel={panel === 'library' ? 'Back to choose your deck' : undefined}>
            {panel === 'library' ? (
              <WorkoutLibrary currentId={exercise?.id} repRange={repRange} disabled={selectionDisabled}
                favorites={favorites} exclusions={exclusions} saving={saving}
                onFavorite={(id) => void togglePreference('favorite', id)} onExclude={(id) => void togglePreference('exclude', id)}
                onChoose={chooseFromLibrary} />
            ) : (
            <>
            <Pressable accessibilityRole="button" accessibilityLabel="Browse all workouts" onPress={() => setPanel('library')}
              style={({ pressed }) => [styles.browseDeckButton, pressed && styles.pressed]}>
              <Text style={styles.howToText}>Browse workouts</Text>
              <View style={styles.chevronIcon} accessible={false} pointerEvents="none"><View style={[styles.chevron, styles.chevronRight]} /></View>
            </Pressable>
            <View style={styles.equipmentOptions}>
              {equipmentOptions.map((option) => (
                <Pressable key={option.value} accessibilityRole="button" accessibilityLabel={option.accessibilityLabel}
                  accessibilityState={{ selected: equipment === option.value, disabled: selectionDisabled }} disabled={selectionDisabled}
                  onPress={() => changeSelection(option.value, favoritesOnly)}
                  style={({ pressed }) => [styles.equipmentOption, equipment === option.value && styles.optionSelected, pressed && styles.pressed, selectionDisabled && styles.disabled]}>
                  <Text style={[styles.optionText, equipment === option.value && styles.selectedText]}>{option.label}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.deckOptions}>
            <Pressable accessibilityRole="button" accessibilityLabel="F3 Classics deck"
              accessibilityState={{ selected: !favoritesOnly, disabled: selectionDisabled }} disabled={selectionDisabled} onPress={() => changeSelection(equipment, false)}
              style={({ pressed }) => [styles.deckOption, !favoritesOnly && styles.optionSelected, pressed && styles.pressed]}>
              <Text style={styles.deckOptionText}>F3 Classics</Text><Text style={styles.optionCount}>{exclusionsUnavailable ? '…' : equipmentDeck.length}</Text>
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Favorites deck"
              accessibilityState={{ selected: favoritesOnly, disabled: selectionDisabled || favoritesUnavailable }} disabled={selectionDisabled || favoritesUnavailable}
              onPress={() => changeSelection(equipment, true)}
              style={({ pressed }) => [styles.deckOption, favoritesOnly && styles.optionSelected, pressed && styles.pressed, favoritesUnavailable && styles.disabled]}>
              <Text style={styles.deckOptionText}>Favorites</Text><Text style={styles.optionCount}>{favoritesUnavailable || exclusionsUnavailable ? '…' : savedDeck.length}</Text>
            </Pressable>
            </View>
            <RepRangePicker value={repRange} onChange={changeRepRange} disabled={saving} />
            {excludedCount > 0 && <Text style={styles.sheetNote}>{excludedCount} excluded {excludedCount === 1 ? 'move' : 'moves'}. Restore any move in Browse.</Text>}
            {onlyMove && <Text style={styles.sheetNote}>One available move. Restore a move in Browse or choose another deck for more variety.</Text>}
            {favorites.phase === 'loading' && <Text style={styles.sheetNote} accessibilityLiveRegion="polite">Loading saved favorites…</Text>}
            <PreferenceNotice label="favorites" list={favorites} />
            <PreferenceNotice label="exclusions" list={exclusions} />
            </>
            )}
          </Sheet>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  screen: { flex: 1, minHeight: 0, width: '100%', maxWidth: 500, alignSelf: 'center', paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, minHeight: 52 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 0 },
  logo: { color: colors.background, backgroundColor: colors.ink, fontSize: 24, lineHeight: 31, paddingHorizontal: 5, fontWeight: '900', fontStyle: 'italic', letterSpacing: -1.5 },
  brandName: { color: colors.ink, fontSize: 12, lineHeight: 18, fontWeight: '900', letterSpacing: 0.8, flexShrink: 1 },
  browseDeckButton: { minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: colors.line },
  deckButton: { minHeight: 52, flexShrink: 1, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, maxWidth: '62%' },
  deckButtonText: { color: colors.ink, fontSize: 14, lineHeight: 20, fontWeight: '700', flexShrink: 1 },
  chevronIcon: { width: 16, height: 20, flexShrink: 0, alignItems: 'center', justifyContent: 'center' },
  chevron: { width: 8, height: 8, borderRightWidth: 2, borderBottomWidth: 2, borderColor: colors.accent, transform: [{ rotate: '45deg' }], marginTop: -4 },
  chevronRight: { transform: [{ rotate: '-45deg' }], marginTop: 0, marginLeft: -4 },
  workout: { flex: 1, minHeight: 0, gap: 10 },
  workoutScroll: { flex: 1, minHeight: 0, borderRadius: 14 },
  workoutContent: { flexGrow: 1 },
  card: { flexGrow: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderTopWidth: 3, borderTopColor: colors.accent, borderRadius: 14, padding: 20 },
  compactCard: { padding: 14 },
  cardTools: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  equipmentBadge: { flex: 1, color: colors.muted, fontSize: 11, lineHeight: 16, fontWeight: '800', letterSpacing: 0.8 },
  howToButton: { minHeight: 52, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
  howToText: { color: colors.ink, fontSize: 16, lineHeight: 22, fontWeight: '800' },
  favoriteButton: { width: 52, height: 52, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line },
  favoriteSelected: { borderColor: colors.accent, backgroundColor: colors.accent },
  star: { color: colors.ink, fontSize: 30, lineHeight: 36 },
  moveContent: { flexGrow: 1, justifyContent: 'center', gap: 16, paddingTop: 12, paddingBottom: 8 },
  moveHeading: { gap: 4 },
  plainName: { color: colors.muted, fontSize: 17, lineHeight: 23 },
  exerciseName: { color: colors.ink, fontSize: 38, lineHeight: 42, fontWeight: '900', letterSpacing: -0.7 },
  compactName: { fontSize: 30, lineHeight: 33, letterSpacing: -0.5 },
  dose: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 20 },
  amount: { color: colors.ink, fontSize: 120, lineHeight: 124, fontWeight: '900', letterSpacing: -5, fontVariant: ['tabular-nums'] },
  compactAmount: { fontSize: 92, lineHeight: 96, letterSpacing: -3 },
  distance: { color: colors.ink, fontSize: 40, lineHeight: 44, fontWeight: '900', letterSpacing: -0.7 },
  compactDistance: { fontSize: 32, lineHeight: 36, letterSpacing: -0.5 },
  doseLabel: { gap: 6, flexShrink: 1 },
  unit: { color: colors.ink, fontSize: 16, lineHeight: 22, fontWeight: '800', letterSpacing: 0.6 },
  description: { color: colors.muted, fontSize: 17, lineHeight: 24 },
  actions: { flexDirection: 'row', gap: 8 },
  action: { flex: 1, minHeight: 64, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  primaryAction: { backgroundColor: colors.accent, borderColor: colors.accent },
  actionText: { color: colors.onAccent, fontSize: 20, lineHeight: 26, fontWeight: '900', textAlign: 'center' },
  actionPressed: { backgroundColor: colors.accentPressed, borderColor: colors.accentPressed },
  pressed: { backgroundColor: colors.pressedSurface },
  disabled: { opacity: 0.45 },
  selectedText: { color: colors.onAccent },
  equipmentOptions: { flexDirection: 'row', gap: 6 },
  equipmentOption: { flex: 1, minHeight: 56, paddingHorizontal: 4, paddingVertical: 12, borderRadius: 10, borderWidth: 2, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  optionText: { color: colors.ink, fontSize: 14, lineHeight: 20, fontWeight: '700', textAlign: 'center' },
  optionSelected: { borderColor: colors.accent, backgroundColor: colors.accent },
  deckOptions: { flexDirection: 'row', gap: 8 },
  deckOption: { flex: 1, minHeight: 56, borderWidth: 2, borderColor: colors.line, borderRadius: 10, padding: 10, flexDirection: 'row', justifyContent: 'space-between', gap: 6, alignItems: 'center' },
  deckOptionText: { color: colors.ink, fontSize: 15, lineHeight: 21, fontWeight: '700', flexShrink: 1 },
  optionCount: { color: colors.ink, fontSize: 16, lineHeight: 22, fontWeight: '800' },
  sheetNote: { color: colors.muted, fontSize: 16, lineHeight: 24 },
  instructions: { gap: 20 },
  sheetExercise: { color: colors.ink, fontSize: 26, lineHeight: 32, fontWeight: '800' },
  sheetMeta: { color: colors.muted, fontSize: 16, lineHeight: 23 },
  step: { flexDirection: 'row', gap: 12 },
  stepNumber: { color: colors.ink, fontSize: 18, lineHeight: 27, fontWeight: '800' },
  instructionText: { flexShrink: 1, color: colors.ink, fontSize: 18, lineHeight: 27 },
  counting: { color: colors.ink, fontSize: 17, lineHeight: 25, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 16 },
});
