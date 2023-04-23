import { TeamsUserCredentialContext } from "./singletonContext";

/**
 * This function performs a login action using the Teams user credential context.
 * @param scope An array of scopes to request access to.
 */
export async function loginAction(scope: string[]) {
  try {
    // Get the Teams user credential from the singleton context
    var credential = TeamsUserCredentialContext.getInstance().getCredential();

    // Perform the login action with the specified scopes
    await credential.login(scope);
    
    // Set the updated credential back into the singleton context
    TeamsUserCredentialContext.getInstance().setCredential(credential);
  } catch (e) {
    // Log any errors and re-throw the exception
    console.log(e);
    throw e;
  }
}
