import { useQuery } from '@tanstack/react-query';
import { fetchPresets } from '../api/client';
export function usePresets() {
    return useQuery({
        queryKey: ['presets'],
        queryFn: fetchPresets,
        staleTime: Infinity,
    });
}
