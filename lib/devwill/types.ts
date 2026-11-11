export type WorkspaceFile = {
  id: string;
  name: string;
  size: number;
  category: "folder" | "file" | "patch" | "wallpaper";
  parentId?: string;
  example?: boolean;
};

export type PatchProject = {
  id: string;
  name: string;
  size: number;
  active: boolean;
  example?: boolean;
};

export type WallpaperPackage = {
  id: string;
  name: string;
  size: number;
  applied: boolean;
  example?: boolean;
};

export type CleanerEntry = {
  id: string;
  label: string;
  path: "Library/Caches" | "tmp";
  size: number;
  selected: boolean;
};

export type SectionId = "home" | "files" | "injector" | "cleaner" | "wallpapers";
