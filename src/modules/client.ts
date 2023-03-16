import fetch from 'node-fetch';
import { InteractionName, RpcRequest, RpcResponse, RpcResponseError } from "../types/rpc-messages";


type CallReturn<T extends InteractionName> =  RpcResponse<T>["result"] extends {metadata: null}
    ? RpcResponse<T>["result"]["data"]
    : RpcResponse<T>["result"]

export class RpcClient {
    private url: URL;
    private id: number = 0;

    constructor(url: URL) {
        this.url = url;
    }

    protected async call<T extends InteractionName>(method: T, params: RpcRequest<T>["params"]): Promise<CallReturn<T>> {
        const response = new Promise<RpcResponse<T>>(async (resolve, reject) => {
            return fetch(this.url.href, {
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
            .then(response => {
                if (!response.ok) {
                    reject(response.status === 401
                        ? 'Server requires authorization.'
                        : `Response status code not OK: ${response.status} ${response.statusText}`)
                }
                return response
            })
            .then(response => response.json())
            .then(data => {
                const typedData = data as RpcResponse<T> | RpcResponseError
                if ('result' in typedData) resolve(typedData as RpcResponse<T>)
                if ('error' in typedData) reject(`${typedData.error.message}: ${typedData.error.data}`)
                reject(`Unexpected format of data ${JSON.stringify(data)}`)
              })
        });
    
        if (!response) {
            throw new Error("Response is not successful");
        }
    
        return await response.then(response => {
            if (!response.result.metadata) return response.result.data
            return response.result
        });
    }

    // TODO <T extends EventName>
    protected async subscribe<T extends InteractionName>(event: T, params: RpcRequest<T>["params"]) {
        const eventSource = new EventSource(this.url.href);
        return {
            next: (callback: (data: any) => void) => {
                eventSource.addEventListener(event, (event) => {
                    if (typeof event !== 'object' || !event || typeof (event as any).subscription !== 'number' ||
                        !('result' in event)) {
                            return
                    }
                    const {result, subscription} = event as unknown as {result: RpcResponse<T> | T; subscription: number}
                    callback(result)
                })
            },
            error: (callback: (data: any) => void) => {
                eventSource.addEventListener(event, (event) => {
                    if (typeof event !== 'object' || !event || typeof (event as any).subscription !== 'number' ||
                        !('result' in event)) {
                            callback(event)
                    }
                });
                eventSource.onerror = (event) => callback(event)
            },
        }
    }
}
