import fetch from 'node-fetch';
import { ErrorCallReturn, MethodName, MethodResponse, MethodResponseError, RpcRequest } from "../types/rpc-messages";

type SuccessCallReturn<T extends MethodName, ShowMetadata extends boolean> = MethodResponse<T>["result"] extends { metadata: null }
    ? MethodResponse<T>["result"]["data"]
    : ShowMetadata extends true
        ? MethodResponse<T>["result"]
        : MethodResponse<T>["result"]["data"]

type MaybeResponse<T extends MethodName, ShowMetadata extends boolean> = {
    error: ErrorCallReturn,
    data: undefined
} | {
    error: undefined,
    data: SuccessCallReturn<T, ShowMetadata>
}

export class HttpClient {
    private url: URL;
    private id: number = 0;

    constructor(url: URL) {
        this.url = url;
    }

    async call<T extends MethodName, ShowMetadata extends boolean>(method: T, params: RpcRequest<T>["params"], withMetadata: ShowMetadata): Promise<MaybeResponse<T, ShowMetadata>> {
        // replace undefined with null
        params = params.map((param: undefined) => param === undefined ? null : param)


        const response = await fetch(this.url.href, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method,
                params,
                id: this.id++,
            }),
        })

        if (!response.ok) {
            return {
                error: {
                    code: response.status,
                    message: response.status === 401
                        ? 'Server requires authorization.'
                        : `Response status code not OK: ${response.status} ${response.statusText}`
                },
                data: undefined,
            }
        }

        const json = await response.json()

        const typedData = json as MethodResponse<T> | MethodResponseError
        if ('result' in typedData) {
            const data: SuccessCallReturn<T, ShowMetadata> = (!withMetadata || !typedData.result.metadata)
                ? typedData.result.data
                : typedData.result
            return {
                error: undefined,
                data,
            }
        }
        if ('error' in typedData) {
            return {
                error: {
                    code: typedData.error.code,
                    message: `${typedData.error.message}: ${typedData.error.data}`,
                },
                data: undefined,
            }
        }

        return {
            error: {
                code: -1,
                message: `Unexpected format of data ${JSON.stringify(json)}`,
            },
            data: undefined,
        }
    }
}
