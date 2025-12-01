import type { Kysely, Selectable } from 'kysely';
import type {
  Database,
  OperatorRole,
  OperatorsTable
} from '../../database/schema';
import type { OperatorRecord, OperatorWithSecret } from './auth.types';

type OperatorRow = Selectable<OperatorsTable>;

const memoryOperators = new Map<
  string,
  OperatorWithSecret
>();

let memoryIdCounter = 1;

const rowToRecord = (row: OperatorRow): OperatorRecord => ({
  id: row.id,
  username: row.username,
  role: row.role,
  isActive: row.is_active ?? true,
  createdAt: new Date(row.created_at).toISOString(),
  updatedAt: new Date(row.updated_at).toISOString()
});

const rowToWithSecret = (row: OperatorRow): OperatorWithSecret => ({
  ...rowToRecord(row),
  passwordHash: row.password_hash
});

export class OperatorsRepository {
  constructor(private readonly db: Kysely<Database> | null) {}

  async count(): Promise<number> {
    if (!this.db) {
      return memoryOperators.size;
    }

    const result = await this.db
      .selectFrom('operators')
      .select(({ fn }) => fn.count('id').as('count'))
      .executeTakeFirst();

    return Number(result?.count ?? 0);
  }

  async findWithSecret(username: string): Promise<OperatorWithSecret | undefined> {
    if (!this.db) {
      return memoryOperators.get(username);
    }

    const row = await this.db
      .selectFrom('operators')
      .selectAll()
      .where('username', '=', username)
      .executeTakeFirst();

    return row ? rowToWithSecret(row) : undefined;
  }

  async findById(id: number): Promise<OperatorRecord | undefined> {
    if (!this.db) {
      const found = Array.from(memoryOperators.values()).find((op) => op.id === id);
      return found ? { ...found } : undefined;
    }

    const row = await this.db
      .selectFrom('operators')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    return row ? rowToRecord(row) : undefined;
  }

  async createOperator(params: {
    username: string;
    passwordHash: string;
    role?: OperatorRole;
    isActive?: boolean;
  }): Promise<OperatorRecord> {
    if (!this.db) {
      const operator: OperatorWithSecret = {
        id: memoryIdCounter++,
        username: params.username,
        role: params.role ?? 'owner',
        isActive: params.isActive ?? true,
        passwordHash: params.passwordHash,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      memoryOperators.set(params.username, operator);
      return {
        id: operator.id,
        username: operator.username,
        role: operator.role,
        isActive: operator.isActive,
        createdAt: operator.createdAt,
        updatedAt: operator.updatedAt
      };
    }

    const now = new Date();
    const row = await this.db
      .insertInto('operators')
      .values({
        username: params.username,
        password_hash: params.passwordHash,
        role: params.role ?? 'owner',
        is_active: params.isActive ?? true,
        created_at: now,
        updated_at: now
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return rowToRecord(row);
  }
}

