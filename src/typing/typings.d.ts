declare namespace API {
  /** 服务器返回的格式类型 */
  type BaseResponse<T> = {
    resultCode?: string;
    resultMsg?: string;
    resultObject?: T | undefined;
  };

  type ResponseConfig = {
    isShowSuccessTips?: boolean;
    isShowErrorTips?: boolean;
    localSuccessTips?: string;
    localErrorTips?: string;
  };

  /** 本地格式化类型 */
  type BaseRes<T = any> = {
    isSuccess: boolean;
    code: string;
    msg: string;
    data: T | undefined;
  };

  type List<T> = {
    pageIndex: number;
    pageInfo: PageInfo;
    records: number;
    rows: T[];
    total: number; //备用字段，暂时不包装到分页对象里面
  };

  type PageInfo = {
    pageCount: number;
    pageIndex: number;
    pageSize: number;
    total: number;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };



  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

}
