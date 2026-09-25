import { useQuery } from '@tanstack/react-query';
import { staffService } from '@/services/staff.service';

export function useAllStaffs() {
  return useQuery({
    queryKey: ['staffs', 'all'],
    queryFn: () => staffService.getAllStaff(),
  });
}
