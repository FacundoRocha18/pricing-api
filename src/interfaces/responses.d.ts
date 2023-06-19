export interface IResponse {
  status_code: number;
  status_message: string;
}

export interface IResponseData extends IResponse {
  data: object;
}
