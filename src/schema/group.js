import { GroupTC } from '../models/group';

const GroupQuery = {
  groupPagination: GroupTC.getResolver('pagination'),
};

export { GroupQuery };
