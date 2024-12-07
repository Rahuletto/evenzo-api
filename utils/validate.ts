export function validateToken(token: string, validationKey?: string): boolean {
    if (!validationKey) {
      console.error("VALIDATION_KEY is not defined!");
      return false;
    }
  
    const decodedData = atob(token);
    const [timestamp, key] = decodedData?.split(".");
  
    if (key !== validationKey) {
      return false;
    }
  
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const tokenTimestamp = parseInt(timestamp, 10);
  
    const isValid = currentTimestamp - tokenTimestamp <= 180;
    return isValid;
  }
  