import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
  const session = useSession();

  return { user: session?.data?.user };
};

export default useCurrentUser;
