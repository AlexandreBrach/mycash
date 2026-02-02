export type CategoryProperties = {
  id: number;
  name: string;
  color?: string;
  lft: number;
  rght: number;
  treeId: number;
  level: number;
  parentId: number | undefined;
};

export class Category {
  protected data: CategoryProperties;
  constructor(props: CategoryProperties) {
    this.data = props;
  }

  raw(): CategoryProperties {
    return this.data;
  }
}
