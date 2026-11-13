/**
 * Pure tool functions — business logic only, no MCP dependency.
 */

export interface BusinessIdResult {
  [key: string]: unknown;
  input: string;
  valid: boolean;
  reason: string;
}

/**
 * Validate a Taiwan Unified Business Number (統一編號, 8 digits).
 * Weights 1,2,1,2,1,2,4,1; digits of each product are summed.
 * Valid if the sum is divisible by 5 (rule in force since 2023),
 * or, when the 7th digit is 7, if (sum + 1) is divisible by 5.
 */
export function validateBusinessId(id: string): BusinessIdResult {
  const input = id.trim();
  if (!/^\d{8}$/.test(input)) {
    return { input, valid: false, reason: "統一編號必須是 8 位數字" };
  }
  const weights = [1, 2, 1, 2, 1, 2, 4, 1];
  const sum = [...input].reduce((acc, ch, i) => {
    const p = Number(ch) * weights[i];
    return acc + Math.floor(p / 10) + (p % 10);
  }, 0);
  const ok = sum % 5 === 0 || (input[6] === "7" && (sum + 1) % 5 === 0);
  return {
    input,
    valid: ok,
    reason: ok ? "格式與檢查碼正確（僅代表編碼合法，不代表該公司真實存在）" : "檢查碼不符",
  };
}

export interface DateConvertResult {
  [key: string]: unknown;
  input: string;
  rocDate: string;
  gregorianDate: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Convert 民國 date (e.g. 115-11-13 or 1151113) to Gregorian. */
export function rocToGregorian(roc: string): DateConvertResult {
  const m = roc.trim().match(/^(\d{1,3})[-/.]?(\d{2})[-/.]?(\d{2})$/);
  if (!m) throw new Error("格式錯誤，請使用例如 115-11-13 或 1151113");
  const y = Number(m[1]) + 1911, mo = Number(m[2]), d = Number(m[3]);
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) {
    throw new Error("不存在的日期");
  }
  return { input: roc, rocDate: `${m[1]}-${pad(mo)}-${pad(d)}`, gregorianDate: `${y}-${pad(mo)}-${pad(d)}` };
}

/** Convert Gregorian date (YYYY-MM-DD) to 民國. */
export function gregorianToRoc(greg: string): DateConvertResult {
  const m = greg.trim().match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (!m) throw new Error("格式錯誤，請使用例如 2026-11-13");
  const y = Number(m[1]), mo = Number(m[2]), d = Number(m[3]);
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) {
    throw new Error("不存在的日期");
  }
  if (y <= 1911) throw new Error("民國紀年自 1912 年起");
  return { input: greg, rocDate: `${y - 1911}-${pad(mo)}-${pad(d)}`, gregorianDate: `${y}-${pad(mo)}-${pad(d)}` };
}
