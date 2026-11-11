import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { CopyKey } from "@/lib/devwill/strings";
import type { SectionId } from "@/lib/devwill/types";
import { IconTile, palette, PrimaryButton, SectionLabel, Surface, Tag, type Translator } from "@/components/devwill/ui";

const shortcuts: { id: SectionId; key: CopyKey; detailKey: CopyKey; icon: React.ComponentProps<typeof Ionicons>["name"]; color: string; bg: string }[] = [
  { id: "files", key: "files", detailKey: "subtitleFiles", icon: "folder-open-outline", color: "#E86A33", bg: "#FFF0E8" },
  { id: "injector", key: "injector", detailKey: "subtitleInjector", icon: "cube-outline", color: "#6359A6", bg: "#EFEDF9" },
  { id: "cleaner", key: "cleaner", detailKey: "subtitleCleaner", icon: "sparkles-outline", color: "#16835F", bg: "#E9F6F0" },
  { id: "wallpapers", key: "wallpapers", detailKey: "subtitleWallpapers", icon: "images-outline", color: "#4776A8", bg: "#EAF2F9" },
];

export function HomeScreen({ t, counts, onNavigate }: { t: Translator; counts: { files: number; patches: number; wallpapers: number }; onNavigate: (id: SectionId) => void }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <View style={styles.heroTitle}>
        <Text style={styles.eyebrow}>{t("workspaceLabel")}</Text>
        <Text style={styles.headline}>{t("homeHeadline")}</Text>
        <Text style={styles.description}>{t("homeBody")}</Text>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <Tag label={t("localDemo")} tone="orange" />
          <Ionicons name="shield-checkmark-outline" size={19} color="#F2B694" />
        </View>
        <Text style={styles.heroCardTitle}>{t("safeNoticeTitle")}</Text>
        <Text style={styles.heroCardBody}>{t("safeNoticeBody")}</Text>
        <View style={styles.metrics}>
          <Metric value={counts.files} label={t("filesCount")} />
          <View style={styles.metricDivider} />
          <Metric value={counts.patches} label={t("patchesCount")} />
          <View style={styles.metricDivider} />
          <Metric value={counts.wallpapers} label={t("wallpapersCount")} />
        </View>
      </View>

      <View>
        <SectionLabel>{t("quickAccess")}</SectionLabel>
        <View style={styles.shortcutGrid}>
          {shortcuts.map((item) => (
            <Pressable key={item.id} accessibilityRole="button" onPress={() => onNavigate(item.id)} style={({ pressed }) => [styles.shortcut, pressed && { opacity: 0.84, transform: [{ scale: 0.99 }] }]}>
              <View style={styles.shortcutTop}>
                <IconTile name={item.icon} color={item.color} background={item.bg} />
                <Ionicons name="chevron-forward" size={17} color={palette.muted} />
              </View>
              <Text style={styles.shortcutTitle}>{t(item.key)}</Text>
              <Text style={styles.shortcutDetail}>{t(item.detailKey)}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Surface style={styles.bottomCard}>
        <View style={styles.bottomIcon}><Ionicons name="folder-open-outline" size={20} color={palette.orange} /></View>
        <View style={{ flex: 1, gap: 3 }}>
          <Text style={styles.bottomTitle}>{t("recentActivity")}</Text>
          <Text style={styles.bottomSubtitle}>{t("filesPrivacy")}</Text>
        </View>
        <Pressable accessibilityRole="button" onPress={() => onNavigate("files")} hitSlop={10}><Ionicons name="arrow-forward-circle-outline" size={25} color={palette.orange} /></Pressable>
      </Surface>
    </ScrollView>
  );
}

function Metric({ value, label }: { value: number; label: string }) {
  return <View style={styles.metric}><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricLabel}>{label}</Text></View>;
}

export function OnboardingScreen({ t, onStart }: { t: Translator; onStart: () => void }) {
  return (
    <ScrollView contentContainerStyle={styles.onboardScroll}>
      <View style={styles.onboardLogo}><Ionicons name="layers-outline" size={34} color={palette.white} /></View>
      <Text style={styles.onboardBrand}>DevWill</Text>
      <Text style={styles.onboardTitle}>{t("onboardingTitle")}</Text>
      <Text style={styles.onboardBody}>{t("onboardingBody")}</Text>
      <Surface style={styles.pointsCard}>
        <Point text={t("onboardingPoint1")} />
        <View style={styles.pointDivider} />
        <Point text={t("onboardingPoint2")} />
      </Surface>
      <PrimaryButton label={t("openWorkspace")} onPress={onStart} icon="arrow-forward" />
      <Text style={styles.onboardFoot}>{t("workspaceLabel")} · {t("localDemo")}</Text>
    </ScrollView>
  );
}

function Point({ text }: { text: string }) {
  return <View style={styles.point}><Ionicons name="checkmark-circle" size={20} color={palette.green} /><Text style={styles.pointText}>{text}</Text></View>;
}

const styles: any = StyleSheet.create({
  content: { padding: 18, paddingTop: 10, paddingBottom: 28, gap: 20 }, heroTitle: { gap: 6, paddingTop: 4 }, eyebrow: { fontSize: 10, fontWeight: "800", color: palette.orange, letterSpacing: 1.7 }, headline: { fontSize: 31, lineHeight: 35, fontWeight: "800", color: palette.ink, letterSpacing: -1.1 }, description: { color: palette.muted, fontSize: 14, lineHeight: 20, maxWidth: 320 },
  heroCard: { backgroundColor: palette.dark, borderRadius: 22, padding: 18, overflow: "hidden" }, heroTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, heroCardTitle: { fontSize: 18, lineHeight: 23, fontWeight: "800", color: palette.white, marginTop: 16 }, heroCardBody: { color: "#C5C7CE", fontSize: 12, lineHeight: 18, marginTop: 5 }, metrics: { flexDirection: "row", alignItems: "center", marginTop: 18, paddingTop: 14, borderTopWidth: 1, borderColor: "#41434A" }, metric: { flex: 1, alignItems: "center", gap: 2 }, metricValue: { color: palette.white, fontSize: 19, fontWeight: "800" }, metricLabel: { color: "#B7B9C0", fontSize: 10 }, metricDivider: { width: 1, height: 28, backgroundColor: "#4A4C54" },
  shortcutGrid: { flexDirection: "row", flexWrap: "wrap", gap: 11 }, shortcut: { width: "48%", flexGrow: 1, minHeight: 126, borderRadius: 18, backgroundColor: palette.surface, padding: 14, borderWidth: 1, borderColor: "#ECECF0", justifyContent: "space-between" }, shortcutTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, shortcutTitle: { fontSize: 15, fontWeight: "800", color: palette.ink, marginTop: 12 }, shortcutDetail: { fontSize: 11, color: palette.muted, marginTop: 3, lineHeight: 15 },
  bottomCard: { flexDirection: "row", alignItems: "center", gap: 11, padding: 14 }, bottomIcon: { width: 38, height: 38, borderRadius: 13, backgroundColor: palette.orangeSoft, alignItems: "center", justifyContent: "center" }, bottomTitle: { fontSize: 13, fontWeight: "700", color: palette.ink }, bottomSubtitle: { fontSize: 11, color: palette.muted, lineHeight: 15 },
  onboardScroll: { flexGrow: 1, justifyContent: "center", padding: 26, gap: 17, backgroundColor: palette.bg }, onboardLogo: { width: 76, height: 76, borderRadius: 25, backgroundColor: palette.orange, alignItems: "center", justifyContent: "center", shadowColor: palette.orange, shadowOpacity: 0.22, shadowRadius: 18, elevation: 5 }, onboardBrand: { color: palette.muted, fontSize: 12, letterSpacing: 2, fontWeight: "800", marginTop: 3 }, onboardTitle: { color: palette.ink, fontSize: 34, lineHeight: 39, fontWeight: "800", letterSpacing: -1.1, marginTop: 7 }, onboardBody: { color: palette.muted, fontSize: 15, lineHeight: 23, maxWidth: 400 }, pointsCard: { marginTop: 8, gap: 13 }, point: { flexDirection: "row", alignItems: "center", gap: 10 }, pointText: { flex: 1, color: palette.ink, fontSize: 13, lineHeight: 19 }, pointDivider: { height: 1, backgroundColor: palette.line }, onboardFoot: { textAlign: "center", fontSize: 10, color: palette.muted, letterSpacing: 1.3, fontWeight: "700", marginTop: 2 },
});
