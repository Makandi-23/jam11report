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
      const response = await fetch('http://localhost/jam11report/backend/api/reports/vote.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          report_id: reportId,
          user_id: user.id // Make sure your user object has id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to vote');
      }

      const data = await response.json();

      if (data.message === "Vote added successfully.") {
        // Store vote in localStorage
        const votedReports = getVotedReports();
        votedReports.push(reportId);
        localStorage.setItem(`voted_reports_${user.id}`, JSON.stringify(votedReports));
      }

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