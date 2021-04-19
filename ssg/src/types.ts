export type StringMap<T> = {
  readonly [key: string]: T;
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
