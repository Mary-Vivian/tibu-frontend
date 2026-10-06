const styles: Record<string, string> = {
  Scheduled: "bg-blue-100 text-blue-800",
  Completed: "bg-green-100 text-green-800",
  Cancelled: "bg-gray-200 text-gray-600",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? styles.Cancelled}`}>
      {status}
    </span>
  );
}