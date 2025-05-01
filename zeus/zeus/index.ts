/* eslint-disable */

import { AllTypesProps, ReturnTypes, Ops } from './const';
export const HOST = "http://localhost:9001/graphql"


export const HEADERS = {}
export const apiSubscription = (options: chainOptions) => (query: string) => {
  try {
    const queryString = options[0] + '?query=' + encodeURIComponent(query);
    const wsString = queryString.replace('http', 'ws');
    const host = (options.length > 1 && options[1]?.websocket?.[0]) || wsString;
    const webSocketOptions = options[1]?.websocket || [host];
    const ws = new WebSocket(...webSocketOptions);
    return {
      ws,
      on: (e: (args: any) => void) => {
        ws.onmessage = (event: any) => {
          if (event.data) {
            const parsed = JSON.parse(event.data);
            const data = parsed.data;
            return e(data);
          }
        };
      },
      off: (e: (args: any) => void) => {
        ws.onclose = e;
      },
      error: (e: (args: any) => void) => {
        ws.onerror = e;
      },
      open: (e: () => void) => {
        ws.onopen = e;
      },
    };
  } catch {
    throw new Error('No websockets implemented');
  }
};
const handleFetchResponse = (response: Response): Promise<GraphQLResponse> => {
  if (!response.ok) {
    return new Promise((_, reject) => {
      response
        .text()
        .then((text) => {
          try {
            reject(JSON.parse(text));
          } catch (err) {
            reject(text);
          }
        })
        .catch(reject);
    });
  }
  return response.json() as Promise<GraphQLResponse>;
};

export const apiFetch =
  (options: fetchOptions) =>
  (query: string, variables: Record<string, unknown> = {}) => {
    const fetchOptions = options[1] || {};
    if (fetchOptions.method && fetchOptions.method === 'GET') {
      return fetch(`${options[0]}?query=${encodeURIComponent(query)}`, fetchOptions)
        .then(handleFetchResponse)
        .then((response: GraphQLResponse) => {
          if (response.errors) {
            throw new GraphQLError(response);
          }
          return response.data;
        });
    }
    return fetch(`${options[0]}`, {
      body: JSON.stringify({ query, variables }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      ...fetchOptions,
    })
      .then(handleFetchResponse)
      .then((response: GraphQLResponse) => {
        if (response.errors) {
          throw new GraphQLError(response);
        }
        return response.data;
      });
  };

export const InternalsBuildQuery = ({
  ops,
  props,
  returns,
  options,
  scalars,
}: {
  props: AllTypesPropsType;
  returns: ReturnTypesType;
  ops: Operations;
  options?: OperationOptions;
  scalars?: ScalarDefinition;
}) => {
  const ibb = (
    k: string,
    o: InputValueType | VType,
    p = '',
    root = true,
    vars: Array<{ name: string; graphQLType: string }> = [],
  ): string => {
    const keyForPath = purifyGraphQLKey(k);
    const newPath = [p, keyForPath].join(SEPARATOR);
    if (!o) {
      return '';
    }
    if (typeof o === 'boolean' || typeof o === 'number') {
      return k;
    }
    if (typeof o === 'string') {
      return `${k} ${o}`;
    }
    if (Array.isArray(o)) {
      const args = InternalArgsBuilt({
        props,
        returns,
        ops,
        scalars,
        vars,
      })(o[0], newPath);
      return `${ibb(args ? `${k}(${args})` : k, o[1], p, false, vars)}`;
    }
    if (k === '__alias') {
      return Object.entries(o)
        .map(([alias, objectUnderAlias]) => {
          if (typeof objectUnderAlias !== 'object' || Array.isArray(objectUnderAlias)) {
            throw new Error(
              'Invalid alias it should be __alias:{ YOUR_ALIAS_NAME: { OPERATION_NAME: { ...selectors }}}',
            );
          }
          const operationName = Object.keys(objectUnderAlias)[0];
          const operation = objectUnderAlias[operationName];
          return ibb(`${alias}:${operationName}`, operation, p, false, vars);
        })
        .join('\n');
    }
    const hasOperationName = root && options?.operationName ? ' ' + options.operationName : '';
    const keyForDirectives = o.__directives ?? '';
    const query = `{${Object.entries(o)
      .filter(([k]) => k !== '__directives')
      .map((e) => ibb(...e, [p, `field<>${keyForPath}`].join(SEPARATOR), false, vars))
      .join('\n')}}`;
    if (!root) {
      return `${k} ${keyForDirectives}${hasOperationName} ${query}`;
    }
    const varsString = vars.map((v) => `${v.name}: ${v.graphQLType}`).join(', ');
    return `${k} ${keyForDirectives}${hasOperationName}${varsString ? `(${varsString})` : ''} ${query}`;
  };
  return ibb;
};

type UnionOverrideKeys<T, U> = Omit<T, keyof U> & U;

export const Thunder =
  <SCLR extends ScalarDefinition>(fn: FetchFunction, thunderGraphQLOptions?: ThunderGraphQLOptions<SCLR>) =>
  <O extends keyof typeof Ops, OVERRIDESCLR extends SCLR, R extends keyof ValueTypes = GenericOperation<O>>(
    operation: O,
    graphqlOptions?: ThunderGraphQLOptions<OVERRIDESCLR>,
  ) =>
  <Z extends ValueTypes[R]>(
    o: Z & {
      [P in keyof Z]: P extends keyof ValueTypes[R] ? Z[P] : never;
    },
    ops?: OperationOptions & { variables?: Record<string, unknown> },
  ) => {
    const options = {
      ...thunderGraphQLOptions,
      ...graphqlOptions,
    };
    return fn(
      Zeus(operation, o, {
        operationOptions: ops,
        scalars: options?.scalars,
      }),
      ops?.variables,
    ).then((data) => {
      if (options?.scalars) {
        return decodeScalarsInResponse({
          response: data,
          initialOp: operation,
          initialZeusQuery: o as VType,
          returns: ReturnTypes,
          scalars: options.scalars,
          ops: Ops,
        });
      }
      return data;
    }) as Promise<InputType<GraphQLTypes[R], Z, UnionOverrideKeys<SCLR, OVERRIDESCLR>>>;
  };

export const Chain = (...options: chainOptions) => Thunder(apiFetch(options));

export const SubscriptionThunder =
  <SCLR extends ScalarDefinition>(fn: SubscriptionFunction, thunderGraphQLOptions?: ThunderGraphQLOptions<SCLR>) =>
  <O extends keyof typeof Ops, OVERRIDESCLR extends SCLR, R extends keyof ValueTypes = GenericOperation<O>>(
    operation: O,
    graphqlOptions?: ThunderGraphQLOptions<OVERRIDESCLR>,
  ) =>
  <Z extends ValueTypes[R]>(
    o: Z & {
      [P in keyof Z]: P extends keyof ValueTypes[R] ? Z[P] : never;
    },
    ops?: OperationOptions & { variables?: ExtractVariables<Z> },
  ) => {
    const options = {
      ...thunderGraphQLOptions,
      ...graphqlOptions,
    };
    type CombinedSCLR = UnionOverrideKeys<SCLR, OVERRIDESCLR>;
    const returnedFunction = fn(
      Zeus(operation, o, {
        operationOptions: ops,
        scalars: options?.scalars,
      }),
    ) as SubscriptionToGraphQL<Z, GraphQLTypes[R], CombinedSCLR>;
    if (returnedFunction?.on && options?.scalars) {
      const wrapped = returnedFunction.on;
      returnedFunction.on = (fnToCall: (args: InputType<GraphQLTypes[R], Z, CombinedSCLR>) => void) =>
        wrapped((data: InputType<GraphQLTypes[R], Z, CombinedSCLR>) => {
          if (options?.scalars) {
            return fnToCall(
              decodeScalarsInResponse({
                response: data,
                initialOp: operation,
                initialZeusQuery: o as VType,
                returns: ReturnTypes,
                scalars: options.scalars,
                ops: Ops,
              }),
            );
          }
          return fnToCall(data);
        });
    }
    return returnedFunction;
  };

export const Subscription = (...options: chainOptions) => SubscriptionThunder(apiSubscription(options));
export const Zeus = <
  Z extends ValueTypes[R],
  O extends keyof typeof Ops,
  R extends keyof ValueTypes = GenericOperation<O>,
>(
  operation: O,
  o: Z,
  ops?: {
    operationOptions?: OperationOptions;
    scalars?: ScalarDefinition;
  },
) =>
  InternalsBuildQuery({
    props: AllTypesProps,
    returns: ReturnTypes,
    ops: Ops,
    options: ops?.operationOptions,
    scalars: ops?.scalars,
  })(operation, o as VType);

export const ZeusSelect = <T>() => ((t: unknown) => t) as SelectionFunction<T>;

export const Selector = <T extends keyof ValueTypes>(key: T) => key && ZeusSelect<ValueTypes[T]>();

export const TypeFromSelector = <T extends keyof ValueTypes>(key: T) => key && ZeusSelect<ValueTypes[T]>();
export const Gql = Chain(HOST, {
  headers: {
    'Content-Type': 'application/json',
    ...HEADERS,
  },
});

export const ZeusScalars = ZeusSelect<ScalarCoders>();

type BaseSymbol = number | string | undefined | boolean | null;

type ScalarsSelector<T, V> = {
  [X in Required<{
    [P in keyof T]: P extends keyof V
      ? V[P] extends Array<any> | undefined
        ? never
        : T[P] extends BaseSymbol | Array<BaseSymbol>
        ? P
        : never
      : never;
  }>[keyof T]]: true;
};

export const fields = <T extends keyof ModelTypes>(k: T) => {
  const t = ReturnTypes[k];
  const fnType = k in AllTypesProps ? AllTypesProps[k as keyof typeof AllTypesProps] : undefined;
  const hasFnTypes = typeof fnType === 'object' ? fnType : undefined;
  const o = Object.fromEntries(
    Object.entries(t)
      .filter(([k, value]) => {
        const isFunctionType = hasFnTypes && k in hasFnTypes && !!hasFnTypes[k as keyof typeof hasFnTypes];
        if (isFunctionType) return false;
        const isReturnType = ReturnTypes[value as string];
        if (!isReturnType) return true;
        if (typeof isReturnType !== 'string') return false;
        if (isReturnType.startsWith('scalar.')) {
          return true;
        }
        return false;
      })
      .map(([key]) => [key, true as const]),
  );
  return o as ScalarsSelector<ModelTypes[T], T extends keyof ValueTypes ? ValueTypes[T] : never>;
};

export const decodeScalarsInResponse = <O extends Operations>({
  response,
  scalars,
  returns,
  ops,
  initialZeusQuery,
  initialOp,
}: {
  ops: O;
  response: any;
  returns: ReturnTypesType;
  scalars?: Record<string, ScalarResolver | undefined>;
  initialOp: keyof O;
  initialZeusQuery: InputValueType | VType;
}) => {
  if (!scalars) {
    return response;
  }
  const builder = PrepareScalarPaths({
    ops,
    returns,
  });

  const scalarPaths = builder(initialOp as string, ops[initialOp], initialZeusQuery);
  if (scalarPaths) {
    const r = traverseResponse({ scalarPaths, resolvers: scalars })(initialOp as string, response, [ops[initialOp]]);
    return r;
  }
  return response;
};

export const traverseResponse = ({
  resolvers,
  scalarPaths,
}: {
  scalarPaths: { [x: string]: `scalar.${string}` };
  resolvers: {
    [x: string]: ScalarResolver | undefined;
  };
}) => {
  const ibb = (k: string, o: InputValueType | VType, p: string[] = []): unknown => {
    if (Array.isArray(o)) {
      return o.map((eachO) => ibb(k, eachO, p));
    }
    if (o == null) {
      return o;
    }
    const scalarPathString = p.join(SEPARATOR);
    const currentScalarString = scalarPaths[scalarPathString];
    if (currentScalarString) {
      const currentDecoder = resolvers[currentScalarString.split('.')[1]]?.decode;
      if (currentDecoder) {
        return currentDecoder(o);
      }
    }
    if (typeof o === 'boolean' || typeof o === 'number' || typeof o === 'string' || !o) {
      return o;
    }
    const entries = Object.entries(o).map(([k, v]) => [k, ibb(k, v, [...p, purifyGraphQLKey(k)])] as const);
    const objectFromEntries = entries.reduce<Record<string, unknown>>((a, [k, v]) => {
      a[k] = v;
      return a;
    }, {});
    return objectFromEntries;
  };
  return ibb;
};

export type AllTypesPropsType = {
  [x: string]:
    | undefined
    | `scalar.${string}`
    | 'enum'
    | {
        [x: string]:
          | undefined
          | string
          | {
              [x: string]: string | undefined;
            };
      };
};

export type ReturnTypesType = {
  [x: string]:
    | {
        [x: string]: string | undefined;
      }
    | `scalar.${string}`
    | undefined;
};
export type InputValueType = {
  [x: string]: undefined | boolean | string | number | [any, undefined | boolean | InputValueType] | InputValueType;
};
export type VType =
  | undefined
  | boolean
  | string
  | number
  | [any, undefined | boolean | InputValueType]
  | InputValueType;

export type PlainType = boolean | number | string | null | undefined;
export type ZeusArgsType =
  | PlainType
  | {
      [x: string]: ZeusArgsType;
    }
  | Array<ZeusArgsType>;

export type Operations = Record<string, string>;

export type VariableDefinition = {
  [x: string]: unknown;
};

export const SEPARATOR = '|';

export type fetchOptions = Parameters<typeof fetch>;
type websocketOptions = typeof WebSocket extends new (...args: infer R) => WebSocket ? R : never;
export type chainOptions = [fetchOptions[0], fetchOptions[1] & { websocket?: websocketOptions }] | [fetchOptions[0]];
export type FetchFunction = (query: string, variables?: Record<string, unknown>) => Promise<any>;
export type SubscriptionFunction = (query: string) => any;
type NotUndefined<T> = T extends undefined ? never : T;
export type ResolverType<F> = NotUndefined<F extends [infer ARGS, any] ? ARGS : undefined>;

export type OperationOptions = {
  operationName?: string;
};

export type ScalarCoder = Record<string, (s: unknown) => string>;

export interface GraphQLResponse {
  data?: Record<string, any>;
  errors?: Array<{
    message: string;
  }>;
}
export class GraphQLError extends Error {
  constructor(public response: GraphQLResponse) {
    super('');
    console.error(response);
  }
  toString() {
    return 'GraphQL Response Error';
  }
}
export type GenericOperation<O> = O extends keyof typeof Ops ? typeof Ops[O] : never;
export type ThunderGraphQLOptions<SCLR extends ScalarDefinition> = {
  scalars?: SCLR | ScalarCoders;
};

const ExtractScalar = (mappedParts: string[], returns: ReturnTypesType): `scalar.${string}` | undefined => {
  if (mappedParts.length === 0) {
    return;
  }
  const oKey = mappedParts[0];
  const returnP1 = returns[oKey];
  if (typeof returnP1 === 'object') {
    const returnP2 = returnP1[mappedParts[1]];
    if (returnP2) {
      return ExtractScalar([returnP2, ...mappedParts.slice(2)], returns);
    }
    return undefined;
  }
  return returnP1 as `scalar.${string}` | undefined;
};

export const PrepareScalarPaths = ({ ops, returns }: { returns: ReturnTypesType; ops: Operations }) => {
  const ibb = (
    k: string,
    originalKey: string,
    o: InputValueType | VType,
    p: string[] = [],
    pOriginals: string[] = [],
    root = true,
  ): { [x: string]: `scalar.${string}` } | undefined => {
    if (!o) {
      return;
    }
    if (typeof o === 'boolean' || typeof o === 'number' || typeof o === 'string') {
      const extractionArray = [...pOriginals, originalKey];
      const isScalar = ExtractScalar(extractionArray, returns);
      if (isScalar?.startsWith('scalar')) {
        const partOfTree = {
          [[...p, k].join(SEPARATOR)]: isScalar,
        };
        return partOfTree;
      }
      return {};
    }
    if (Array.isArray(o)) {
      return ibb(k, k, o[1], p, pOriginals, false);
    }
    if (k === '__alias') {
      return Object.entries(o)
        .map(([alias, objectUnderAlias]) => {
          if (typeof objectUnderAlias !== 'object' || Array.isArray(objectUnderAlias)) {
            throw new Error(
              'Invalid alias it should be __alias:{ YOUR_ALIAS_NAME: { OPERATION_NAME: { ...selectors }}}',
            );
          }
          const operationName = Object.keys(objectUnderAlias)[0];
          const operation = objectUnderAlias[operationName];
          return ibb(alias, operationName, operation, p, pOriginals, false);
        })
        .reduce((a, b) => ({
          ...a,
          ...b,
        }));
    }
    const keyName = root ? ops[k] : k;
    return Object.entries(o)
      .filter(([k]) => k !== '__directives')
      .map(([k, v]) => {
        // Inline fragments shouldn't be added to the path as they aren't a field
        const isInlineFragment = originalKey.match(/^...\s*on/) != null;
        return ibb(
          k,
          k,
          v,
          isInlineFragment ? p : [...p, purifyGraphQLKey(keyName || k)],
          isInlineFragment ? pOriginals : [...pOriginals, purifyGraphQLKey(originalKey)],
          false,
        );
      })
      .reduce((a, b) => ({
        ...a,
        ...b,
      }));
  };
  return ibb;
};

export const purifyGraphQLKey = (k: string) => k.replace(/\([^)]*\)/g, '').replace(/^[^:]*\:/g, '');

const mapPart = (p: string) => {
  const [isArg, isField] = p.split('<>');
  if (isField) {
    return {
      v: isField,
      __type: 'field',
    } as const;
  }
  return {
    v: isArg,
    __type: 'arg',
  } as const;
};

type Part = ReturnType<typeof mapPart>;

export const ResolveFromPath = (props: AllTypesPropsType, returns: ReturnTypesType, ops: Operations) => {
  const ResolvePropsType = (mappedParts: Part[]) => {
    const oKey = ops[mappedParts[0].v];
    const propsP1 = oKey ? props[oKey] : props[mappedParts[0].v];
    if (propsP1 === 'enum' && mappedParts.length === 1) {
      return 'enum';
    }
    if (typeof propsP1 === 'string' && propsP1.startsWith('scalar.') && mappedParts.length === 1) {
      return propsP1;
    }
    if (typeof propsP1 === 'object') {
      if (mappedParts.length < 2) {
        return 'not';
      }
      const propsP2 = propsP1[mappedParts[1].v];
      if (typeof propsP2 === 'string') {
        return rpp(
          `${propsP2}${SEPARATOR}${mappedParts
            .slice(2)
            .map((mp) => mp.v)
            .join(SEPARATOR)}`,
        );
      }
      if (typeof propsP2 === 'object') {
        if (mappedParts.length < 3) {
          return 'not';
        }
        const propsP3 = propsP2[mappedParts[2].v];
        if (propsP3 && mappedParts[2].__type === 'arg') {
          return rpp(
            `${propsP3}${SEPARATOR}${mappedParts
              .slice(3)
              .map((mp) => mp.v)
              .join(SEPARATOR)}`,
          );
        }
      }
    }
  };
  const ResolveReturnType = (mappedParts: Part[]) => {
    if (mappedParts.length === 0) {
      return 'not';
    }
    const oKey = ops[mappedParts[0].v];
    const returnP1 = oKey ? returns[oKey] : returns[mappedParts[0].v];
    if (typeof returnP1 === 'object') {
      if (mappedParts.length < 2) return 'not';
      const returnP2 = returnP1[mappedParts[1].v];
      if (returnP2) {
        return rpp(
          `${returnP2}${SEPARATOR}${mappedParts
            .slice(2)
            .map((mp) => mp.v)
            .join(SEPARATOR)}`,
        );
      }
    }
  };
  const rpp = (path: string): 'enum' | 'not' | `scalar.${string}` => {
    const parts = path.split(SEPARATOR).filter((l) => l.length > 0);
    const mappedParts = parts.map(mapPart);
    const propsP1 = ResolvePropsType(mappedParts);
    if (propsP1) {
      return propsP1;
    }
    const returnP1 = ResolveReturnType(mappedParts);
    if (returnP1) {
      return returnP1;
    }
    return 'not';
  };
  return rpp;
};

