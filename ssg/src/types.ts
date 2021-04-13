export type ProjectMetadata = {
  repo: string;
  tech: string[];
  branch: string;
};

export type IndexMetadata = {
  projects: ProjectMetadata[];
};

export type ArticleMetadata = {
  title: string;
  url: string;
  [key: string]: string;
};
