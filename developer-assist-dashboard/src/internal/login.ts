import { TeamsUserCredentialContext } from "./singletonContext";

/**
 * This function performs the login action for the specified scope.
 * @param scope The scope for which the login action is performed.
 */
export async function loginAction(scope: string[]) {
  try {
    // Get the Teams user credential context instance and retrieve the credential.
    var credential = TeamsUserCredentialContext.getInstance().getCredential();

    // Perform the login action for the specified scope.
    await credential.login(scope);

    // Set the credential in the Teams user credential context instance.
    TeamsUserCredentialContext.getInstance().setCredential(credential);
  } catch (e) {
    // Log any errors that occur during the login action and re-throw the error.
    console.log(e);
    throw e;
  }
}
