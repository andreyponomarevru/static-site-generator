export type ProjectMeta = {
  repo: string;
  tech: string[];
  branch: string;
};

export type IndexMeta = {
  projects: ProjectMeta[];
};

export type ArticleMeta = {
  [key: string]: string;
};

export type JSON<Metadata> = {
  [filename: string]: Metadata;
};
