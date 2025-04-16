import { AlertHistoryViewMode, AlertHistoryWithRelations } from "@/lib/alertHistory";
import { formatDateTime, getActionColor, getRoleBadgeColor, getUserInitials } from "@/lib/alertHistoryUtils";

interface TableViewProps {
  data: AlertHistoryWithRelations[];
  onSelect: (id: string) => void;
  onActiveTab: (id:AlertHistoryViewMode) => void;
}

export default function TableView({ data, onSelect,onActiveTab }: TableViewProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Details
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Time
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getActionColor(item.action)}`}>
                      {getUserInitials(item.user?.name || 'System')}
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {item.user?.name || 'System'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.user?.prenom || ''}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  getRoleBadgeColor(item.user?.role || 'SYSTEM')
                }`}>
                  {item.user?.role || 'SYSTEM'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  getActionColor(item.action)
                }`}>
                  {item.action.replace(/_/g, ' ').toLowerCase()}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                {item.details || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDateTime(item.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => {onSelect(item.id)
                    onActiveTab("changes")
                   }
                    
                  }
                  className="text-blue-600 hover:text-blue-900"
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}