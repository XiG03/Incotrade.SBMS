import { useQuery } from '@tanstack/react-query';
import { serviceService } from '@/services/service.service';

export function useActiveServices() {
  return useQuery({
    queryKey: ['services', 'active'],
    queryFn: () => serviceService.getActive(),
  });
}

export function useAllServices() {
  return useQuery({
    queryKey: ['services', 'all'],
    queryFn: () => serviceService.getAll(),
  });
}
