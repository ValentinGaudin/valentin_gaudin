import type { Activity } from '../domain/activity';

export interface ActivityRepository {
  lister(): Promise<readonly Activity[]>;
}
