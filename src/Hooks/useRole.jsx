import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading: authLoading } = useAuth();
  const hasUser = Boolean(user?.email);

  const { data: role = "", isLoading } = useQuery({
    queryKey: ["role", user?.email],
    queryFn: async () => {
      if (!user?.email) return "";
      const { data } = await axiosSecure.get(`/users/role/${user.email}`);
      return data?.role || "";
    },
    enabled: hasUser && !authLoading,
  });

  const roleLoading = authLoading || (hasUser && isLoading);

  return [role, roleLoading];
};

export default useRole;
