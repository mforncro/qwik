import type { RenderDocument } from '../../../../qwik/src/server/types';
import type { ROUTE_TYPE_ENDPOINT } from './constants';

export interface EndpointModule<BODY = unknown> {
  onDelete?: EndpointHandler<BODY>;
  onGet?: EndpointHandler<BODY>;
  onHead?: EndpointHandler<BODY>;
  onOptions?: EndpointHandler<BODY>;
  onPatch?: EndpointHandler<BODY>;
  onPost?: EndpointHandler<BODY>;
  onPut?: EndpointHandler<BODY>;
  onRequest?: EndpointHandler<BODY>;
}

export interface PageModule extends EndpointModule {
  readonly default: any;
  readonly breadcrumbs?: ContentBreadcrumb[];
  readonly head?: ContentModuleHead;
  readonly headings?: ContentHeading[];
}

export interface LayoutModule extends EndpointModule {
  readonly default: any;
  readonly head?: ContentModuleHead;
}

/**
 * @public
 */
export interface RouteLocation {
  hash: string;
  hostname: string;
  href: string;
  params: RouteParams;
  pathname: string;
  search: string;
  query: Record<string, string>;
}

/**
 * @public
 */
export interface ResolvedDocumentHead {
  title?: string;
  meta?: DocumentMeta[];
  links?: DocumentLink[];
  styles?: DocumentStyle[];
}

/**
 * @public
 */
export interface DocumentMeta {
  content?: string;
  httpEquiv?: string;
  name?: string;
  property?: string;
  key?: string;
}

/**
 * @public
 */
export interface DocumentLink {
  as?: string;
  crossorigin?: string;
  disabled?: boolean;
  href?: string;
  hreflang?: string;
  id?: string;
  imagesizes?: string;
  imagesrcset?: string;
  integrity?: string;
  media?: string;
  prefetch?: string;
  referrerpolicy?: string;
  rel?: string;
  sizes?: string;
  title?: string;
  type?: string;
  key?: string;
}

/**
 * @public
 */
export interface DocumentStyle {
  style: string;
  props?: { [propName: string]: string };
  key?: string;
}

/**
 * @public
 */
export interface DocumentHeadProps<T = unknown> extends RouteLocation {
  data: T | null;
  head: Required<ResolvedDocumentHead>;
}

/**
 * @public
 */
export type DocumentHead<T = unknown> =
  | ResolvedDocumentHead
  | ((props: DocumentHeadProps<T>) => ResolvedDocumentHead);

/**
 * @public
 */
export interface ContentBreadcrumb {
  text: string;
  href?: string;
}

export interface ContentState {
  breadcrumbs: ContentBreadcrumb[] | undefined;
  headings: ContentHeading[] | undefined;
  modules: ContentModule[];
}

/**
 * @public
 */
export interface ContentMenu {
  text: string;
  href?: string;
  items?: ContentMenu[];
}

/**
 * @public
 */
export interface ContentHeading {
  text: string;
  id: string;
  level: number;
}

export type ContentModuleLoader = () => Promise<ContentModule>;
export type EndpointModuleLoader = () => Promise<EndpointModule>;
export type ModuleLoader = ContentModuleLoader | EndpointModuleLoader;

/**
 * @public
 */
export type RouteData =
  | [pattern: RegExp, pageLoaders: ContentModuleLoader[]]
  | [pattern: RegExp, pageLoaders: ContentModuleLoader[], paramNames: string[]]
  | [
      pattern: RegExp,
      endpointLoaders: EndpointModuleLoader[],
      paramNames: string[],
      routeType: typeof ROUTE_TYPE_ENDPOINT
    ];

/**
 * @public
 */
export interface QwikCityPlan {
  routes: RouteData[];
  menus?: { [pathName: string]: ContentMenu };
  trailingSlash?: boolean;
}

/**
 * @public
 */
export type RouteParams = Record<string, string>;

export interface MatchedRoute {
  loaders: ModuleLoader[];
  params: RouteParams;
}

export interface LoadedRoute extends MatchedRoute {
  modules: ContentModule[];
}

export interface LoadedContent extends LoadedRoute {
  pageModule: PageModule;
}

export type ContentModule = PageModule | LayoutModule;

export type ContentModuleHead = DocumentHead | ResolvedDocumentHead;

