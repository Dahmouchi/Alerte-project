export const getActionColor = (action: string): string => {
    const colors: Record<string, string> = {
      ASSIGN_ANALYST: 'bg-purple-100 text-purple-800',
      SET_STATUS: 'bg-blue-100 text-blue-800',
      VALIDATE: 'bg-green-100 text-green-800',
      CREATE: 'bg-indigo-100 text-indigo-800',
      UPDATE: 'bg-yellow-100 text-yellow-800',
      DELETE: 'bg-red-100 text-red-800',
    };
    return colors[action] || 'bg-gray-100 text-gray-800';
  };
  
  export const getActionIcon = (action: string): string => {
    const icons: Record<string, string> = {
      ASSIGN_ANALYST: '👤',
      ASSIGN_RESPONSABLE: '👤',
      SET_STATUS: '🏷️',
      VALIDATE: '✓',
      CREATE: '+',
      SEND:'📧',
      UPDATE: '✏️',
      DELETE: '🗑️',
    };
    return icons[action] || '⚙️';
  };
  
  export const getRoleBadgeColor = (role: string | undefined): string => {
    const colors: Record<string, string> = {
      ADMIN: 'bg-red-100 text-red-800',
      ANALYSTE: 'bg-blue-100 text-blue-800',
      RESPONSABLE: 'bg-yellow-100 text-yellow-800',
      USER: 'bg-purple-100 text-purple-800',
    };
    return colors[role || ''] || 'bg-gray-100 text-gray-800';
  };
  
  export const formatDateTime = (date: Date): string => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  export const getUserInitials = (name: string | undefined | null): string => {
    if (!name) return 'S';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  export const parseDetails = (details: string | null): Record<string, unknown> | null => {
    if (!details) return null;
    try {
      return JSON.parse(details);
    } catch {
      return null;
    }
  };