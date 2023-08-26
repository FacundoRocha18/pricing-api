import { Report } from '../reports/report.entity';

export interface IResponse {
  status_code: number;
  status_message: string;
}

export interface IResponseData {
  data: Report[];
}
