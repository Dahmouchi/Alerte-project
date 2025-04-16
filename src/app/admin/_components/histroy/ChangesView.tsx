import { AlertHistoryWithRelations } from "@/lib/alertHistory";

interface ChangesViewProps {
  item: AlertHistoryWithRelations;
}

export default function ChangesView({ item }: ChangesViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Action Details</h3>
        <div className="bg-white p-4 rounded">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500">Action Type</h4>
            <p className="mt-1 text-sm text-gray-900 capitalize">
              {item.action.replace(/_/g, ' ').toLowerCase()}
            </p>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500">Performed By</h4>
            <p className="mt-1 text-sm text-gray-900">
              {item.user?.name || 'System'} ({item.user?.role || 'SYSTEM'})
            </p>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500">Performed At</h4>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(item.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Change Details</h3>
        <div className="bg-white p-4 rounded">
          {item.details ? (
            <pre className="text-sm whitespace-pre-wrap">
              {item.details}
            </pre>
          ) : (
            <p className="text-gray-500">No additional details provided</p>
          )}
        </div>
      </div>
    </div>
  );
}