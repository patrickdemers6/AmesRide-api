import LocalFsArchiver from "./localFs";

export interface ArchiveManager {
  archive(data: ArrayBuffer, description: string): void;
}

export type ArchiveManagerType = "local";

export interface ArchiveManagerOptions {
  url?: string;
  directory: string;
}

const getArchiveManager = (
  type: ArchiveManagerType,
  options: ArchiveManagerOptions
): ArchiveManager => {
  switch (type) {
    case "local":
      return new LocalFsArchiver(options);
    default:
      throw new TypeError(`Unknown archive manager type: ${type}`);
  }
};

export default getArchiveManager;
