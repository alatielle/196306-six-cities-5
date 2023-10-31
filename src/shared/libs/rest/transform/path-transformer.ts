import { inject, injectable } from 'inversify';

import { STATIC_FILES_ROUTE, STATIC_UPLOAD_ROUTE } from '../../../../rest/index.js';
import { Component } from '../../../types/index.js';
import { getFullServerPath } from '../../../helpers/index.js';
import { Config, RestSchema } from '../../config/index.js';
import { Logger } from '../../logger/index.js';
import { DEFAULT_STATIC_IMAGES, STATIC_RESOURCE_FIELDS } from './path-transformer.constant.js';

function isObject(value: unknown): value is Record<string, object> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

@injectable()
export class PathTransformer {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>
  ) {
    this.logger.info('PathTransformer created');
  }

  private hasDefaultImage(value: string) {
    return DEFAULT_STATIC_IMAGES.includes(value);
  }

  private isStaticProperty(property: string) {
    return STATIC_RESOURCE_FIELDS.includes(property);
  }

  private transform(value: string) {
    const staticPath = STATIC_FILES_ROUTE;
    const uploadPath = STATIC_UPLOAD_ROUTE;
    const serverHost = this.config.get('HOST');
    const serverPort = this.config.get('PORT');
    const rootPath = this.hasDefaultImage(value) ? staticPath : uploadPath;
    return `${getFullServerPath(serverHost, serverPort)}${rootPath}/${value}`;
  }

  public execute(data: Record<string, unknown>): Record<string, unknown> {
    const stack = [data];

    while (stack.length > 0) {
      const current = stack.pop();

      for (const key in current) {
        if (Object.hasOwn(current, key)) {
          const value = current[key];

          if (isObject(value)) {
            stack.push(value);
            continue;
          }

          if (this.isStaticProperty(key)) {
            if (typeof value === 'string') {
              current[key] = this.transform(value);
            }

            if (Array.isArray(value)) {
              current[key] = value.map((v) => typeof v === 'string' ? this.transform(v) : v);
            }
          }
        }
      }
    }

    return data;
  }
}
