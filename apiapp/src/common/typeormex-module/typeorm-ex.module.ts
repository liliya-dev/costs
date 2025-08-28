import { DynamicModule, Provider } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource, ObjectLiteral } from 'typeorm';

import { TYPEORM_EX_CUSTOM_REPOSITORY } from '../decorators/typeorm-ex.decorator';

export class TypeOrmExModule {
  public static forCustomRepository<T extends new (...args: any[]) => any>(
    repositories: T[],
  ): DynamicModule {
    const providers: Provider[] = [];
    repositories.forEach((repository) => {
      const entity = Reflect.getMetadata(
        TYPEORM_EX_CUSTOM_REPOSITORY,
        repository,
      );
      if (entity) {
        providers.push({
          inject: [getDataSourceToken()],
          provide: repository,
          useFactory: (dataSource: DataSource): typeof repository => {
            const baseRepository =
              dataSource.getRepository<ObjectLiteral>(entity);
            return new repository(
              baseRepository.target,
              baseRepository.manager,
              baseRepository.queryRunner,
            );
          },
        });
      }
    });

    return {
      exports: providers,
      module: TypeOrmExModule,
      providers,
    };
  }
}
