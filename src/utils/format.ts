//  จัดรูปแบบตัวเลขให้เป็นสกุลเงิน (ทศนิยม 2 ตำแหน่ง)
export const formatCurrency = (amount: number): string => {
  return amount.toFixed(2)
}

// สร้าง Order ID ที่ไม่ซ้ำกันโดยใช้ Timestamp ปัจจุบัน
export const generateOrderId = (): string => {
  return Date.now().toString()
}
