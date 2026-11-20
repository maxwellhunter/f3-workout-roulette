import { StyleSheet, Text, View } from 'react-native';
import { HapticPressable as Pressable } from './HapticPressable';
import { colors } from './theme';
import type { SavedExerciseList } from './useSavedExercises';

export function PreferenceNotice({ label, list }: { label: 'favorites' | 'exclusions'; list: SavedExerciseList }) {
  if (list.phase !== 'load-error' && list.phase !== 'save-error') return null;
  return (
    <View style={styles.notice}>
      <Text style={styles.message} accessibilityRole="alert">
        {list.phase === 'load-error' ? `Couldn’t load ${label}.` : `Couldn’t save ${label}. Tap the control again to retry.`}
      </Text>
      {list.phase === 'load-error' && (
        <Pressable accessibilityRole="button" accessibilityLabel={`Retry loading ${label}`} onPress={() => void list.reload()} style={styles.retry}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  notice: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  message: { flex: 1, color: '#FFD5B5', fontSize: 14, lineHeight: 20 },
  retry: { minHeight: 52, minWidth: 64, borderWidth: 1, borderColor: colors.line, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  retryText: { color: colors.accent, fontSize: 16, fontWeight: '800' },
});
