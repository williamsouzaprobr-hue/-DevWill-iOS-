import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { WallpaperPackage } from "@/lib/devwill/types";
import { formatBytes } from "@/components/devwill/screens/FilesScreen";
import { IconTile, palette, PrimaryButton, SafetyNote, ScreenHeading, SectionLabel, Surface, Tag, type Translator } from "@/components/devwill/ui";

export function WallpapersScreen({ t, packages, onImport, onApply }: { t: Translator; packages: WallpaperPackage[]; onImport: () => void; onApply: (item: WallpaperPackage) => void }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <ScreenHeading title={t("wallpapers")} subtitle={t("subtitleWallpapers")} />
      <SafetyNote title={t("safeNoticeTitle")} body={t("wallpaperSafeBody")} />
      <PrimaryButton label={t("importWallpaper")} icon="download-outline" onPress={onImport} />
      <SectionLabel>{t("wallpaperPreview")}</SectionLabel>
      {packages.length ? packages.map((item) => (
        <Surface key={item.id} style={styles.packageCard}>
          <View style={styles.previewScene}>
            <View style={styles.sun} />
            <View style={[styles.hill, styles.hillBack]} />
            <View style={[styles.hill, styles.hillFront]} />
            <View style={styles.previewCaption}><Text style={styles.previewEyebrow}>DEVWILL · PREVIEW</Text><Text style={styles.previewName}>{item.name.replace(/\.tendies$/i, "")}</Text></View>
          </View>
          <View style={styles.packageMeta}>
            <IconTile name="images-outline" color="#4776A8" background="#EAF2F9" size={19} />
            <View style={{ flex: 1, gap: 3 }}><Text style={styles.packageName} numberOfLines={1}>{item.name}</Text><Text style={styles.packageSize}>{formatBytes(item.size)} · {item.example ? t("example") : t("selected")}</Text></View>
            <Tag label={item.applied ? t("statusApplied") : t("ready")} tone={item.applied ? "green" : "neutral"} />
          </View>
          <PrimaryButton compact label={item.applied ? t("appliedLocal") : t("apply")} icon={item.applied ? "checkmark-circle-outline" : "sparkles-outline"} onPress={() => onApply(item)} />
        </Surface>
      )) : <Surface style={styles.empty}><Ionicons name="images-outline" size={28} color="#B5B8C0" /><Text style={styles.emptyTitle}>{t("noWallpapers")}</Text><Text style={styles.emptySub}>{t("noWallpaperDescription")}</Text></Surface>}
      <Text style={styles.footnote}>{t("wallpaperSafeBody")}</Text>
    </ScrollView>
  );
}

const styles: any = StyleSheet.create({ content: { padding: 18, paddingTop: 10, paddingBottom: 28, gap: 15 }, packageCard: { padding: 12, gap: 13 }, previewScene: { height: 190, borderRadius: 15, overflow: "hidden", backgroundColor: "#D9E8E7", justifyContent: "flex-end", position: "relative" }, sun: { position: "absolute", width: 72, height: 72, borderRadius: 36, backgroundColor: "#F1BE88", top: 27, right: 35 }, hill: { position: "absolute", width: "115%", height: 92, bottom: -37, left: -12, borderRadius: 100 }, hillBack: { backgroundColor: "#85AAA3", transform: [{ rotate: "-7deg" }], bottom: -20 }, hillFront: { backgroundColor: "#435D61", transform: [{ rotate: "8deg" }], left: 85, bottom: -57 }, previewCaption: { padding: 15, zIndex: 2 }, previewEyebrow: { color: "#F9F6EF", fontSize: 8, fontWeight: "800", letterSpacing: 1.5 }, previewName: { color: palette.white, fontSize: 18, fontWeight: "800", marginTop: 3 }, packageMeta: { flexDirection: "row", alignItems: "center", gap: 10 }, packageName: { fontSize: 12, color: palette.ink, fontWeight: "800" }, packageSize: { fontSize: 10, color: palette.muted }, empty: { minHeight: 185, alignItems: "center", justifyContent: "center", gap: 10 }, emptyTitle: { color: palette.ink, fontSize: 15, fontWeight: "800" }, emptySub: { color: palette.muted, fontSize: 12, textAlign: "center", lineHeight: 17, maxWidth: 230 }, footnote: { color: palette.muted, fontSize: 11, lineHeight: 16 },
});
