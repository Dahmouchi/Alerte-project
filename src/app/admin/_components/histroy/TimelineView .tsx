import { AlertHistoryWithRelations } from "@/lib/alertHistory";
import { formatDateTime, getActionColor, getActionIcon } from "@/lib/alertHistoryUtils";

interface TimelineViewProps {
  data: AlertHistoryWithRelations[];
  onSelect: (id: string) => void;
}

export default function TimelineView({ data, onSelect }: TimelineViewProps) {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {data.map((item, idx) => (
          <li key={item.id}>
            <div className="relative pb-8">
              {idx !== data.length - 1 && (
                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" />
              )}
              <div className="relative flex space-x-3">
                <div>
                  <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getActionColor(item.action)}`}>
                    {getActionIcon(item.action)}
                  </span>
                </div>
                <div 
                  className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  onClick={() => onSelect(item.id)}
                >
                  <div>
                    <p className="text-sm text-gray-800">
                      <span className="font-medium">{item.user?.name || 'System'}</span>{' '}
                      <span className="font-semibold">{item.action.replace(/_/g, ' ').toLowerCase()}</span> this alert
                      {item.details && <span className="text-gray-600">: {item.details}</span>}
                    </p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    <time dateTime={item.createdAt.toISOString()}>
                      {formatDateTime(item.createdAt)}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}