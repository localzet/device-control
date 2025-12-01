import type { OperatorRole } from '../../database/schema';

export type OperatorRecord = {
  id: number;
  username: string;
  role: OperatorRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type OperatorWithSecret = OperatorRecord & {
  passwordHash: string;
};

