function generateBookingReference() {
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  const time = Date.now().toString().slice(-6);
  return `XPJ-${time}-${rand}`;
}

module.exports = generateBookingReference;