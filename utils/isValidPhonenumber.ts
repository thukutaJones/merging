export function isValidPhonenumber(phoneNumber: string): boolean {
  const pattern = /^(08|09)\d{8}$/;
  return pattern.test(phoneNumber);
}
