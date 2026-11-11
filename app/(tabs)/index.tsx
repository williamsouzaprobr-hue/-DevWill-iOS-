import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { CleanerScreen } from "@/components/devwill/screens/CleanerScreen";
import { FilesScreen } from "@/components/devwill/screens/FilesScreen";
import { HomeScreen, OnboardingScreen } from "@/components/devwill/screens/HomeScreen";
import { InjectorScreen } from "@/components/devwill/screens/InjectorScreen";
import { SettingsScreen } from "@/components/devwill/screens/SettingsScreen";
import { WallpapersScreen } from "@/components/devwill/screens/WallpapersScreen";
import { ConfirmDialog, palette, TabBar, Toast, TopBar, type Translator } from "@/components/devwill/ui";
import { t as translate, type Language } from "@/lib/devwill/strings";
import type { CleanerEntry, PatchProject, SectionId, WallpaperPackage, WorkspaceFile } from "@/lib/devwill/types";

const STORAGE_KEYS = { language: "@devwill/language", onboarding: "@devwill/onboarding", files: "@devwill/files", patches: "@devwill/patches", wallpapers: "@devwill/wallpapers" };
const demoFiles: WorkspaceFile[] = [
  { id: "demo-folder", name: "Projetos", category: "folder", size: 0, example: true },
  { id: "demo-patch-file", name: "Ajuste visual.3105", category: "patch", size: 42300, parentId: "demo-folder", example: true },
  { id: "demo-wall-file", name: "Aurora.tendies", category: "wallpaper", size: 81200, parentId: "demo-folder", example: true },
];
const demoPatches: PatchProject[] = [{ id: "demo-patch", name: "Ajuste visual", size: 42300, active: false, example: true }];
const demoWallpapers: WallpaperPackage[] = [{ id: "demo-wallpaper", name: "Aurora.tendies", size: 81200, applied: false, example: true }];
const demoCleaner: CleanerEntry[] = [
  { id: "cache-preview", label: "Prévia de miniaturas", path: "Library/Caches", size: 276000, selected: false },
  { id: "cache-index", label: "Índice de exemplo", path: "Library/Caches", size: 164000, selected: false },
  { id: "tmp-import", label: "Temporário de importação", path: "tmp", size: 66000, selected: false },
];
type Screen = SectionId | "settings";
type DialogAction = "none" | "createPatch" | "createFolder" | "togglePatch" | "clean" | "applyWallpaper";
type DialogState = { title: string; message: string; confirmLabel: string; action: DialogAction; targetId?: string; inputPlaceholder?: string };
type ImportKind = "file" | "patch" | "wallpaper";

function isLanguage(value: string | null): value is Language {
  return value === "pt-BR" || value === "en" || value === "vi" || value === "zh-Hans";
}
function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function parseArray<T>(value: string | null, fallback: T[], validate: (item: unknown) => item is T): T[] {
  if (!value) return fallback;
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) && parsed.every(validate) ? parsed : fallback;
  } catch { return fallback; }
}
function isWorkspaceFile(value: unknown): value is WorkspaceFile {
  if (!isRecord(value)) return false;
  return typeof value.id === "string" && typeof value.name === "string" && typeof value.size === "number" && Number.isFinite(value.size) && value.size >= 0 && ["folder", "file", "patch", "wallpaper"].includes(String(value.category)) && (value.parentId === undefined || typeof value.parentId === "string");
}
function isPatch(value: unknown): value is PatchProject {
  return isRecord(value) && typeof value.id === "string" && typeof value.name === "string" && typeof value.size === "number" && Number.isFinite(value.size) && value.size >= 0 && typeof value.active === "boolean";
}
function isWallpaper(value: unknown): value is WallpaperPackage {
  return isRecord(value) && typeof value.id === "string" && typeof value.name === "string" && typeof value.size === "number" && Number.isFinite(value.size) && value.size >= 0 && typeof value.applied === "boolean";
}

