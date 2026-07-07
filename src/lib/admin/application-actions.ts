/**
 * The application status transitions, shared by the detail page's action
 * cluster and the table's per-row menu so the two can never drift.
 */
export const APPLICATION_STATUS_ACTIONS = [
  { status: "RECRUITED", label: "Admit", variant: "primary" as const },
  { status: "WAITLISTED", label: "Waitlist", variant: "outline" as const },
  { status: "REJECTED", label: "Reject", variant: "danger" as const },
  { status: "WITHDRAWN", label: "Withdraw", variant: "outline" as const },
];

/** Confirm-dialog copy for a status transition. */
export const applicationStatusCopy = (status: string): string =>
  status === "RECRUITED"
    ? "This admits the applicant and creates their student record."
    : status === "REJECTED"
      ? "This rejects the applicant — any admission is reversed and paid fees refunded."
      : `This sets the application to ${status.toLowerCase()}.`;

export const APPLICATION_DELETE_COPY =
  "This removes the application. Applicants who have paid or been admitted can't be deleted.";
