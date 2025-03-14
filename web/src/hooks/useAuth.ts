import { useState, useEffect } from 'react';
import { User } from '@/types/task';
import { usersAPI } from '@/lib/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        const response = await usersAPI.getAllUsers();
        if (response.data && response.data.length > 0) {
          setUser(response.data[0]); // Karena getAllUsers mengembalikan array dengan user saat ini
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return { user, loading, error };
} 