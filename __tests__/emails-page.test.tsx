/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EmailsPage from "@/app/emails/page";
import { ToastProvider } from "@/components/toast";
import { createEmail } from "@/lib/email-actions";

jest.mock("@/components/protected-route", () => ({
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/lib/emails", () => ({
  getEmails: jest.fn().mockResolvedValue([]),
}));

jest.mock("@/lib/email-actions", () => ({
  createEmail: jest.fn(),
  deleteEmail: jest.fn(),
}));

const mockCreateEmail = createEmail as jest.Mock;

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <EmailsPage />
      </ToastProvider>
    </QueryClientProvider>
  );
}

describe("emails page compose flow", () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockCreateEmail.mockReset();
  });

  test("logging an email records it and says so honestly — it does not claim the CRM sent it", async () => {
    mockCreateEmail.mockResolvedValue({ id: "1" });
    const user = userEvent.setup();
    renderPage();

    await user.click(await screen.findByRole("button", { name: "Compose" }));
    await user.type(screen.getByPlaceholderText("To address"), "c@d.com");
    await user.type(screen.getByPlaceholderText("Subject"), "Quarterly update");
    await user.type(screen.getByPlaceholderText("Body"), "Notes from the call.");
    await user.click(screen.getByRole("button", { name: "Log email" }));

    await waitFor(() => expect(mockCreateEmail).toHaveBeenCalledTimes(1));
    expect(mockCreateEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        toAddress: "c@d.com",
        subject: "Quarterly update",
        body: "Notes from the call.",
        status: "SENT",
      })
    );

    expect(await screen.findByText("Email logged to CRM history")).toBeInTheDocument();
    expect(screen.queryByText("Email sent")).not.toBeInTheDocument();
    expect(screen.queryByText("Email sent and logged")).not.toBeInTheDocument();
  });

  test("no Send button is offered when EmailJS is not configured", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(await screen.findByRole("button", { name: "Compose" }));

    expect(await screen.findByText(/Email sending is not configured in this environment/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Send & log" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log email" })).toBeInTheDocument();
  });

  test("shows a validation error and records nothing for an empty form", async () => {
    mockCreateEmail.mockResolvedValue({ id: "1" });
    const user = userEvent.setup();
    renderPage();

    await user.click(await screen.findByRole("button", { name: "Compose" }));
    await user.click(screen.getByRole("button", { name: "Log email" }));

    expect(await screen.findByText("Invalid email")).toBeInTheDocument();
    expect(mockCreateEmail).not.toHaveBeenCalled();
  });
});
