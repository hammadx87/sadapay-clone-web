export const AUTHORIZED_PIN = '76064';

class SecurityService {
  private static instance: SecurityService;
  private _isAuthenticated: boolean = false;

  private constructor() {}

  public static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  public validatePin(pin: string): boolean {
    return pin === AUTHORIZED_PIN;
  }

  public setAuthenticated(value: boolean): void {
    this._isAuthenticated = value;
  }

  public get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }
}

export default SecurityService;
