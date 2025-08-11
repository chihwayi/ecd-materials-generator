import { toast } from 'react-hot-toast';

export const handlePlanLimitError = (error) => {
  if (error.response?.status === 403 && error.response?.data?.upgradeRequired) {
    const { message, currentCount, limit } = error.response.data;
    
    toast.error(
      <div className="space-y-2">
        <p className="font-semibold">Plan Limit Reached</p>
        <p className="text-sm">{message}</p>
        <p className="text-xs text-gray-600">Current: {currentCount}/{limit}</p>
      </div>,
      {
        duration: 6000,
        style: {
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          color: '#991B1B'
        }
      }
    );
    
    return true; // Indicates this was a plan limit error
  }
  
  return false; // Not a plan limit error
};

export const showUpgradePrompt = (limitType) => {
  toast(
    <div className="space-y-2">
      <p className="font-semibold">💡 Upgrade Required</p>
      <p className="text-sm">You've reached your {limitType} limit. Upgrade to continue adding more.</p>
      <button 
        onClick={() => window.location.href = '/subscription/pricing'}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        View Plans →
      </button>
    </div>,
    {
      duration: 8000,
      style: {
        background: '#EFF6FF',
        border: '1px solid #DBEAFE',
        color: '#1E40AF'
      }
    }
  );
};