export function createOrderNumber(prefix: "SVC" | "REQ") {
  const date = new Date();
  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const suffix = Math.floor(1000 + Math.random() * 9000);

  return `JS-${prefix}-${year}${month}${day}-${suffix}`;
}
