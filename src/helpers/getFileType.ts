export enum EFileType {
  IMAGE = "image",
  DOCUMENT = "document",
  SPREADSHEET = "spreadsheet",
  UNKNOWN = "unknown",
}

export const getFileType = (filename: string): EFileType => {
  const extension = filename.split(".").pop()?.toLowerCase();

  if (!extension) return EFileType.UNKNOWN;

  const fileTypeMapping: Record<EFileType, string[]> = {
    [EFileType.IMAGE]: ["png", "jpg", "jpeg", "gif", "bmp", "webp"],
    [EFileType.DOCUMENT]: ["pdf", "doc", "docx", "txt"],
    [EFileType.SPREADSHEET]: ["xls", "xlsx", "csv"],
    [EFileType.UNKNOWN]: [],
  };

  for (const type of Object.keys(fileTypeMapping) as EFileType[]) {
    if (fileTypeMapping[type].includes(extension)) {
      return type;
    }
  }

  return EFileType.UNKNOWN;
};
