// This interface represents the structure of a GitHub issue
export interface githubIssuesModel {
  // The state of the issue (open or closed)
  state?: string;

  // The URL of the issue
  url: string;

  // The title of the issue
  title?: string;

  // The body of the issue (optional)
  body?: string | null;
}