export default function DevWillWorkspace() {
  const [screen, setScreen] = useState<Screen>("home");
  const [lastScreen, setLastScreen] = useState<SectionId>("home");
  const [language, setLanguage] = useState<Language>("pt-BR");
  const [onboarding, setOnboarding] = useState<boolean | null>(null);
  const [storageReady, setStorageReady] = useState(false);
  const [files, setFiles] = useState<WorkspaceFile[]>(demoFiles);
  const [patches, setPatches] = useState<PatchProject[]>(demoPatches);
  const [wallpapers, setWallpapers] = useState<WallpaperPackage[]>(demoWallpapers);
  const [cleanerItems, setCleanerItems] = useState<CleanerEntry[]>(demoCleaner);
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [draftName, setDraftName] = useState("");
  const [toast, setToast] = useState("");
  const t: Translator = (key) => translate(language, key);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [savedLanguage, seenOnboarding, savedFiles, savedPatches, savedWallpapers] = await AsyncStorage.multiGet([
          STORAGE_KEYS.language, STORAGE_KEYS.onboarding, STORAGE_KEYS.files, STORAGE_KEYS.patches, STORAGE_KEYS.wallpapers,
        ]);
        if (!mounted) return;
        if (isLanguage(savedLanguage[1])) setLanguage(savedLanguage[1]);
        setOnboarding(seenOnboarding[1] !== "1");
        setFiles(parseArray(savedFiles[1], demoFiles, isWorkspaceFile));
        setPatches(parseArray(savedPatches[1], demoPatches, isPatch));
        setWallpapers(parseArray(savedWallpapers[1], demoWallpapers, isWallpaper));
      } catch {
        if (mounted) setOnboarding(true);
      } finally {
        if (mounted) setStorageReady(true);
      }
    };
    void load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    void AsyncStorage.multiSet([
      [STORAGE_KEYS.language, language], [STORAGE_KEYS.files, JSON.stringify(files)],
      [STORAGE_KEYS.patches, JSON.stringify(patches)], [STORAGE_KEYS.wallpapers, JSON.stringify(wallpapers)],
    ]).catch(() => undefined);
  }, [storageReady, language, files, patches, wallpapers]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 3200);
  };
  const showInfo = (message: string) => setDialog({ title: t("about"), message, confirmLabel: t("confirm"), action: "none" });
  const openSettings = () => {
    if (screen !== "settings") setLastScreen(screen as SectionId);
    setScreen(screen === "settings" ? lastScreen : "settings");
  };
  const startWorkspace = () => {
    setOnboarding(false);
    void AsyncStorage.setItem(STORAGE_KEYS.onboarding, "1").catch(() => undefined);
  };

  const importFile = async (kind: ImportKind, parentId?: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*", multiple: false, copyToCacheDirectory: false });
      const asset = result.canceled ? undefined : result.assets?.[0];
      if (!asset) return;
      const extension = asset.name.toLowerCase().split(".").pop() ?? "";
      if (kind === "patch" && extension !== "3105") { showInfo(t("chooseSupported")); return; }
      if (kind === "wallpaper" && extension !== "tendies") { showInfo(t("chooseWallpaper")); return; }
      const id = `picked-${Date.now()}`;
      const category = kind === "patch" || extension === "3105" ? "patch" : kind === "wallpaper" || extension === "tendies" ? "wallpaper" : "file";
      const size = asset.size ?? 0;
      setFiles((current) => [{ id, name: asset.name, size, category, parentId, example: false }, ...current]);
      if (category === "patch") setPatches((current) => [{ id, name: asset.name, size, active: false, example: false }, ...current]);
      if (category === "wallpaper") setWallpapers((current) => [{ id, name: asset.name, size, applied: false, example: false }, ...current]);
      showToast(t("importMetadataOnly"));
    } catch {
      showInfo(t("chooseSupported"));
    }
  };

  const beginCreatePatch = () => {
    setDraftName("");
    setDialog({ title: t("createPatch"), message: t("createPatchHint"), confirmLabel: t("createPatch"), action: "createPatch", inputPlaceholder: t("patchNamePlaceholder") });
  };
  const beginCreateFolder = (parentId?: string) => {
    setDraftName("");
    setDialog({ title: t("newFolder"), message: t("folderNamePlaceholder"), confirmLabel: t("create"), action: "createFolder", targetId: parentId });
  };
  const askTogglePatch = (patch: PatchProject) => setDialog({
    title: patch.active ? t("deactivateRestore") : t("activate"), message: t("patchConfirm"), confirmLabel: t("confirm"), action: "togglePatch", targetId: patch.id,
  });
  const askClean = () => {
    if (!cleanerItems.some((item) => item.selected)) { showInfo(t("cleanReady")); return; }
    setDialog({ title: t("cleanSelected"), message: t("cleanConfirm"), confirmLabel: t("confirm"), action: "clean" });
  };
  const askApplyWallpaper = (item: WallpaperPackage) => setDialog({ title: t("apply"), message: t("wallpaperSafeBody"), confirmLabel: t("confirm"), action: "applyWallpaper", targetId: item.id });

  const confirmDialog = () => {
    const current = dialog;
    if (!current) return;
    if (current.action === "createPatch") {
      const name = draftName.trim();
      if (!name) { setDialog({ title: t("patchName"), message: t("patchNamePlaceholder"), confirmLabel: t("confirm"), action: "none" }); return; }
      const id = `local-${Date.now()}`;
      const newPatch: PatchProject = { id, name, size: 0, active: false };
      setPatches((items) => [newPatch, ...items]);
      setFiles((items) => [{ id: `${id}-file`, name: `${name}.3105`, size: 0, category: "patch" }, ...items]);
      showToast(t("ready"));
    } else if (current.action === "createFolder") {
      const name = draftName.trim();
      if (!name) { setDialog({ title: t("folder"), message: t("folderNamePlaceholder"), confirmLabel: t("confirm"), action: "none" }); return; }
      const id = `folder-${Date.now()}`;
      const folder: WorkspaceFile = { id, name, size: 0, category: "folder", parentId: current.targetId };
      setFiles((items) => [folder, ...items]);
      showToast(t("ready"));
    } else if (current.action === "togglePatch" && current.targetId) {
      setPatches((items) => items.map((item) => item.id === current.targetId ? { ...item, active: !item.active } : item));
      showToast(t("patchConfirm"));
    } else if (current.action === "clean") {
      setCleanerItems((items) => items.filter((item) => !item.selected));
      showToast(t("cleanDone"));
    } else if (current.action === "applyWallpaper" && current.targetId) {
      setWallpapers((items) => items.map((item) => ({ ...item, applied: item.id === current.targetId })));
      showToast(t("wallpaperSafeBody"));
    }
    setDialog(null);
    setDraftName("");
  };

  const counts = useMemo(() => ({ files: files.length, patches: patches.length, wallpapers: wallpapers.length }), [files.length, patches.length, wallpapers.length]);
  const showOnboarding = onboarding ?? true;

  return (
    <ScreenContainer containerClassName="bg-[#F3F4F7]" safeAreaClassName="bg-[#F3F4F7]" className="p-0">
      <View style={{ flex: 1, backgroundColor: palette.bg }}>
        {!storageReady && onboarding === null ? <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}><ActivityIndicator color={palette.orange} /></View> : showOnboarding ? (
          <OnboardingScreen t={t} onStart={startWorkspace} />
        ) : <>
          <TopBar settingsOpen={screen === "settings"} onSettings={openSettings} t={t} />
          <View style={{ flex: 1 }}>
            {screen === "home" ? <HomeScreen t={t} counts={counts} onNavigate={setScreen} /> : null}
            {screen === "files" ? <FilesScreen t={t} files={files} onImport={(parentId) => void importFile("file", parentId)} onCreateFolder={beginCreateFolder} /> : null}
            {screen === "injector" ? <InjectorScreen t={t} patches={patches} onCreate={beginCreatePatch} onImport={() => void importFile("patch")} onToggle={askTogglePatch} /> : null}
            {screen === "cleaner" ? <CleanerScreen t={t} items={cleanerItems} onToggle={(id) => setCleanerItems((items) => items.map((item) => item.id === id ? { ...item, selected: !item.selected } : item))} onClean={askClean} /> : null}
            {screen === "wallpapers" ? <WallpapersScreen t={t} packages={wallpapers} onImport={() => void importFile("wallpaper")} onApply={askApplyWallpaper} /> : null}
            {screen === "settings" ? <SettingsScreen t={t} language={language} onLanguage={setLanguage} /> : null}
            <TabBar active={screen === "settings" ? "settings" : screen} onChange={setScreen} t={t} bottomInset={12} />
            <Toast message={toast} />
          </View>
          <ConfirmDialog visible={Boolean(dialog)} title={dialog?.title ?? ""} message={dialog?.message ?? ""} confirmLabel={dialog?.confirmLabel ?? t("confirm")} cancelLabel={t("cancel")} inputPlaceholder={dialog?.inputPlaceholder} inputValue={draftName} onInput={setDraftName} onConfirm={confirmDialog} onCancel={() => { setDialog(null); setDraftName(""); }} />
        </>}
      </View>
    </ScreenContainer>
  );
}
