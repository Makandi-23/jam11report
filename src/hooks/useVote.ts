import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useVote = () => {
  const { user, token } = useAuth();
  const [votingStates, setVotingStates] = useState<Record<number, boolean>>({});

  const getVotedReports = useCallback(() => {
    if (!user) return [];
    const voted = localStorage.getItem(`voted_reports_${user.id}`);
    return voted ? JSON.parse(voted) : [];
  }, [user]);

  const hasVoted = useCallback((reportId: number) => {
    const votedReports = getVotedReports();
    return votedReports.includes(reportId);
  }, [getVotedReports]);

  const vote = useCallback(async (reportId: number) => {
    if (!user || !token || hasVoted(reportId) || votingStates[reportId]) {
      return null;
    }

    setVotingStates(prev => ({ ...prev, [reportId]: true }));

    try {
      const response = await fetch(`/api/reports/${reportId}/vote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to vote');
      }

      const data = await response.json();

      // Store vote in localStorage
      const votedReports = getVotedReports();
      votedReports.push(reportId);
      localStorage.setItem(`voted_reports_${user.id}`, JSON.stringify(votedReports));

      return data;
    } catch (error) {
      console.error('Error voting:', error);
      throw error;
    } finally {
      setVotingStates(prev => ({ ...prev, [reportId]: false }));
    }
  }, [user, token, hasVoted, votingStates, getVotedReports]);

  return {
    vote,
    hasVoted,
    isVoting: (reportId: number) => votingStates[reportId] || false,
  };
};