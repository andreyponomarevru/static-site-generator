export type ProjectMetadata = {
  repo: string;
  tech: string[];
  branch: string;
};

export type IndexMetadata = {
  projects: ProjectMetadata[];
};

export type ArticleMetadata = {
  [key: string]: string;
};

export type JSON<Metadata> = {
  [filename: string]: Metadata;
};
