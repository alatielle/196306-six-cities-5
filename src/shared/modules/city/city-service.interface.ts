import { DocumentType } from '@typegoose/typegoose';
import { CityEntity } from './city.entity.js';
import { CreateCityDto } from './dto/create-city.dto.js';
import { DocumentExists } from '../../types/index.js';

export interface CityService extends DocumentExists {
  create(dto: CreateCityDto): Promise<DocumentType<CityEntity>>;
  findByCityId(cityId: string): Promise<DocumentType<CityEntity> | null>;
  findByCityName(cityName: string): Promise<DocumentType<CityEntity> | null>;
  findByCityNameOrCreate(
    cityName: string,
    dto: CreateCityDto,
  ): Promise<DocumentType<CityEntity>>;
}
