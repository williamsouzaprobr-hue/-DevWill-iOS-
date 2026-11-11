import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type { WorkspaceFile } from "@/lib/devwill/types";
import { IconTile, palette, PrimaryButton, QuietButton, SafetyNote, ScreenHeading, Surface, Tag, type Translator } from "@/components/devwill/ui";

export function FilesScreen({ t, files, onImport, onCreateFolder }: { t: Translator; files: WorkspaceFile[]; onImport: (parentId?: string) => void; onCreateFolder: (parentId?: string) => void }) {
  const [query, setQuery] = useState("");
  const [folderId, setFolderId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<WorkspaceFile | null>(null);
  const currentFolder = folderId ? files.find((item) => item.id === folderId && item.category === "folder") : undefined;
  const filtered = useMemo(() => files.filter((item) => (item.parentId ?? null) === folderId && item.name.toLowerCase().includes(query.trim().toLowerCase())), [files, query, folderId]);
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <ScreenHeading title={t("files")} subtitle={t("subtitleFiles")} />
      <SafetyNote title={t("safeNoticeTitle")} body={t("onlySelected")} />
      <View style={styles.actions}>
        <View style={{ flex: 1 }}><PrimaryButton compact label={t("importFile")} icon="download-outline" onPress={() => onImport(folderId ?? undefined)} /></View>
        <View style={{ flex: 1 }}><QuietButton label={t("newFolder")} icon="folder-outline" onPress={() => onCreateFolder(folderId ?? undefined)} /></View>
      </View>
      <View style={styles.searchBox}><Ionicons name="search-outline" size={18} color={palette.muted} /><TextInput value={query} onChangeText={setQuery} placeholder={t("search")} placeholderTextColor="#9A9EA7" style={styles.searchInput} /></View>
      <View style={styles.breadcrumb}>
        <Pressable accessibilityRole="button" onPress={() => { setFolderId(null); setSelectedFile(null); }}><Text style={[styles.crumb, !folderId && styles.crumbActive]}>{t("workspaceFiles")}</Text></Pressable>
        {currentFolder ? <><Ionicons name="chevron-forward" size={14} color={palette.muted} /><Text numberOfLines={1} style={[styles.crumb, styles.crumbActive]}>{currentFolder.name}</Text></> : null}
        <View style={{ flex: 1 }} /><Tag label={`${filtered.length}`} />
      </View>
      <Surface style={styles.listSurface}>
        {filtered.length ? filtered.map((item, index) => <FileRow key={item.id} item={item} t={t} last={index === filtered.length - 1} onPress={() => item.category === "folder" ? (setFolderId(item.id), setSelectedFile(null)) : setSelectedFile(item)} />) : <View style={styles.empty}><Ionicons name="folder-open-outline" size={27} color="#B5B8C0" /><Text style={styles.emptyTitle}>{query ? t("searchEmpty") : t("noFiles")}</Text></View>}
      </Surface>
      {selectedFile ? <Surface style={styles.detailCard}>
        <View style={styles.detailHead}><Text style={styles.detailTitle}>{t("fileMetadata")}</Text><Pressable accessibilityRole="button" accessibilityLabel={t("close")} onPress={() => setSelectedFile(null)}><Ionicons name="close-circle-outline" size={21} color={palette.muted} /></Pressable></View>
        <Text style={styles.fileName}>{selectedFile.name}</Text>
        <Text style={styles.fileMeta}>{formatBytes(selectedFile.size)} · {selectedFile.example ? t("example") : t("selected")}</Text>
      </Surface> : null}
      <Text style={styles.footnote}>{t("filesPrivacy")}</Text>
    </ScrollView>
  );
}

function FileRow({ item, t, last, onPress }: { item: WorkspaceFile; t: Translator; last: boolean; onPress: () => void }) {
  const icon = item.category === "folder" ? "folder-outline" : item.category === "patch" ? "cube-outline" : item.category === "wallpaper" ? "image-outline" : "document-text-outline";
  const color = item.category === "patch" ? "#6359A6" : item.category === "wallpaper" ? "#4776A8" : palette.orange;
  const bg = item.category === "patch" ? "#EFEDF9" : item.category === "wallpaper" ? "#EAF2F9" : palette.orangeSoft;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${item.category === "folder" ? t("folder") : t("file")}: ${item.name}`} onPress={onPress} style={[styles.fileRow, !last && styles.rowBorder]}>
      <IconTile name={icon} color={color} background={bg} size={19} />
      <View style={{ flex: 1, gap: 4 }}><Text numberOfLines={1} style={styles.fileName}>{item.name}</Text><Text style={styles.fileMeta}>{item.category === "folder" ? t("folder") : `${formatBytes(item.size)} · ${item.example ? t("example") : t("selected")}`}</Text></View>
      {item.category === "folder" ? <Ionicons name="chevron-forward" size={18} color={palette.muted} /> : <Tag label={item.example ? t("example") : t("selected")} tone={item.example ? "neutral" : "orange"} />}
    </Pressable>
  );
}

export function formatBytes(bytes: number) {
  if (bytes < 1000) return `${bytes} B`;
  if (bytes < 1_000_000) return `${(bytes / 1000).toFixed(1)} KB`;
  return `${(bytes / 1_000_000).toFixed(1)} MB`;
}

const styles: any = StyleSheet.create({ content: { padding: 18, paddingTop: 10, paddingBottom: 28, gap: 15 }, actions: { flexDirection: "row", gap: 10 }, searchBox: { height: 47, borderRadius: 14, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.line, paddingHorizontal: 13, flexDirection: "row", alignItems: "center", gap: 9 }, searchInput: { flex: 1, height: 45, color: palette.ink, fontSize: 13 }, breadcrumb: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 }, crumb: { color: palette.muted, fontSize: 11, fontWeight: "600", maxWidth: 140 }, crumbActive: { color: palette.ink, fontWeight: "700" }, listSurface: { paddingHorizontal: 14, paddingVertical: 2 }, fileRow: { minHeight: 69, flexDirection: "row", alignItems: "center", gap: 11 }, rowBorder: { borderBottomWidth: 1, borderBottomColor: palette.line }, fileName: { color: palette.ink, fontSize: 13, fontWeight: "700" }, fileMeta: { color: palette.muted, fontSize: 11 }, empty: { minHeight: 155, alignItems: "center", justifyContent: "center", gap: 11 }, emptyTitle: { color: palette.muted, fontSize: 13, textAlign: "center" }, detailCard: { gap: 7 }, detailHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, detailTitle: { color: palette.muted, fontSize: 11, fontWeight: "700" }, footnote: { color: palette.muted, fontSize: 11, lineHeight: 16, paddingHorizontal: 2 },
});
