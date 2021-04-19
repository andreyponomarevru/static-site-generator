export type GitHubProject = {
  readonly repo: string;
  readonly branch: string;
  readonly [key: string]: string;
};

export const gitHubProjects: GitHubProject[] = [
  { repo: "static-site-generator", branch: "dev" },
  { repo: "musicbox", branch: "dev" },
  { repo: "biscuit-components", branch: "master" },
  { repo: "automation-scripts", branch: "master" },
];
