
export function validateDate(date) {
  const today = new Date();
  const inputDate = new Date(date);
  return inputDate >= today;
}

export function calculatePrice(roomType, nights) {
  const rates = { single: 50, double: 80, dorm: 30 };
  return rates[roomType] * nights;
}
