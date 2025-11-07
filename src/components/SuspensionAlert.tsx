import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Ban, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SuspensionAlert: React.FC = () => {
  const { user } = useAuth();

  if (!user || user.status !== 'suspended') {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"
    >
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-yellow-800 mb-1">
            Account Suspended
          </h3>
          <p className="text-sm text-yellow-700 mb-2">
            Your account has been suspended. You cannot submit new reports or vote on existing ones.
            Please contact support if you believe this is a mistake.
          </p>
          <div className="flex items-center space-x-4 text-xs text-yellow-600">
            <div className="flex items-center">
              <Ban className="w-3 h-3 mr-1" />
              Cannot submit reports
            </div>
            <div className="flex items-center">
              <Ban className="w-3 h-3 mr-1" />
              Cannot vote on reports
            </div>
            <div className="flex items-center">
              <Mail className="w-3 h-3 mr-1" />
              Contact: support@jamiireport.com
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SuspensionAlert;