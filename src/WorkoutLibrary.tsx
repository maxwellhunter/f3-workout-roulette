import { useRef, useState } from 'react';
import { FlatList, Keyboard, StyleSheet, Text, TextInput, View } from 'react-native';
import { HapticPressable as Pressable } from './HapticPressable';
import { exercises, type EquipmentFilter, type Exercise } from './exercises';
import { filterLibraryExercises, libraryDose, searchExercises, type LibraryFilter } from './library';
import type { RepRange } from './repRanges';
import { PreferenceNotice } from './PreferenceNotice';
import type { SavedExerciseList } from './useSavedExercises';
import { colors } from './theme';

const equipmentOptions = [
  { value: 'all', label: 'All gear' },
  { value: 'bodyweight', label: 'Bodyweight' },
  { value: 'block', label: 'Block' },
] as const;

const libraryOptions = [
  { value: 'all', label: 'All', accessibilityLabel: 'Show all library workouts' },
  { value: 'favorites', label: 'Favorites', accessibilityLabel: 'Show favorite workouts' },
  { value: 'excluded', label: 'Excluded', accessibilityLabel: 'Show excluded workouts' },
] as const;

export function WorkoutLibrary({ currentId, repRange, disabled, favorites, exclusions, saving, onFavorite, onExclude, onChoose }: {
  currentId?: string; repRange: RepRange | null; disabled: boolean;
  favorites: SavedExerciseList; exclusions: SavedExerciseList; saving: boolean;
  onFavorite: (id: string) => void; onExclude: (id: string) => void;
  onChoose: (exercise: Exercise) => void;
}) {
  const [query, setQuery] = useState('');
  const [equipment, setEquipment] = useState<EquipmentFilter>('all');
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [filter, setFilter] = useState<LibraryFilter>('all');
  const list = useRef<FlatList<Exercise>>(null);
  const selectedList = filter === 'favorites' ? favorites : filter === 'excluded' ? exclusions : null;
  const listLoading = selectedList?.phase === 'loading';
  const listError = selectedList?.phase === 'load-error';
  const catalog = filterLibraryExercises(exercises, filter, favorites.ids, exclusions.ids);
  const matches = listLoading || listError ? [] : searchExercises(catalog, query, equipment);
  const resultLabel = listLoading ? 'Loading…' : listError ? 'Saved moves unavailable' : `${matches.length} ${matches.length === 1 ? 'move' : 'moves'}`;
  const equipmentLabel = equipmentOptions.find(({ value }) => value === equipment)!.label;
  const favoriteDisabled = saving || favorites.phase === 'loading' || favorites.phase === 'load-error';
  const excludeDisabled = saving || exclusions.phase === 'loading' || exclusions.phase === 'load-error';
  const emptyMessage = listLoading ? 'Loading your saved moves…' : listError ? 'Use Retry above to load your saved moves.'
    : query.trim() || equipment !== 'all' ? 'No matches. Try another name or equipment filter.'
      : filter === 'favorites' ? 'No favorites yet. Choose All and tap a star to save a move.'
        : filter === 'excluded' ? 'No excluded workouts. Every move is available.' : 'No matching workouts.';

  function changeQuery(value: string) {
    setQuery(value);
    setEquipmentOpen(false);
    list.current?.scrollToOffset({ offset: 0, animated: false });
  }

  return (
    <View style={styles.container}>
      {equipmentOpen && <Pressable style={[StyleSheet.absoluteFill, styles.menuDismiss]} accessible={false}
        testID="equipment-filter-dismiss" onPress={() => setEquipmentOpen(false)} />}
      <View style={styles.tools}>
        <View style={styles.filters}>
          {libraryOptions.map((option) => (
            <Pressable key={option.value} accessibilityRole="button" accessibilityLabel={option.accessibilityLabel}
              accessibilityState={{ selected: filter === option.value }}
              accessibilityHint={filter === option.value ? resultLabel : undefined}
              onPress={() => { setFilter(option.value); setEquipmentOpen(false); list.current?.scrollToOffset({ offset: 0, animated: false }); }}
              style={({ pressed }) => [styles.filter, filter === option.value && styles.selected, pressed && styles.pressed]}>
              <Text style={[styles.filterText, filter === option.value && styles.accent]}>{option.label}</Text>
              {filter === option.value && <Text style={styles.resultCount} accessibilityLabel={resultLabel} accessibilityLiveRegion="polite" testID="library-results">
                {listLoading ? '…' : listError ? '!' : matches.length}
              </Text>}
            </Pressable>
          ))}
        </View>
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
          <TextInput accessibilityLabel="Search workouts" placeholder="Search workouts"
            placeholderTextColor={colors.muted} value={query} onChangeText={changeQuery}
            autoCapitalize="none" autoCorrect={false} returnKeyType="search" style={styles.search} />
          {query.length > 0 && (
            <Pressable accessibilityRole="button" accessibilityLabel="Clear workout search" onPress={() => changeQuery('')}
              style={({ pressed }) => [styles.clearButton, pressed && styles.pressed]}>
              <Text style={styles.clearText}>Clear</Text>
            </Pressable>
          )}
          </View>
          <View style={styles.equipmentControl}>
            <Pressable accessibilityRole="button" accessibilityLabel="Filter workouts by equipment" accessibilityHint={equipmentLabel}
              accessibilityState={{ expanded: equipmentOpen }}
              onPress={() => { Keyboard.dismiss(); setEquipmentOpen(!equipmentOpen); }}
              style={({ pressed }) => [styles.equipmentButton, equipment !== 'all' && styles.selected, pressed && styles.pressed]}>
              <Text style={[styles.equipmentText, equipment !== 'all' && styles.accent]} numberOfLines={1}>{equipmentLabel}</Text>
              <View style={[styles.chevron, equipmentOpen && styles.chevronOpen]} accessible={false} />
            </Pressable>
            {equipmentOpen && <View style={styles.equipmentMenu}>
              {equipmentOptions.map((option) => (
                <Pressable key={option.value} accessibilityRole="button" accessibilityLabel={`Show ${option.label.toLowerCase()} workouts`}
                  accessibilityState={{ selected: equipment === option.value }}
                  onPress={() => { setEquipment(option.value); setEquipmentOpen(false); list.current?.scrollToOffset({ offset: 0, animated: false }); }}
                  style={({ pressed }) => [styles.equipmentOption, equipment === option.value && styles.selected, pressed && styles.pressed]}>
                  <Text style={[styles.equipmentOptionText, equipment === option.value && styles.accent]}>{option.label}</Text>
                </Pressable>
              ))}
            </View>}
          </View>
        </View>
        <PreferenceNotice label="favorites" list={favorites} />
        <PreferenceNotice label="exclusions" list={exclusions} />
      </View>
      <FlatList ref={list} data={matches} keyExtractor={(item) => item.id} initialNumToRender={12}
        style={styles.list} contentContainerStyle={styles.listContent} testID="workout-library-list"
        keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag"
        ListEmptyComponent={<Text style={styles.empty} accessibilityLiveRegion="polite">{emptyMessage}</Text>}
        renderItem={({ item }) => {
          const dose = libraryDose(item, repRange);
          const saved = favorites.ids.includes(item.id);
          const excluded = exclusions.ids.includes(item.id);
          const chooseDisabled = disabled || excluded;
          return (
            <View style={[styles.row, currentId === item.id && styles.current]}>
              <Pressable accessibilityRole="button" accessibilityLabel={`Choose ${item.name}, ${item.plainName}, ${dose.count} ${dose.unit}`}
                accessibilityHint={excluded ? 'Restore this move before choosing it.' : 'Loads this move on your workout screen.'}
                accessibilityState={{ selected: currentId === item.id, disabled: chooseDisabled }}
                disabled={chooseDisabled} onPress={() => onChoose(item)} testID={`library-workout-${item.id}`}
                style={({ pressed }) => [styles.choose, pressed && styles.pressed]}>
                <Text style={[styles.name, excluded && styles.excludedName]}>{item.name}</Text>
                <Text style={styles.plainName} numberOfLines={1}>{item.plainName}</Text>
                <Text style={[styles.dose, excluded && styles.excludedText]}>{excluded ? 'Excluded from draws' : `${dose.count} ${dose.unit}`}</Text>
              </Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel={`${saved ? 'Remove' : 'Save'} ${item.name} ${saved ? 'from' : 'to'} favorites`}
                accessibilityState={{ selected: saved, disabled: favoriteDisabled, busy: favorites.phase === 'saving' }}
                disabled={favoriteDisabled} onPress={() => onFavorite(item.id)}
                style={({ pressed }) => [styles.starButton, saved && styles.selected, pressed && styles.pressed, favoriteDisabled && styles.disabled]}>
                <Text accessible={false} style={[styles.star, saved && styles.accent]}>{saved ? '★' : '☆'}</Text>
              </Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel={`${excluded ? 'Restore' : 'Exclude'} ${item.name}`}
                accessibilityHint={excluded ? 'Returns this move to your draws.' : 'Removes this move from all draws, including Favorites.'}
                accessibilityState={{ selected: excluded, disabled: excludeDisabled, busy: exclusions.phase === 'saving' }}
                disabled={excludeDisabled} onPress={() => onExclude(item.id)}
                style={({ pressed }) => [styles.excludeButton, excluded && styles.restoreButton, pressed && styles.pressed, excludeDisabled && styles.disabled]}>
                <Text style={[styles.excludeText, excluded && styles.accent]}>{excluded ? 'Restore' : 'Exclude'}</Text>
              </Pressable>
            </View>
          );
        }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 0 },
  tools: { paddingHorizontal: 12, paddingVertical: 6, gap: 6, zIndex: 2, borderBottomWidth: 1, borderBottomColor: colors.line },
  searchRow: { flexDirection: 'row', gap: 6 },
  searchBox: { flex: 1, minWidth: 0, flexDirection: 'row', borderWidth: 1, borderColor: colors.line, borderRadius: 8, backgroundColor: colors.background },
  search: { flex: 1, minWidth: 0, minHeight: 44, paddingHorizontal: 10, paddingVertical: 10, color: colors.ink, fontSize: 16, lineHeight: 22 },
  clearButton: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 7 },
  clearText: { color: colors.accent, fontSize: 14, fontWeight: '700' },
  filters: { flexDirection: 'row', gap: 4 },
  filter: { flex: 1, minHeight: 44, flexDirection: 'row', gap: 4, borderWidth: 1, borderColor: colors.line, borderRadius: 8, paddingHorizontal: 4, paddingVertical: 6, alignItems: 'center', justifyContent: 'center' },
  filterText: { color: colors.ink, fontSize: 14, lineHeight: 20, fontWeight: '700', textAlign: 'center' },
  selected: { borderColor: colors.accent, backgroundColor: '#283322' },
  accent: { color: colors.accent },
  resultCount: { color: colors.accent, fontSize: 12, lineHeight: 18, fontWeight: '700' },
  equipmentControl: { width: 116 },
  equipmentButton: { minHeight: 46, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: colors.line, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 8 },
  equipmentText: { flexShrink: 1, color: colors.ink, fontSize: 14, lineHeight: 20, fontWeight: '700' },
  chevron: { width: 7, height: 7, borderRightWidth: 2, borderBottomWidth: 2, borderColor: colors.accent, transform: [{ rotate: '45deg' }], marginTop: -3, marginRight: 2 },
  chevronOpen: { transform: [{ rotate: '225deg' }], marginTop: 3 },
  equipmentMenu: { position: 'absolute', top: 50, right: 0, width: 172, padding: 4, gap: 4, borderRadius: 10, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, elevation: 8, boxShadow: '0 6px 18px rgba(0,0,0,0.4)' },
  equipmentOption: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, borderWidth: 1, borderColor: 'transparent' },
  equipmentOptionText: { color: colors.ink, fontSize: 16, lineHeight: 22, fontWeight: '700' },
  menuDismiss: { zIndex: 1 },
  list: { flex: 1, minHeight: 0 },
  listContent: { paddingBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: colors.line },
  current: { backgroundColor: '#283322' },
  choose: { flex: 1, minHeight: 92, minWidth: 0, justifyContent: 'center', gap: 3, paddingVertical: 12, paddingRight: 4, borderRadius: 8 },
  name: { color: colors.ink, fontSize: 17, lineHeight: 22, fontWeight: '800' },
  plainName: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  dose: { color: colors.accent, fontSize: 13, lineHeight: 18, fontWeight: '700' },
  starButton: { width: 52, height: 52, borderWidth: 1, borderColor: colors.line, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  star: { color: colors.ink, fontSize: 28, lineHeight: 34 },
  excludeButton: { minWidth: 66, minHeight: 52, paddingHorizontal: 6, borderWidth: 1, borderColor: colors.line, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  excludeText: { color: colors.muted, fontSize: 13, lineHeight: 18, fontWeight: '700' },
  restoreButton: { borderColor: colors.accent },
  excludedName: { color: colors.muted },
  excludedText: { color: '#FFD5B5' },
  empty: { padding: 24, color: colors.muted, fontSize: 16, lineHeight: 24, textAlign: 'center' },
  pressed: { backgroundColor: '#34402A' },
  disabled: { opacity: 0.45 },
});
