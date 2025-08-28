import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';

const typeReturn = async <T>(
  mutation: Promise<UpdateResult | DeleteResult | InsertResult>,
): Promise<T> => await mutation.then((res) => res?.raw[0]);

export { typeReturn };
