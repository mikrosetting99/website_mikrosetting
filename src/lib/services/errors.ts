export class ServiceError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "ServiceError";
  }
}

export class UnauthorizedError extends ServiceError {
  constructor(message = "Anda harus login untuk melanjutkan.") {
    super("UNAUTHORIZED", message);
  }
}

export class ToolNotFoundError extends ServiceError {
  constructor() {
    super("TOOL_NOT_FOUND", "Tool tidak ditemukan atau tidak aktif.");
  }
}

export class InsufficientCoinError extends ServiceError {
  required: number;
  balance: number;

  constructor(required: number, balance: number) {
    super("INSUFFICIENT_COIN", "Saldo koin tidak cukup.");
    this.required = required;
    this.balance = balance;
  }
}

export class SubscriptionRequiredError extends ServiceError {
  constructor() {
    super("SUBSCRIPTION_REQUIRED", "Tool ini hanya untuk subscriber aktif.");
  }
}
