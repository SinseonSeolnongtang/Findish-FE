interface BusinessHour {
  day: string;
  hours: string;
  is_24h: boolean;
  breaktime: string | null;
  is_closed: boolean;
}

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"] as const;

function parseMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

export function isOpenNow(raw: string | null | undefined): boolean {
  if (!raw) return false;
  try {
    const hours: BusinessHour[] = JSON.parse(raw);
    const now = new Date();
    const todayKr = DAY_NAMES[now.getDay()];
    const entry = hours.find((h) => h.day === todayKr);
    if (!entry) return false;
    if (entry.is_closed) return false;
    if (entry.is_24h) return true;

    const current = now.getHours() * 60 + now.getMinutes();
    const [startStr, endStr] = entry.hours.split(" - ");
    if (current < parseMinutes(startStr) || current >= parseMinutes(endStr)) return false;

    if (entry.breaktime) {
      const [bStartStr, bEndStr] = entry.breaktime.split(" - ");
      if (current >= parseMinutes(bStartStr) && current < parseMinutes(bEndStr)) return false;
    }

    return true;
  } catch {
    return false;
  }
}
