interface EmptyStateProps {
  statusFilter: string;
}

export default function EmptyState({ statusFilter }: EmptyStateProps) {
  return (
    <div className="text-center p-16 bg-white rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">No Bookings Found</h3>
      <p className="text-gray-600">
        No {statusFilter !== 'All' ? statusFilter.toLowerCase() : ''} bookings to display.
      </p>
    </div>
  );
}