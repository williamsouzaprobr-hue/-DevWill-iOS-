import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { PatchProject } from "@/lib/devwill/types";
import { formatBytes } from "@/components/devwill/screens/FilesScreen";
import { IconTile, palette, PrimaryButton, SafetyNote, ScreenHeading, SectionLabel, Surface, Tag, type Translator } from "@/components/devwill/ui";

export function InjectorScreen({ t, patches, onCreate, onImport, onToggle }: { t: Translator; patches: PatchProject[]; onCreate: () => void; onImport: () => void; onToggle: (patch: PatchProject) => void }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <ScreenHeading title={t("injector")} subtitle={t("subtitleInjector")} />
      <SafetyNote title={t("safeNoticeTitle")} body={t("patchLocalNote")} />
      <View style={styles.actions}>
        <PrimaryButton compact label={t("createPatch")} icon="add" onPress={onCreate} />
        <PrimaryButton compact label={t("importPatch")} icon="download-outline" onPress={onImport} />
      </View>
      <SectionLabel>{t("patchProjects")}</SectionLabel>
      {patches.length ? patches.map((patch) => (
        <Surface key={patch.id} style={styles.patchCard}>
          <View style={styles.patchTop}>
            <IconTile name="cube-outline" color="#6359A6" background="#EFEDF9" size={20} />
            <View style={{ flex: 1, gap: 4 }}><Text style={styles.patchName} numberOfLines={1}>{patch.name}</Text><Text style={styles.patchMeta}>{formatBytes(patch.size)} · {patch.example ? t("example") : t("selected")}</Text></View>
            <Tag label={patch.active ? t("activeLocal") : t("ready")} tone={patch.active ? "green" : "neutral"} />
          </View>
          <View style={styles.patchDivider} />
          <PrimaryButton compact label={patch.active ? t("deactivateRestore") : t("activate")} icon={patch.active ? "refresh-outline" : "checkmark-circle-outline"} onPress={() => onToggle(patch)} />
        </Surface>
      )) : <Surface style={styles.empty}><Ionicons name="cube-outline" size={28} color="#B5B8C0" /><Text style={styles.emptyTitle}>{t("noPatches")}</Text><Text style={styles.emptySub}>{t("createPatchHint")}</Text></Surface>}
      <View style={styles.disclaimer}><Ionicons name="information-circle-outline" size={17} color={palette.muted} /><Text style={styles.disclaimerText}>{t("patchLocalNote")}</Text></View>
    </ScrollView>
  );
}

const styles: any = StyleSheet.create({ content: { padding: 18, paddingTop: 10, paddingBottom: 28, gap: 15 }, actions: { flexDirection: "row", gap: 10 }, patchCard: { padding: 14, gap: 13 }, patchTop: { flexDirection: "row", alignItems: "center", gap: 10 }, patchName: { color: palette.ink, fontSize: 14, fontWeight: "800" }, patchMeta: { color: palette.muted, fontSize: 11 }, patchDivider: { height: 1, backgroundColor: palette.line }, empty: { minHeight: 190, alignItems: "center", justifyContent: "center", gap: 10 }, emptyTitle: { fontSize: 15, color: palette.ink, fontWeight: "800" }, emptySub: { color: palette.muted, fontSize: 12, textAlign: "center", maxWidth: 230, lineHeight: 18 }, disclaimer: { flexDirection: "row", gap: 7, paddingHorizontal: 2 }, disclaimerText: { flex: 1, color: palette.muted, fontSize: 11, lineHeight: 16 },
});
