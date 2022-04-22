import { TeamsFx } from "@microsoft/teamsfx";
import { useData } from "./useData";

export function useLogin(scopes: string[]) {
  const { data, error, loading, reload } = useData(async () => {
    try {
      const teamsfx = new TeamsFx();
      await teamsfx.getCredential().getToken(scopes);
      return false;
    } catch (err: any) {
      if (err.code?.includes("UiRequiredError")) {
        return true;
      } else {
        throw err;
      }
    }
  });
  return { needLogin: data, error, loading, reload };
}
