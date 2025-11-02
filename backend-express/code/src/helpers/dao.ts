export interface DAOInterface<Model> {
  findById: (id: string) => Promise<Model | undefined>;
  find: (props: Object) => Promise<Model[]>;
  findOne: (props: Object) => Promise<Model | undefined>;
  save: (segment: Model) => Promise<Model>;
  insert: (segment: Model) => Promise<Model>;
  update: (segment: Model) => Promise<Model>;
  delete: (segmentId: string) => Promise<void>;
}
