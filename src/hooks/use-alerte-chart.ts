import useSWR from 'swr';
import axios from 'axios';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export function useAlerts() {
  const { data, error, isLoading } = useSWR('/api/alerteChart', fetcher);
  return { data, error, isLoading };
}
