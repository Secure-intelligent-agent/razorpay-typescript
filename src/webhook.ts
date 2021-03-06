export type WebHookFunction = (payload: IRazorWebHookPayload) => Promise<any>;
export type EntityContain =
  | "payment"
  | "order"
  | "refund"
  | "dispute"
  | "invoice"
  | "subscription"
  | "settlement"
  | "virtual_account";
export type WebHookEvent =
  | "order.paid"
  | "payment.authorized"
  | "payment.captured"
  | "payment.failed"
  | "refund.created"
  | "payment.dispute.created"
  | "payment.dispute.won"
  | "payment.dispute.lost"
  | "payment.dispute.closed"
  | "invoice.partially_paid"
  | "invoice.paid"
  | "invoice.expired"
  | "subscription.activated"
  | "subscription.charged"
  | "subscription.completed"
  | "subscription.updated"
  | "subscription.pending"
  | "subscription.halted"
  | "subscription.cancelled"
  | "settlement.processed"
  | "virtual_account.created"
  | "virtual_account.credited"
  | "virtual_account.closed";

export interface IActionHandler {
  order: {
    paid: WebHookFunction;
  };
  payment: {
    authorized: WebHookFunction;
    captured: WebHookFunction;
    failed: WebHookFunction;
  };
  refund: {
    created: WebHookFunction;
  };
  dispute: {
    created: WebHookFunction;
    won: WebHookFunction;
    lost: WebHookFunction;
    closed: WebHookFunction;
  };
  invoice: {
    partially_paid: WebHookFunction;
    paid: WebHookFunction;
    expired: WebHookFunction;
  };
  subscription: {
    activated: WebHookFunction;
    charged: WebHookFunction;
    completed: WebHookFunction;
    updated: WebHookFunction;
    pending: WebHookFunction;
    halted: WebHookFunction;
    cancelled: WebHookFunction;
  };
  settlement: {
    processed: WebHookFunction;
  };
  virtual_account: {
    created: WebHookFunction;
    credited: WebHookFunction;
    closed: WebHookFunction;
  };
}
export interface IRazorWebHookPayload {
  entity: "event";
  account_id: string;
  event: WebHookEvent;
  contains: EntityContain[];
  payload: {
    [key: string]: {
      entity: any;
    };
  };
  created_at: number;
}

/**
 * ## Razorpay Webhooks
 * Webhooks allow you to build or set up integrations that subscribe to certain
 * events on Razorpay APIs. When one of those events is triggered, we send an
 * HTTP POST payload in JSON to the webhook's configured URL.
 *
 * @class RazorWebhook
 * @constructor IRazorWebHookPayload payload
 */
export class RazorWebhook {
  private _payload: IRazorWebHookPayload;
  private _handler: RazorWebhookHandler;

  constructor(payload: IRazorWebHookPayload) {
    if (!payload) {
      throw new Error("`payload` is mandatory");
    }
    this._payload = payload;
    this._handler = new RazorWebhookHandler();
  }

  protected get TAG(): string {
    return `[${new Date().toUTCString()} | ${this.constructor.name}]`;
  }

  protected get payload(): IRazorWebHookPayload {
    return this._payload;
  }

  get handler() {
    return this._handler;
  }

  /**
   * ### Execute Webhook Computation
   * @return Promise<any>
   */
  execute() {
    const pl = this._payload;
    const handler = this._handler.handler;
    switch (this._payload.event) {
      case "order.paid":
        return handler.order.paid(pl);

      case "payment.authorized":
        return handler.payment.authorized(pl);
      case "payment.captured":
        return handler.payment.captured(pl);
      case "payment.failed":
        return handler.payment.failed(pl);

      case "refund.created":
        return handler.refund.created(pl);

      case "payment.dispute.created":
        return handler.dispute.created(pl);
      case "payment.dispute.won":
        return handler.dispute.won(pl);
      case "payment.dispute.lost":
        return handler.dispute.lost(pl);
      case "payment.dispute.closed":
        return handler.dispute.closed(pl);

      case "invoice.partially_paid":
        return handler.invoice.partially_paid(pl);
      case "invoice.paid":
        return handler.invoice.paid(pl);
      case "invoice.expired":
        return handler.invoice.expired(pl);

      case "subscription.activated":
        return handler.subscription.activated(pl);
      case "subscription.charged":
        return handler.subscription.charged(pl);
      case "subscription.completed":
        return handler.subscription.completed(pl);
      case "subscription.updated":
        return handler.subscription.updated(pl);
      case "subscription.pending":
        return handler.subscription.pending(pl);
      case "subscription.halted":
        return handler.subscription.halted(pl);
      case "subscription.cancelled":
        return handler.subscription.cancelled(pl);

      case "settlement.processed":
        return handler.settlement.processed(pl);

      case "virtual_account.created":
        return handler.virtual_account.created(pl);
      case "virtual_account.credited":
        return handler.virtual_account.credited(pl);
      case "virtual_account.closed":
        return handler.virtual_account.closed(pl);

      default:
        return Promise.reject(
          "Payload event is currently isn't supported by RazorWebhook class."
        );
    }
  }
}

