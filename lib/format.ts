export function formatEventDate(d: string | Date) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function shortDate(d: string | Date) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

// A friendly avatar fallback when a user has no photo.
export function avatarFor(seed: string) {
  return `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(
    seed
  )}`;
}