export const InternalArgsBuilt = ({
  props,
  ops,
  returns,
  scalars,
  vars,
}: {
  props: AllTypesPropsType;
  returns: ReturnTypesType;
  ops: Operations;
  scalars?: ScalarDefinition;
  vars: Array<{ name: string; graphQLType: string }>;
}) => {
  const arb = (a: ZeusArgsType, p = '', root = true): string => {
    if (typeof a === 'string') {
      if (a.startsWith(START_VAR_NAME)) {
        const [varName, graphQLType] = a.replace(START_VAR_NAME, '$').split(GRAPHQL_TYPE_SEPARATOR);
        const v = vars.find((v) => v.name === varName);
        if (!v) {
          vars.push({
            name: varName,
            graphQLType,
          });
        } else {
          if (v.graphQLType !== graphQLType) {
            throw new Error(
              `Invalid variable exists with two different GraphQL Types, "${v.graphQLType}" and ${graphQLType}`,
            );
          }
        }
        return varName;
      }
    }
    const checkType = ResolveFromPath(props, returns, ops)(p);
    if (checkType.startsWith('scalar.')) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, ...splittedScalar] = checkType.split('.');
      const scalarKey = splittedScalar.join('.');
      return (scalars?.[scalarKey]?.encode?.(a) as string) || JSON.stringify(a);
    }
    if (Array.isArray(a)) {
      return `[${a.map((arr) => arb(arr, p, false)).join(', ')}]`;
    }
    if (typeof a === 'string') {
      if (checkType === 'enum') {
        return a;
      }
      return `${JSON.stringify(a)}`;
    }
    if (typeof a === 'object') {
      if (a === null) {
        return `null`;
      }
      const returnedObjectString = Object.entries(a)
        .filter(([, v]) => typeof v !== 'undefined')
        .map(([k, v]) => `${k}: ${arb(v, [p, k].join(SEPARATOR), false)}`)
        .join(',\n');
      if (!root) {
        return `{${returnedObjectString}}`;
      }
      return returnedObjectString;
    }
    return `${a}`;
  };
  return arb;
};

export const resolverFor = <X, T extends keyof ResolverInputTypes, Z extends keyof ResolverInputTypes[T]>(
  type: T,
  field: Z,
  fn: (
    args: Required<ResolverInputTypes[T]>[Z] extends [infer Input, any] ? Input : any,
    source: any,
  ) => Z extends keyof ModelTypes[T] ? ModelTypes[T][Z] | Promise<ModelTypes[T][Z]> | X : never,
) => fn as (args?: any, source?: any) => ReturnType<typeof fn>;

export type UnwrapPromise<T> = T extends Promise<infer R> ? R : T;
export type ZeusState<T extends (...args: any[]) => Promise<any>> = NonNullable<UnwrapPromise<ReturnType<T>>>;
export type ZeusHook<
  T extends (...args: any[]) => Record<string, (...args: any[]) => Promise<any>>,
  N extends keyof ReturnType<T>,
> = ZeusState<ReturnType<T>[N]>;

export type WithTypeNameValue<T> = T & {
  __typename?: boolean;
  __directives?: string;
};
export type AliasType<T> = WithTypeNameValue<T> & {
  __alias?: Record<string, WithTypeNameValue<T>>;
};
type DeepAnify<T> = {
  [P in keyof T]?: any;
};
type IsPayLoad<T> = T extends [any, infer PayLoad] ? PayLoad : T;
export type ScalarDefinition = Record<string, ScalarResolver>;

type IsScalar<S, SCLR extends ScalarDefinition> = S extends 'scalar' & { name: infer T }
  ? T extends keyof SCLR
    ? SCLR[T]['decode'] extends (s: unknown) => unknown
      ? ReturnType<SCLR[T]['decode']>
      : unknown
    : unknown
  : S;
type IsArray<T, U, SCLR extends ScalarDefinition> = T extends Array<infer R>
  ? InputType<R, U, SCLR>[]
  : InputType<T, U, SCLR>;
type FlattenArray<T> = T extends Array<infer R> ? R : T;
type BaseZeusResolver = boolean | 1 | string | Variable<any, string>;

type IsInterfaced<SRC extends DeepAnify<DST>, DST, SCLR extends ScalarDefinition> = FlattenArray<SRC> extends
  | ZEUS_INTERFACES
  | ZEUS_UNIONS
  ? {
      [P in keyof SRC]: SRC[P] extends '__union' & infer R
        ? P extends keyof DST
          ? IsArray<R, '__typename' extends keyof DST ? DST[P] & { __typename: true } : DST[P], SCLR>
          : IsArray<R, '__typename' extends keyof DST ? { __typename: true } : Record<string, never>, SCLR>
        : never;
    }[keyof SRC] & {
      [P in keyof Omit<
        Pick<
          SRC,
          {
            [P in keyof DST]: SRC[P] extends '__union' & infer R ? never : P;
          }[keyof DST]
        >,
        '__typename'
      >]: IsPayLoad<DST[P]> extends BaseZeusResolver ? IsScalar<SRC[P], SCLR> : IsArray<SRC[P], DST[P], SCLR>;
    }
  : {
      [P in keyof Pick<SRC, keyof DST>]: IsPayLoad<DST[P]> extends BaseZeusResolver
        ? IsScalar<SRC[P], SCLR>
        : IsArray<SRC[P], DST[P], SCLR>;
    };

export type MapType<SRC, DST, SCLR extends ScalarDefinition> = SRC extends DeepAnify<DST>
  ? IsInterfaced<SRC, DST, SCLR>
  : never;
// eslint-disable-next-line @typescript-eslint/ban-types
export type InputType<SRC, DST, SCLR extends ScalarDefinition = {}> = IsPayLoad<DST> extends { __alias: infer R }
  ? {
      [P in keyof R]: MapType<SRC, R[P], SCLR>[keyof MapType<SRC, R[P], SCLR>];
    } & MapType<SRC, Omit<IsPayLoad<DST>, '__alias'>, SCLR>
  : MapType<SRC, IsPayLoad<DST>, SCLR>;
