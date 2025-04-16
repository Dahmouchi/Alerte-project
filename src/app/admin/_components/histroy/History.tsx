"use client"
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import TableView from './TableView';
import ChangesView from './ChangesView';
import { AlertHistoryViewMode, AlertHistoryWithRelations } from '@/lib/alertHistory';
import TimelineView from './TimelineView ';

interface AlertHistoryPageProps {
  historyData: AlertHistoryWithRelations[];
}

export default function AlertHistoryPage({ historyData }: AlertHistoryPageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AlertHistoryViewMode>('timeline');
  const [selectedOperation, setSelectedOperation] = useState<string | null>(null);

  const selectedItem = selectedOperation 
    ? historyData.find(item => item.id === selectedOperation) 
    : historyData[0];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex gap-2 lg:items-center justify-between mb-8 lg:flex-row flex-col-reverse">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Historique des alertes</h1>
            <p className="text-gray-600">Suivi de toutes les opérations effectuées sur Alert #{selectedItem?.alert?.code}</p>
          </div>
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 bg-white border cursor-pointer border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
          >
           Retour aux alertes
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {(['timeline', 'table', 'changes'] as AlertHistoryViewMode[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab} view
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {activeTab === 'timeline' && (
              <TimelineView
                data={historyData} 
                onSelect={setSelectedOperation} 
              />
            )}
            
            {activeTab === 'table' && (
              <TableView 
                data={historyData} 
                onSelect={setSelectedOperation} 
                onActiveTab={setActiveTab}
              />
            )}
            
            {activeTab === 'changes' && selectedItem && (
              <ChangesView 
                item={selectedItem} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

