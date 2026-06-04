export function generateReferralCode() {
  return (
    "RW-" +
    Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()
  );
}