export type SubscriptionToGraphQL<Z, T, SCLR extends ScalarDefinition> = {
  ws: WebSocket;
  on: (fn: (args: InputType<T, Z, SCLR>) => void) => void;
  off: (fn: (e: { data?: InputType<T, Z, SCLR>; code?: number; reason?: string; message?: string }) => void) => void;
  error: (fn: (e: { data?: InputType<T, Z, SCLR>; errors?: string[] }) => void) => void;
  open: () => void;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type FromSelector<SELECTOR, NAME extends keyof GraphQLTypes, SCLR extends ScalarDefinition = {}> = InputType<
  GraphQLTypes[NAME],
  SELECTOR,
  SCLR
>;

export type ScalarResolver = {
  encode?: (s: unknown) => string;
  decode?: (s: unknown) => unknown;
};

export type SelectionFunction<V> = <Z extends V>(
  t: Z & {
    [P in keyof Z]: P extends keyof V ? Z[P] : never;
  },
) => Z;

type BuiltInVariableTypes = {
  ['String']: string;
  ['Int']: number;
  ['Float']: number;
  ['Boolean']: boolean;
};
type AllVariableTypes = keyof BuiltInVariableTypes | keyof ZEUS_VARIABLES;
type VariableRequired<T extends string> = `${T}!` | T | `[${T}]` | `[${T}]!` | `[${T}!]` | `[${T}!]!`;
type VR<T extends string> = VariableRequired<VariableRequired<T>>;

export type GraphQLVariableType = VR<AllVariableTypes>;

type ExtractVariableTypeString<T extends string> = T extends VR<infer R1>
  ? R1 extends VR<infer R2>
    ? R2 extends VR<infer R3>
      ? R3 extends VR<infer R4>
        ? R4 extends VR<infer R5>
          ? R5
          : R4
        : R3
      : R2
    : R1
  : T;

type DecomposeType<T, Type> = T extends `[${infer R}]`
  ? Array<DecomposeType<R, Type>> | undefined
  : T extends `${infer R}!`
  ? NonNullable<DecomposeType<R, Type>>
  : Type | undefined;

type ExtractTypeFromGraphQLType<T extends string> = T extends keyof ZEUS_VARIABLES
  ? ZEUS_VARIABLES[T]
  : T extends keyof BuiltInVariableTypes
  ? BuiltInVariableTypes[T]
  : any;

export type GetVariableType<T extends string> = DecomposeType<
  T,
  ExtractTypeFromGraphQLType<ExtractVariableTypeString<T>>
>;

type UndefinedKeys<T> = {
  [K in keyof T]-?: T[K] extends NonNullable<T[K]> ? never : K;
}[keyof T];

type WithNullableKeys<T> = Pick<T, UndefinedKeys<T>>;
type WithNonNullableKeys<T> = Omit<T, UndefinedKeys<T>>;

type OptionalKeys<T> = {
  [P in keyof T]?: T[P];
};

export type WithOptionalNullables<T> = OptionalKeys<WithNullableKeys<T>> & WithNonNullableKeys<T>;

export type ComposableSelector<T extends keyof ValueTypes> = ReturnType<SelectionFunction<ValueTypes[T]>>;

export type Variable<T extends GraphQLVariableType, Name extends string> = {
  ' __zeus_name': Name;
  ' __zeus_type': T;
};

export type ExtractVariablesDeep<Query> = Query extends Variable<infer VType, infer VName>
  ? { [key in VName]: GetVariableType<VType> }
  : Query extends string | number | boolean | Array<string | number | boolean>
  ? // eslint-disable-next-line @typescript-eslint/ban-types
    {}
  : UnionToIntersection<{ [K in keyof Query]: WithOptionalNullables<ExtractVariablesDeep<Query[K]>> }[keyof Query]>;

export type ExtractVariables<Query> = Query extends Variable<infer VType, infer VName>
  ? { [key in VName]: GetVariableType<VType> }
  : Query extends [infer Inputs, infer Outputs]
  ? ExtractVariablesDeep<Inputs> & ExtractVariables<Outputs>
  : Query extends string | number | boolean | Array<string | number | boolean>
  ? // eslint-disable-next-line @typescript-eslint/ban-types
    {}
  : UnionToIntersection<{ [K in keyof Query]: WithOptionalNullables<ExtractVariables<Query[K]>> }[keyof Query]>;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export const START_VAR_NAME = `$ZEUS_VAR`;
export const GRAPHQL_TYPE_SEPARATOR = `__$GRAPHQL__`;

export const $ = <Type extends GraphQLVariableType, Name extends string>(name: Name, graphqlType: Type) => {
  return (START_VAR_NAME + name + GRAPHQL_TYPE_SEPARATOR + graphqlType) as unknown as Variable<Type, Name>;
};
type ZEUS_INTERFACES = never
export type ScalarCoders = {
	Date?: ScalarResolver;
	JSONObject?: ScalarResolver;
	Time?: ScalarResolver;
	ID?: ScalarResolver;
}
type ZEUS_UNIONS = never

export type ValueTypes = {
    ["RootQuery"]: AliasType<{
	getAllRoles?:ValueTypes["RolesResponse"],
getRoleById?: [{	id: number | Variable<any, string>},ValueTypes["RoleResponse"]],
	usersList?:ValueTypes["usersListResponse"],
	getProfile?:ValueTypes["getProfileResponse"],
	RestaurantList?:ValueTypes["RestaurantsResponse"],
restaurant?: [{	id?: number | undefined | null | Variable<any, string>},ValueTypes["RestaurantResponse"]],
RBranchList?: [{	restaurant_id?: number | undefined | null | Variable<any, string>},ValueTypes["BranchesResponse"]],
getBranchById?: [{	id?: number | undefined | null | Variable<any, string>},ValueTypes["BranchByIdResponse"]],
getBranchByRestaurantId?: [{	restaurant_id?: number | undefined | null | Variable<any, string>},ValueTypes["getBranchesByRestaurantIdResponse"]],
getCategoryById?: [{	id?: number | undefined | null | Variable<any, string>},ValueTypes["CategoryByIdResponse"]],
	categoryList?:ValueTypes["CategoryListResponse"],
subCategoriesList?: [{	category_id?: number | undefined | null | Variable<any, string>},ValueTypes["SubCategoriesListResponse"]],
getSubcategoryById?: [{	id?: number | undefined | null | Variable<any, string>},ValueTypes["SubCategoryByIdResponse"]],
		__typename?: boolean | `@${string}`
}>;
	["RolesResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The roles data */
	data?:ValueTypes["Role"],
		__typename?: boolean | `@${string}`
}>;
	["Role"]: AliasType<{
	id?:boolean | `@${string}`,
	created_at?:boolean | `@${string}`,
	deleted_at?:boolean | `@${string}`,
	updated_at?:boolean | `@${string}`,
	is_admin?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	permissions?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["Date"]:unknown;
	/** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
["JSONObject"]:unknown;
	["RoleResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The role data */
	data?:ValueTypes["Role"],
		__typename?: boolean | `@${string}`
}>;
	["usersListResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The userslist data */
	data?:ValueTypes["usersList"],
		__typename?: boolean | `@${string}`
}>;
	["usersList"]: AliasType<{
	count?:boolean | `@${string}`,
	rows?:ValueTypes["User"],
		__typename?: boolean | `@${string}`
}>;
	["User"]: AliasType<{
	id?:boolean | `@${string}`,
	username?:boolean | `@${string}`,
	phone?:boolean | `@${string}`,
	gender?:boolean | `@${string}`,
	dob?:boolean | `@${string}`,
	aadhar_card?:boolean | `@${string}`,
	pan_card?:boolean | `@${string}`,
	voter_id?:boolean | `@${string}`,
	first_name?:boolean | `@${string}`,
	last_name?:boolean | `@${string}`,
	email?:boolean | `@${string}`,
	password?:boolean | `@${string}`,
	role_id?:boolean | `@${string}`,
	is_active?:boolean | `@${string}`,
	is_verified?:boolean | `@${string}`,
	profile_picture?:boolean | `@${string}`,
	address?:boolean | `@${string}`,
	city?:boolean | `@${string}`,
	state?:boolean | `@${string}`,
	country?:boolean | `@${string}`,
	zip_code?:boolean | `@${string}`,
	last_login_at?:boolean | `@${string}`,
	login_count?:boolean | `@${string}`,
	device_token?:boolean | `@${string}`,
	wallet_balance?:boolean | `@${string}`,
	referral_code?:boolean | `@${string}`,
	referred_by?:boolean | `@${string}`,
	otp_code?:boolean | `@${string}`,
	otp_expiry?:boolean | `@${string}`,
	blocked_reason?:boolean | `@${string}`,
	language_preference?:boolean | `@${string}`,
	created_at?:boolean | `@${string}`,
	updated_at?:boolean | `@${string}`,
	deleted_at?:boolean | `@${string}`,
	created_by?:boolean | `@${string}`,
	updated_by?:boolean | `@${string}`,
	deleted_by?:boolean | `@${string}`,
	terms_conditions_accepted?:boolean | `@${string}`,
	facebook?:boolean | `@${string}`,
	x?:boolean | `@${string}`,
	linkedin?:boolean | `@${string}`,
	instagram?:boolean | `@${string}`,
	role?:ValueTypes["Role"],
		__typename?: boolean | `@${string}`
}>;
	["getProfileResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The getprofile data */
	data?:ValueTypes["User"],
		__typename?: boolean | `@${string}`
}>;
	["RestaurantsResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The restaurants data */
	data?:ValueTypes["Restaurant"],
		__typename?: boolean | `@${string}`
}>;
	["Restaurant"]: AliasType<{
	id?:boolean | `@${string}`,
	owner_id?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	slug?:boolean | `@${string}`,
	description?:boolean | `@${string}`,
	image?:boolean | `@${string}`,
	email?:boolean | `@${string}`,
	phone_number?:boolean | `@${string}`,
	alternate_phone_number?:boolean | `@${string}`,
	website_url?:boolean | `@${string}`,
	facebook_url?:boolean | `@${string}`,
	instagram_url?:boolean | `@${string}`,
	gst_number?:boolean | `@${string}`,
	status?:boolean | `@${string}`,
	rejection_reason?:boolean | `@${string}`,
	fssai_license_number?:boolean | `@${string}`,
	is_chain?:boolean | `@${string}`,
	founded_year?:boolean | `@${string}`,
	total_branches?:boolean | `@${string}`,
	cuisine_types?:boolean | `@${string}`,
	tags?:boolean | `@${string}`,
	average_rating?:boolean | `@${string}`,
	total_reviews?:boolean | `@${string}`,
	is_verified?:boolean | `@${string}`,
	approval_status?:boolean | `@${string}`,
	approval_notes?:boolean | `@${string}`,
	timezone?:boolean | `@${string}`,
	external_integration_id?:boolean | `@${string}`,
	priority_order?:boolean | `@${string}`,
	visibility_status?:boolean | `@${string}`,
	cancellation_policy?:boolean | `@${string}`,
	created_at?:boolean | `@${string}`,
	updated_at?:boolean | `@${string}`,
	deleted_at?:boolean | `@${string}`,
	created_by?:boolean | `@${string}`,
	updated_by?:boolean | `@${string}`,
	deleted_by?:boolean | `@${string}`,
	account_number?:boolean | `@${string}`,
	upi_id?:boolean | `@${string}`,
	swift_code?:boolean | `@${string}`,
	bank_name?:boolean | `@${string}`,
	bank_branch?:boolean | `@${string}`,
	ifsc_code?:boolean | `@${string}`,
	account_holder_name?:boolean | `@${string}`,
	branches?:ValueTypes["RBranch"],
	branch?:ValueTypes["RBranch"],
	owner?:ValueTypes["User"],
		__typename?: boolean | `@${string}`
}>;
	["RBranch"]: AliasType<{
	id?:boolean | `@${string}`,
	description?:boolean | `@${string}`,
	restaurant_id?:boolean | `@${string}`,
	owner_id?:boolean | `@${string}`,
	manager_id?:boolean | `@${string}`,
	location?:boolean | `@${string}`,
	longitude?:boolean | `@${string}`,
	latitude?:boolean | `@${string}`,
	image?:boolean | `@${string}`,
	email?:boolean | `@${string}`,
	phone_number?:boolean | `@${string}`,
	alternate_phone_number?:boolean | `@${string}`,
	expected_delivery_time?:boolean | `@${string}`,
	average_price_for_one?:boolean | `@${string}`,
	average_price_for_two?:boolean | `@${string}`,
	delivery_charge?:boolean | `@${string}`,
	min_order_value?:boolean | `@${string}`,
	max_order_value?:boolean | `@${string}`,
	packaging_charge?:boolean | `@${string}`,
	rating?:boolean | `@${string}`,
	is_open?:boolean | `@${string}`,
	is_featured?:boolean | `@${string}`,
	is_available_for_delivery?:boolean | `@${string}`,
	is_available_for_pickup?:boolean | `@${string}`,
	is_veg_only?:boolean | `@${string}`,
	opening_time?:boolean | `@${string}`,
	closing_time?:boolean | `@${string}`,
	special_opening_time?:boolean | `@${string}`,
	special_closing_time?:boolean | `@${string}`,
	average_preparation_time?:boolean | `@${string}`,
	slug?:boolean | `@${string}`,
	short_description?:boolean | `@${string}`,
	full_description?:boolean | `@${string}`,
	gst_number?:boolean | `@${string}`,
	fssai_license_number?:boolean | `@${string}`,
	service_radius_km?:boolean | `@${string}`,
	approval_status?:boolean | `@${string}`,
	approval_notes?:boolean | `@${string}`,
	cancellation_policy?:boolean | `@${string}`,
	external_integration_id?:boolean | `@${string}`,
	timezone?:boolean | `@${string}`,
	country?:boolean | `@${string}`,
	state?:boolean | `@${string}`,
	city?:boolean | `@${string}`,
	zip_code?:boolean | `@${string}`,
	landmark?:boolean | `@${string}`,
	block_floor_number?:boolean | `@${string}`,
	nearby_landmark?:boolean | `@${string}`,
	created_at?:boolean | `@${string}`,
	updated_at?:boolean | `@${string}`,
	deleted_at?:boolean | `@${string}`,
	created_by?:boolean | `@${string}`,
	updated_by?:boolean | `@${string}`,
	deleted_by?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["RestaurantResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The restaurant data */
	data?:ValueTypes["Restaurant"],
		__typename?: boolean | `@${string}`
}>;
	["BranchesResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The branches data */
	data?:ValueTypes["Branches"],
		__typename?: boolean | `@${string}`
}>;
	["Branches"]: AliasType<{
	id?:boolean | `@${string}`,
	description?:boolean | `@${string}`,
	restaurant_id?:boolean | `@${string}`,
	owner_id?:boolean | `@${string}`,
	manager_id?:boolean | `@${string}`,
	location?:boolean | `@${string}`,
	longitude?:boolean | `@${string}`,
	latitude?:boolean | `@${string}`,
	image?:boolean | `@${string}`,
	email?:boolean | `@${string}`,
	phone_number?:boolean | `@${string}`,
	alternate_phone_number?:boolean | `@${string}`,
	expected_delivery_time?:boolean | `@${string}`,
	average_price_for_one?:boolean | `@${string}`,
	average_price_for_two?:boolean | `@${string}`,
	delivery_charge?:boolean | `@${string}`,
	min_order_value?:boolean | `@${string}`,
	max_order_value?:boolean | `@${string}`,
	packaging_charge?:boolean | `@${string}`,
	rating?:boolean | `@${string}`,
	is_open?:boolean | `@${string}`,
	is_featured?:boolean | `@${string}`,
	is_available_for_delivery?:boolean | `@${string}`,
	is_available_for_pickup?:boolean | `@${string}`,
	is_veg_only?:boolean | `@${string}`,
	opening_time?:boolean | `@${string}`,
	closing_time?:boolean | `@${string}`,
	special_opening_time?:boolean | `@${string}`,
	special_closing_time?:boolean | `@${string}`,
	average_preparation_time?:boolean | `@${string}`,
	slug?:boolean | `@${string}`,
	short_description?:boolean | `@${string}`,
	full_description?:boolean | `@${string}`,
	gst_number?:boolean | `@${string}`,
	fssai_license_number?:boolean | `@${string}`,
	service_radius_km?:boolean | `@${string}`,
	approval_status?:boolean | `@${string}`,
	approval_notes?:boolean | `@${string}`,
	cancellation_policy?:boolean | `@${string}`,
	external_integration_id?:boolean | `@${string}`,
	timezone?:boolean | `@${string}`,
	country?:boolean | `@${string}`,
	state?:boolean | `@${string}`,
	city?:boolean | `@${string}`,
	zip_code?:boolean | `@${string}`,
	landmark?:boolean | `@${string}`,
	block_floor_number?:boolean | `@${string}`,
	nearby_landmark?:boolean | `@${string}`,
	created_at?:boolean | `@${string}`,
	updated_at?:boolean | `@${string}`,
	deleted_at?:boolean | `@${string}`,
	created_by?:boolean | `@${string}`,
	updated_by?:boolean | `@${string}`,
	deleted_by?:boolean | `@${string}`,
	restaurant?:ValueTypes["Restaurant"],
	owner?:ValueTypes["User"],
	manager?:ValueTypes["User"],
		__typename?: boolean | `@${string}`
}>;
	["BranchByIdResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The branchbyid data */
	data?:ValueTypes["RBranch"],
		__typename?: boolean | `@${string}`
}>;
	["getBranchesByRestaurantIdResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The getbranchesbyrestaurantid data */
	data?:ValueTypes["RBranch"],
		__typename?: boolean | `@${string}`
}>;
	["CategoryByIdResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The categorybyid data */
	data?:ValueTypes["Category"],
		__typename?: boolean | `@${string}`
}>;
	["Category"]: AliasType<{
	id?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	slug?:boolean | `@${string}`,
	short_description?:boolean | `@${string}`,
	long_description?:boolean | `@${string}`,
	image?:boolean | `@${string}`,
	banner_image?:boolean | `@${string}`,
	icon?:boolean | `@${string}`,
	display_order?:boolean | `@${string}`,
	is_featured?:boolean | `@${string}`,
	is_active?:boolean | `@${string}`,
	seo_title?:boolean | `@${string}`,
	seo_description?:boolean | `@${string}`,
	seo_keywords?:boolean | `@${string}`,
	created_at?:boolean | `@${string}`,
	updated_at?:boolean | `@${string}`,
	deleted_at?:boolean | `@${string}`,
	created_by?:boolean | `@${string}`,
	updated_by?:boolean | `@${string}`,
	deleted_by?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["CategoryListResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The categorylist data */
	data?:ValueTypes["categoryList"],
		__typename?: boolean | `@${string}`
}>;
	["categoryList"]: AliasType<{
	count?:boolean | `@${string}`,
	rows?:ValueTypes["Category"],
		__typename?: boolean | `@${string}`
}>;
	["SubCategoriesListResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The subcategorieslist data */
	data?:ValueTypes["SubCategory"],
		__typename?: boolean | `@${string}`
}>;
	["SubCategory"]: AliasType<{
	id?:boolean | `@${string}`,
	category_id?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	slug?:boolean | `@${string}`,
	short_description?:boolean | `@${string}`,
	long_description?:boolean | `@${string}`,
	image?:boolean | `@${string}`,
	banner_image?:boolean | `@${string}`,
	icon?:boolean | `@${string}`,
	display_order?:boolean | `@${string}`,
	is_featured?:boolean | `@${string}`,
	is_active?:boolean | `@${string}`,
	seo_title?:boolean | `@${string}`,
	seo_description?:boolean | `@${string}`,
	seo_keywords?:boolean | `@${string}`,
	created_at?:boolean | `@${string}`,
	updated_at?:boolean | `@${string}`,
	deleted_at?:boolean | `@${string}`,
	created_by?:boolean | `@${string}`,
	updated_by?:boolean | `@${string}`,
	deleted_by?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["SubCategoryByIdResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The subcategorybyid data */
	data?:ValueTypes["SubCategory"],
		__typename?: boolean | `@${string}`
}>;
	["RootMutation"]: AliasType<{
createOrUpdateRole?: [{	name: string | Variable<any, string>,	permissions?: ValueTypes["JSONObject"] | undefined | null | Variable<any, string>},ValueTypes["Role"]],
deleteRole?: [{	id: number | Variable<any, string>},ValueTypes["Role"]],
createUser?: [{	username?: string | undefined | null | Variable<any, string>,	phone?: string | undefined | null | Variable<any, string>,	gender?: string | undefined | null | Variable<any, string>,	dob?: ValueTypes["Date"] | undefined | null | Variable<any, string>,	aadhar_card?: string | undefined | null | Variable<any, string>,	pan_card?: string | undefined | null | Variable<any, string>,	voter_id?: string | undefined | null | Variable<any, string>,	first_name?: string | undefined | null | Variable<any, string>,	last_name?: string | undefined | null | Variable<any, string>,	email?: string | undefined | null | Variable<any, string>,	password?: string | undefined | null | Variable<any, string>,	role_id?: number | undefined | null | Variable<any, string>,	is_active?: boolean | undefined | null | Variable<any, string>,	is_verified?: boolean | undefined | null | Variable<any, string>,	profile_picture?: string | undefined | null | Variable<any, string>,	address?: string | undefined | null | Variable<any, string>,	city?: string | undefined | null | Variable<any, string>,	state?: string | undefined | null | Variable<any, string>,	country?: string | undefined | null | Variable<any, string>,	zip_code?: number | undefined | null | Variable<any, string>,	last_login_at?: ValueTypes["Date"] | undefined | null | Variable<any, string>,	login_count?: number | undefined | null | Variable<any, string>,	device_token?: string | undefined | null | Variable<any, string>,	wallet_balance?: number | undefined | null | Variable<any, string>,	referral_code?: number | undefined | null | Variable<any, string>,	referred_by?: number | undefined | null | Variable<any, string>,	otp_code?: number | undefined | null | Variable<any, string>,	otp_expiry?: ValueTypes["Date"] | undefined | null | Variable<any, string>,	blocked_reason?: string | undefined | null | Variable<any, string>,	language_preference?: string | undefined | null | Variable<any, string>,	terms_conditions_accepted?: boolean | undefined | null | Variable<any, string>,	facebook?: string | undefined | null | Variable<any, string>,	x?: string | undefined | null | Variable<any, string>,	linkedin?: string | undefined | null | Variable<any, string>,	instagram?: string | undefined | null | Variable<any, string>,	role?: ValueTypes["ID"] | undefined | null | Variable<any, string>},ValueTypes["CreateUserResponse"]],
updateUser?: [{	id?: number | undefined | null | Variable<any, string>,	username?: string | undefined | null | Variable<any, string>,	phone?: string | undefined | null | Variable<any, string>,	gender?: string | undefined | null | Variable<any, string>,	dob?: ValueTypes["Date"] | undefined | null | Variable<any, string>,	aadhar_card?: string | undefined | null | Variable<any, string>,	pan_card?: string | undefined | null | Variable<any, string>,	voter_id?: string | undefined | null | Variable<any, string>,	first_name?: string | undefined | null | Variable<any, string>,	last_name?: string | undefined | null | Variable<any, string>,	email?: string | undefined | null | Variable<any, string>,	password?: string | undefined | null | Variable<any, string>,	role_id?: number | undefined | null | Variable<any, string>,	is_active?: boolean | undefined | null | Variable<any, string>,	is_verified?: boolean | undefined | null | Variable<any, string>,	profile_picture?: string | undefined | null | Variable<any, string>,	address?: string | undefined | null | Variable<any, string>,	city?: string | undefined | null | Variable<any, string>,	state?: string | undefined | null | Variable<any, string>,	country?: string | undefined | null | Variable<any, string>,	zip_code?: number | undefined | null | Variable<any, string>,	last_login_at?: ValueTypes["Date"] | undefined | null | Variable<any, string>,	login_count?: number | undefined | null | Variable<any, string>,	device_token?: string | undefined | null | Variable<any, string>,	wallet_balance?: number | undefined | null | Variable<any, string>,	referral_code?: number | undefined | null | Variable<any, string>,	referred_by?: number | undefined | null | Variable<any, string>,	otp_code?: number | undefined | null | Variable<any, string>,	otp_expiry?: ValueTypes["Date"] | undefined | null | Variable<any, string>,	blocked_reason?: string | undefined | null | Variable<any, string>,	language_preference?: string | undefined | null | Variable<any, string>,	terms_conditions_accepted?: boolean | undefined | null | Variable<any, string>,	facebook?: string | undefined | null | Variable<any, string>,	x?: string | undefined | null | Variable<any, string>,	linkedin?: string | undefined | null | Variable<any, string>,	instagram?: string | undefined | null | Variable<any, string>,	role?: ValueTypes["ID"] | undefined | null | Variable<any, string>},ValueTypes["UpdateUserResponse"]],
deleteUser?: [{	id?: number | undefined | null | Variable<any, string>},ValueTypes["DeleteUserResponse"]],
login?: [{	email?: string | undefined | null | Variable<any, string>,	password?: string | undefined | null | Variable<any, string>},ValueTypes["LoginResponse"]],
register?: [{	username?: string | undefined | null | Variable<any, string>,	phone?: string | undefined | null | Variable<any, string>,	gender?: string | undefined | null | Variable<any, string>,	dob?: ValueTypes["Date"] | undefined | null | Variable<any, string>,	aadhar_card?: string | undefined | null | Variable<any, string>,	pan_card?: string | undefined | null | Variable<any, string>,	voter_id?: string | undefined | null | Variable<any, string>,	first_name?: string | undefined | null | Variable<any, string>,	last_name?: string | undefined | null | Variable<any, string>,	email?: string | undefined | null | Variable<any, string>,	password?: string | undefined | null | Variable<any, string>,	role_id?: number | undefined | null | Variable<any, string>,	is_active?: boolean | undefined | null | Variable<any, string>,	is_verified?: boolean | undefined | null | Variable<any, string>,	profile_picture?: string | undefined | null | Variable<any, string>,	address?: string | undefined | null | Variable<any, string>,	city?: string | undefined | null | Variable<any, string>,	state?: string | undefined | null | Variable<any, string>,	country?: string | undefined | null | Variable<any, string>,	zip_code?: number | undefined | null | Variable<any, string>,	last_login_at?: ValueTypes["Date"] | undefined | null | Variable<any, string>,	login_count?: number | undefined | null | Variable<any, string>,	device_token?: string | undefined | null | Variable<any, string>,	wallet_balance?: number | undefined | null | Variable<any, string>,	referral_code?: number | undefined | null | Variable<any, string>,	referred_by?: number | undefined | null | Variable<any, string>,	otp_code?: number | undefined | null | Variable<any, string>,	otp_expiry?: ValueTypes["Date"] | undefined | null | Variable<any, string>,	blocked_reason?: string | undefined | null | Variable<any, string>,	language_preference?: string | undefined | null | Variable<any, string>,	terms_conditions_accepted?: boolean | undefined | null | Variable<any, string>,	facebook?: string | undefined | null | Variable<any, string>,	x?: string | undefined | null | Variable<any, string>,	linkedin?: string | undefined | null | Variable<any, string>,	instagram?: string | undefined | null | Variable<any, string>,	role?: ValueTypes["ID"] | undefined | null | Variable<any, string>},ValueTypes["RegisterResponse"]],
createRestaurant?: [{	owner_id?: number | undefined | null | Variable<any, string>,	name?: string | undefined | null | Variable<any, string>,	slug?: string | undefined | null | Variable<any, string>,	description?: string | undefined | null | Variable<any, string>,	image?: string | undefined | null | Variable<any, string>,	email?: string | undefined | null | Variable<any, string>,	phone_number?: string | undefined | null | Variable<any, string>,	alternate_phone_number?: string | undefined | null | Variable<any, string>,	website_url?: string | undefined | null | Variable<any, string>,	facebook_url?: string | undefined | null | Variable<any, string>,	instagram_url?: string | undefined | null | Variable<any, string>,	gst_number?: string | undefined | null | Variable<any, string>,	fssai_license_number?: string | undefined | null | Variable<any, string>,	is_chain?: boolean | undefined | null | Variable<any, string>,	founded_year?: string | undefined | null | Variable<any, string>,	total_branches?: number | undefined | null | Variable<any, string>,	cuisine_types?: string | undefined | null | Variable<any, string>,	tags?: string | undefined | null | Variable<any, string>,	average_rating?: number | undefined | null | Variable<any, string>,	total_reviews?: number | undefined | null | Variable<any, string>,	is_verified?: boolean | undefined | null | Variable<any, string>,	approval_status?: string | undefined | null | Variable<any, string>,	approval_notes?: string | undefined | null | Variable<any, string>,	timezone?: string | undefined | null | Variable<any, string>,	external_integration_id?: number | undefined | null | Variable<any, string>,	priority_order?: number | undefined | null | Variable<any, string>,	visibility_status?: string | undefined | null | Variable<any, string>,	cancellation_policy?: string | undefined | null | Variable<any, string>,	created_by?: number | undefined | null | Variable<any, string>,	account_number?: string | undefined | null | Variable<any, string>,	upi_id?: string | undefined | null | Variable<any, string>,	swift_code?: string | undefined | null | Variable<any, string>,	bank_name?: string | undefined | null | Variable<any, string>,	bank_branch?: string | undefined | null | Variable<any, string>,	ifsc_code?: string | undefined | null | Variable<any, string>,	account_holder_name?: string | undefined | null | Variable<any, string>,	branches?: Array<ValueTypes["ID"] | undefined | null> | undefined | null | Variable<any, string>,	branch?: ValueTypes["ID"] | undefined | null | Variable<any, string>,	owner?: ValueTypes["ID"] | undefined | null | Variable<any, string>},ValueTypes["RestaurantResponse"]],
updateRestaurant?: [{	id?: number | undefined | null | Variable<any, string>,	owner_id?: number | undefined | null | Variable<any, string>,	name?: string | undefined | null | Variable<any, string>,	slug?: string | undefined | null | Variable<any, string>,	description?: string | undefined | null | Variable<any, string>,	image?: string | undefined | null | Variable<any, string>,	email?: string | undefined | null | Variable<any, string>,	phone_number?: string | undefined | null | Variable<any, string>,	alternate_phone_number?: string | undefined | null | Variable<any, string>,	website_url?: string | undefined | null | Variable<any, string>,	facebook_url?: string | undefined | null | Variable<any, string>,	instagram_url?: string | undefined | null | Variable<any, string>,	gst_number?: string | undefined | null | Variable<any, string>,	status?: string | undefined | null | Variable<any, string>,	rejection_reason?: string | undefined | null | Variable<any, string>,	fssai_license_number?: string | undefined | null | Variable<any, string>,	is_chain?: boolean | undefined | null | Variable<any, string>,	founded_year?: string | undefined | null | Variable<any, string>,	total_branches?: number | undefined | null | Variable<any, string>,	cuisine_types?: string | undefined | null | Variable<any, string>,	tags?: string | undefined | null | Variable<any, string>,	average_rating?: number | undefined | null | Variable<any, string>,	total_reviews?: number | undefined | null | Variable<any, string>,	is_verified?: boolean | undefined | null | Variable<any, string>,	approval_status?: string | undefined | null | Variable<any, string>,	approval_notes?: string | undefined | null | Variable<any, string>,	timezone?: string | undefined | null | Variable<any, string>,	external_integration_id?: number | undefined | null | Variable<any, string>,	priority_order?: number | undefined | null | Variable<any, string>,	visibility_status?: string | undefined | null | Variable<any, string>,	cancellation_policy?: string | undefined | null | Variable<any, string>,	created_at?: ValueTypes["Date"] | undefined | null | Variable<any, string>,	updated_at?: ValueTypes["Date"] | undefined | null | Variable<any, string>,	deleted_at?: ValueTypes["Date"] | undefined | null | Variable<any, string>,	created_by?: number | undefined | null | Variable<any, string>,	updated_by?: number | undefined | null | Variable<any, string>,	deleted_by?: number | undefined | null | Variable<any, string>,	account_number?: string | undefined | null | Variable<any, string>,	upi_id?: string | undefined | null | Variable<any, string>,	swift_code?: string | undefined | null | Variable<any, string>,	bank_name?: string | undefined | null | Variable<any, string>,	bank_branch?: string | undefined | null | Variable<any, string>,	ifsc_code?: string | undefined | null | Variable<any, string>,	account_holder_name?: string | undefined | null | Variable<any, string>,	branches?: Array<ValueTypes["ID"] | undefined | null> | undefined | null | Variable<any, string>,	branch?: ValueTypes["ID"] | undefined | null | Variable<any, string>,	owner?: ValueTypes["ID"] | undefined | null | Variable<any, string>},ValueTypes["RestaurantResponse"]],
createCategory?: [{	id?: number | undefined | null | Variable<any, string>,	name?: string | undefined | null | Variable<any, string>,	slug?: string | undefined | null | Variable<any, string>,	short_description?: string | undefined | null | Variable<any, string>,	long_description?: string | undefined | null | Variable<any, string>,	image?: string | undefined | null | Variable<any, string>,	banner_image?: string | undefined | null | Variable<any, string>,	icon?: string | undefined | null | Variable<any, string>,	display_order?: number | undefined | null | Variable<any, string>,	is_featured?: boolean | undefined | null | Variable<any, string>,	is_active?: boolean | undefined | null | Variable<any, string>,	seo_title?: string | undefined | null | Variable<any, string>,	seo_description?: string | undefined | null | Variable<any, string>,	seo_keywords?: string | undefined | null | Variable<any, string>,	created_at?: ValueTypes["Date"] | undefined | null | Variable<any, string>,	updated_at?: ValueTypes["Date"] | undefined | null | Variable<any, string>,	deleted_at?: ValueTypes["Date"] | undefined | null | Variable<any, string>,	created_by?: number | undefined | null | Variable<any, string>,	updated_by?: number | undefined | null | Variable<any, string>,	deleted_by?: number | undefined | null | Variable<any, string>},ValueTypes["createCategoryResponse"]],
updateCategory?: [{	id?: number | undefined | null | Variable<any, string>,	name?: string | undefined | null | Variable<any, string>,	slug?: string | undefined | null | Variable<any, string>,	short_description?: string | undefined | null | Variable<any, string>,	long_description?: string | undefined | null | Variable<any, string>,	image?: string | undefined | null | Variable<any, string>,	banner_image?: string | undefined | null | Variable<any, string>,	icon?: string | undefined | null | Variable<any, string>,	display_order?: number | undefined | null | Variable<any, string>,	is_featured?: boolean | undefined | null | Variable<any, string>,	is_active?: boolean | undefined | null | Variable<any, string>,	seo_title?: string | undefined | null | Variable<any, string>,	seo_description?: string | undefined | null | Variable<any, string>,	seo_keywords?: string | undefined | null | Variable<any, string>,	created_at?: ValueTypes["Date"] | undefined | null | Variable<any, string>,	updated_at?: ValueTypes["Date"] | undefined | null | Variable<any, string>,	deleted_at?: ValueTypes["Date"] | undefined | null | Variable<any, string>,	created_by?: number | undefined | null | Variable<any, string>,	updated_by?: number | undefined | null | Variable<any, string>,	deleted_by?: number | undefined | null | Variable<any, string>},ValueTypes["updateCategoryResponse"]],
deleteCategory?: [{	id?: number | undefined | null | Variable<any, string>},ValueTypes["deleteCategoryResponse"]],
createSubcategory?: [{	category_id?: number | undefined | null | Variable<any, string>,	name?: string | undefined | null | Variable<any, string>,	slug?: string | undefined | null | Variable<any, string>,	short_description?: string | undefined | null | Variable<any, string>,	long_description?: string | undefined | null | Variable<any, string>,	image?: string | undefined | null | Variable<any, string>,	banner_image?: string | undefined | null | Variable<any, string>,	icon?: string | undefined | null | Variable<any, string>,	display_order?: number | undefined | null | Variable<any, string>,	is_featured?: boolean | undefined | null | Variable<any, string>,	is_active?: boolean | undefined | null | Variable<any, string>,	seo_title?: string | undefined | null | Variable<any, string>,	seo_description?: string | undefined | null | Variable<any, string>,	seo_keywords?: string | undefined | null | Variable<any, string>},ValueTypes["createSubcategoryResponse"]],
updateSubcategory?: [{	id?: number | undefined | null | Variable<any, string>,	category_id?: number | undefined | null | Variable<any, string>,	name?: string | undefined | null | Variable<any, string>,	slug?: string | undefined | null | Variable<any, string>,	short_description?: string | undefined | null | Variable<any, string>,	long_description?: string | undefined | null | Variable<any, string>,	image?: string | undefined | null | Variable<any, string>,	banner_image?: string | undefined | null | Variable<any, string>,	icon?: string | undefined | null | Variable<any, string>,	display_order?: number | undefined | null | Variable<any, string>,	is_featured?: boolean | undefined | null | Variable<any, string>,	is_active?: boolean | undefined | null | Variable<any, string>,	seo_title?: string | undefined | null | Variable<any, string>,	seo_description?: string | undefined | null | Variable<any, string>,	seo_keywords?: string | undefined | null | Variable<any, string>,	created_at?: ValueTypes["Date"] | undefined | null | Variable<any, string>,	updated_at?: ValueTypes["Date"] | undefined | null | Variable<any, string>,	deleted_at?: ValueTypes["Date"] | undefined | null | Variable<any, string>,	created_by?: number | undefined | null | Variable<any, string>,	updated_by?: number | undefined | null | Variable<any, string>,	deleted_by?: number | undefined | null | Variable<any, string>},ValueTypes["updateSubcategoryResponse"]],
deleteSubcategory?: [{	id?: number | undefined | null | Variable<any, string>},ValueTypes["deleteSubcategoryResponse"]],
createBranch?: [{	description?: string | undefined | null | Variable<any, string>,	restaurant_id?: number | undefined | null | Variable<any, string>,	owner_id?: number | undefined | null | Variable<any, string>,	manager_id?: number | undefined | null | Variable<any, string>,	location?: string | undefined | null | Variable<any, string>,	longitude?: number | undefined | null | Variable<any, string>,	latitude?: number | undefined | null | Variable<any, string>,	image?: string | undefined | null | Variable<any, string>,	email?: string | undefined | null | Variable<any, string>,	phone_number?: string | undefined | null | Variable<any, string>,	alternate_phone_number?: string | undefined | null | Variable<any, string>,	expected_delivery_time?: string | undefined | null | Variable<any, string>,	average_price_for_one?: number | undefined | null | Variable<any, string>,	average_price_for_two?: number | undefined | null | Variable<any, string>,	delivery_charge?: number | undefined | null | Variable<any, string>,	min_order_value?: number | undefined | null | Variable<any, string>,	max_order_value?: number | undefined | null | Variable<any, string>,	packaging_charge?: number | undefined | null | Variable<any, string>,	is_open?: boolean | undefined | null | Variable<any, string>,	is_featured?: boolean | undefined | null | Variable<any, string>,	is_available_for_delivery?: boolean | undefined | null | Variable<any, string>,	is_available_for_pickup?: boolean | undefined | null | Variable<any, string>,	is_veg_only?: boolean | undefined | null | Variable<any, string>,	opening_time?: string | undefined | null | Variable<any, string>,	closing_time?: string | undefined | null | Variable<any, string>,	special_opening_time?: string | undefined | null | Variable<any, string>,	special_closing_time?: string | undefined | null | Variable<any, string>,	average_preparation_time?: string | undefined | null | Variable<any, string>,	slug?: string | undefined | null | Variable<any, string>,	short_description?: string | undefined | null | Variable<any, string>,	full_description?: string | undefined | null | Variable<any, string>,	gst_number?: string | undefined | null | Variable<any, string>,	fssai_license_number?: string | undefined | null | Variable<any, string>,	service_radius_km?: number | undefined | null | Variable<any, string>,	approval_status?: string | undefined | null | Variable<any, string>,	approval_notes?: string | undefined | null | Variable<any, string>,	cancellation_policy?: string | undefined | null | Variable<any, string>,	external_integration_id?: string | undefined | null | Variable<any, string>,	timezone?: string | undefined | null | Variable<any, string>,	country?: string | undefined | null | Variable<any, string>,	state?: string | undefined | null | Variable<any, string>,	city?: string | undefined | null | Variable<any, string>,	zip_code?: string | undefined | null | Variable<any, string>,	landmark?: string | undefined | null | Variable<any, string>,	block_floor_number?: number | undefined | null | Variable<any, string>,	nearby_landmark?: string | undefined | null | Variable<any, string>,	created_at?: ValueTypes["Date"] | undefined | null | Variable<any, string>,	updated_at?: ValueTypes["Date"] | undefined | null | Variable<any, string>,	deleted_at?: ValueTypes["Date"] | undefined | null | Variable<any, string>,	created_by?: number | undefined | null | Variable<any, string>,	updated_by?: number | undefined | null | Variable<any, string>,	deleted_by?: number | undefined | null | Variable<any, string>},ValueTypes["createBranchResponse"]],
updateBranch?: [{	id?: number | undefined | null | Variable<any, string>,	description?: string | undefined | null | Variable<any, string>,	restaurant_id?: number | undefined | null | Variable<any, string>,	owner_id?: number | undefined | null | Variable<any, string>,	manager_id?: number | undefined | null | Variable<any, string>,	location?: string | undefined | null | Variable<any, string>,	longitude?: number | undefined | null | Variable<any, string>,	latitude?: number | undefined | null | Variable<any, string>,	image?: string | undefined | null | Variable<any, string>,	email?: string | undefined | null | Variable<any, string>,	phone_number?: string | undefined | null | Variable<any, string>,	alternate_phone_number?: string | undefined | null | Variable<any, string>,	expected_delivery_time?: string | undefined | null | Variable<any, string>,	average_price_for_one?: number | undefined | null | Variable<any, string>,	average_price_for_two?: number | undefined | null | Variable<any, string>,	delivery_charge?: number | undefined | null | Variable<any, string>,	min_order_value?: number | undefined | null | Variable<any, string>,	max_order_value?: number | undefined | null | Variable<any, string>,	packaging_charge?: number | undefined | null | Variable<any, string>,	is_open?: boolean | undefined | null | Variable<any, string>,	is_featured?: boolean | undefined | null | Variable<any, string>,	is_available_for_delivery?: boolean | undefined | null | Variable<any, string>,	is_available_for_pickup?: boolean | undefined | null | Variable<any, string>,	is_veg_only?: boolean | undefined | null | Variable<any, string>,	opening_time?: string | undefined | null | Variable<any, string>,	closing_time?: string | undefined | null | Variable<any, string>,	special_opening_time?: string | undefined | null | Variable<any, string>,	special_closing_time?: string | undefined | null | Variable<any, string>,	average_preparation_time?: string | undefined | null | Variable<any, string>,	slug?: string | undefined | null | Variable<any, string>,	short_description?: string | undefined | null | Variable<any, string>,	full_description?: string | undefined | null | Variable<any, string>,	gst_number?: string | undefined | null | Variable<any, string>,	fssai_license_number?: string | undefined | null | Variable<any, string>,	service_radius_km?: number | undefined | null | Variable<any, string>,	approval_status?: string | undefined | null | Variable<any, string>,	approval_notes?: string | undefined | null | Variable<any, string>,	cancellation_policy?: string | undefined | null | Variable<any, string>,	external_integration_id?: string | undefined | null | Variable<any, string>,	timezone?: string | undefined | null | Variable<any, string>,	country?: string | undefined | null | Variable<any, string>,	state?: string | undefined | null | Variable<any, string>,	city?: string | undefined | null | Variable<any, string>,	zip_code?: string | undefined | null | Variable<any, string>,	landmark?: string | undefined | null | Variable<any, string>,	block_floor_number?: number | undefined | null | Variable<any, string>,	nearby_landmark?: string | undefined | null | Variable<any, string>,	created_at?: ValueTypes["Date"] | undefined | null | Variable<any, string>,	updated_at?: ValueTypes["Date"] | undefined | null | Variable<any, string>,	deleted_at?: ValueTypes["Date"] | undefined | null | Variable<any, string>,	created_by?: number | undefined | null | Variable<any, string>,	updated_by?: number | undefined | null | Variable<any, string>,	deleted_by?: number | undefined | null | Variable<any, string>},ValueTypes["updateBranchResponse"]],
deleteBranch?: [{	id?: number | undefined | null | Variable<any, string>},ValueTypes["deleteBranchResponse"]],
createCDeal?: [{	deal_id?: number | undefined | null | Variable<any, string>,	category_id?: number | undefined | null | Variable<any, string>,	created_at?: ValueTypes["Date"] | undefined | null | Variable<any, string>,	updated_at?: ValueTypes["Date"] | undefined | null | Variable<any, string>},ValueTypes["createCDealResponse"]],
deleteCDeals?: [{	id?: number | undefined | null | Variable<any, string>},ValueTypes["deleteCDealResponse"]],
createRDeal?: [{	deal_id?: number | undefined | null | Variable<any, string>,	restaurant_id?: number | undefined | null | Variable<any, string>,	created_at?: ValueTypes["Date"] | undefined | null | Variable<any, string>,	updated_at?: ValueTypes["Date"] | undefined | null | Variable<any, string>},ValueTypes["createRDealResponse"]],
deleteRDeals?: [{	id?: number | undefined | null | Variable<any, string>},ValueTypes["deleteRDealResponse"]],
createRBDeal?: [{	deal_id?: number | undefined | null | Variable<any, string>,	rbranch_id?: number | undefined | null | Variable<any, string>,	created_at?: ValueTypes["Date"] | undefined | null | Variable<any, string>,	updated_at?: ValueTypes["Date"] | undefined | null | Variable<any, string>},ValueTypes["createRBDealResponse"]],
deleteRBDeal?: [{	id?: number | undefined | null | Variable<any, string>},ValueTypes["deleteRBDealResponse"]],
createDish?: [{	id?: number | undefined | null | Variable<any, string>,	restaurant_id?: number | undefined | null | Variable<any, string>,	branch_id?: number | undefined | null | Variable<any, string>,	category_id?: number | undefined | null | Variable<any, string>,	subcategory_id?: number | undefined | null | Variable<any, string>,	name?: string | undefined | null | Variable<any, string>,	slug?: string | undefined | null | Variable<any, string>,	description?: string | undefined | null | Variable<any, string>,	image?: string | undefined | null | Variable<any, string>,	banner_image?: string | undefined | null | Variable<any, string>,	price?: number | undefined | null | Variable<any, string>,	original_price?: number | undefined | null | Variable<any, string>,	currency?: string | undefined | null | Variable<any, string>,	discount_percentage?: number | undefined | null | Variable<any, string>,	is_available?: boolean | undefined | null | Variable<any, string>,	is_veg?: boolean | undefined | null | Variable<any, string>,	is_customizable?: boolean | undefined | null | Variable<any, string>,	spicy_level?: string | undefined | null | Variable<any, string>,	preparation_time_minutes?: number | undefined | null | Variable<any, string>,	dietary_tags?: ValueTypes["JSONObject"] | undefined | null | Variable<any, string>,	ingredients?: string | undefined | null | Variable<any, string>,	availability_start_time?: ValueTypes["Time"] | undefined | null | Variable<any, string>,	availability_end_time?: ValueTypes["Time"] | undefined | null | Variable<any, string>,	stock_quantity?: number | undefined | null | Variable<any, string>,	min_order_qty?: number | undefined | null | Variable<any, string>,	max_order_qty?: number | undefined | null | Variable<any, string>,	rating?: number | undefined | null | Variable<any, string>,	approval_status?: string | undefined | null | Variable<any, string>,	rejection_reason?: string | undefined | null | Variable<any, string>,	created_at?: ValueTypes["Date"] | undefined | null | Variable<any, string>,	updated_at?: ValueTypes["Date"] | undefined | null | Variable<any, string>,	deleted_at?: ValueTypes["Date"] | undefined | null | Variable<any, string>,	ingredients_options?: Array<ValueTypes["IngredientInput"] | undefined | null> | undefined | null | Variable<any, string>},ValueTypes["createDishResponse"]],
		__typename?: boolean | `@${string}`
}>;
	["CreateUserResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The createuser data */
	data?:ValueTypes["User"],
		__typename?: boolean | `@${string}`
}>;
	["UpdateUserResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The updateuser data */
	data?:ValueTypes["User"],
		__typename?: boolean | `@${string}`
}>;
	["DeleteUserResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["LoginResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	token?:boolean | `@${string}`,
	/** The login data */
	data?:ValueTypes["User"],
		__typename?: boolean | `@${string}`
}>;
	["RegisterResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	token?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["createCategoryResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The createcategory data */
	data?:ValueTypes["Category"],
		__typename?: boolean | `@${string}`
}>;
	["updateCategoryResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The updatecategory data */
	data?:ValueTypes["Category"],
		__typename?: boolean | `@${string}`
}>;
	["deleteCategoryResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["createSubcategoryResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The createsubcategory data */
	data?:ValueTypes["SubCategory"],
		__typename?: boolean | `@${string}`
}>;
	["updateSubcategoryResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The updatesubcategory data */
	data?:ValueTypes["SubCategory"],
		__typename?: boolean | `@${string}`
}>;
	["deleteSubcategoryResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["createBranchResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The createbranch data */
	data?:ValueTypes["RBranch"],
		__typename?: boolean | `@${string}`
}>;
	["updateBranchResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The updatebranch data */
	data?:ValueTypes["RBranch"],
		__typename?: boolean | `@${string}`
}>;
	["deleteBranchResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The deletebranch data */
	data?:ValueTypes["RBranch"],
		__typename?: boolean | `@${string}`
}>;
	["createCDealResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The createcdeal data */
	data?:ValueTypes["CDeals"],
		__typename?: boolean | `@${string}`
}>;
	["CDeals"]: AliasType<{
	id?:boolean | `@${string}`,
	deal_id?:boolean | `@${string}`,
	category_id?:boolean | `@${string}`,
	created_at?:boolean | `@${string}`,
	updated_at?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["deleteCDealResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The deletecdeal data */
	data?:ValueTypes["CDeals"],
		__typename?: boolean | `@${string}`
}>;
	["createRDealResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The createrdeal data */
	data?:ValueTypes["RDeals"],
		__typename?: boolean | `@${string}`
}>;
	["RDeals"]: AliasType<{
	id?:boolean | `@${string}`,
	deal_id?:boolean | `@${string}`,
	restaurant_id?:boolean | `@${string}`,
	created_at?:boolean | `@${string}`,
	updated_at?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["deleteRDealResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The deleterdeal data */
	data?:ValueTypes["RDeals"],
		__typename?: boolean | `@${string}`
}>;
	["createRBDealResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The createrbdeal data */
	data?:ValueTypes["RBDeals"],
		__typename?: boolean | `@${string}`
}>;
	["RBDeals"]: AliasType<{
	id?:boolean | `@${string}`,
	deal_id?:boolean | `@${string}`,
	rbranch_id?:boolean | `@${string}`,
	created_at?:boolean | `@${string}`,
	updated_at?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["deleteRBDealResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The deleterbdeal data */
	data?:ValueTypes["RBDeals"],
		__typename?: boolean | `@${string}`
}>;
	["createDishResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The createdish data */
	data?:ValueTypes["Dish"],
		__typename?: boolean | `@${string}`
}>;
	["Dish"]: AliasType<{
	id?:boolean | `@${string}`,
	restaurant_id?:boolean | `@${string}`,
	branch_id?:boolean | `@${string}`,
	category_id?:boolean | `@${string}`,
	subcategory_id?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	slug?:boolean | `@${string}`,
	description?:boolean | `@${string}`,
	image?:boolean | `@${string}`,
	banner_image?:boolean | `@${string}`,
	price?:boolean | `@${string}`,
	original_price?:boolean | `@${string}`,
	currency?:boolean | `@${string}`,
	discount_percentage?:boolean | `@${string}`,
	is_available?:boolean | `@${string}`,
	is_veg?:boolean | `@${string}`,
	is_customizable?:boolean | `@${string}`,
	spicy_level?:boolean | `@${string}`,
	preparation_time_minutes?:boolean | `@${string}`,
	dietary_tags?:boolean | `@${string}`,
	ingredients?:boolean | `@${string}`,
	availability_start_time?:boolean | `@${string}`,
	availability_end_time?:boolean | `@${string}`,
	stock_quantity?:boolean | `@${string}`,
	min_order_qty?:boolean | `@${string}`,
	max_order_qty?:boolean | `@${string}`,
	rating?:boolean | `@${string}`,
	approval_status?:boolean | `@${string}`,
	rejection_reason?:boolean | `@${string}`,
	created_at?:boolean | `@${string}`,
	updated_at?:boolean | `@${string}`,
	deleted_at?:boolean | `@${string}`,
	restaurant?:ValueTypes["Restaurant"],
	branch?:ValueTypes["RBranch"],
	category?:ValueTypes["Category"],
	subcategory?:ValueTypes["SubCategory"],
		__typename?: boolean | `@${string}`
}>;
	/** Time custom scalar, formatted as HH:mm */
["Time"]:unknown;
	["IngredientInput"]: {
	name?: string | undefined | null | Variable<any, string>,
	image_url?: string | undefined | null | Variable<any, string>,
	has_options?: boolean | undefined | null | Variable<any, string>,
	created_at?: ValueTypes["Date"] | undefined | null | Variable<any, string>,
	updated_at?: ValueTypes["Date"] | undefined | null | Variable<any, string>,
	options?: Array<ValueTypes["DIOptionInput"] | undefined | null> | undefined | null | Variable<any, string>
};
	["DIOptionInput"]: {
	name?: string | undefined | null | Variable<any, string>,
	price?: number | undefined | null | Variable<any, string>,
	description?: string | undefined | null | Variable<any, string>,
	image_url?: string | undefined | null | Variable<any, string>
};
	["ID"]:unknown
  }

export type ResolverInputTypes = {
    ["schema"]: AliasType<{
	query?:ResolverInputTypes["RootQuery"],
	mutation?:ResolverInputTypes["RootMutation"],
		__typename?: boolean | `@${string}`
}>;
	["RootQuery"]: AliasType<{
	getAllRoles?:ResolverInputTypes["RolesResponse"],
getRoleById?: [{	id: number},ResolverInputTypes["RoleResponse"]],
	usersList?:ResolverInputTypes["usersListResponse"],
	getProfile?:ResolverInputTypes["getProfileResponse"],
	RestaurantList?:ResolverInputTypes["RestaurantsResponse"],
restaurant?: [{	id?: number | undefined | null},ResolverInputTypes["RestaurantResponse"]],
RBranchList?: [{	restaurant_id?: number | undefined | null},ResolverInputTypes["BranchesResponse"]],
getBranchById?: [{	id?: number | undefined | null},ResolverInputTypes["BranchByIdResponse"]],
getBranchByRestaurantId?: [{	restaurant_id?: number | undefined | null},ResolverInputTypes["getBranchesByRestaurantIdResponse"]],
getCategoryById?: [{	id?: number | undefined | null},ResolverInputTypes["CategoryByIdResponse"]],
	categoryList?:ResolverInputTypes["CategoryListResponse"],
subCategoriesList?: [{	category_id?: number | undefined | null},ResolverInputTypes["SubCategoriesListResponse"]],
getSubcategoryById?: [{	id?: number | undefined | null},ResolverInputTypes["SubCategoryByIdResponse"]],
		__typename?: boolean | `@${string}`
}>;
	["RolesResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The roles data */
	data?:ResolverInputTypes["Role"],
		__typename?: boolean | `@${string}`
}>;
	["Role"]: AliasType<{
	id?:boolean | `@${string}`,
	created_at?:boolean | `@${string}`,
	deleted_at?:boolean | `@${string}`,
	updated_at?:boolean | `@${string}`,
	is_admin?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	permissions?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["Date"]:unknown;
	/** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
["JSONObject"]:unknown;
	["RoleResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The role data */
	data?:ResolverInputTypes["Role"],
		__typename?: boolean | `@${string}`
}>;
	["usersListResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The userslist data */
	data?:ResolverInputTypes["usersList"],
		__typename?: boolean | `@${string}`
}>;
	["usersList"]: AliasType<{
	count?:boolean | `@${string}`,
	rows?:ResolverInputTypes["User"],
		__typename?: boolean | `@${string}`
}>;
	["User"]: AliasType<{
	id?:boolean | `@${string}`,
	username?:boolean | `@${string}`,
	phone?:boolean | `@${string}`,
	gender?:boolean | `@${string}`,
	dob?:boolean | `@${string}`,
	aadhar_card?:boolean | `@${string}`,
	pan_card?:boolean | `@${string}`,
	voter_id?:boolean | `@${string}`,
	first_name?:boolean | `@${string}`,
	last_name?:boolean | `@${string}`,
	email?:boolean | `@${string}`,
	password?:boolean | `@${string}`,
	role_id?:boolean | `@${string}`,
	is_active?:boolean | `@${string}`,
	is_verified?:boolean | `@${string}`,
	profile_picture?:boolean | `@${string}`,
	address?:boolean | `@${string}`,
	city?:boolean | `@${string}`,
	state?:boolean | `@${string}`,
	country?:boolean | `@${string}`,
	zip_code?:boolean | `@${string}`,
	last_login_at?:boolean | `@${string}`,
	login_count?:boolean | `@${string}`,
	device_token?:boolean | `@${string}`,
	wallet_balance?:boolean | `@${string}`,
	referral_code?:boolean | `@${string}`,
	referred_by?:boolean | `@${string}`,
	otp_code?:boolean | `@${string}`,
	otp_expiry?:boolean | `@${string}`,
	blocked_reason?:boolean | `@${string}`,
	language_preference?:boolean | `@${string}`,
	created_at?:boolean | `@${string}`,
	updated_at?:boolean | `@${string}`,
	deleted_at?:boolean | `@${string}`,
	created_by?:boolean | `@${string}`,
	updated_by?:boolean | `@${string}`,
	deleted_by?:boolean | `@${string}`,
	terms_conditions_accepted?:boolean | `@${string}`,
	facebook?:boolean | `@${string}`,
	x?:boolean | `@${string}`,
	linkedin?:boolean | `@${string}`,
	instagram?:boolean | `@${string}`,
	role?:ResolverInputTypes["Role"],
		__typename?: boolean | `@${string}`
}>;
	["getProfileResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The getprofile data */
	data?:ResolverInputTypes["User"],
		__typename?: boolean | `@${string}`
}>;
	["RestaurantsResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The restaurants data */
	data?:ResolverInputTypes["Restaurant"],
		__typename?: boolean | `@${string}`
}>;
	["Restaurant"]: AliasType<{
	id?:boolean | `@${string}`,
	owner_id?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	slug?:boolean | `@${string}`,
	description?:boolean | `@${string}`,
	image?:boolean | `@${string}`,
	email?:boolean | `@${string}`,
	phone_number?:boolean | `@${string}`,
	alternate_phone_number?:boolean | `@${string}`,
	website_url?:boolean | `@${string}`,
	facebook_url?:boolean | `@${string}`,
	instagram_url?:boolean | `@${string}`,
	gst_number?:boolean | `@${string}`,
	status?:boolean | `@${string}`,
	rejection_reason?:boolean | `@${string}`,
	fssai_license_number?:boolean | `@${string}`,
	is_chain?:boolean | `@${string}`,
	founded_year?:boolean | `@${string}`,
	total_branches?:boolean | `@${string}`,
	cuisine_types?:boolean | `@${string}`,
	tags?:boolean | `@${string}`,
	average_rating?:boolean | `@${string}`,
	total_reviews?:boolean | `@${string}`,
	is_verified?:boolean | `@${string}`,
	approval_status?:boolean | `@${string}`,
	approval_notes?:boolean | `@${string}`,
	timezone?:boolean | `@${string}`,
	external_integration_id?:boolean | `@${string}`,
	priority_order?:boolean | `@${string}`,
	visibility_status?:boolean | `@${string}`,
	cancellation_policy?:boolean | `@${string}`,
	created_at?:boolean | `@${string}`,
	updated_at?:boolean | `@${string}`,
	deleted_at?:boolean | `@${string}`,
	created_by?:boolean | `@${string}`,
	updated_by?:boolean | `@${string}`,
	deleted_by?:boolean | `@${string}`,
	account_number?:boolean | `@${string}`,
	upi_id?:boolean | `@${string}`,
	swift_code?:boolean | `@${string}`,
	bank_name?:boolean | `@${string}`,
	bank_branch?:boolean | `@${string}`,
	ifsc_code?:boolean | `@${string}`,
	account_holder_name?:boolean | `@${string}`,
	branches?:ResolverInputTypes["RBranch"],
	branch?:ResolverInputTypes["RBranch"],
	owner?:ResolverInputTypes["User"],
		__typename?: boolean | `@${string}`
}>;
	["RBranch"]: AliasType<{
	id?:boolean | `@${string}`,
	description?:boolean | `@${string}`,
	restaurant_id?:boolean | `@${string}`,
	owner_id?:boolean | `@${string}`,
	manager_id?:boolean | `@${string}`,
	location?:boolean | `@${string}`,
	longitude?:boolean | `@${string}`,
	latitude?:boolean | `@${string}`,
	image?:boolean | `@${string}`,
	email?:boolean | `@${string}`,
	phone_number?:boolean | `@${string}`,
	alternate_phone_number?:boolean | `@${string}`,
	expected_delivery_time?:boolean | `@${string}`,
	average_price_for_one?:boolean | `@${string}`,
	average_price_for_two?:boolean | `@${string}`,
	delivery_charge?:boolean | `@${string}`,
	min_order_value?:boolean | `@${string}`,
	max_order_value?:boolean | `@${string}`,
	packaging_charge?:boolean | `@${string}`,
	rating?:boolean | `@${string}`,
	is_open?:boolean | `@${string}`,
	is_featured?:boolean | `@${string}`,
	is_available_for_delivery?:boolean | `@${string}`,
	is_available_for_pickup?:boolean | `@${string}`,
	is_veg_only?:boolean | `@${string}`,
	opening_time?:boolean | `@${string}`,
	closing_time?:boolean | `@${string}`,
	special_opening_time?:boolean | `@${string}`,
	special_closing_time?:boolean | `@${string}`,
	average_preparation_time?:boolean | `@${string}`,
	slug?:boolean | `@${string}`,
	short_description?:boolean | `@${string}`,
	full_description?:boolean | `@${string}`,
	gst_number?:boolean | `@${string}`,
	fssai_license_number?:boolean | `@${string}`,
	service_radius_km?:boolean | `@${string}`,
	approval_status?:boolean | `@${string}`,
	approval_notes?:boolean | `@${string}`,
	cancellation_policy?:boolean | `@${string}`,
	external_integration_id?:boolean | `@${string}`,
	timezone?:boolean | `@${string}`,
	country?:boolean | `@${string}`,
	state?:boolean | `@${string}`,
	city?:boolean | `@${string}`,
	zip_code?:boolean | `@${string}`,
	landmark?:boolean | `@${string}`,
	block_floor_number?:boolean | `@${string}`,
	nearby_landmark?:boolean | `@${string}`,
	created_at?:boolean | `@${string}`,
	updated_at?:boolean | `@${string}`,
	deleted_at?:boolean | `@${string}`,
	created_by?:boolean | `@${string}`,
	updated_by?:boolean | `@${string}`,
	deleted_by?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["RestaurantResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The restaurant data */
	data?:ResolverInputTypes["Restaurant"],
		__typename?: boolean | `@${string}`
}>;
	["BranchesResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The branches data */
	data?:ResolverInputTypes["Branches"],
		__typename?: boolean | `@${string}`
}>;
	["Branches"]: AliasType<{
	id?:boolean | `@${string}`,
	description?:boolean | `@${string}`,
	restaurant_id?:boolean | `@${string}`,
	owner_id?:boolean | `@${string}`,
	manager_id?:boolean | `@${string}`,
	location?:boolean | `@${string}`,
	longitude?:boolean | `@${string}`,
	latitude?:boolean | `@${string}`,
	image?:boolean | `@${string}`,
	email?:boolean | `@${string}`,
	phone_number?:boolean | `@${string}`,
	alternate_phone_number?:boolean | `@${string}`,
	expected_delivery_time?:boolean | `@${string}`,
	average_price_for_one?:boolean | `@${string}`,
	average_price_for_two?:boolean | `@${string}`,
	delivery_charge?:boolean | `@${string}`,
	min_order_value?:boolean | `@${string}`,
	max_order_value?:boolean | `@${string}`,
	packaging_charge?:boolean | `@${string}`,
	rating?:boolean | `@${string}`,
	is_open?:boolean | `@${string}`,
	is_featured?:boolean | `@${string}`,
	is_available_for_delivery?:boolean | `@${string}`,
	is_available_for_pickup?:boolean | `@${string}`,
	is_veg_only?:boolean | `@${string}`,
	opening_time?:boolean | `@${string}`,
	closing_time?:boolean | `@${string}`,
	special_opening_time?:boolean | `@${string}`,
	special_closing_time?:boolean | `@${string}`,
	average_preparation_time?:boolean | `@${string}`,
	slug?:boolean | `@${string}`,
	short_description?:boolean | `@${string}`,
	full_description?:boolean | `@${string}`,
	gst_number?:boolean | `@${string}`,
	fssai_license_number?:boolean | `@${string}`,
	service_radius_km?:boolean | `@${string}`,
	approval_status?:boolean | `@${string}`,
	approval_notes?:boolean | `@${string}`,
	cancellation_policy?:boolean | `@${string}`,
	external_integration_id?:boolean | `@${string}`,
	timezone?:boolean | `@${string}`,
	country?:boolean | `@${string}`,
	state?:boolean | `@${string}`,
	city?:boolean | `@${string}`,
	zip_code?:boolean | `@${string}`,
	landmark?:boolean | `@${string}`,
	block_floor_number?:boolean | `@${string}`,
	nearby_landmark?:boolean | `@${string}`,
	created_at?:boolean | `@${string}`,
	updated_at?:boolean | `@${string}`,
	deleted_at?:boolean | `@${string}`,
	created_by?:boolean | `@${string}`,
	updated_by?:boolean | `@${string}`,
	deleted_by?:boolean | `@${string}`,
	restaurant?:ResolverInputTypes["Restaurant"],
	owner?:ResolverInputTypes["User"],
	manager?:ResolverInputTypes["User"],
		__typename?: boolean | `@${string}`
}>;
	["BranchByIdResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The branchbyid data */
	data?:ResolverInputTypes["RBranch"],
		__typename?: boolean | `@${string}`
}>;
	["getBranchesByRestaurantIdResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The getbranchesbyrestaurantid data */
	data?:ResolverInputTypes["RBranch"],
		__typename?: boolean | `@${string}`
}>;
	["CategoryByIdResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The categorybyid data */
	data?:ResolverInputTypes["Category"],
		__typename?: boolean | `@${string}`
}>;
	["Category"]: AliasType<{
	id?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	slug?:boolean | `@${string}`,
	short_description?:boolean | `@${string}`,
	long_description?:boolean | `@${string}`,
	image?:boolean | `@${string}`,
	banner_image?:boolean | `@${string}`,
	icon?:boolean | `@${string}`,
	display_order?:boolean | `@${string}`,
	is_featured?:boolean | `@${string}`,
	is_active?:boolean | `@${string}`,
	seo_title?:boolean | `@${string}`,
	seo_description?:boolean | `@${string}`,
	seo_keywords?:boolean | `@${string}`,
	created_at?:boolean | `@${string}`,
	updated_at?:boolean | `@${string}`,
	deleted_at?:boolean | `@${string}`,
	created_by?:boolean | `@${string}`,
	updated_by?:boolean | `@${string}`,
	deleted_by?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["CategoryListResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The categorylist data */
	data?:ResolverInputTypes["categoryList"],
		__typename?: boolean | `@${string}`
}>;
	["categoryList"]: AliasType<{
	count?:boolean | `@${string}`,
	rows?:ResolverInputTypes["Category"],
		__typename?: boolean | `@${string}`
}>;
	["SubCategoriesListResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The subcategorieslist data */
	data?:ResolverInputTypes["SubCategory"],
		__typename?: boolean | `@${string}`
}>;
	["SubCategory"]: AliasType<{
	id?:boolean | `@${string}`,
	category_id?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	slug?:boolean | `@${string}`,
	short_description?:boolean | `@${string}`,
	long_description?:boolean | `@${string}`,
	image?:boolean | `@${string}`,
	banner_image?:boolean | `@${string}`,
	icon?:boolean | `@${string}`,
	display_order?:boolean | `@${string}`,
	is_featured?:boolean | `@${string}`,
	is_active?:boolean | `@${string}`,
	seo_title?:boolean | `@${string}`,
	seo_description?:boolean | `@${string}`,
	seo_keywords?:boolean | `@${string}`,
	created_at?:boolean | `@${string}`,
	updated_at?:boolean | `@${string}`,
	deleted_at?:boolean | `@${string}`,
	created_by?:boolean | `@${string}`,
	updated_by?:boolean | `@${string}`,
	deleted_by?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["SubCategoryByIdResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The subcategorybyid data */
	data?:ResolverInputTypes["SubCategory"],
		__typename?: boolean | `@${string}`
}>;
	["RootMutation"]: AliasType<{
createOrUpdateRole?: [{	name: string,	permissions?: ResolverInputTypes["JSONObject"] | undefined | null},ResolverInputTypes["Role"]],
deleteRole?: [{	id: number},ResolverInputTypes["Role"]],
createUser?: [{	username?: string | undefined | null,	phone?: string | undefined | null,	gender?: string | undefined | null,	dob?: ResolverInputTypes["Date"] | undefined | null,	aadhar_card?: string | undefined | null,	pan_card?: string | undefined | null,	voter_id?: string | undefined | null,	first_name?: string | undefined | null,	last_name?: string | undefined | null,	email?: string | undefined | null,	password?: string | undefined | null,	role_id?: number | undefined | null,	is_active?: boolean | undefined | null,	is_verified?: boolean | undefined | null,	profile_picture?: string | undefined | null,	address?: string | undefined | null,	city?: string | undefined | null,	state?: string | undefined | null,	country?: string | undefined | null,	zip_code?: number | undefined | null,	last_login_at?: ResolverInputTypes["Date"] | undefined | null,	login_count?: number | undefined | null,	device_token?: string | undefined | null,	wallet_balance?: number | undefined | null,	referral_code?: number | undefined | null,	referred_by?: number | undefined | null,	otp_code?: number | undefined | null,	otp_expiry?: ResolverInputTypes["Date"] | undefined | null,	blocked_reason?: string | undefined | null,	language_preference?: string | undefined | null,	terms_conditions_accepted?: boolean | undefined | null,	facebook?: string | undefined | null,	x?: string | undefined | null,	linkedin?: string | undefined | null,	instagram?: string | undefined | null,	role?: ResolverInputTypes["ID"] | undefined | null},ResolverInputTypes["CreateUserResponse"]],
updateUser?: [{	id?: number | undefined | null,	username?: string | undefined | null,	phone?: string | undefined | null,	gender?: string | undefined | null,	dob?: ResolverInputTypes["Date"] | undefined | null,	aadhar_card?: string | undefined | null,	pan_card?: string | undefined | null,	voter_id?: string | undefined | null,	first_name?: string | undefined | null,	last_name?: string | undefined | null,	email?: string | undefined | null,	password?: string | undefined | null,	role_id?: number | undefined | null,	is_active?: boolean | undefined | null,	is_verified?: boolean | undefined | null,	profile_picture?: string | undefined | null,	address?: string | undefined | null,	city?: string | undefined | null,	state?: string | undefined | null,	country?: string | undefined | null,	zip_code?: number | undefined | null,	last_login_at?: ResolverInputTypes["Date"] | undefined | null,	login_count?: number | undefined | null,	device_token?: string | undefined | null,	wallet_balance?: number | undefined | null,	referral_code?: number | undefined | null,	referred_by?: number | undefined | null,	otp_code?: number | undefined | null,	otp_expiry?: ResolverInputTypes["Date"] | undefined | null,	blocked_reason?: string | undefined | null,	language_preference?: string | undefined | null,	terms_conditions_accepted?: boolean | undefined | null,	facebook?: string | undefined | null,	x?: string | undefined | null,	linkedin?: string | undefined | null,	instagram?: string | undefined | null,	role?: ResolverInputTypes["ID"] | undefined | null},ResolverInputTypes["UpdateUserResponse"]],
deleteUser?: [{	id?: number | undefined | null},ResolverInputTypes["DeleteUserResponse"]],
login?: [{	email?: string | undefined | null,	password?: string | undefined | null},ResolverInputTypes["LoginResponse"]],
register?: [{	username?: string | undefined | null,	phone?: string | undefined | null,	gender?: string | undefined | null,	dob?: ResolverInputTypes["Date"] | undefined | null,	aadhar_card?: string | undefined | null,	pan_card?: string | undefined | null,	voter_id?: string | undefined | null,	first_name?: string | undefined | null,	last_name?: string | undefined | null,	email?: string | undefined | null,	password?: string | undefined | null,	role_id?: number | undefined | null,	is_active?: boolean | undefined | null,	is_verified?: boolean | undefined | null,	profile_picture?: string | undefined | null,	address?: string | undefined | null,	city?: string | undefined | null,	state?: string | undefined | null,	country?: string | undefined | null,	zip_code?: number | undefined | null,	last_login_at?: ResolverInputTypes["Date"] | undefined | null,	login_count?: number | undefined | null,	device_token?: string | undefined | null,	wallet_balance?: number | undefined | null,	referral_code?: number | undefined | null,	referred_by?: number | undefined | null,	otp_code?: number | undefined | null,	otp_expiry?: ResolverInputTypes["Date"] | undefined | null,	blocked_reason?: string | undefined | null,	language_preference?: string | undefined | null,	terms_conditions_accepted?: boolean | undefined | null,	facebook?: string | undefined | null,	x?: string | undefined | null,	linkedin?: string | undefined | null,	instagram?: string | undefined | null,	role?: ResolverInputTypes["ID"] | undefined | null},ResolverInputTypes["RegisterResponse"]],
createRestaurant?: [{	owner_id?: number | undefined | null,	name?: string | undefined | null,	slug?: string | undefined | null,	description?: string | undefined | null,	image?: string | undefined | null,	email?: string | undefined | null,	phone_number?: string | undefined | null,	alternate_phone_number?: string | undefined | null,	website_url?: string | undefined | null,	facebook_url?: string | undefined | null,	instagram_url?: string | undefined | null,	gst_number?: string | undefined | null,	fssai_license_number?: string | undefined | null,	is_chain?: boolean | undefined | null,	founded_year?: string | undefined | null,	total_branches?: number | undefined | null,	cuisine_types?: string | undefined | null,	tags?: string | undefined | null,	average_rating?: number | undefined | null,	total_reviews?: number | undefined | null,	is_verified?: boolean | undefined | null,	approval_status?: string | undefined | null,	approval_notes?: string | undefined | null,	timezone?: string | undefined | null,	external_integration_id?: number | undefined | null,	priority_order?: number | undefined | null,	visibility_status?: string | undefined | null,	cancellation_policy?: string | undefined | null,	created_by?: number | undefined | null,	account_number?: string | undefined | null,	upi_id?: string | undefined | null,	swift_code?: string | undefined | null,	bank_name?: string | undefined | null,	bank_branch?: string | undefined | null,	ifsc_code?: string | undefined | null,	account_holder_name?: string | undefined | null,	branches?: Array<ResolverInputTypes["ID"] | undefined | null> | undefined | null,	branch?: ResolverInputTypes["ID"] | undefined | null,	owner?: ResolverInputTypes["ID"] | undefined | null},ResolverInputTypes["RestaurantResponse"]],
updateRestaurant?: [{	id?: number | undefined | null,	owner_id?: number | undefined | null,	name?: string | undefined | null,	slug?: string | undefined | null,	description?: string | undefined | null,	image?: string | undefined | null,	email?: string | undefined | null,	phone_number?: string | undefined | null,	alternate_phone_number?: string | undefined | null,	website_url?: string | undefined | null,	facebook_url?: string | undefined | null,	instagram_url?: string | undefined | null,	gst_number?: string | undefined | null,	status?: string | undefined | null,	rejection_reason?: string | undefined | null,	fssai_license_number?: string | undefined | null,	is_chain?: boolean | undefined | null,	founded_year?: string | undefined | null,	total_branches?: number | undefined | null,	cuisine_types?: string | undefined | null,	tags?: string | undefined | null,	average_rating?: number | undefined | null,	total_reviews?: number | undefined | null,	is_verified?: boolean | undefined | null,	approval_status?: string | undefined | null,	approval_notes?: string | undefined | null,	timezone?: string | undefined | null,	external_integration_id?: number | undefined | null,	priority_order?: number | undefined | null,	visibility_status?: string | undefined | null,	cancellation_policy?: string | undefined | null,	created_at?: ResolverInputTypes["Date"] | undefined | null,	updated_at?: ResolverInputTypes["Date"] | undefined | null,	deleted_at?: ResolverInputTypes["Date"] | undefined | null,	created_by?: number | undefined | null,	updated_by?: number | undefined | null,	deleted_by?: number | undefined | null,	account_number?: string | undefined | null,	upi_id?: string | undefined | null,	swift_code?: string | undefined | null,	bank_name?: string | undefined | null,	bank_branch?: string | undefined | null,	ifsc_code?: string | undefined | null,	account_holder_name?: string | undefined | null,	branches?: Array<ResolverInputTypes["ID"] | undefined | null> | undefined | null,	branch?: ResolverInputTypes["ID"] | undefined | null,	owner?: ResolverInputTypes["ID"] | undefined | null},ResolverInputTypes["RestaurantResponse"]],
createCategory?: [{	id?: number | undefined | null,	name?: string | undefined | null,	slug?: string | undefined | null,	short_description?: string | undefined | null,	long_description?: string | undefined | null,	image?: string | undefined | null,	banner_image?: string | undefined | null,	icon?: string | undefined | null,	display_order?: number | undefined | null,	is_featured?: boolean | undefined | null,	is_active?: boolean | undefined | null,	seo_title?: string | undefined | null,	seo_description?: string | undefined | null,	seo_keywords?: string | undefined | null,	created_at?: ResolverInputTypes["Date"] | undefined | null,	updated_at?: ResolverInputTypes["Date"] | undefined | null,	deleted_at?: ResolverInputTypes["Date"] | undefined | null,	created_by?: number | undefined | null,	updated_by?: number | undefined | null,	deleted_by?: number | undefined | null},ResolverInputTypes["createCategoryResponse"]],
updateCategory?: [{	id?: number | undefined | null,	name?: string | undefined | null,	slug?: string | undefined | null,	short_description?: string | undefined | null,	long_description?: string | undefined | null,	image?: string | undefined | null,	banner_image?: string | undefined | null,	icon?: string | undefined | null,	display_order?: number | undefined | null,	is_featured?: boolean | undefined | null,	is_active?: boolean | undefined | null,	seo_title?: string | undefined | null,	seo_description?: string | undefined | null,	seo_keywords?: string | undefined | null,	created_at?: ResolverInputTypes["Date"] | undefined | null,	updated_at?: ResolverInputTypes["Date"] | undefined | null,	deleted_at?: ResolverInputTypes["Date"] | undefined | null,	created_by?: number | undefined | null,	updated_by?: number | undefined | null,	deleted_by?: number | undefined | null},ResolverInputTypes["updateCategoryResponse"]],
deleteCategory?: [{	id?: number | undefined | null},ResolverInputTypes["deleteCategoryResponse"]],
createSubcategory?: [{	category_id?: number | undefined | null,	name?: string | undefined | null,	slug?: string | undefined | null,	short_description?: string | undefined | null,	long_description?: string | undefined | null,	image?: string | undefined | null,	banner_image?: string | undefined | null,	icon?: string | undefined | null,	display_order?: number | undefined | null,	is_featured?: boolean | undefined | null,	is_active?: boolean | undefined | null,	seo_title?: string | undefined | null,	seo_description?: string | undefined | null,	seo_keywords?: string | undefined | null},ResolverInputTypes["createSubcategoryResponse"]],
updateSubcategory?: [{	id?: number | undefined | null,	category_id?: number | undefined | null,	name?: string | undefined | null,	slug?: string | undefined | null,	short_description?: string | undefined | null,	long_description?: string | undefined | null,	image?: string | undefined | null,	banner_image?: string | undefined | null,	icon?: string | undefined | null,	display_order?: number | undefined | null,	is_featured?: boolean | undefined | null,	is_active?: boolean | undefined | null,	seo_title?: string | undefined | null,	seo_description?: string | undefined | null,	seo_keywords?: string | undefined | null,	created_at?: ResolverInputTypes["Date"] | undefined | null,	updated_at?: ResolverInputTypes["Date"] | undefined | null,	deleted_at?: ResolverInputTypes["Date"] | undefined | null,	created_by?: number | undefined | null,	updated_by?: number | undefined | null,	deleted_by?: number | undefined | null},ResolverInputTypes["updateSubcategoryResponse"]],
deleteSubcategory?: [{	id?: number | undefined | null},ResolverInputTypes["deleteSubcategoryResponse"]],
createBranch?: [{	description?: string | undefined | null,	restaurant_id?: number | undefined | null,	owner_id?: number | undefined | null,	manager_id?: number | undefined | null,	location?: string | undefined | null,	longitude?: number | undefined | null,	latitude?: number | undefined | null,	image?: string | undefined | null,	email?: string | undefined | null,	phone_number?: string | undefined | null,	alternate_phone_number?: string | undefined | null,	expected_delivery_time?: string | undefined | null,	average_price_for_one?: number | undefined | null,	average_price_for_two?: number | undefined | null,	delivery_charge?: number | undefined | null,	min_order_value?: number | undefined | null,	max_order_value?: number | undefined | null,	packaging_charge?: number | undefined | null,	is_open?: boolean | undefined | null,	is_featured?: boolean | undefined | null,	is_available_for_delivery?: boolean | undefined | null,	is_available_for_pickup?: boolean | undefined | null,	is_veg_only?: boolean | undefined | null,	opening_time?: string | undefined | null,	closing_time?: string | undefined | null,	special_opening_time?: string | undefined | null,	special_closing_time?: string | undefined | null,	average_preparation_time?: string | undefined | null,	slug?: string | undefined | null,	short_description?: string | undefined | null,	full_description?: string | undefined | null,	gst_number?: string | undefined | null,	fssai_license_number?: string | undefined | null,	service_radius_km?: number | undefined | null,	approval_status?: string | undefined | null,	approval_notes?: string | undefined | null,	cancellation_policy?: string | undefined | null,	external_integration_id?: string | undefined | null,	timezone?: string | undefined | null,	country?: string | undefined | null,	state?: string | undefined | null,	city?: string | undefined | null,	zip_code?: string | undefined | null,	landmark?: string | undefined | null,	block_floor_number?: number | undefined | null,	nearby_landmark?: string | undefined | null,	created_at?: ResolverInputTypes["Date"] | undefined | null,	updated_at?: ResolverInputTypes["Date"] | undefined | null,	deleted_at?: ResolverInputTypes["Date"] | undefined | null,	created_by?: number | undefined | null,	updated_by?: number | undefined | null,	deleted_by?: number | undefined | null},ResolverInputTypes["createBranchResponse"]],
updateBranch?: [{	id?: number | undefined | null,	description?: string | undefined | null,	restaurant_id?: number | undefined | null,	owner_id?: number | undefined | null,	manager_id?: number | undefined | null,	location?: string | undefined | null,	longitude?: number | undefined | null,	latitude?: number | undefined | null,	image?: string | undefined | null,	email?: string | undefined | null,	phone_number?: string | undefined | null,	alternate_phone_number?: string | undefined | null,	expected_delivery_time?: string | undefined | null,	average_price_for_one?: number | undefined | null,	average_price_for_two?: number | undefined | null,	delivery_charge?: number | undefined | null,	min_order_value?: number | undefined | null,	max_order_value?: number | undefined | null,	packaging_charge?: number | undefined | null,	is_open?: boolean | undefined | null,	is_featured?: boolean | undefined | null,	is_available_for_delivery?: boolean | undefined | null,	is_available_for_pickup?: boolean | undefined | null,	is_veg_only?: boolean | undefined | null,	opening_time?: string | undefined | null,	closing_time?: string | undefined | null,	special_opening_time?: string | undefined | null,	special_closing_time?: string | undefined | null,	average_preparation_time?: string | undefined | null,	slug?: string | undefined | null,	short_description?: string | undefined | null,	full_description?: string | undefined | null,	gst_number?: string | undefined | null,	fssai_license_number?: string | undefined | null,	service_radius_km?: number | undefined | null,	approval_status?: string | undefined | null,	approval_notes?: string | undefined | null,	cancellation_policy?: string | undefined | null,	external_integration_id?: string | undefined | null,	timezone?: string | undefined | null,	country?: string | undefined | null,	state?: string | undefined | null,	city?: string | undefined | null,	zip_code?: string | undefined | null,	landmark?: string | undefined | null,	block_floor_number?: number | undefined | null,	nearby_landmark?: string | undefined | null,	created_at?: ResolverInputTypes["Date"] | undefined | null,	updated_at?: ResolverInputTypes["Date"] | undefined | null,	deleted_at?: ResolverInputTypes["Date"] | undefined | null,	created_by?: number | undefined | null,	updated_by?: number | undefined | null,	deleted_by?: number | undefined | null},ResolverInputTypes["updateBranchResponse"]],
deleteBranch?: [{	id?: number | undefined | null},ResolverInputTypes["deleteBranchResponse"]],
createCDeal?: [{	deal_id?: number | undefined | null,	category_id?: number | undefined | null,	created_at?: ResolverInputTypes["Date"] | undefined | null,	updated_at?: ResolverInputTypes["Date"] | undefined | null},ResolverInputTypes["createCDealResponse"]],
deleteCDeals?: [{	id?: number | undefined | null},ResolverInputTypes["deleteCDealResponse"]],
createRDeal?: [{	deal_id?: number | undefined | null,	restaurant_id?: number | undefined | null,	created_at?: ResolverInputTypes["Date"] | undefined | null,	updated_at?: ResolverInputTypes["Date"] | undefined | null},ResolverInputTypes["createRDealResponse"]],
deleteRDeals?: [{	id?: number | undefined | null},ResolverInputTypes["deleteRDealResponse"]],
createRBDeal?: [{	deal_id?: number | undefined | null,	rbranch_id?: number | undefined | null,	created_at?: ResolverInputTypes["Date"] | undefined | null,	updated_at?: ResolverInputTypes["Date"] | undefined | null},ResolverInputTypes["createRBDealResponse"]],
deleteRBDeal?: [{	id?: number | undefined | null},ResolverInputTypes["deleteRBDealResponse"]],
createDish?: [{	id?: number | undefined | null,	restaurant_id?: number | undefined | null,	branch_id?: number | undefined | null,	category_id?: number | undefined | null,	subcategory_id?: number | undefined | null,	name?: string | undefined | null,	slug?: string | undefined | null,	description?: string | undefined | null,	image?: string | undefined | null,	banner_image?: string | undefined | null,	price?: number | undefined | null,	original_price?: number | undefined | null,	currency?: string | undefined | null,	discount_percentage?: number | undefined | null,	is_available?: boolean | undefined | null,	is_veg?: boolean | undefined | null,	is_customizable?: boolean | undefined | null,	spicy_level?: string | undefined | null,	preparation_time_minutes?: number | undefined | null,	dietary_tags?: ResolverInputTypes["JSONObject"] | undefined | null,	ingredients?: string | undefined | null,	availability_start_time?: ResolverInputTypes["Time"] | undefined | null,	availability_end_time?: ResolverInputTypes["Time"] | undefined | null,	stock_quantity?: number | undefined | null,	min_order_qty?: number | undefined | null,	max_order_qty?: number | undefined | null,	rating?: number | undefined | null,	approval_status?: string | undefined | null,	rejection_reason?: string | undefined | null,	created_at?: ResolverInputTypes["Date"] | undefined | null,	updated_at?: ResolverInputTypes["Date"] | undefined | null,	deleted_at?: ResolverInputTypes["Date"] | undefined | null,	ingredients_options?: Array<ResolverInputTypes["IngredientInput"] | undefined | null> | undefined | null},ResolverInputTypes["createDishResponse"]],
		__typename?: boolean | `@${string}`
}>;
	["CreateUserResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The createuser data */
	data?:ResolverInputTypes["User"],
		__typename?: boolean | `@${string}`
}>;
	["UpdateUserResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The updateuser data */
	data?:ResolverInputTypes["User"],
		__typename?: boolean | `@${string}`
}>;
	["DeleteUserResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["LoginResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	token?:boolean | `@${string}`,
	/** The login data */
	data?:ResolverInputTypes["User"],
		__typename?: boolean | `@${string}`
}>;
	["RegisterResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	token?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["createCategoryResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The createcategory data */
	data?:ResolverInputTypes["Category"],
		__typename?: boolean | `@${string}`
}>;
	["updateCategoryResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The updatecategory data */
	data?:ResolverInputTypes["Category"],
		__typename?: boolean | `@${string}`
}>;
	["deleteCategoryResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["createSubcategoryResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The createsubcategory data */
	data?:ResolverInputTypes["SubCategory"],
		__typename?: boolean | `@${string}`
}>;
	["updateSubcategoryResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The updatesubcategory data */
	data?:ResolverInputTypes["SubCategory"],
		__typename?: boolean | `@${string}`
}>;
	["deleteSubcategoryResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["createBranchResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The createbranch data */
	data?:ResolverInputTypes["RBranch"],
		__typename?: boolean | `@${string}`
}>;
	["updateBranchResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The updatebranch data */
	data?:ResolverInputTypes["RBranch"],
		__typename?: boolean | `@${string}`
}>;
	["deleteBranchResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The deletebranch data */
	data?:ResolverInputTypes["RBranch"],
		__typename?: boolean | `@${string}`
}>;
	["createCDealResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The createcdeal data */
	data?:ResolverInputTypes["CDeals"],
		__typename?: boolean | `@${string}`
}>;
	["CDeals"]: AliasType<{
	id?:boolean | `@${string}`,
	deal_id?:boolean | `@${string}`,
	category_id?:boolean | `@${string}`,
	created_at?:boolean | `@${string}`,
	updated_at?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["deleteCDealResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The deletecdeal data */
	data?:ResolverInputTypes["CDeals"],
		__typename?: boolean | `@${string}`
}>;
	["createRDealResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The createrdeal data */
	data?:ResolverInputTypes["RDeals"],
		__typename?: boolean | `@${string}`
}>;
	["RDeals"]: AliasType<{
	id?:boolean | `@${string}`,
	deal_id?:boolean | `@${string}`,
	restaurant_id?:boolean | `@${string}`,
	created_at?:boolean | `@${string}`,
	updated_at?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["deleteRDealResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The deleterdeal data */
	data?:ResolverInputTypes["RDeals"],
		__typename?: boolean | `@${string}`
}>;
	["createRBDealResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The createrbdeal data */
	data?:ResolverInputTypes["RBDeals"],
		__typename?: boolean | `@${string}`
}>;
	["RBDeals"]: AliasType<{
	id?:boolean | `@${string}`,
	deal_id?:boolean | `@${string}`,
	rbranch_id?:boolean | `@${string}`,
	created_at?:boolean | `@${string}`,
	updated_at?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["deleteRBDealResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The deleterbdeal data */
	data?:ResolverInputTypes["RBDeals"],
		__typename?: boolean | `@${string}`
}>;
	["createDishResponse"]: AliasType<{
	status?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	isToast?:boolean | `@${string}`,
	isError?:boolean | `@${string}`,
	message?:boolean | `@${string}`,
	/** The createdish data */
	data?:ResolverInputTypes["Dish"],
		__typename?: boolean | `@${string}`
}>;
	["Dish"]: AliasType<{
	id?:boolean | `@${string}`,
	restaurant_id?:boolean | `@${string}`,
	branch_id?:boolean | `@${string}`,
	category_id?:boolean | `@${string}`,
	subcategory_id?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	slug?:boolean | `@${string}`,
	description?:boolean | `@${string}`,
	image?:boolean | `@${string}`,
	banner_image?:boolean | `@${string}`,
	price?:boolean | `@${string}`,
	original_price?:boolean | `@${string}`,
	currency?:boolean | `@${string}`,
	discount_percentage?:boolean | `@${string}`,
	is_available?:boolean | `@${string}`,
	is_veg?:boolean | `@${string}`,
	is_customizable?:boolean | `@${string}`,
	spicy_level?:boolean | `@${string}`,
	preparation_time_minutes?:boolean | `@${string}`,
	dietary_tags?:boolean | `@${string}`,
	ingredients?:boolean | `@${string}`,
	availability_start_time?:boolean | `@${string}`,
	availability_end_time?:boolean | `@${string}`,
	stock_quantity?:boolean | `@${string}`,
	min_order_qty?:boolean | `@${string}`,
	max_order_qty?:boolean | `@${string}`,
	rating?:boolean | `@${string}`,
	approval_status?:boolean | `@${string}`,
	rejection_reason?:boolean | `@${string}`,
	created_at?:boolean | `@${string}`,
	updated_at?:boolean | `@${string}`,
	deleted_at?:boolean | `@${string}`,
	restaurant?:ResolverInputTypes["Restaurant"],
	branch?:ResolverInputTypes["RBranch"],
	category?:ResolverInputTypes["Category"],
	subcategory?:ResolverInputTypes["SubCategory"],
		__typename?: boolean | `@${string}`
}>;
	/** Time custom scalar, formatted as HH:mm */
["Time"]:unknown;
	["IngredientInput"]: {
	name?: string | undefined | null,
	image_url?: string | undefined | null,
	has_options?: boolean | undefined | null,
	created_at?: ResolverInputTypes["Date"] | undefined | null,
	updated_at?: ResolverInputTypes["Date"] | undefined | null,
	options?: Array<ResolverInputTypes["DIOptionInput"] | undefined | null> | undefined | null
};
	["DIOptionInput"]: {
	name?: string | undefined | null,
	price?: number | undefined | null,
	description?: string | undefined | null,
	image_url?: string | undefined | null
};
	["ID"]:unknown
  }

export type ModelTypes = {
    ["schema"]: {
	query?: ModelTypes["RootQuery"] | undefined | null,
	mutation?: ModelTypes["RootMutation"] | undefined | null
};
	["RootQuery"]: {
		getAllRoles?: ModelTypes["RolesResponse"] | undefined | null,
	getRoleById?: ModelTypes["RoleResponse"] | undefined | null,
	usersList?: ModelTypes["usersListResponse"] | undefined | null,
	getProfile?: ModelTypes["getProfileResponse"] | undefined | null,
	RestaurantList?: ModelTypes["RestaurantsResponse"] | undefined | null,
	restaurant?: ModelTypes["RestaurantResponse"] | undefined | null,
	RBranchList?: ModelTypes["BranchesResponse"] | undefined | null,
	getBranchById?: ModelTypes["BranchByIdResponse"] | undefined | null,
	getBranchByRestaurantId?: ModelTypes["getBranchesByRestaurantIdResponse"] | undefined | null,
	getCategoryById?: ModelTypes["CategoryByIdResponse"] | undefined | null,
	categoryList?: ModelTypes["CategoryListResponse"] | undefined | null,
	subCategoriesList?: ModelTypes["SubCategoriesListResponse"] | undefined | null,
	getSubcategoryById?: ModelTypes["SubCategoryByIdResponse"] | undefined | null
};
	["RolesResponse"]: {
		status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The roles data */
	data?: Array<ModelTypes["Role"] | undefined | null> | undefined | null
};
	["Role"]: {
		id?: number | undefined | null,
	created_at?: ModelTypes["Date"] | undefined | null,
	deleted_at?: ModelTypes["Date"] | undefined | null,
	updated_at?: ModelTypes["Date"] | undefined | null,
	is_admin?: boolean | undefined | null,
	name?: string | undefined | null,
	permissions?: ModelTypes["JSONObject"] | undefined | null
};
	["Date"]:any;
	/** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
["JSONObject"]:any;
	["RoleResponse"]: {
		status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The role data */
	data?: ModelTypes["Role"] | undefined | null
};
	["usersListResponse"]: {
		status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The userslist data */
	data?: ModelTypes["usersList"] | undefined | null
};
	["usersList"]: {
		count?: number | undefined | null,
	rows?: Array<ModelTypes["User"] | undefined | null> | undefined | null
};
	["User"]: {
		id?: number | undefined | null,
	username?: string | undefined | null,
	phone?: string | undefined | null,
	gender?: string | undefined | null,
	dob?: ModelTypes["Date"] | undefined | null,
	aadhar_card?: string | undefined | null,
	pan_card?: string | undefined | null,
	voter_id?: string | undefined | null,
	first_name?: string | undefined | null,
	last_name?: string | undefined | null,
	email?: string | undefined | null,
	password?: string | undefined | null,
	role_id?: number | undefined | null,
	is_active?: boolean | undefined | null,
	is_verified?: boolean | undefined | null,
	profile_picture?: string | undefined | null,
	address?: string | undefined | null,
	city?: string | undefined | null,
	state?: string | undefined | null,
	country?: string | undefined | null,
	zip_code?: number | undefined | null,
	last_login_at?: ModelTypes["Date"] | undefined | null,
	login_count?: number | undefined | null,
	device_token?: string | undefined | null,
	wallet_balance?: number | undefined | null,
	referral_code?: number | undefined | null,
	referred_by?: number | undefined | null,
	otp_code?: number | undefined | null,
	otp_expiry?: ModelTypes["Date"] | undefined | null,
	blocked_reason?: string | undefined | null,
	language_preference?: string | undefined | null,
	created_at?: ModelTypes["Date"] | undefined | null,
	updated_at?: ModelTypes["Date"] | undefined | null,
	deleted_at?: ModelTypes["Date"] | undefined | null,
	created_by?: number | undefined | null,
	updated_by?: number | undefined | null,
	deleted_by?: number | undefined | null,
	terms_conditions_accepted?: boolean | undefined | null,
	facebook?: string | undefined | null,
	x?: string | undefined | null,
	linkedin?: string | undefined | null,
	instagram?: string | undefined | null,
	role?: ModelTypes["Role"] | undefined | null
};
	["getProfileResponse"]: {
		status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The getprofile data */
	data?: ModelTypes["User"] | undefined | null
};
	["RestaurantsResponse"]: {
		status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The restaurants data */
	data?: Array<ModelTypes["Restaurant"] | undefined | null> | undefined | null
};
	["Restaurant"]: {
		id?: number | undefined | null,
	owner_id?: number | undefined | null,
	name?: string | undefined | null,
	slug?: string | undefined | null,
	description?: string | undefined | null,
	image?: string | undefined | null,
	email?: string | undefined | null,
	phone_number?: string | undefined | null,
	alternate_phone_number?: string | undefined | null,
	website_url?: string | undefined | null,
	facebook_url?: string | undefined | null,
	instagram_url?: string | undefined | null,
	gst_number?: string | undefined | null,
	status?: string | undefined | null,
	rejection_reason?: string | undefined | null,
	fssai_license_number?: string | undefined | null,
	is_chain?: boolean | undefined | null,
	founded_year?: string | undefined | null,
	total_branches?: number | undefined | null,
	cuisine_types?: string | undefined | null,
	tags?: string | undefined | null,
	average_rating?: number | undefined | null,
	total_reviews?: number | undefined | null,
	is_verified?: boolean | undefined | null,
	approval_status?: string | undefined | null,
	approval_notes?: string | undefined | null,
	timezone?: string | undefined | null,
	external_integration_id?: number | undefined | null,
	priority_order?: number | undefined | null,
	visibility_status?: string | undefined | null,
	cancellation_policy?: string | undefined | null,
	created_at?: ModelTypes["Date"] | undefined | null,
	updated_at?: ModelTypes["Date"] | undefined | null,
	deleted_at?: ModelTypes["Date"] | undefined | null,
	created_by?: number | undefined | null,
	updated_by?: number | undefined | null,
	deleted_by?: number | undefined | null,
	account_number?: string | undefined | null,
	upi_id?: string | undefined | null,
	swift_code?: string | undefined | null,
	bank_name?: string | undefined | null,
	bank_branch?: string | undefined | null,
	ifsc_code?: string | undefined | null,
	account_holder_name?: string | undefined | null,
	branches?: Array<ModelTypes["RBranch"] | undefined | null> | undefined | null,
	branch?: ModelTypes["RBranch"] | undefined | null,
	owner?: ModelTypes["User"] | undefined | null
};
	["RBranch"]: {
		id?: number | undefined | null,
	description?: string | undefined | null,
	restaurant_id?: number | undefined | null,
	owner_id?: number | undefined | null,
	manager_id?: number | undefined | null,
	location?: string | undefined | null,
	longitude?: number | undefined | null,
	latitude?: number | undefined | null,
	image?: string | undefined | null,
	email?: string | undefined | null,
	phone_number?: string | undefined | null,
	alternate_phone_number?: string | undefined | null,
	expected_delivery_time?: string | undefined | null,
	average_price_for_one?: number | undefined | null,
	average_price_for_two?: number | undefined | null,
	delivery_charge?: number | undefined | null,
	min_order_value?: number | undefined | null,
	max_order_value?: number | undefined | null,
	packaging_charge?: number | undefined | null,
	rating?: number | undefined | null,
	is_open?: boolean | undefined | null,
	is_featured?: boolean | undefined | null,
	is_available_for_delivery?: boolean | undefined | null,
	is_available_for_pickup?: boolean | undefined | null,
	is_veg_only?: boolean | undefined | null,
	opening_time?: string | undefined | null,
	closing_time?: string | undefined | null,
	special_opening_time?: string | undefined | null,
	special_closing_time?: string | undefined | null,
	average_preparation_time?: string | undefined | null,
	slug?: string | undefined | null,
	short_description?: string | undefined | null,
	full_description?: string | undefined | null,
	gst_number?: string | undefined | null,
	fssai_license_number?: string | undefined | null,
	service_radius_km?: number | undefined | null,
	approval_status?: string | undefined | null,
	approval_notes?: string | undefined | null,
	cancellation_policy?: string | undefined | null,
	external_integration_id?: string | undefined | null,
	timezone?: string | undefined | null,
	country?: string | undefined | null,
	state?: string | undefined | null,
	city?: string | undefined | null,
	zip_code?: string | undefined | null,
	landmark?: string | undefined | null,
	block_floor_number?: number | undefined | null,
	nearby_landmark?: string | undefined | null,
	created_at?: ModelTypes["Date"] | undefined | null,
	updated_at?: ModelTypes["Date"] | undefined | null,
	deleted_at?: ModelTypes["Date"] | undefined | null,
	created_by?: number | undefined | null,
	updated_by?: number | undefined | null,
	deleted_by?: number | undefined | null
};
	["RestaurantResponse"]: {
		status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The restaurant data */
	data?: ModelTypes["Restaurant"] | undefined | null
};
	["BranchesResponse"]: {
		status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The branches data */
	data?: Array<ModelTypes["Branches"] | undefined | null> | undefined | null
};
	["Branches"]: {
		id?: number | undefined | null,
	description?: string | undefined | null,
	restaurant_id?: number | undefined | null,
	owner_id?: number | undefined | null,
	manager_id?: number | undefined | null,
	location?: string | undefined | null,
	longitude?: number | undefined | null,
	latitude?: number | undefined | null,
	image?: string | undefined | null,
	email?: string | undefined | null,
	phone_number?: string | undefined | null,
	alternate_phone_number?: string | undefined | null,
	expected_delivery_time?: string | undefined | null,
	average_price_for_one?: number | undefined | null,
	average_price_for_two?: number | undefined | null,
	delivery_charge?: number | undefined | null,
	min_order_value?: number | undefined | null,
	max_order_value?: number | undefined | null,
	packaging_charge?: number | undefined | null,
	rating?: number | undefined | null,
	is_open?: boolean | undefined | null,
	is_featured?: boolean | undefined | null,
	is_available_for_delivery?: boolean | undefined | null,
	is_available_for_pickup?: boolean | undefined | null,
	is_veg_only?: boolean | undefined | null,
	opening_time?: string | undefined | null,
	closing_time?: string | undefined | null,
	special_opening_time?: string | undefined | null,
	special_closing_time?: string | undefined | null,
	average_preparation_time?: string | undefined | null,
	slug?: string | undefined | null,
	short_description?: string | undefined | null,
	full_description?: string | undefined | null,
	gst_number?: string | undefined | null,
	fssai_license_number?: string | undefined | null,
	service_radius_km?: number | undefined | null,
	approval_status?: string | undefined | null,
	approval_notes?: string | undefined | null,
	cancellation_policy?: string | undefined | null,
	external_integration_id?: string | undefined | null,
	timezone?: string | undefined | null,
	country?: string | undefined | null,
	state?: string | undefined | null,
	city?: string | undefined | null,
	zip_code?: string | undefined | null,
	landmark?: string | undefined | null,
	block_floor_number?: number | undefined | null,
	nearby_landmark?: string | undefined | null,
	created_at?: ModelTypes["Date"] | undefined | null,
	updated_at?: ModelTypes["Date"] | undefined | null,
	deleted_at?: ModelTypes["Date"] | undefined | null,
	created_by?: number | undefined | null,
	updated_by?: number | undefined | null,
	deleted_by?: number | undefined | null,
	restaurant?: ModelTypes["Restaurant"] | undefined | null,
	owner?: ModelTypes["User"] | undefined | null,
	manager?: ModelTypes["User"] | undefined | null
};
	["BranchByIdResponse"]: {
		status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The branchbyid data */
	data?: ModelTypes["RBranch"] | undefined | null
};
	["getBranchesByRestaurantIdResponse"]: {
		status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The getbranchesbyrestaurantid data */
	data?: Array<ModelTypes["RBranch"] | undefined | null> | undefined | null
};
	["CategoryByIdResponse"]: {
		status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The categorybyid data */
	data?: ModelTypes["Category"] | undefined | null
};
	["Category"]: {
		id?: number | undefined | null,
	name?: string | undefined | null,
	slug?: string | undefined | null,
	short_description?: string | undefined | null,
	long_description?: string | undefined | null,
	image?: string | undefined | null,
	banner_image?: string | undefined | null,
	icon?: string | undefined | null,
	display_order?: number | undefined | null,
	is_featured?: boolean | undefined | null,
	is_active?: boolean | undefined | null,
	seo_title?: string | undefined | null,
	seo_description?: string | undefined | null,
	seo_keywords?: string | undefined | null,
	created_at?: ModelTypes["Date"] | undefined | null,
	updated_at?: ModelTypes["Date"] | undefined | null,
	deleted_at?: ModelTypes["Date"] | undefined | null,
	created_by?: number | undefined | null,
	updated_by?: number | undefined | null,
	deleted_by?: number | undefined | null
};
	["CategoryListResponse"]: {
		status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The categorylist data */
	data?: ModelTypes["categoryList"] | undefined | null
};
	["categoryList"]: {
		count?: number | undefined | null,
	rows?: Array<ModelTypes["Category"] | undefined | null> | undefined | null
};
	["SubCategoriesListResponse"]: {
		status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The subcategorieslist data */
	data?: Array<ModelTypes["SubCategory"] | undefined | null> | undefined | null
};
	["SubCategory"]: {
		id?: number | undefined | null,
	category_id?: number | undefined | null,
	name?: string | undefined | null,
	slug?: string | undefined | null,
	short_description?: string | undefined | null,
	long_description?: string | undefined | null,
	image?: string | undefined | null,
	banner_image?: string | undefined | null,
	icon?: string | undefined | null,
	display_order?: number | undefined | null,
	is_featured?: boolean | undefined | null,
	is_active?: boolean | undefined | null,
	seo_title?: string | undefined | null,
	seo_description?: string | undefined | null,
	seo_keywords?: string | undefined | null,
	created_at?: ModelTypes["Date"] | undefined | null,
	updated_at?: ModelTypes["Date"] | undefined | null,
	deleted_at?: ModelTypes["Date"] | undefined | null,
	created_by?: number | undefined | null,
	updated_by?: number | undefined | null,
	deleted_by?: number | undefined | null
};
	["SubCategoryByIdResponse"]: {
		status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The subcategorybyid data */
	data?: ModelTypes["SubCategory"] | undefined | null
};
	["RootMutation"]: {
		createOrUpdateRole?: ModelTypes["Role"] | undefined | null,
	deleteRole?: ModelTypes["Role"] | undefined | null,
	createUser?: ModelTypes["CreateUserResponse"] | undefined | null,
	updateUser?: ModelTypes["UpdateUserResponse"] | undefined | null,
	deleteUser?: ModelTypes["DeleteUserResponse"] | undefined | null,
	login?: ModelTypes["LoginResponse"] | undefined | null,
	register?: ModelTypes["RegisterResponse"] | undefined | null,
	createRestaurant?: ModelTypes["RestaurantResponse"] | undefined | null,
	updateRestaurant?: ModelTypes["RestaurantResponse"] | undefined | null,
	createCategory?: ModelTypes["createCategoryResponse"] | undefined | null,
	updateCategory?: ModelTypes["updateCategoryResponse"] | undefined | null,
	deleteCategory?: ModelTypes["deleteCategoryResponse"] | undefined | null,
	createSubcategory?: ModelTypes["createSubcategoryResponse"] | undefined | null,
	updateSubcategory?: ModelTypes["updateSubcategoryResponse"] | undefined | null,
	deleteSubcategory?: ModelTypes["deleteSubcategoryResponse"] | undefined | null,
	createBranch?: ModelTypes["createBranchResponse"] | undefined | null,
	updateBranch?: ModelTypes["updateBranchResponse"] | undefined | null,
	deleteBranch?: ModelTypes["deleteBranchResponse"] | undefined | null,
	createCDeal?: ModelTypes["createCDealResponse"] | undefined | null,
	deleteCDeals?: ModelTypes["deleteCDealResponse"] | undefined | null,
	createRDeal?: ModelTypes["createRDealResponse"] | undefined | null,
	deleteRDeals?: ModelTypes["deleteRDealResponse"] | undefined | null,
	createRBDeal?: ModelTypes["createRBDealResponse"] | undefined | null,
	deleteRBDeal?: ModelTypes["deleteRBDealResponse"] | undefined | null,
	createDish?: ModelTypes["createDishResponse"] | undefined | null
};
	["CreateUserResponse"]: {
		status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The createuser data */
	data?: ModelTypes["User"] | undefined | null
};
	["UpdateUserResponse"]: {
		status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The updateuser data */
	data?: ModelTypes["User"] | undefined | null
};
	["DeleteUserResponse"]: {
		status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null
};
	["LoginResponse"]: {
		status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	token?: string | undefined | null,
	/** The login data */
	data?: ModelTypes["User"] | undefined | null
};
	["RegisterResponse"]: {
		status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	token?: string | undefined | null
};
	["createCategoryResponse"]: {
		status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The createcategory data */
	data?: ModelTypes["Category"] | undefined | null
};
	["updateCategoryResponse"]: {
		status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The updatecategory data */
	data?: ModelTypes["Category"] | undefined | null
};
	["deleteCategoryResponse"]: {
		status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null
};
	["createSubcategoryResponse"]: {
		status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The createsubcategory data */
	data?: ModelTypes["SubCategory"] | undefined | null
};
	["updateSubcategoryResponse"]: {
		status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The updatesubcategory data */
	data?: ModelTypes["SubCategory"] | undefined | null
};
	["deleteSubcategoryResponse"]: {
		status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null
};
	["createBranchResponse"]: {
		status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The createbranch data */
	data?: ModelTypes["RBranch"] | undefined | null
};
	["updateBranchResponse"]: {
		status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The updatebranch data */
	data?: ModelTypes["RBranch"] | undefined | null
};
	["deleteBranchResponse"]: {
		status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The deletebranch data */
	data?: ModelTypes["RBranch"] | undefined | null
};
	["createCDealResponse"]: {
		status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The createcdeal data */
	data?: ModelTypes["CDeals"] | undefined | null
};
	["CDeals"]: {
		id?: number | undefined | null,
	deal_id?: number | undefined | null,
	category_id?: number | undefined | null,
	created_at?: ModelTypes["Date"] | undefined | null,
	updated_at?: ModelTypes["Date"] | undefined | null
};
	["deleteCDealResponse"]: {
		status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The deletecdeal data */
	data?: ModelTypes["CDeals"] | undefined | null
};
	["createRDealResponse"]: {
		status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The createrdeal data */
	data?: ModelTypes["RDeals"] | undefined | null
};
	["RDeals"]: {
		id?: number | undefined | null,
	deal_id?: number | undefined | null,
	restaurant_id?: number | undefined | null,
	created_at?: ModelTypes["Date"] | undefined | null,
	updated_at?: ModelTypes["Date"] | undefined | null
};
	["deleteRDealResponse"]: {
		status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The deleterdeal data */
	data?: ModelTypes["RDeals"] | undefined | null
};
	["createRBDealResponse"]: {
		status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The createrbdeal data */
	data?: ModelTypes["RBDeals"] | undefined | null
};
	["RBDeals"]: {
		id?: number | undefined | null,
	deal_id?: number | undefined | null,
	rbranch_id?: number | undefined | null,
	created_at?: ModelTypes["Date"] | undefined | null,
	updated_at?: ModelTypes["Date"] | undefined | null
};
	["deleteRBDealResponse"]: {
		status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The deleterbdeal data */
	data?: ModelTypes["RBDeals"] | undefined | null
};
	["createDishResponse"]: {
		status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The createdish data */
	data?: ModelTypes["Dish"] | undefined | null
};
	["Dish"]: {
		id?: number | undefined | null,
	restaurant_id?: number | undefined | null,
	branch_id?: number | undefined | null,
	category_id?: number | undefined | null,
	subcategory_id?: number | undefined | null,
	name?: string | undefined | null,
	slug?: string | undefined | null,
	description?: string | undefined | null,
	image?: string | undefined | null,
	banner_image?: string | undefined | null,
	price?: number | undefined | null,
	original_price?: number | undefined | null,
	currency?: string | undefined | null,
	discount_percentage?: number | undefined | null,
	is_available?: boolean | undefined | null,
	is_veg?: boolean | undefined | null,
	is_customizable?: boolean | undefined | null,
	spicy_level?: string | undefined | null,
	preparation_time_minutes?: number | undefined | null,
	dietary_tags?: ModelTypes["JSONObject"] | undefined | null,
	ingredients?: string | undefined | null,
	availability_start_time?: ModelTypes["Time"] | undefined | null,
	availability_end_time?: ModelTypes["Time"] | undefined | null,
	stock_quantity?: number | undefined | null,
	min_order_qty?: number | undefined | null,
	max_order_qty?: number | undefined | null,
	rating?: number | undefined | null,
	approval_status?: string | undefined | null,
	rejection_reason?: string | undefined | null,
	created_at?: ModelTypes["Date"] | undefined | null,
	updated_at?: ModelTypes["Date"] | undefined | null,
	deleted_at?: ModelTypes["Date"] | undefined | null,
	restaurant?: ModelTypes["Restaurant"] | undefined | null,
	branch?: ModelTypes["RBranch"] | undefined | null,
	category?: ModelTypes["Category"] | undefined | null,
	subcategory?: ModelTypes["SubCategory"] | undefined | null
};
	/** Time custom scalar, formatted as HH:mm */
["Time"]:any;
	["IngredientInput"]: {
	name?: string | undefined | null,
	image_url?: string | undefined | null,
	has_options?: boolean | undefined | null,
	created_at?: ModelTypes["Date"] | undefined | null,
	updated_at?: ModelTypes["Date"] | undefined | null,
	options?: Array<ModelTypes["DIOptionInput"] | undefined | null> | undefined | null
};
	["DIOptionInput"]: {
	name?: string | undefined | null,
	price?: number | undefined | null,
	description?: string | undefined | null,
	image_url?: string | undefined | null
};
	["ID"]:any
    }

export type GraphQLTypes = {
    ["RootQuery"]: {
	__typename: "RootQuery",
	getAllRoles?: GraphQLTypes["RolesResponse"] | undefined | null,
	getRoleById?: GraphQLTypes["RoleResponse"] | undefined | null,
	usersList?: GraphQLTypes["usersListResponse"] | undefined | null,
	getProfile?: GraphQLTypes["getProfileResponse"] | undefined | null,
	RestaurantList?: GraphQLTypes["RestaurantsResponse"] | undefined | null,
	restaurant?: GraphQLTypes["RestaurantResponse"] | undefined | null,
	RBranchList?: GraphQLTypes["BranchesResponse"] | undefined | null,
	getBranchById?: GraphQLTypes["BranchByIdResponse"] | undefined | null,
	getBranchByRestaurantId?: GraphQLTypes["getBranchesByRestaurantIdResponse"] | undefined | null,
	getCategoryById?: GraphQLTypes["CategoryByIdResponse"] | undefined | null,
	categoryList?: GraphQLTypes["CategoryListResponse"] | undefined | null,
	subCategoriesList?: GraphQLTypes["SubCategoriesListResponse"] | undefined | null,
	getSubcategoryById?: GraphQLTypes["SubCategoryByIdResponse"] | undefined | null
};
	["RolesResponse"]: {
	__typename: "RolesResponse",
	status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The roles data */
	data?: Array<GraphQLTypes["Role"] | undefined | null> | undefined | null
};
	["Role"]: {
	__typename: "Role",
	id?: number | undefined | null,
	created_at?: GraphQLTypes["Date"] | undefined | null,
	deleted_at?: GraphQLTypes["Date"] | undefined | null,
	updated_at?: GraphQLTypes["Date"] | undefined | null,
	is_admin?: boolean | undefined | null,
	name?: string | undefined | null,
	permissions?: GraphQLTypes["JSONObject"] | undefined | null
};
	["Date"]: "scalar" & { name: "Date" };
	/** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
["JSONObject"]: "scalar" & { name: "JSONObject" };
	["RoleResponse"]: {
	__typename: "RoleResponse",
	status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The role data */
	data?: GraphQLTypes["Role"] | undefined | null
};
	["usersListResponse"]: {
	__typename: "usersListResponse",
	status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The userslist data */
	data?: GraphQLTypes["usersList"] | undefined | null
};
	["usersList"]: {
	__typename: "usersList",
	count?: number | undefined | null,
	rows?: Array<GraphQLTypes["User"] | undefined | null> | undefined | null
};
	["User"]: {
	__typename: "User",
	id?: number | undefined | null,
	username?: string | undefined | null,
	phone?: string | undefined | null,
	gender?: string | undefined | null,
	dob?: GraphQLTypes["Date"] | undefined | null,
	aadhar_card?: string | undefined | null,
	pan_card?: string | undefined | null,
	voter_id?: string | undefined | null,
	first_name?: string | undefined | null,
	last_name?: string | undefined | null,
	email?: string | undefined | null,
	password?: string | undefined | null,
	role_id?: number | undefined | null,
	is_active?: boolean | undefined | null,
	is_verified?: boolean | undefined | null,
	profile_picture?: string | undefined | null,
	address?: string | undefined | null,
	city?: string | undefined | null,
	state?: string | undefined | null,
	country?: string | undefined | null,
	zip_code?: number | undefined | null,
	last_login_at?: GraphQLTypes["Date"] | undefined | null,
	login_count?: number | undefined | null,
	device_token?: string | undefined | null,
	wallet_balance?: number | undefined | null,
	referral_code?: number | undefined | null,
	referred_by?: number | undefined | null,
	otp_code?: number | undefined | null,
	otp_expiry?: GraphQLTypes["Date"] | undefined | null,
	blocked_reason?: string | undefined | null,
	language_preference?: string | undefined | null,
	created_at?: GraphQLTypes["Date"] | undefined | null,
	updated_at?: GraphQLTypes["Date"] | undefined | null,
	deleted_at?: GraphQLTypes["Date"] | undefined | null,
	created_by?: number | undefined | null,
	updated_by?: number | undefined | null,
	deleted_by?: number | undefined | null,
	terms_conditions_accepted?: boolean | undefined | null,
	facebook?: string | undefined | null,
	x?: string | undefined | null,
	linkedin?: string | undefined | null,
	instagram?: string | undefined | null,
	role?: GraphQLTypes["Role"] | undefined | null
};
	["getProfileResponse"]: {
	__typename: "getProfileResponse",
	status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The getprofile data */
	data?: GraphQLTypes["User"] | undefined | null
};
	["RestaurantsResponse"]: {
	__typename: "RestaurantsResponse",
	status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The restaurants data */
	data?: Array<GraphQLTypes["Restaurant"] | undefined | null> | undefined | null
};
	["Restaurant"]: {
	__typename: "Restaurant",
	id?: number | undefined | null,
	owner_id?: number | undefined | null,
	name?: string | undefined | null,
	slug?: string | undefined | null,
	description?: string | undefined | null,
	image?: string | undefined | null,
	email?: string | undefined | null,
	phone_number?: string | undefined | null,
	alternate_phone_number?: string | undefined | null,
	website_url?: string | undefined | null,
	facebook_url?: string | undefined | null,
	instagram_url?: string | undefined | null,
	gst_number?: string | undefined | null,
	status?: string | undefined | null,
	rejection_reason?: string | undefined | null,
	fssai_license_number?: string | undefined | null,
	is_chain?: boolean | undefined | null,
	founded_year?: string | undefined | null,
	total_branches?: number | undefined | null,
	cuisine_types?: string | undefined | null,
	tags?: string | undefined | null,
	average_rating?: number | undefined | null,
	total_reviews?: number | undefined | null,
	is_verified?: boolean | undefined | null,
	approval_status?: string | undefined | null,
	approval_notes?: string | undefined | null,
	timezone?: string | undefined | null,
	external_integration_id?: number | undefined | null,
	priority_order?: number | undefined | null,
	visibility_status?: string | undefined | null,
	cancellation_policy?: string | undefined | null,
	created_at?: GraphQLTypes["Date"] | undefined | null,
	updated_at?: GraphQLTypes["Date"] | undefined | null,
	deleted_at?: GraphQLTypes["Date"] | undefined | null,
	created_by?: number | undefined | null,
	updated_by?: number | undefined | null,
	deleted_by?: number | undefined | null,
	account_number?: string | undefined | null,
	upi_id?: string | undefined | null,
	swift_code?: string | undefined | null,
	bank_name?: string | undefined | null,
	bank_branch?: string | undefined | null,
	ifsc_code?: string | undefined | null,
	account_holder_name?: string | undefined | null,
	branches?: Array<GraphQLTypes["RBranch"] | undefined | null> | undefined | null,
	branch?: GraphQLTypes["RBranch"] | undefined | null,
	owner?: GraphQLTypes["User"] | undefined | null
};
	["RBranch"]: {
	__typename: "RBranch",
	id?: number | undefined | null,
	description?: string | undefined | null,
	restaurant_id?: number | undefined | null,
	owner_id?: number | undefined | null,
	manager_id?: number | undefined | null,
	location?: string | undefined | null,
	longitude?: number | undefined | null,
	latitude?: number | undefined | null,
	image?: string | undefined | null,
	email?: string | undefined | null,
	phone_number?: string | undefined | null,
	alternate_phone_number?: string | undefined | null,
	expected_delivery_time?: string | undefined | null,
	average_price_for_one?: number | undefined | null,
	average_price_for_two?: number | undefined | null,
	delivery_charge?: number | undefined | null,
	min_order_value?: number | undefined | null,
	max_order_value?: number | undefined | null,
	packaging_charge?: number | undefined | null,
	rating?: number | undefined | null,
	is_open?: boolean | undefined | null,
	is_featured?: boolean | undefined | null,
	is_available_for_delivery?: boolean | undefined | null,
	is_available_for_pickup?: boolean | undefined | null,
	is_veg_only?: boolean | undefined | null,
	opening_time?: string | undefined | null,
	closing_time?: string | undefined | null,
	special_opening_time?: string | undefined | null,
	special_closing_time?: string | undefined | null,
	average_preparation_time?: string | undefined | null,
	slug?: string | undefined | null,
	short_description?: string | undefined | null,
	full_description?: string | undefined | null,
	gst_number?: string | undefined | null,
	fssai_license_number?: string | undefined | null,
	service_radius_km?: number | undefined | null,
	approval_status?: string | undefined | null,
	approval_notes?: string | undefined | null,
	cancellation_policy?: string | undefined | null,
	external_integration_id?: string | undefined | null,
	timezone?: string | undefined | null,
	country?: string | undefined | null,
	state?: string | undefined | null,
	city?: string | undefined | null,
	zip_code?: string | undefined | null,
	landmark?: string | undefined | null,
	block_floor_number?: number | undefined | null,
	nearby_landmark?: string | undefined | null,
	created_at?: GraphQLTypes["Date"] | undefined | null,
	updated_at?: GraphQLTypes["Date"] | undefined | null,
	deleted_at?: GraphQLTypes["Date"] | undefined | null,
	created_by?: number | undefined | null,
	updated_by?: number | undefined | null,
	deleted_by?: number | undefined | null
};
	["RestaurantResponse"]: {
	__typename: "RestaurantResponse",
	status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The restaurant data */
	data?: GraphQLTypes["Restaurant"] | undefined | null
};
	["BranchesResponse"]: {
	__typename: "BranchesResponse",
	status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The branches data */
	data?: Array<GraphQLTypes["Branches"] | undefined | null> | undefined | null
};
	["Branches"]: {
	__typename: "Branches",
	id?: number | undefined | null,
	description?: string | undefined | null,
	restaurant_id?: number | undefined | null,
	owner_id?: number | undefined | null,
	manager_id?: number | undefined | null,
	location?: string | undefined | null,
	longitude?: number | undefined | null,
	latitude?: number | undefined | null,
	image?: string | undefined | null,
	email?: string | undefined | null,
	phone_number?: string | undefined | null,
	alternate_phone_number?: string | undefined | null,
	expected_delivery_time?: string | undefined | null,
	average_price_for_one?: number | undefined | null,
	average_price_for_two?: number | undefined | null,
	delivery_charge?: number | undefined | null,
	min_order_value?: number | undefined | null,
	max_order_value?: number | undefined | null,
	packaging_charge?: number | undefined | null,
	rating?: number | undefined | null,
	is_open?: boolean | undefined | null,
	is_featured?: boolean | undefined | null,
	is_available_for_delivery?: boolean | undefined | null,
	is_available_for_pickup?: boolean | undefined | null,
	is_veg_only?: boolean | undefined | null,
	opening_time?: string | undefined | null,
	closing_time?: string | undefined | null,
	special_opening_time?: string | undefined | null,
	special_closing_time?: string | undefined | null,
	average_preparation_time?: string | undefined | null,
	slug?: string | undefined | null,
	short_description?: string | undefined | null,
	full_description?: string | undefined | null,
	gst_number?: string | undefined | null,
	fssai_license_number?: string | undefined | null,
	service_radius_km?: number | undefined | null,
	approval_status?: string | undefined | null,
	approval_notes?: string | undefined | null,
	cancellation_policy?: string | undefined | null,
	external_integration_id?: string | undefined | null,
	timezone?: string | undefined | null,
	country?: string | undefined | null,
	state?: string | undefined | null,
	city?: string | undefined | null,
	zip_code?: string | undefined | null,
	landmark?: string | undefined | null,
	block_floor_number?: number | undefined | null,
	nearby_landmark?: string | undefined | null,
	created_at?: GraphQLTypes["Date"] | undefined | null,
	updated_at?: GraphQLTypes["Date"] | undefined | null,
	deleted_at?: GraphQLTypes["Date"] | undefined | null,
	created_by?: number | undefined | null,
	updated_by?: number | undefined | null,
	deleted_by?: number | undefined | null,
	restaurant?: GraphQLTypes["Restaurant"] | undefined | null,
	owner?: GraphQLTypes["User"] | undefined | null,
	manager?: GraphQLTypes["User"] | undefined | null
};
	["BranchByIdResponse"]: {
	__typename: "BranchByIdResponse",
	status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The branchbyid data */
	data?: GraphQLTypes["RBranch"] | undefined | null
};
	["getBranchesByRestaurantIdResponse"]: {
	__typename: "getBranchesByRestaurantIdResponse",
	status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The getbranchesbyrestaurantid data */
	data?: Array<GraphQLTypes["RBranch"] | undefined | null> | undefined | null
};
	["CategoryByIdResponse"]: {
	__typename: "CategoryByIdResponse",
	status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The categorybyid data */
	data?: GraphQLTypes["Category"] | undefined | null
};
	["Category"]: {
	__typename: "Category",
	id?: number | undefined | null,
	name?: string | undefined | null,
	slug?: string | undefined | null,
	short_description?: string | undefined | null,
	long_description?: string | undefined | null,
	image?: string | undefined | null,
	banner_image?: string | undefined | null,
	icon?: string | undefined | null,
	display_order?: number | undefined | null,
	is_featured?: boolean | undefined | null,
	is_active?: boolean | undefined | null,
	seo_title?: string | undefined | null,
	seo_description?: string | undefined | null,
	seo_keywords?: string | undefined | null,
	created_at?: GraphQLTypes["Date"] | undefined | null,
	updated_at?: GraphQLTypes["Date"] | undefined | null,
	deleted_at?: GraphQLTypes["Date"] | undefined | null,
	created_by?: number | undefined | null,
	updated_by?: number | undefined | null,
	deleted_by?: number | undefined | null
};
	["CategoryListResponse"]: {
	__typename: "CategoryListResponse",
	status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The categorylist data */
	data?: GraphQLTypes["categoryList"] | undefined | null
};
	["categoryList"]: {
	__typename: "categoryList",
	count?: number | undefined | null,
	rows?: Array<GraphQLTypes["Category"] | undefined | null> | undefined | null
};
	["SubCategoriesListResponse"]: {
	__typename: "SubCategoriesListResponse",
	status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The subcategorieslist data */
	data?: Array<GraphQLTypes["SubCategory"] | undefined | null> | undefined | null
};
	["SubCategory"]: {
	__typename: "SubCategory",
	id?: number | undefined | null,
	category_id?: number | undefined | null,
	name?: string | undefined | null,
	slug?: string | undefined | null,
	short_description?: string | undefined | null,
	long_description?: string | undefined | null,
	image?: string | undefined | null,
	banner_image?: string | undefined | null,
	icon?: string | undefined | null,
	display_order?: number | undefined | null,
	is_featured?: boolean | undefined | null,
	is_active?: boolean | undefined | null,
	seo_title?: string | undefined | null,
	seo_description?: string | undefined | null,
	seo_keywords?: string | undefined | null,
	created_at?: GraphQLTypes["Date"] | undefined | null,
	updated_at?: GraphQLTypes["Date"] | undefined | null,
	deleted_at?: GraphQLTypes["Date"] | undefined | null,
	created_by?: number | undefined | null,
	updated_by?: number | undefined | null,
	deleted_by?: number | undefined | null
};
	["SubCategoryByIdResponse"]: {
	__typename: "SubCategoryByIdResponse",
	status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The subcategorybyid data */
	data?: GraphQLTypes["SubCategory"] | undefined | null
};
	["RootMutation"]: {
	__typename: "RootMutation",
	createOrUpdateRole?: GraphQLTypes["Role"] | undefined | null,
	deleteRole?: GraphQLTypes["Role"] | undefined | null,
	createUser?: GraphQLTypes["CreateUserResponse"] | undefined | null,
	updateUser?: GraphQLTypes["UpdateUserResponse"] | undefined | null,
	deleteUser?: GraphQLTypes["DeleteUserResponse"] | undefined | null,
	login?: GraphQLTypes["LoginResponse"] | undefined | null,
	register?: GraphQLTypes["RegisterResponse"] | undefined | null,
	createRestaurant?: GraphQLTypes["RestaurantResponse"] | undefined | null,
	updateRestaurant?: GraphQLTypes["RestaurantResponse"] | undefined | null,
	createCategory?: GraphQLTypes["createCategoryResponse"] | undefined | null,
	updateCategory?: GraphQLTypes["updateCategoryResponse"] | undefined | null,
	deleteCategory?: GraphQLTypes["deleteCategoryResponse"] | undefined | null,
	createSubcategory?: GraphQLTypes["createSubcategoryResponse"] | undefined | null,
	updateSubcategory?: GraphQLTypes["updateSubcategoryResponse"] | undefined | null,
	deleteSubcategory?: GraphQLTypes["deleteSubcategoryResponse"] | undefined | null,
	createBranch?: GraphQLTypes["createBranchResponse"] | undefined | null,
	updateBranch?: GraphQLTypes["updateBranchResponse"] | undefined | null,
	deleteBranch?: GraphQLTypes["deleteBranchResponse"] | undefined | null,
	createCDeal?: GraphQLTypes["createCDealResponse"] | undefined | null,
	deleteCDeals?: GraphQLTypes["deleteCDealResponse"] | undefined | null,
	createRDeal?: GraphQLTypes["createRDealResponse"] | undefined | null,
	deleteRDeals?: GraphQLTypes["deleteRDealResponse"] | undefined | null,
	createRBDeal?: GraphQLTypes["createRBDealResponse"] | undefined | null,
	deleteRBDeal?: GraphQLTypes["deleteRBDealResponse"] | undefined | null,
	createDish?: GraphQLTypes["createDishResponse"] | undefined | null
};
	["CreateUserResponse"]: {
	__typename: "CreateUserResponse",
	status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The createuser data */
	data?: GraphQLTypes["User"] | undefined | null
};
	["UpdateUserResponse"]: {
	__typename: "UpdateUserResponse",
	status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The updateuser data */
	data?: GraphQLTypes["User"] | undefined | null
};
	["DeleteUserResponse"]: {
	__typename: "DeleteUserResponse",
	status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null
};
	["LoginResponse"]: {
	__typename: "LoginResponse",
	status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	token?: string | undefined | null,
	/** The login data */
	data?: GraphQLTypes["User"] | undefined | null
};
	["RegisterResponse"]: {
	__typename: "RegisterResponse",
	status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	token?: string | undefined | null
};
	["createCategoryResponse"]: {
	__typename: "createCategoryResponse",
	status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The createcategory data */
	data?: GraphQLTypes["Category"] | undefined | null
};
	["updateCategoryResponse"]: {
	__typename: "updateCategoryResponse",
	status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The updatecategory data */
	data?: GraphQLTypes["Category"] | undefined | null
};
	["deleteCategoryResponse"]: {
	__typename: "deleteCategoryResponse",
	status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null
};
	["createSubcategoryResponse"]: {
	__typename: "createSubcategoryResponse",
	status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The createsubcategory data */
	data?: GraphQLTypes["SubCategory"] | undefined | null
};
	["updateSubcategoryResponse"]: {
	__typename: "updateSubcategoryResponse",
	status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The updatesubcategory data */
	data?: GraphQLTypes["SubCategory"] | undefined | null
};
	["deleteSubcategoryResponse"]: {
	__typename: "deleteSubcategoryResponse",
	status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null
};
	["createBranchResponse"]: {
	__typename: "createBranchResponse",
	status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The createbranch data */
	data?: GraphQLTypes["RBranch"] | undefined | null
};
	["updateBranchResponse"]: {
	__typename: "updateBranchResponse",
	status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The updatebranch data */
	data?: GraphQLTypes["RBranch"] | undefined | null
};
	["deleteBranchResponse"]: {
	__typename: "deleteBranchResponse",
	status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The deletebranch data */
	data?: GraphQLTypes["RBranch"] | undefined | null
};
	["createCDealResponse"]: {
	__typename: "createCDealResponse",
	status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The createcdeal data */
	data?: GraphQLTypes["CDeals"] | undefined | null
};
	["CDeals"]: {
	__typename: "CDeals",
	id?: number | undefined | null,
	deal_id?: number | undefined | null,
	category_id?: number | undefined | null,
	created_at?: GraphQLTypes["Date"] | undefined | null,
	updated_at?: GraphQLTypes["Date"] | undefined | null
};
	["deleteCDealResponse"]: {
	__typename: "deleteCDealResponse",
	status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The deletecdeal data */
	data?: GraphQLTypes["CDeals"] | undefined | null
};
	["createRDealResponse"]: {
	__typename: "createRDealResponse",
	status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The createrdeal data */
	data?: GraphQLTypes["RDeals"] | undefined | null
};
	["RDeals"]: {
	__typename: "RDeals",
	id?: number | undefined | null,
	deal_id?: number | undefined | null,
	restaurant_id?: number | undefined | null,
	created_at?: GraphQLTypes["Date"] | undefined | null,
	updated_at?: GraphQLTypes["Date"] | undefined | null
};
	["deleteRDealResponse"]: {
	__typename: "deleteRDealResponse",
	status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The deleterdeal data */
	data?: GraphQLTypes["RDeals"] | undefined | null
};
	["createRBDealResponse"]: {
	__typename: "createRBDealResponse",
	status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The createrbdeal data */
	data?: GraphQLTypes["RBDeals"] | undefined | null
};
	["RBDeals"]: {
	__typename: "RBDeals",
	id?: number | undefined | null,
	deal_id?: number | undefined | null,
	rbranch_id?: number | undefined | null,
	created_at?: GraphQLTypes["Date"] | undefined | null,
	updated_at?: GraphQLTypes["Date"] | undefined | null
};
	["deleteRBDealResponse"]: {
	__typename: "deleteRBDealResponse",
	status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The deleterbdeal data */
	data?: GraphQLTypes["RBDeals"] | undefined | null
};
	["createDishResponse"]: {
	__typename: "createDishResponse",
	status?: number | undefined | null,
	success?: boolean | undefined | null,
	isToast?: boolean | undefined | null,
	isError?: boolean | undefined | null,
	message?: string | undefined | null,
	/** The createdish data */
	data?: GraphQLTypes["Dish"] | undefined | null
};
	["Dish"]: {
	__typename: "Dish",
	id?: number | undefined | null,
	restaurant_id?: number | undefined | null,
	branch_id?: number | undefined | null,
	category_id?: number | undefined | null,
	subcategory_id?: number | undefined | null,
	name?: string | undefined | null,
	slug?: string | undefined | null,
	description?: string | undefined | null,
	image?: string | undefined | null,
	banner_image?: string | undefined | null,
	price?: number | undefined | null,
	original_price?: number | undefined | null,
	currency?: string | undefined | null,
	discount_percentage?: number | undefined | null,
	is_available?: boolean | undefined | null,
	is_veg?: boolean | undefined | null,
	is_customizable?: boolean | undefined | null,
	spicy_level?: string | undefined | null,
	preparation_time_minutes?: number | undefined | null,
	dietary_tags?: GraphQLTypes["JSONObject"] | undefined | null,
	ingredients?: string | undefined | null,
	availability_start_time?: GraphQLTypes["Time"] | undefined | null,
	availability_end_time?: GraphQLTypes["Time"] | undefined | null,
	stock_quantity?: number | undefined | null,
	min_order_qty?: number | undefined | null,
	max_order_qty?: number | undefined | null,
	rating?: number | undefined | null,
	approval_status?: string | undefined | null,
	rejection_reason?: string | undefined | null,
	created_at?: GraphQLTypes["Date"] | undefined | null,
	updated_at?: GraphQLTypes["Date"] | undefined | null,
	deleted_at?: GraphQLTypes["Date"] | undefined | null,
	restaurant?: GraphQLTypes["Restaurant"] | undefined | null,
	branch?: GraphQLTypes["RBranch"] | undefined | null,
	category?: GraphQLTypes["Category"] | undefined | null,
	subcategory?: GraphQLTypes["SubCategory"] | undefined | null
};
	/** Time custom scalar, formatted as HH:mm */
["Time"]: "scalar" & { name: "Time" };
	["IngredientInput"]: {
		name?: string | undefined | null,
	image_url?: string | undefined | null,
	has_options?: boolean | undefined | null,
	created_at?: GraphQLTypes["Date"] | undefined | null,
	updated_at?: GraphQLTypes["Date"] | undefined | null,
	options?: Array<GraphQLTypes["DIOptionInput"] | undefined | null> | undefined | null
};
	["DIOptionInput"]: {
		name?: string | undefined | null,
	price?: number | undefined | null,
	description?: string | undefined | null,
	image_url?: string | undefined | null
};
	["ID"]: "scalar" & { name: "ID" }
    }


type ZEUS_VARIABLES = {
	["Date"]: ValueTypes["Date"];
	["JSONObject"]: ValueTypes["JSONObject"];
	["Time"]: ValueTypes["Time"];
	["IngredientInput"]: ValueTypes["IngredientInput"];
	["DIOptionInput"]: ValueTypes["DIOptionInput"];
	["ID"]: ValueTypes["ID"];
}