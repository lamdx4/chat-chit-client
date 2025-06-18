/* eslint-disable @typescript-eslint/no-explicit-any */
export default function transformDateFields(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "string") {
    const mysqlDateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;

    if (mysqlDateRegex.test(obj)) {
      // MySQL datetime từ container UTC+7
      // Cần convert về UTC trước khi tạo Date object

      console.log("🔄 Converting MySQL datetime (UTC+7):", obj);

      const [datePart, timePart] = obj.split(" ");
      const [year, month, day] = datePart.split("-").map(Number);
      const [hour, minute, second] = timePart.split(":").map(Number);

      // Tạo Date object theo UTC+7, sau đó lấy UTC time
      const localDate = new Date(year, month - 1, day, hour, minute, second);

      // Trừ đi 7 tiếng để convert về UTC
      const utcTime = localDate.getTime() - 7 * 60 * 60 * 1000;
      const utcDate = new Date(utcTime);

      console.log("  - Original (UTC+7):", obj);
      console.log("  - Converted to UTC:", utcDate.toISOString());

      return utcDate;
    }

    if (isoDateRegex.test(obj)) {
      return new Date(obj);
    }

    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => transformDateFields(item));
  }

  if (typeof obj === "object") {
    const transformed = { ...obj };
    for (const key in transformed) {
      if (Object.prototype.hasOwnProperty.call(transformed, key)) {
        transformed[key] = transformDateFields(transformed[key]);
      }
    }
    return transformed;
  }

  return obj;
}
