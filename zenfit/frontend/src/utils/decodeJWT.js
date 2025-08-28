export const decodeJWT = (token) => {
    try {
      if (!token) return null;
  
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
  
      const decoded = JSON.parse(jsonPayload);
  
      const currentTime = Date.now() / 1000; 
      if (decoded.exp && decoded.exp < currentTime) {
        console.warn("Token has expired");
        return null;
      }
  
      return decoded;
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  };
  