"use client";

import { useClerk } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export function AccountDetailsDialog() {
  const clerk = useClerk();

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => {
        clerk.openUserProfile({
          appearance: {
            elements: {
              cardBox: "shadow-none",
            },
          },
        });
      }}
    >
      Edit account
    </Button>
  );
}
