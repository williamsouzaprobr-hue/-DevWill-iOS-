import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";
import { Image, Modal, Pressable, StyleSheet, Text, TextInput, View, type StyleProp, type ViewStyle } from "react-native";
import type { CopyKey } from "@/lib/devwill/strings";
import type { SectionId } from "@/lib/devwill/types";

export const palette = {
  bg: "#F3F4F7", surface: "#FFFFFF", ink: "#202127", muted: "#777D88", line: "#E6E7EB",
  orange: "#E86A33", orangeSoft: "#FFF0E8", green: "#16835F", greenSoft: "#E9F6F0", red: "#B94A44",
  dark: "#23252B", lavender: "#EBE9F2", soft: "#F8F8FA", white: "#FFFFFF",
};

export type Translator = (key: CopyKey) => string;
type IconName = React.ComponentProps<typeof Ionicons>["name"];

export function TopBar({ onSettings, settingsOpen = false, t }: { onSettings: () => void; settingsOpen?: boolean; t: Translator }) {
  return (
    <View style={styles.topbar}>
      <View style={styles.brand}>
        <Image source={require("@/assets/images/icon.png")} style={styles.logo} />
        <View>
          <Text style={styles.brandName}>DevWill</Text>
          <Text style={styles.brandTag}>MOBILE WORKSPACE</Text>
        </View>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel={settingsOpen ? t("close") : t("settings")} onPress={onSettings} style={styles.gear}>
        <Ionicons name={settingsOpen ? "close-outline" : "settings-outline"} size={21} color={palette.ink} />
      </Pressable>
    </View>
  );
}

export function Surface({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.surface, style]}>{children}</View>;
}

export function ScreenHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.heading}>
      <Text style={styles.headingTitle}>{title}</Text>
      {subtitle ? <Text style={styles.headingSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function SectionLabel({ children, trailing }: { children: ReactNode; trailing?: ReactNode }) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionLabel}>{children}</Text>
      {trailing}
    </View>
  );
}

export function PrimaryButton({ label, onPress, icon, disabled = false, compact = false }: { label: string; onPress: () => void; icon?: IconName; disabled?: boolean; compact?: boolean }) {
  return (
    <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.primaryButton, compact && styles.compactButton, disabled && styles.disabledButton, pressed && !disabled && styles.pressed]}>
      {icon ? <Ionicons name={icon} size={18} color={palette.white} /> : null}
      <Text style={styles.primaryText}>{label}</Text>
    </Pressable>
  );
}

export function QuietButton({ label, onPress, icon }: { label: string; onPress: () => void; icon?: IconName }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.quietButton, pressed && styles.pressed]}>
      {icon ? <Ionicons name={icon} size={17} color={palette.orange} /> : null}
      <Text style={styles.quietText}>{label}</Text>
    </Pressable>
  );
}

export function SafetyNote({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.safetyNote}>
      <View style={styles.safetyIcon}><Ionicons name="shield-checkmark-outline" size={18} color={palette.orange} /></View>
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={styles.safetyTitle}>{title}</Text>
        <Text style={styles.safetyBody}>{body}</Text>
      </View>
    </View>
  );
}

export function Tag({ label, tone = "neutral" }: { label: string; tone?: "neutral" | "green" | "orange" }) {
  const tint = tone === "green" ? palette.green : tone === "orange" ? palette.orange : palette.muted;
  const bg = tone === "green" ? palette.greenSoft : tone === "orange" ? palette.orangeSoft : "#F0F1F4";
  return <View style={[styles.tag, { backgroundColor: bg }]}><Text style={[styles.tagText, { color: tint }]}>{label}</Text></View>;
}

export function IconTile({ name, color = palette.orange, background = palette.orangeSoft, size = 20 }: { name: IconName; color?: string; background?: string; size?: number }) {
  return <View style={[styles.iconTile, { backgroundColor: background }]}><Ionicons name={name} size={size} color={color} /></View>;
}

