import { useState, type ReactNode } from 'react';
import { Animated, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { HapticPressable as Pressable } from './HapticPressable';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from './theme';
import { useRevealMotion } from './useRevealMotion';

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

export function Sheet({ title, onClose, children, reducedMotion, scrollable = true, fullHeight = false, compactHeader = false, closeLabel = 'Done', closeAccessibilityLabel }: {
  title: string; onClose: () => void; children: ReactNode; reducedMotion: boolean; scrollable?: boolean; fullHeight?: boolean;
  compactHeader?: boolean; closeLabel?: string; closeAccessibilityLabel?: string;
}) {
  const [shown, setShown] = useState(false);
  const backdrop = useRevealMotion({ duration: 200, reducedMotion, ready: shown });
  const reveal = useRevealMotion({ duration: 200, reducedMotion, ready: shown, replayKey: title });

  return (
    <Modal transparent visible animationType="none" onShow={() => setShown(true)} onRequestClose={onClose} accessibilityLabel={title}>
      <KeyboardAvoidingView style={styles.scrim} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} enabled={Platform.OS !== 'web'}>
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: backdrop }]} testID="sheet-backdrop" />
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessible={false} />
        <AnimatedSafeAreaView edges={['bottom', 'left', 'right']} accessibilityViewIsModal testID="sheet-panel"
          style={[styles.sheet, fullHeight && styles.fullHeight, {
            opacity: reveal,
            transform: [{ translateY: reveal.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
          }]}>
          <View style={[styles.header, compactHeader && styles.compactHeader]}>
            <Text accessibilityRole="header" style={[styles.title, compactHeader && styles.compactTitle]}>{title}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel={closeAccessibilityLabel ?? `Close ${title.toLowerCase()}`} onPress={onClose}
              style={({ pressed }) => [styles.closeButton, compactHeader && styles.compactCloseButton, pressed && styles.pressed]}>
              <Text style={styles.closeText}>{closeLabel}</Text>
            </Pressable>
          </View>
          {scrollable ? (
            <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" testID="sheet-scroll">
              {children}
            </ScrollView>
          ) : <View style={styles.body}>{children}</View>}
        </AnimatedSafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { flex: 1, justifyContent: 'flex-end', paddingTop: 20 },
  backdrop: { backgroundColor: 'rgba(0,0,0,0.8)' },
  sheet: { maxHeight: '94%', width: '100%', maxWidth: 500, alignSelf: 'center', backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, borderWidth: 1, borderColor: colors.line },
  fullHeight: { height: '94%' },
  header: { padding: 16, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.line },
  compactHeader: { paddingHorizontal: 12, paddingVertical: 6 },
  title: { color: colors.ink, fontSize: 22, lineHeight: 28, fontWeight: '800', flex: 1 },
  compactTitle: { fontSize: 20, lineHeight: 26 },
  closeButton: { minWidth: 64, minHeight: 52, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: colors.accent },
  compactCloseButton: { minWidth: 56, minHeight: 44, paddingHorizontal: 10, borderRadius: 8 },
  closeText: { color: colors.ink, fontSize: 16, fontWeight: '800' },
  scroll: { flexShrink: 1 },
  content: { padding: 16, gap: 12, paddingBottom: 16 },
  body: { flex: 1, minHeight: 0 },
  pressed: { backgroundColor: colors.pressedSurface },
});
