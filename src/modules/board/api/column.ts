import { apiClient, ApiResponse } from 'modules/core/apiClient';
import { AxiosResponse } from 'axios';
import { ValidationError } from '@/modules/core/errors/errors';
import { ColumnDto } from './dto';
import { dtoToColumn } from './transform';

export interface CreateColumnRequest {
  name: string;
  board_id: number;
  seq: number;
  color: string;
}

const store = async (payload: CreateColumnRequest) => {
  const response: AxiosResponse<ApiResponse<ColumnDto>> = await apiClient.post(
    '/column/store',
    payload
  );

  const apiResponse: ApiResponse<ColumnDto> = response.data;

  if (!apiResponse.success && apiResponse.invalidFields) {
    throw new ValidationError(apiResponse.message, apiResponse.invalidFields);
  }

  return dtoToColumn(apiResponse.data);
};

const update = async (
  id: string | number,
  payload: Partial<CreateColumnRequest>
) => {
  const response: AxiosResponse<ApiResponse<ColumnDto>> = await apiClient.put(
    `/column/${id}`,
    payload
  );

  const apiResponse: ApiResponse<ColumnDto> = response.data;

  if (!apiResponse.success && apiResponse.invalidFields) {
    throw new ValidationError(apiResponse.message, apiResponse.invalidFields);
  }

  return dtoToColumn(apiResponse.data);
};

export default {
  store,
  update,
};
