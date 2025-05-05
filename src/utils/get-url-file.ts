export default function getUrlFile(fileId: string): string {
  return `${import.meta.env.VITE_URL_BACKEND}/files/${fileId}`;
}