export function TabBar({ active, onChange, t, bottomInset }: { active: SectionId | "settings"; onChange: (section: SectionId) => void; t: Translator; bottomInset: number }) {
  const items: { id: SectionId; key: CopyKey; icon: IconName }[] = [
    { id: "home", key: "home", icon: "home-outline" },
    { id: "files", key: "files", icon: "folder-outline" },
    { id: "injector", key: "injector", icon: "cube-outline" },
    { id: "cleaner", key: "cleaner", icon: "sparkles-outline" },
    { id: "wallpapers", key: "wallpapers", icon: "images-outline" },
  ];
  return (
    <View style={[styles.tabbar, { paddingBottom: Math.max(bottomInset, 10) }]}>
      {items.map((item) => {
        const selected = item.id === active;
        return (
          <Pressable key={item.id} accessibilityRole="tab" accessibilityState={{ selected }} onPress={() => onChange(item.id)} style={styles.tabButton}>
            <View style={[styles.tabIconWrap, selected && styles.tabIconSelected]}><Ionicons name={item.icon} size={20} color={selected ? palette.orange : palette.ink} /></View>
            <Text numberOfLines={1} style={[styles.tabText, selected && styles.tabTextSelected]}>{t(item.key)}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function ConfirmDialog({ visible, title, message, confirmLabel, cancelLabel, inputPlaceholder, inputValue, onInput, onConfirm, onCancel }: {
  visible: boolean; title: string; message: string; confirmLabel: string; cancelLabel: string; inputPlaceholder?: string; inputValue: string; onInput: (value: string) => void; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View style={styles.modalRoot}>
        <Pressable accessibilityRole="button" accessibilityLabel={cancelLabel} onPress={onCancel} style={StyleSheet.absoluteFill} />
        <View style={styles.modalCard}>
          <View style={styles.modalMark}><Ionicons name="information-circle-outline" size={22} color={palette.orange} /></View>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          {inputPlaceholder ? <TextInput accessibilityLabel={inputPlaceholder} placeholder={inputPlaceholder} value={inputValue} onChangeText={onInput} autoFocus style={styles.modalInput} /> : null}
          <View style={styles.modalActions}>
            <Pressable onPress={onCancel} style={styles.cancelButton}><Text style={styles.cancelText}>{cancelLabel}</Text></Pressable>
            <Pressable onPress={onConfirm} style={styles.modalConfirm}><Text style={styles.modalConfirmText}>{confirmLabel}</Text></Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function Toast({ message }: { message: string }) {
  if (!message) return null;
  return <View accessibilityLiveRegion="polite" style={styles.toast}><Ionicons name="checkmark-circle" size={17} color={palette.green} /><Text style={styles.toastText}>{message}</Text></View>;
}

const styles: any = StyleSheet.create({
  topbar: { height: 62, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: palette.bg },
  brand: { flexDirection: "row", alignItems: "center", gap: 10 }, logo: { width: 40, height: 40, borderRadius: 12, backgroundColor: palette.dark }, brandName: { fontSize: 17, fontWeight: "800", color: palette.ink, letterSpacing: -0.3 }, brandTag: { fontSize: 9, letterSpacing: 1.6, color: palette.muted, marginTop: 2, fontWeight: "700" },
  gear: { width: 40, height: 40, borderRadius: 14, backgroundColor: palette.surface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: palette.line },
  surface: { backgroundColor: palette.surface, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: "#ECECF0" },
  heading: { gap: 5, marginBottom: 2 }, headingTitle: { fontSize: 26, lineHeight: 31, fontWeight: "800", letterSpacing: -0.7, color: palette.ink }, headingSubtitle: { fontSize: 14, lineHeight: 20, color: palette.muted },
  sectionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }, sectionLabel: { fontSize: 16, fontWeight: "700", color: palette.ink },
  primaryButton: { minHeight: 48, borderRadius: 15, backgroundColor: palette.orange, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingHorizontal: 17 }, compactButton: { minHeight: 41, borderRadius: 13, paddingHorizontal: 13 }, disabledButton: { backgroundColor: "#D9DADD" }, primaryText: { color: palette.white, fontSize: 14, fontWeight: "700" }, quietButton: { minHeight: 42, borderRadius: 13, backgroundColor: palette.orangeSoft, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, paddingHorizontal: 13 }, quietText: { color: palette.orange, fontSize: 13, fontWeight: "700" }, pressed: { opacity: 0.82, transform: [{ scale: 0.985 }] },
  safetyNote: { flexDirection: "row", gap: 10, padding: 13, borderRadius: 16, borderWidth: 1, borderColor: "#F2DDCE", backgroundColor: "#FFF8F3" }, safetyIcon: { width: 30, height: 30, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: palette.orangeSoft }, safetyTitle: { color: palette.ink, fontSize: 13, fontWeight: "700" }, safetyBody: { color: palette.muted, fontSize: 12, lineHeight: 17 },
  tag: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 999, alignSelf: "flex-start" }, tagText: { fontSize: 10, fontWeight: "700", letterSpacing: 0.2 }, iconTile: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  tabbar: { minHeight: 66, paddingTop: 7, paddingHorizontal: 5, backgroundColor: "rgba(255,255,255,0.98)", flexDirection: "row", alignItems: "flex-start", justifyContent: "space-around", borderTopWidth: 1, borderTopColor: palette.line }, tabButton: { flex: 1, alignItems: "center", gap: 2 }, tabIconWrap: { width: 48, height: 30, alignItems: "center", justifyContent: "center", borderRadius: 12 }, tabIconSelected: { backgroundColor: "#F8EDE7" }, tabText: { fontSize: 10, color: palette.muted, fontWeight: "600" }, tabTextSelected: { color: palette.orange, fontWeight: "800" },
  modalRoot: { flex: 1, backgroundColor: "rgba(24,25,29,0.38)", justifyContent: "center", paddingHorizontal: 24 }, modalCard: { backgroundColor: palette.surface, borderRadius: 24, padding: 22, borderWidth: 1, borderColor: palette.line, gap: 12, maxWidth: 440, width: "100%", alignSelf: "center", shadowColor: "#121214", shadowOpacity: 0.15, shadowRadius: 22, shadowOffset: { width: 0, height: 10 }, elevation: 8 }, modalMark: { width: 42, height: 42, alignItems: "center", justifyContent: "center", backgroundColor: palette.orangeSoft, borderRadius: 15 }, modalTitle: { fontSize: 20, fontWeight: "800", color: palette.ink }, modalMessage: { fontSize: 14, color: palette.muted, lineHeight: 21 }, modalInput: { height: 48, paddingHorizontal: 14, borderRadius: 13, borderWidth: 1, borderColor: palette.line, color: palette.ink, backgroundColor: palette.soft }, modalActions: { flexDirection: "row", gap: 10, marginTop: 4 }, cancelButton: { flex: 1, minHeight: 46, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "#F1F2F4" }, cancelText: { color: palette.ink, fontWeight: "700" }, modalConfirm: { flex: 1, minHeight: 46, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: palette.orange }, modalConfirmText: { color: palette.white, fontWeight: "800" }, toast: { position: "absolute", left: 16, right: 16, bottom: 84, zIndex: 10, borderRadius: 14, padding: 12, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.line, flexDirection: "row", alignItems: "center", gap: 8, shadowColor: "#000", shadowOpacity: 0.09, shadowRadius: 10, elevation: 4 }, toastText: { flex: 1, fontSize: 12, color: palette.ink, fontWeight: "600" },
});
