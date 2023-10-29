import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';

import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { CityService } from './city-service.interface.js';
import { CityEntity } from './city.entity.js';
import { CreateCityDto } from './dto/create-city.dto.js';

@injectable()
export class DefaultCityService implements CityService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CityModel)
    private readonly cityModel: types.ModelType<CityEntity>,
  ) {}

  public async create(dto: CreateCityDto): Promise<DocumentType<CityEntity>> {
    const city = await this.cityModel.create(dto);
    this.logger.info(`🏘️New city created: ${dto.name}`);
    return city;
  }

  public async findByCityId(
    cityId: string,
  ): Promise<DocumentType<CityEntity> | null> {
    return this.cityModel.findById(cityId).exec();
  }

  public async findByCityName(
    cityName: string,
  ): Promise<DocumentType<CityEntity> | null> {
    return this.cityModel.findOne({ name: cityName }).exec();
  }

  public async findByCityNameOrCreate(
    cityName: string,
    dto: CreateCityDto,
  ): Promise<DocumentType<CityEntity>> {
    const existingCity = await this.findByCityName(cityName);
    return existingCity ?? (await this.create(dto));
  }
}