export class RazorWebhookHandler {
  private _handler: IActionHandler = {
    order: {
      paid: _mockAction,
    },
    payment: {
      authorized: _mockAction,
      captured: _mockAction,
      failed: _mockAction,
    },
    refund: {
      created: _mockAction,
    },
    dispute: {
      created: _mockAction,
      won: _mockAction,
      lost: _mockAction,
      closed: _mockAction,
    },
    invoice: {
      partially_paid: _mockAction,
      paid: _mockAction,
      expired: _mockAction,
    },
    subscription: {
      activated: _mockAction,
      charged: _mockAction,
      completed: _mockAction,
      updated: _mockAction,
      pending: _mockAction,
      halted: _mockAction,
      cancelled: _mockAction,
    },
    settlement: {
      processed: _mockAction,
    },
    virtual_account: {
      created: _mockAction,
      credited: _mockAction,
      closed: _mockAction,
    },
  };

  /**
   * #### ``GET`` Event Handlers
   * @return IActionHandler
   */
  get handler() {
    return this._handler;
  }

  /**
   * #### ``SET`` Event Handle For: `order.paid`
   * Triggered when an order is successfully paid.
   * @param WebHookFunction fn
   */
  set orderPaid(fn: WebHookFunction) {
    this._handler.order.paid = fn;
  }

  /**
   * #### ``SET`` Event Handle For: `refund.created`
   * Triggered when you create a refund.
   * @param WebHookFunction fn
   */
  set refundCreated(fn: WebHookFunction) {
    this._handler.refund.created = fn;
  }

  /**
   * #### ``SET`` Event Handle For: `payment.authorized`
   * Triggered when a payment is authorized.
   * @param WebHookFunction fn
   */
  set paymentAuthorized(fn: WebHookFunction) {
    this._handler.payment.authorized = fn;
  }

  /**
   * #### ``SET`` Event Handle For: `payment.captured`
   * Triggered when a payment is successfully captured.
   * @param WebHookFunction fn
   */
  set paymentCaptured(fn: WebHookFunction) {
    this._handler.payment.captured = fn;
  }

  /**
   * #### ``SET`` Event Handle For: `payment.failed`
   * Triggered when a payment fails.
   * @param WebHookFunction fn
   */
  set paymentFailed(fn: WebHookFunction) {
    this._handler.payment.failed = fn;
  }

  /**
   * #### ``SET`` Event Handle For: `payment.dispute.created`
   * Triggered when a dispute is raised by the customer's issuing bank against a payment.
   * @param WebHookFunction fn
   */
  set disputeCreated(fn: WebHookFunction) {
    this._handler.dispute.created = fn;
  }

  /**
   * #### ``SET`` Event Handle For: `payment.dispute.won`
   * Triggered when a merchant has won a dispute against a payment.
   * @param WebHookFunction fn
   */
  set disputeWon(fn: WebHookFunction) {
    this._handler.dispute.won = fn;
  }

  /**
   * #### ``SET`` Event Handle For: `payment.dispute.lost`
   * Triggered when a merchant has lost a dispute against a payment.
   * @param WebHookFunction fn
   */
  set disputeLost(fn: WebHookFunction) {
    this._handler.dispute.lost = fn;
  }

  /**
   * #### ``SET`` Event Handle For: `payment.dispute.closed`
   * Triggered when a dispute is closed.
   * @param WebHookFunction fn
   */
  set disputeClosed(fn: WebHookFunction) {
    this._handler.dispute.closed = fn;
  }

  /**
   * #### ``SET`` Event Handle For: `invoice.partially_paid`
   * Triggered when a partial payment is made against an invoice.
   * @param WebHookFunction fn
   */
  set invoicePartiallyPaid(fn: WebHookFunction) {
    this._handler.invoice.partially_paid = fn;
  }

