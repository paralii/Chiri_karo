class TokenStore {
  private accessToken: string | null = null;

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public setAccessToken(token: string): void {
    this.accessToken = token;
  }

  public clearAccessToken(): void {
    this.accessToken = null;
  }
}

export const tokenStore = new TokenStore();
