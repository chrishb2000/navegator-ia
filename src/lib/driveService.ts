import { UserProfile } from "../types";

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  iconLink?: string;
  webViewLink?: string;
  thumbnailLink?: string;
}

/**
 * List files from Google Drive
 */
export async function listDriveFiles(
  accessToken: string,
  searchQuery = ""
): Promise<DriveFileItem[]> {
  try {
    let q = "trashed = false";
    if (searchQuery.trim()) {
      const sanitized = searchQuery.replace(/'/g, "\\'");
      q += ` and name contains '${sanitized}'`;
    }

    const url = new URL("https://www.googleapis.com/drive/v3/files");
    url.searchParams.set("q", q);
    url.searchParams.set("pageSize", "40");
    url.searchParams.set(
      "fields",
      "files(id, name, mimeType, size, modifiedTime, iconLink, webViewLink, thumbnailLink)"
    );
    url.searchParams.set("orderBy", "modifiedTime desc");

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Error ${res.status} al consultar Google Drive`);
    }

    const data = await res.json();
    return data.files || [];
  } catch (error) {
    console.error("Error listing Drive files:", error);
    throw error;
  }
}

/**
 * Read text or JSON content from a Google Drive file
 */
export async function getDriveFileContent(
  accessToken: string,
  fileId: string,
  mimeType: string
): Promise<string> {
  try {
    let downloadUrl: string;

    if (mimeType === "application/vnd.google-apps.document") {
      downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain`;
    } else if (mimeType === "application/vnd.google-apps.spreadsheet") {
      downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/csv`;
    } else {
      downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    }

    const res = await fetch(downloadUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Error ${res.status} al descargar el archivo`);
    }

    const text = await res.text();
    return text;
  } catch (error) {
    console.error("Error fetching file content:", error);
    throw error;
  }
}

/**
 * Upload or backup vault profiles JSON to Google Drive
 */
export async function uploadVaultBackupToDrive(
  accessToken: string,
  profiles: UserProfile[],
  fileName = "AutoNav_AI_Vault_Backup.json"
): Promise<{ id: string; name: string }> {
  try {
    const fileContent = JSON.stringify(
      {
        version: "1.0",
        app: "AutoNav AI Assistant",
        exportedAt: new Date().toISOString(),
        profilesCount: profiles.length,
        profiles,
      },
      null,
      2
    );

    const metadata = {
      name: fileName,
      mimeType: "application/json",
      description: "Copia de seguridad cifrada de perfiles para AutoNav AI Form Assistant",
    };

    const boundary = "-------314159265358979323846";
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const multipartRequestBody =
      delimiter +
      "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
      JSON.stringify(metadata) +
      delimiter +
      "Content-Type: application/json\r\n\r\n" +
      fileContent +
      closeDelimiter;

    const res = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": `multipart/related; boundary=${boundary}`,
        },
        body: multipartRequestBody,
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Error ${res.status} al guardar en Google Drive`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error uploading to Drive:", error);
    throw error;
  }
}

/**
 * Save form submission receipt/record to Google Drive as a text document
 */
export async function saveReceiptToDrive(
  accessToken: string,
  receiptTitle: string,
  receiptContent: string
): Promise<{ id: string; name: string }> {
  try {
    const fileName = `Resguardo_${receiptTitle.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.txt`;
    const metadata = {
      name: fileName,
      mimeType: "text/plain",
      description: "Resguardo generado automáticamente por AutoNav AI",
    };

    const boundary = "-------314159265358979323846";
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const multipartRequestBody =
      delimiter +
      "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
      JSON.stringify(metadata) +
      delimiter +
      "Content-Type: text/plain; charset=UTF-8\r\n\r\n" +
      receiptContent +
      closeDelimiter;

    const res = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": `multipart/related; boundary=${boundary}`,
        },
        body: multipartRequestBody,
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Error al guardar resguardo en Google Drive`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error saving receipt to Drive:", error);
    throw error;
  }
}

/**
 * Delete a file in Google Drive (must be protected with user confirmation)
 */
export async function deleteDriveFile(
  accessToken: string,
  fileId: string
): Promise<void> {
  try {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Error ${res.status} al eliminar archivo`);
    }
  } catch (error) {
    console.error("Error deleting Drive file:", error);
    throw error;
  }
}
