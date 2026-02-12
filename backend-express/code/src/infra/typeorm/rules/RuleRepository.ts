import { FindManyOptions, Raw } from 'typeorm';
import { AppDataSource } from '../ormconfig';
import { RuleOrm } from './rules';
import { DAOInterface, GenericRepository, GenericRepositoryInterface } from '../GenericRepository';
import { Month } from '../../../exportable/Interval/Month';
import { Rule } from '../../../models/Rule';

export const RulesOrmRepository = AppDataSource.getRepository(RuleOrm);

class RuleDAO implements DAOInterface<RuleOrm, Rule> {
  public assemble(o: RuleOrm) {
    const { categorie_id, ...all } = o;
    return new Rule({ ...all, categoryId: categorie_id });
  }
  unassemble(entity: Rule): RuleOrm {
    const { categoryId, ...wanted } = entity.raw();

    return {
      ...wanted,
      end: wanted.end || undefined,
      categorie_id: categoryId,
    };
  }
}

export type RulesFilter = FindManyOptions<RuleOrm>;

export interface RuleRepositoryInterface extends GenericRepositoryInterface<Rule, RuleOrm> {
  getRulesApplyingBetween: (start: Month, end: Month) => Promise<Rule[]>;
}

export const RulesRepository = (): RuleRepositoryInterface => {
  const dao = new RuleDAO();
  const generic = GenericRepository<Rule, RuleOrm>(RulesOrmRepository, dao);
  return {
    ...generic,
    /**
     * Return all rules that can apply between two date.
     * If the rule start/end date is NULL, it must be considered as infinite in the past/future
     *
     * @param start
     * @param end
     */
    getRulesApplyingBetween: async (start: Month, end: Month): Promise<Rule[]> => {
      const filter: FindManyOptions<RuleOrm> = {
        where: {
          start: Raw((alias) => `${alias} IS NULL OR ${alias} <= :endDate`, { endDate: end.getEndDate() }),
          end: Raw((alias) => `${alias} IS NULL OR ${alias} >= :startDate`, { startDate: start.getDate() }),
        },
      };
      const rules = await generic.find(filter);
      return rules;
    },
  };
};