/**
 * @public
 */
export interface RequestEvent {
  request: Request;
  params: RouteParams;
  url: URL;
}

/**
 * @public
 */
export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS'
  | 'CONNECT'
  | 'TRACE';

/**
 * @public
 */
export type EndpointHandler<BODY = unknown> = (
  ev: RequestEvent
) => EndpointResponse<BODY> | undefined | null | Promise<EndpointResponse<BODY> | undefined | null>;

export interface EndpointResponse<BODY = unknown> {
  body?: BODY | null | undefined;
  /**
   * HTTP Headers. The "Content-Type" header is used to determine how to serialize the `body` for the
   * HTTP Response.  For example, a "Content-Type" including `application/json` will serialize the `body`
   * with `JSON.stringify(body)`. If the "Content-Type" header is not provided, the response
   * will default to include the header `"Content-Type": "application/json; charset=utf-8"`.
   */
  headers?: Record<string, string | undefined>;

  /**
   * HTTP Status code. The status code is import to determine if the data can be public
   * facing or not. Setting a value of `200` will allow the endpoint to be fetched using
   * an `"accept": "application/json"` request header. If the data from the API
   * should not allowed to be requested, the status should be set to one of the Client Error
   * response status codes. An example would be `401` for "Unauthorized", or `403` for
   * "Forbidden".
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
   */
  status?: number;

  /**
   * URL to redirect to. The `redirect` property is for convenience rather
   * than manually setting the redirect status code and the `location` header.
   * Defaults to use the `307` response status code, but can be overwritten
   * by manually setting the `status` property.
   */
  redirect?: string;
}

export interface NormalizedEndpointResponse {
  body: any;
  headers: Record<string, string>;
  status: number;
}

export interface QwikCityRenderDocument extends RenderDocument {
  _qwikUserCtx?: QwikCityUserContext;
}

export interface QwikCityUserContext {
  qcRoute: RouteLocation;
  qcRequest: {
    method: HttpMethod;
  };
  qcResponse: NormalizedEndpointResponse | null;
}

export declare enum HTTPStatus {
  // 1xx informational response
  Continue = 100,
  Switching_Protocols = 101,
  Processing = 102,
  Early_Hints = 103,
  // 2xx success
  Ok = 200,
  Created = 201,
  Accepted = 202,
  Non_Authoritative_Information = 203,
  No_Content = 204,
  Reset_Content = 205,
  Partial_Content = 206,
  Multi_Status = 207,
  Already_Reported = 208,
  IM_Used = 226,
  // 3xx redirection
  Multiple_Choices = 300,
  Moved_Permanently = 301,
  Found = 302,
  See_Other = 303,
  Not_Modified = 304,
  Use_Proxy = 305,
  Switch_Proxy = 306,
  Temporary_Redirect = 307,
  Permanent_Redirect = 308,
  // 4xx client errors
  Bad_Request = 400,
  Unauthorized = 401,
  Payment_Required = 402,
  Forbidden = 403,
  Not_Found = 404,
  Method_Not_Allowed = 405,
  Not_Acceptable = 406,
  Proxy_Authentication_Required = 407,
  Request_Timeout = 408,
  Conflict = 409,
  Gone = 410,
  Length_Required = 411,
  Precondition_Failed = 412,
  Payload_Too_Large = 413,
  URI_Too_Long = 414,
  Unsupported_Media_Type = 415,
  Range_Not_Satisfiable = 416,
  Expectation_Failed = 417,
  Im_A_Teapot = 418,
  Misdirected_Request = 421,
  Unprocessable_Entity = 422,
  Locked = 423,
  Failed_Dependency = 424,
  Too_Early = 425,
  Upgrade_Required = 426,
  Precondition_Required = 428,
  Too_Many_Requests = 429,
  Request_Header_Fields_Too_Large = 431,
  Unavailable_For_Legal_Reasons = 451,
  // 5xx server errors
  Internal_Server_Error = 500,
  Not_Implemented = 501,
  Bad_Gateway = 502,
  Service_Unavailable = 503,
  Gateway_Timeout = 504,
  HTTP_Version_Not_Supported = 505,
  Variant_Also_Negotiates = 506,
  Insufficient_Storage = 507,
  Loop_Detected = 508,
  Not_Extended = 510,
  Network_Authentication_Required = 511,
}