import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { languages, type Language } from "@/lib/devwill/strings";
import { palette, ScreenHeading, SectionLabel, Surface, type Translator } from "@/components/devwill/ui";

export function SettingsScreen({ t, language, onLanguage }: { t: Translator; language: Language; onLanguage: (value: Language) => void }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <ScreenHeading title={t("settings")} subtitle={t("settingsBody")} />
      <SectionLabel>{t("language")}</SectionLabel>
      <Surface style={styles.languageCard}>
        <Text style={styles.helper}>{t("changeLanguage")}</Text>
        {languages.map((item, index) => {
          const selected = item.code === language;
          return (
            <Pressable key={item.code} accessibilityRole="radio" accessibilityState={{ checked: selected }} onPress={() => onLanguage(item.code)} style={[styles.languageRow, index < languages.length - 1 && styles.rowBorder]}>
              <Text style={styles.languageLabel}>{item.label}</Text>
              <Ionicons name={selected ? "radio-button-on" : "radio-button-off"} size={20} color={selected ? palette.orange : "#A4A7AF"} />
            </Pressable>
          );
        })}
      </Surface>
      <SectionLabel>{t("about")}</SectionLabel>
      <Surface style={styles.infoCard}>
        <View style={styles.aboutHead}><View style={styles.logoTile}><Ionicons name="layers-outline" size={20} color={palette.orange} /></View><View><Text style={styles.appName}>DevWill</Text><Text style={styles.appVersion}>{t("appVersion")}</Text></View></View>
        <View style={styles.divider} />
        <Text style={styles.creditTitle}>{t("credits")}</Text>
        <Text style={styles.creditText}>{t("sourceCredit")}</Text>
      </Surface>
      <View style={styles.bottomNotice}><Ionicons name="shield-checkmark-outline" size={16} color={palette.green} /><Text style={styles.bottomNoticeText}>{t("safeNoticeBody")}</Text></View>
    </ScrollView>
  );
}

const styles: any = StyleSheet.create({ content: { padding: 18, paddingTop: 10, paddingBottom: 30, gap: 15 }, languageCard: { paddingHorizontal: 15, paddingVertical: 5 }, helper: { color: palette.muted, fontSize: 11, lineHeight: 16, marginTop: 7, marginBottom: 3 }, languageRow: { minHeight: 49, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, rowBorder: { borderBottomWidth: 1, borderBottomColor: palette.line }, languageLabel: { color: palette.ink, fontSize: 13, fontWeight: "600" }, infoCard: { gap: 14 }, aboutHead: { flexDirection: "row", alignItems: "center", gap: 11 }, logoTile: { width: 42, height: 42, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: palette.orangeSoft }, appName: { color: palette.ink, fontSize: 15, fontWeight: "800" }, appVersion: { color: palette.muted, fontSize: 11, marginTop: 3 }, divider: { height: 1, backgroundColor: palette.line }, creditTitle: { color: palette.ink, fontSize: 13, fontWeight: "800" }, creditText: { color: palette.muted, fontSize: 12, lineHeight: 18, marginTop: -7 }, bottomNotice: { flexDirection: "row", alignItems: "flex-start", gap: 8, paddingHorizontal: 2 }, bottomNoticeText: { flex: 1, color: palette.muted, fontSize: 11, lineHeight: 16 },
});
