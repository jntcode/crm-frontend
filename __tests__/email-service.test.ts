/**
 * @jest-environment jsdom
 */

const mockSend = jest.fn();

jest.mock("@emailjs/browser", () => ({
  __esModule: true,
  default: { send: (...args: unknown[]) => mockSend(...args) },
}));

describe("email-service", () => {
  beforeEach(() => {
    mockSend.mockReset();
    delete process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    delete process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    delete process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  });

  function loadService() {
    let mod: typeof import("@/lib/email-service");
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      mod = require("@/lib/email-service");
    });
    return mod!;
  }

  test("sendEmail throws when the provider is not configured instead of pretending success", async () => {
    const { sendEmail, isEmailSendingConfigured } = loadService();

    expect(isEmailSendingConfigured()).toBe(false);
    await expect(
      sendEmail({ to: "c@d.com", subject: "Hi", body: "Hello" })
    ).rejects.toThrow("Email sending is not configured");
    expect(mockSend).not.toHaveBeenCalled();
  });

  test("sendEmail delivers through EmailJS when configured", async () => {
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID = "svc";
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID = "tpl";
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY = "key";

    const { sendEmail, isEmailSendingConfigured } = loadService();
    expect(isEmailSendingConfigured()).toBe(true);

    mockSend.mockResolvedValue({ status: 200, text: "OK" });
    await sendEmail({ to: "c@d.com", subject: "Hi", body: "Hello", fromName: "Alice" });

    expect(mockSend).toHaveBeenCalledWith(
      "svc",
      "tpl",
      { to_email: "c@d.com", from_name: "Alice", subject: "Hi", message: "Hello" },
      { publicKey: "key" }
    );
  });

  test("sendEmail surfaces provider failures", async () => {
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID = "svc";
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID = "tpl";
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY = "key";

    const { sendEmail } = loadService();
    mockSend.mockRejectedValue(new Error("Provider rejected the request"));

    await expect(
      sendEmail({ to: "c@d.com", subject: "Hi", body: "Hello" })
    ).rejects.toThrow("Provider rejected the request");
  });
});
