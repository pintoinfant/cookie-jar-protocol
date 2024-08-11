import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export function NotDaoMember() {
  return (
    <Alert variant="destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        You&apos;re not a member of this DAO. Please withdraw amount from the DAO you&apos;re a member of.
      </AlertDescription>
    </Alert>
  )
}
