export class TokenManager {
  private static token: string | null = null;

  public static getToken(): string | null {
    return this.token;
  }

  public static setToken(token: string) {
    this.token = token;
  }

  public static clearToken() {
    this.token = null;
  }
}
