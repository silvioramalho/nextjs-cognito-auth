import { authConfig } from "@/config/auth-config-export";
import { NextServer, createServerRunner } from "@aws-amplify/adapter-nextjs";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth/server";

export interface AuthUser {
  isAdmin: boolean;
  username: string;
  userId: string;
}

export const { runWithAmplifyServerContext } = createServerRunner({
  config: {
    Auth: authConfig,
  },
});

export async function authenticatedUser(context: NextServer.Context): Promise<AuthUser | null> {
  return runWithAmplifyServerContext({
    nextServerContext: context,
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec);
        if (!session.tokens) {
          return null;
        }
        const user = await getCurrentUser(contextSpec);
        const groups = session.tokens.accessToken.payload["cognito:groups"] as string[] | undefined;
        const isAdmin = Array.isArray(groups) && groups.includes("Admins");

        const authUser: AuthUser = {
          isAdmin,
          username: user.username,
          userId: user.userId,
        };

        return authUser;
      } catch (error) {
        console.log("Error in authenticatedUser:", error);
        return null;
      }
    },
  });
}
