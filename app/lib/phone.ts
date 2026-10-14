// Formats a Brazilian phone number for display. Accepts digits-only input,
// with or without the "55" country code (as stored on CLIENT.whatsappPhone /
// CLIENT.landlinePhone) — always renders "(DD) XXXXX-XXXX" (9-digit mobile)
// or "(DD) XXXX-XXXX" (8-digit landline).
export function formatBRPhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.length > 11 && digits.startsWith("55")) digits = digits.slice(2);

  const area = digits.slice(0, 2);
  const local = digits.slice(2);
  const splitAt = local.length === 9 ? 5 : 4;
  return `(${area}) ${local.slice(0, splitAt)}-${local.slice(splitAt)}`;
}
