"use client";

import { useActionState } from "react";
import { FramedCtaButton } from "@/components/ui/FramedCta";
import { approveRates, type ApproveState } from "@/lib/rates/actions";

/** The one button on the approval page. It carries the token back and nothing
 *  else — what is granted is read from the token, on the server. */
export function ApproveForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<ApproveState, FormData>(approveRates, {});

  if (state.sent) {
    return (
      <p className="rates-gate-line" role="status">
        Sent. The link is on its way to {state.sent.email}.
      </p>
    );
  }

  return (
    <form action={action} className="form-action approve-action">
      <input type="hidden" name="t" value={token} />
      <FramedCtaButton type="submit" label="Confirm and send the link" wide disabled={pending} />
      <span role="status" className="form-status font-mono">
        {pending ? "Sending…" : (state.error ?? "")}
      </span>
    </form>
  );
}
