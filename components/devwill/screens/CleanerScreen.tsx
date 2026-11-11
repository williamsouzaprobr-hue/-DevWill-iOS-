import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { CleanerEntry } from "@/lib/devwill/types";
import { formatBytes } from "@/components/devwill/screens/FilesScreen";
import { IconTile, palette, PrimaryButton, SafetyNote, ScreenHeading, SectionLabel, Surface, type Translator } from "@/components/devwill/ui";

export function CleanerScreen({ t, items, onToggle, onClean }: { t: Translator; items: CleanerEntry[]; onToggle: (id: string) => void; onClean: () => void }) {
  const selected = items.filter((item) => item.selected);
  const totalBytes = selected.reduce((sum, item) => sum + item.size, 0);
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <ScreenHeading title={t("cleaner")} subtitle={t("subtitleCleaner")} />
      <SafetyNote title={t("cleanSimulation")} body={t("cleanSimulationBody")} />
      <Surface style={styles.summary}>
        <View style={styles.summaryHead}><IconTile name="sparkles-outline" color={palette.green} background={palette.greenSoft} /><View style={{ flex: 1 }}><Text style={styles.summaryTitle}>{t("cleanSummary")}</Text><Text style={styles.summarySubtitle}>{selected.length} {t("selectItems").toLowerCase()}</Text></View></View>
        <View style={styles.summaryBottom}><Text style={styles.total}>{formatBytes(totalBytes)}</Text><Text style={styles.scope}>Library/Caches · tmp</Text></View>
      </Surface>
      <SectionLabel>{t("selectItems")}</SectionLabel>
      {items.length ? items.map((item) => (
        <Surface key={item.id} style={styles.itemCard}>
          <View style={styles.itemRow}>
            <IconTile name={item.path === "tmp" ? "time-outline" : "archive-outline"} color="#8170A8" background="#F0EDF8" size={19} />
            <View style={{ flex: 1, gap: 4 }}><Text style={styles.itemName}>{t(item.path === "tmp" ? "temporary" : "libraryCaches")}</Text><Text style={styles.itemPath}>{item.path}/DevWill-demo</Text></View>
            <Text style={styles.itemSize}>{formatBytes(item.size)}</Text>
            <Pressable accessibilityRole="checkbox" accessibilityLabel={`${t(item.path === "tmp" ? "temporary" : "libraryCaches")}, ${formatBytes(item.size)}`} accessibilityHint={t("cleanConfirm")} accessibilityState={{ checked: item.selected }} onPress={() => onToggle(item.id)} hitSlop={10} style={styles.checkWrap}><Ionicons name={item.selected ? "checkmark-circle" : "ellipse-outline"} size={22} color={item.selected ? palette.orange : "#B2B5BD"} /></Pressable>
          </View>
        </Surface>
      )) : <Surface style={styles.empty}><Ionicons name="checkmark-done-circle-outline" size={27} color={palette.green} /><Text style={styles.itemName}>{t("cleanDone")}</Text></Surface>}
      <PrimaryButton label={t("cleanSelected")} icon="checkmark-circle-outline" disabled={!selected.length} onPress={onClean} />
      <Text style={styles.footnote}>{t("cleanConfirm")}</Text>
    </ScrollView>
  );
}

const styles: any = StyleSheet.create({ content: { padding: 18, paddingTop: 10, paddingBottom: 28, gap: 14 }, summary: { gap: 14 }, summaryHead: { flexDirection: "row", alignItems: "center", gap: 11 }, summaryTitle: { color: palette.ink, fontSize: 14, fontWeight: "800" }, summarySubtitle: { color: palette.muted, fontSize: 11, marginTop: 3 }, summaryBottom: { paddingTop: 13, borderTopWidth: 1, borderTopColor: palette.line, flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" }, total: { color: palette.ink, fontSize: 24, fontWeight: "800", letterSpacing: -0.6 }, scope: { fontSize: 10, color: palette.muted }, itemCard: { padding: 12 }, itemRow: { flexDirection: "row", alignItems: "center", gap: 9 }, itemName: { color: palette.ink, fontSize: 12, fontWeight: "700" }, itemPath: { color: palette.muted, fontSize: 10 }, itemSize: { color: palette.muted, fontSize: 10, marginRight: 2 }, checkWrap: { padding: 2 }, empty: { alignItems: "center", justifyContent: "center", minHeight: 120, gap: 10 }, footnote: { color: palette.muted, fontSize: 11, lineHeight: 16 },
});