  /**
   * #### ``SET`` Event Handle For: `invoice.paid`
   * Triggered when an invoice is successfully paid.
   * @param WebHookFunction fn
   */
  set invoicePaid(fn: WebHookFunction) {
    this._handler.invoice.paid = fn;
  }

  /**
   * #### ``SET`` Event Handle For: `invoice.expired`
   * Triggered when an invoice expires.
   * @param WebHookFunction fn
   */
  set invoiceExpired(fn: WebHookFunction) {
    this._handler.invoice.expired = fn;
  }

  /**
   * #### ``SET`` Event Handle For: `subscription.activated`
   * Sent when the subscription moves to the `active` state either from the
   * `authenticated`, `pending` or `halted` state. If a subscription moves to
   * the `active` state from the `pending` or `halted` state, only the subsequent
   * invoices that are generated are charged. Existing invoices that were
   * already generated are not charged.
   * @param WebHookFunction fn
   */
  set subscriptionActivated(fn: WebHookFunction) {
    this._handler.subscription.activated = fn;
  }

  /**
   * #### ``SET`` Event Handle For: `subscription.charged`
   * Sent every time a successful charge is made on the subscription.
   * @param WebHookFunction fn
   */
  set subscriptionCharged(fn: WebHookFunction) {
    this._handler.subscription.charged = fn;
  }

  /**
   * #### ``SET`` Event Handle For: `subscription.completed`
   * Sent when all the invoices are generated for a subscription and the
   * subscription moves to the `completed` state.
   * @param WebHookFunction fn
   */
  set subscriptionCompleted(fn: WebHookFunction) {
    this._handler.subscription.completed = fn;
  }

  /**
   * #### ``SET`` Event Handle For: `subscription.updated`
   * Sent when a subscription is successfully updated. There is no state
   * change when a subscription is updated.
   * @param WebHookFunction fn
   */
  set subscriptionUpdated(fn: WebHookFunction) {
    this._handler.subscription.updated = fn;
  }

  /**
   * #### ``SET`` Event Handle For: `subscription.pending`
   * Sent when the subscription moves to the `pending` state. This happens
   * when a charge on the card fails. We try to charge the card on a
   * periodic basis while it is in the `pending` state. If the payment fails
   * again, the webhook is triggered again.
   * @param WebHookFunction fn
   */
  set subscriptionPending(fn: WebHookFunction) {
    this._handler.subscription.pending = fn;
  }

  /**
   * #### ``SET`` Event Handle For: `subscription.halted`
   * Sent when all retries have been exhausted and the subscription moves
   * from the `pending` state to the `halted` state. The customer has to
   * manually retry the charge or change the card linked to the subscription,
   * for the subscription to move back to the `active` state.
   * @param WebHookFunction fn
   */
  set subscriptionHalted(fn: WebHookFunction) {
    this._handler.subscription.halted = fn;
  }

  /**
   * #### ``SET`` Event Handle For: `subscription.cancelled`
   * Sent when a subscription is `cancelled` and the subscription moves to the
   * `cancelled` state.
   * @param WebHookFunction fn
   */
  set subscriptionCancelled(fn: WebHookFunction) {
    this._handler.subscription.cancelled = fn;
  }

  /**
   * #### ``SET`` Event Handle For: `settlement.processed`
   * Triggered when a transfer made to a linked account is settled with the
   * parent merchant. (Available only for [Razorpay Route](https://razorpay.com/docs/webhooks/route/)).
   * @param WebHookFunction fn
   */
  set settlementProcessed(fn: WebHookFunction) {
    this._handler.settlement.processed = fn;
  }

  /**
   * #### ``SET`` Event Handle For: `virtual_account.created`
   * Triggered when a virtual account is created.
   * @param WebHookFunction fn
   */
  set virtualAccountCreated(fn: WebHookFunction) {
    this._handler.virtual_account.created = fn;
  }

  /**
   * #### ``SET`` Event Handle For: `virtual_account.credited`
   * Triggered when a payment is made to a virtual account.
   * @param WebHookFunction fn
   */
  set virtualAccountCredited(fn: WebHookFunction) {
    this._handler.virtual_account.credited = fn;
  }

  /**
   * #### ``SET`` Event Handle For: `virtual_account.closed`
   * Triggered when a virtual account expires on a date set by you or is
   * manually closed by you.
   * @param WebHookFunction fn
   */
  set virtualAccountClosed(fn: WebHookFunction) {
    this._handler.virtual_account.closed = fn;
  }
}

function _mockAction(payload: IRazorWebHookPayload): Promise<any> {
  return Promise.resolve(true);
}
