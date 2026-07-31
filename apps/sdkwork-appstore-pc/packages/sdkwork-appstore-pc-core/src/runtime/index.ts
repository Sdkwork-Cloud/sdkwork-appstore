export class AppRuntime {
  private static instance: AppRuntime;
  private initialized = false;

  public static getInstance(): AppRuntime {
    if (!AppRuntime.instance) {
      AppRuntime.instance = new AppRuntime();
    }
    return AppRuntime.instance;
  }

  public init() {
    if (this.initialized) return;
    this.initialized = true;
  }
}
