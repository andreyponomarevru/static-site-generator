export type StringMap<T> = {
  readonly [key: string]: T;
};

export type ProjectsMeta = {
  title: string;
  year?: string;
  about: string;
  links: {
    github: string;
    demo?: string;
  };
  image?: string;
};

export type MdArticle = {
  readonly content: string;
  readonly mtime: Date;
};

export type Metadata = {
  readonly lang: string;
  readonly stylesheets: string[];
  readonly scripts: string[];
  readonly charset: string;
  readonly title: string;
  readonly description: string;
  readonly keywords: string;
  readonly author: string;
  readonly favicon: string;
  readonly viewport: string;
};

export type GitHub_GetRepository = {
  body: {
    name: string;
    description: string;
    html_url: string;
    homepage: string;
  };
};

export type GitHubProject = {
  readonly repo: string;
  readonly branch: string;
  readonly [key: string]: string;
};
