export default function copyableText(text: string) {
  return navigator.clipboard.writeText(text);
}
