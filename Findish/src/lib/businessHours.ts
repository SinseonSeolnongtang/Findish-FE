interface BusinessHour {
  day: string;
  hours: string;
  is_24h: boolean;
  breaktime: string | null;
  is_closed: boolean;
}

export type BusinessStatus = "영업중" | "영업 전" | "영업 종료";

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"] as const;

function parseMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

export function getBusinessStatus(raw: string | null | undefined): BusinessStatus {
  if (!raw) return "영업 종료";
  try {
    const hours: BusinessHour[] = JSON.parse(raw);
    const now = new Date();
    const todayKr = DAY_NAMES[now.getDay()];
    const entry = hours.find((h) => h.day === todayKr);
    if (!entry) return "영업 종료";
    if (entry.is_closed) return "영업 종료";
    if (entry.is_24h) return "영업중";

    const current = now.getHours() * 60 + now.getMinutes();
    const [startStr, endStr] = entry.hours.split(" - ");
    const startMinutes = parseMinutes(startStr);
    const endMinutes = parseMinutes(endStr);
    const isOvernight = endMinutes <= startMinutes; // e.g., 16:00 - 04:00

    let isOpen: boolean;
    if (isOvernight) {
      // 자정을 넘기는 영업: 시작 이후이거나 종료 이전이면 영업중
      isOpen = current >= startMinutes || current < endMinutes;
    } else {
      if (current < startMinutes) return "영업 전";
      isOpen = current < endMinutes;
    }

    if (!isOpen) return "영업 종료";

    if (entry.breaktime) {
      const [bStartStr, bEndStr] = entry.breaktime.split(" - ");
      if (current >= parseMinutes(bStartStr) && current < parseMinutes(bEndStr)) return "영업 종료";
    }

    return "영업중";
  } catch {
    return "영업 종료";
  }
}

export function isOpenNow(raw: string | null | undefined): boolean {
  return getBusinessStatus(raw) === "영업중";
}
