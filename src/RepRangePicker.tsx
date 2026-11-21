import { useState } from 'react';
import { Keyboard, StyleSheet, Text, TextInput, View } from 'react-native';
import { HapticPressable as Pressable } from './HapticPressable';
import { parseRepRange, REP_PRESETS, repRangeLabel, sameRepRange, type RepRange } from './repRanges';
import { colors } from './theme';

export function RepRangePicker({ value, onChange, disabled = false }: {
  value: RepRange | null; onChange: (range: RepRange | null) => void; disabled?: boolean;
}) {
  const [customOpen, setCustomOpen] = useState(() => !REP_PRESETS.some((preset) => sameRepRange(preset, value)));
  const [minText, setMinText] = useState(String(value?.min ?? 10));
  const [maxText, setMaxText] = useState(String(value?.max ?? 20));
  const parsed = parseRepRange(minText, maxText);
  const applied = parsed.range !== null && sameRepRange(parsed.range, value);
  const customSelected = !REP_PRESETS.some((preset) => sameRepRange(preset, value));

  function applyCustom() {
    if (!parsed.range || disabled) return;
    onChange(parsed.range);
    Keyboard.dismiss();
  }

  return (
    <View style={styles.section} testID="rep-range-picker">
      <View style={styles.heading}>
        <View style={customOpen ? styles.customHeading : styles.inlineHeading}>
          <Text style={styles.label}>Rep range</Text>
          <Text style={styles.current} accessibilityLiveRegion="polite" testID="selected-rep-range">
            {value === null ? 'Per exercise' : `${repRangeLabel(value)} reps`}
          </Text>
        </View>
        {customOpen && (
          <Pressable accessibilityRole="button" accessibilityLabel="Show rep range presets" onPress={() => { setCustomOpen(false); Keyboard.dismiss(); }}
            style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
            <Text style={[styles.optionText, styles.accent]}>Presets</Text>
          </Pressable>
        )}
      </View>
      {!customOpen && (
      <View style={styles.options}>
        {REP_PRESETS.map((preset) => {
          const selected = !customOpen && sameRepRange(preset, value);
          return (
            <Pressable key={repRangeLabel(preset)} accessibilityRole="button"
              accessibilityLabel={preset === null ? 'Default exercise reps' : `${repRangeLabel(preset)} reps`}
              accessibilityState={{ selected, disabled }} disabled={disabled} onPress={() => { setCustomOpen(false); onChange(preset); Keyboard.dismiss(); }}
              style={({ pressed }) => [styles.option, selected && styles.selected, disabled && styles.disabled, pressed && styles.pressed]}>
              <Text style={[styles.optionText, selected && styles.accent]}>{repRangeLabel(preset)}</Text>
            </Pressable>
          );
        })}
        <Pressable accessibilityRole="button" accessibilityLabel="Custom rep range"
          accessibilityState={{ selected: customSelected, expanded: false }}
          onPress={() => { setMinText(String(value?.min ?? 10)); setMaxText(String(value?.max ?? 20)); setCustomOpen(true); }}
          style={({ pressed }) => [styles.option, customSelected && styles.selected, pressed && styles.pressed]}>
          <Text style={[styles.optionText, customSelected && styles.accent]}>Custom</Text>
        </Pressable>
      </View>
      )}
      {customOpen && (
        <View style={styles.section}>
          <View style={styles.inputs}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Min</Text>
              <TextInput accessibilityLabel="Minimum reps" value={minText} onChangeText={setMinText}
                inputMode="numeric" keyboardType="number-pad" selectTextOnFocus returnKeyType="done"
                onSubmitEditing={applyCustom} style={styles.input} selectionColor={colors.accent} />
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Max</Text>
              <TextInput accessibilityLabel="Maximum reps" value={maxText} onChangeText={setMaxText}
                inputMode="numeric" keyboardType="number-pad" selectTextOnFocus returnKeyType="done"
                onSubmitEditing={applyCustom} style={styles.input} selectionColor={colors.accent} />
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Apply custom rep range"
              accessibilityState={{ disabled: disabled || !parsed.range || applied }} disabled={disabled || !parsed.range || applied} onPress={applyCustom}
              style={({ pressed }) => [styles.apply, (disabled || !parsed.range || applied) && styles.disabled, pressed && styles.pressed]}>
              <Text style={styles.applyText}>{applied ? 'Set' : 'Apply'}</Text>
            </Pressable>
          </View>
          {parsed.error && <Text style={styles.error} accessibilityLiveRegion="polite">{parsed.error}</Text>}
        </View>
      )}
      <Text style={styles.note}>Counts go in 5s, including holds and steps. Per-side counts apply to each side. Bear Crawl: pick your distance.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 10 },
  heading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  inlineHeading: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  customHeading: { flex: 1, gap: 4 },
  back: { minHeight: 52, paddingHorizontal: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.line, borderRadius: 10 },
  label: { color: colors.muted, fontSize: 15, lineHeight: 21, fontWeight: '700' },
  current: { color: colors.accent, fontSize: 14, lineHeight: 20, fontWeight: '700', flexShrink: 1 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  option: { flexBasis: '30%', flexGrow: 1, minHeight: 52, padding: 8, borderRadius: 10, borderWidth: 2, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  optionText: { color: colors.ink, fontSize: 16, lineHeight: 22, fontWeight: '700', textAlign: 'center' },
  selected: { borderColor: colors.accent, backgroundColor: '#283322' },
  accent: { color: colors.accent },
  pressed: { backgroundColor: '#34402A' },
  inputs: { flexDirection: 'row', gap: 8, alignItems: 'flex-end' },
  field: { flex: 1, minWidth: 0, gap: 4 },
  fieldLabel: { color: colors.muted, fontSize: 14, lineHeight: 20, fontWeight: '700' },
  input: { minHeight: 52, minWidth: 0, color: colors.ink, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.line, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 10, fontSize: 22, fontWeight: '700', textAlign: 'center' },
  apply: { minHeight: 52, minWidth: 72, borderRadius: 10, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', padding: 10 },
  applyText: { color: colors.background, fontSize: 16, lineHeight: 22, fontWeight: '800' },
  disabled: { opacity: 0.45 },
  note: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  error: { color: '#FFD5B5', fontSize: 14, lineHeight: 20 },
});
