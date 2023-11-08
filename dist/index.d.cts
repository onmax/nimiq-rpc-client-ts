import WebSocket from 'ws';

declare enum BlockType {
    MICRO = "micro",
    MACRO = "macro"
}
declare enum LogType {
    PayoutInherent = "payout-inherent",
    ParkInherent = "park-inherent",
    SlashInherent = "slash-inherent",
    RevertContractInherent = "revert-contract-inherent",
    PayFee = "pay-fee",
    Transfer = "transfer",
    HtlcCreate = "htlc-create",
    HtlcTimeoutResolve = "htlc-timeout-resolve",
    HtlcRegularTransfer = "htlc-regular-transfer",
    HtlcEarlyResolve = "htlc-early-resolve",
    VestingCreate = "vesting-create",
    CreateValidator = "create-validator",
    UpdateValidator = "update-validator",
    DeactivateValidator = "deactivate-validator",
    ReactivateValidator = "reactivate-validator",
    UnparkValidator = "unpark-validator",
    CreateStaker = "create-staker",
    Stake = "stake",
    StakerFeeDeduction = "staker-fee-deduction",
    SetInactiveStake = "set-inactive-stake",
    UpdateStaker = "update-staker",
    RetireValidator = "retire-validator",
    DeleteValidator = "delete-validator",
    Unstake = "unstake",
    PayoutReward = "payout-reward",
    Park = "park",
    Slash = "slash",
    RevertContract = "revert-contract",
    FailedTransaction = "failed-transaction",
    ValidatorFeeDeduction = "validator-fee-deduction"
}
declare enum AccountType {
    BASIC = "basic",
    VESTING = "vesting",
    HTLC = "htlc"
}

type Address = `NQ${number} ${string}`;
type Coin = number;
type BlockNumber = number;
type ValidityStartHeight = {
    relativeValidityStartHeight: number;
} | {
    absoluteValidityStartHeight: number;
};
type EpochIndex = number;
type BatchIndex = number;
type GenesisSupply = number;
type GenesisTime = number;
type CurrentTime = number;
type Hash = string;
interface PolicyConstants {
    stakingContractAddress: Address;
    coinbaseAddress: Address;
    transactionValidityWindow: number;
    maxSizeMicroBody: number;
    version: number;
    slots: number;
    blocksPerBatch: number;
    batchesPerEpoch: number;
    blocksPerEpoch: number;
    validatorDeposit: number;
    totalSupply: number;
}
interface BasicAccount {
    type: AccountType.BASIC;
    address: Address;
    balance: Coin;
}
interface VestingAccount {
    type: AccountType.VESTING;
    address: Address;
    balance: Coin;
    owner: Address;
    vestingStart: number;
    vestingStepBlocks: number;
    vestingStepAmount: Coin;
    vestingTotalAmount: Coin;
}
interface HtlcAccount {
    type: AccountType.HTLC;
    address: Address;
    balance: Coin;
    sender: Address;
    recipient: Address;
    hashRoot: string;
    hashCount: number;
    timeout: number;
    totalAmount: Coin;
}
type Account = BasicAccount | VestingAccount | HtlcAccount;
interface Transaction {
    hash: string;
    blockNumber: number;
    timestamp: number;
    confirmations: number;
    from: Address;
    to: Address;
    value: Coin;
    fee: Coin;
    data: string;
    flags: number;
    validityStartHeight: number;
    proof: string;
    executionResult: boolean;
}
type RawTransaction = string;
interface PartialMicroBlock {
    type: BlockType.MICRO;
    hash: string;
    size: number;
    batch: number;
    version: number;
    number: number;
    timestamp: number;
    parentHash: string;
    seed: string;
    extraData: string;
    stateHash: string;
    bodyHash: string;
    historyHash: string;
    producer: {
        slotNumber: number;
        validator: Address;
        publicKey: string;
    };
    justification: {
        micro: string;
    } | {
        skip: {
            sig: {
                signature: {
                    signature: string;
                };
                signers: number[];
            };
        };
    };
}
type MicroBlock = PartialMicroBlock & {
    transactions: Transaction[];
};
interface PartialMacroBlock {
    type: BlockType.MACRO;
    hash: string;
    size: number;
    batch: number;
    epoch: number;
    version: number;
    number: number;
    timestamp: number;
    parentHash: string;
    seed: string;
    extraData: string;
    stateHash: string;
    bodyHash: string;
    historyHash: string;
    parentElectionHash: string;
}
type MacroBlock = PartialMacroBlock & {
    isElectionBlock: false;
    transactions: Transaction[];
    lostRewardSet: number[];
    disabledSet: number[];
    justification: {
        round: number;
        sig: {
            signature: {
                signature: string;
            };
            signers: number[];
        };
    };
};
type ElectionMacroBlock = PartialMacroBlock & {
    isElectionBlock: true;
    transactions: Transaction[];
    interlink: string[];
    slots: Slot[];
    nextBatchInitialPunishedSet: number[];
};
type PartialBlock = PartialMicroBlock | PartialMacroBlock;
type Block = MicroBlock | MacroBlock | ElectionMacroBlock;
interface Staker {
    address: Address;
    balance: Coin;
    delegation?: Address;
    inactiveBalance: Coin;
    inactiveFrom: number | null;
}
interface Validator {
    address: Address;
    signingKey: string;
    votingKey: string;
    rewardAddress: Address;
    balance: Coin;
    numStakers: number;
    retired: boolean;
}
interface Slot {
    firstSlotNumber: number;
    numSlots: number;
    validator: Address;
    publicKey: string;
}
interface PenalizedSlot {
    blockNumber: BlockNumber;
    lostRewards: number[];
    disabled: number[];
}
interface Inherent {
    reward: {
        block_number: number;
        block_time: number;
        target: Address;
        value: Coin;
        hash: string;
    };
}
interface MempoolInfo {
    _0?: number;
    _1?: number;
    _2?: number;
    _5?: number;
    _10?: number;
    _20?: number;
    _50?: number;
    _100?: number;
    _200?: number;
    _500?: number;
    _1000?: number;
    _2000?: number;
    _5000?: number;
    _10000?: number;
    total: number;
    buckets: number[];
}
interface WalletAccount {
    address: Address;
    publicKey: string;
    privateKey: string;
}
interface Signature {
    signature: string;
    publicKey: string;
}
interface ZKPState {
    latestHeaderHash: Hash;
    latestBlockNumber: BlockNumber;
    latestProof?: string;
}
interface BlockchainState {
    blockNumber: BlockNumber;
    blockHash: Hash;
}
type Auth = {
    username: string;
    password: string;
} | {
    secret: string;
};

interface PayFeeLog {
    type: LogType.PayFee;
    from: string;
    fee: number;
}
interface TransferLog {
    type: LogType.Transfer;
    from: Address;
    to: Address;
    amount: Coin;
}
interface HtlcCreateLog {
    contractAddress: Address;
    sender: Address;
    recipient: Address;
    hashAlgorithm: string;
    hashRoot: string;
    hashCount: number;
    timeout: number;
    totalAmount: Coin;
}
interface HTLCTimeoutResolve {
    contractAddress: Address;
}
interface HTLCRegularTransfer {
    contractAddress: Address;
    preImage: string;
    hashDepth: number;
}
interface HTLCEarlyResolve {
    contractAddress: Address;
}
interface VestingCreateLog {
    type: LogType.VestingCreate;
    contractAddress: Address;
    owner: Address;
    startTime: number;
    timeStep: number;
    stepAmount: Coin;
    totalAmount: Coin;
}
interface CreateValidatorLog {
    type: LogType.CreateValidator;
    validatorAddress: Address;
    rewardAddress: Address;
}
interface UpdateValidatorLog {
    type: LogType.UpdateValidator;
    validatorAddress: Address;
    oldRewardAddress: Address;
    newRewardAddress: Address | null;
}
interface ValidatorFeeDeductionLog {
    type: LogType.ValidatorFeeDeduction;
    validatorAddress: Address;
    fee: Coin;
}
interface DeactivateValidatorLog {
    type: LogType.DeactivateValidator;
    validatorAddress: Address;
}
interface ReactivateValidatorLog {
    type: LogType.ReactivateValidator;
    validatorAddress: Address;
}
interface SetInactiveStakeLog {
    type: LogType.SetInactiveStake;
    validatorAddress: Address;
}
interface CreateStakerLog {
    type: LogType.CreateStaker;
    stakerAddress: Address;
    validatorAddress: Address | null;
    value: Coin;
}
interface StakeLog {
    type: LogType.Stake;
    stakerAddress: Address;
    validatorAddress: Address | null;
    value: Coin;
}
interface StakerFeeDeductionLog {
    type: LogType.StakerFeeDeduction;
    stakerAddress: Address;
    fee: Coin;
}
interface UpdateStakerLog {
    type: LogType.UpdateStaker;
    stakerAddress: Address;
    oldValidatorAddress: Address | null;
    newValidatorAddress: Address | null;
}
interface RetireValidatorLog {
    type: LogType.RetireValidator;
    validatorAddress: Address;
}
interface DeleteValidatorLog {
    type: LogType.DeleteValidator;
    validatorAddress: Address;
    rewardAddress: Address;
}
interface UnstakeLog {
    type: LogType.Unstake;
    stakerAddress: Address;
    validatorAddress: Address | null;
    value: Coin;
}
interface PayoutRewardLog {
    type: LogType.PayoutReward;
    to: Address;
    value: Coin;
}
interface ParkLog {
    type: LogType.Park;
    validatorAddress: Address;
    eventBlock: number;
}
interface SlashLog {
    type: LogType.Slash;
    validatorAddress: Address;
    eventBlock: number;
    slot: number;
    newlyDisabled: boolean;
}
interface RevertContractLog {
    type: LogType.RevertContract;
    contractAddress: Address;
}
interface FailedTransactionLog {
    type: LogType.FailedTransaction;
    from: Address;
    to: Address;
    failureReason: string;
}
type Log = PayFeeLog | TransferLog | HtlcCreateLog | HTLCTimeoutResolve | HTLCRegularTransfer | VestingCreateLog | CreateValidatorLog | UpdateValidatorLog | ValidatorFeeDeductionLog | DeactivateValidatorLog | ReactivateValidatorLog | SetInactiveStakeLog | CreateStakerLog | StakeLog | StakerFeeDeductionLog | UpdateStakerLog | RetireValidatorLog | DeleteValidatorLog | UnstakeLog | PayoutRewardLog | ParkLog | SlashLog | RevertContractLog | FailedTransactionLog;
interface TransactionLog {
    hash: string;
    logs: Log[];
    failed: boolean;
}
interface BlockLog {
    inherents: Log[];
    blockHash: string;
    blockNumber: number;
    transactions: TransactionLog[];
}
type AppliedBlockLog = BlockLog & {
    type: 'applied-block';
    timestamp: number;
};
type RevertedBlockLog = BlockLog & {
    type: 'reverted-block';
};

interface HttpOptions {
    timeout?: number | false;
}
type SendTxCallOptions = HttpOptions & ({
    waitForConfirmationTimeout?: number;
});
declare const DEFAULT_OPTIONS: HttpOptions;
declare const DEFAULT_TIMEOUT_CONFIRMATION: number;
declare const DEFAULT_OPTIONS_SEND_TX: SendTxCallOptions;
interface Context {
    headers: HeadersInit;
    body: {
        method: string;
        params: any[];
        id: number;
        jsonrpc: string;
    };
    timestamp: number;
    url: string;
}
type CallResult<Data, Metadata = undefined> = {
    context: Context;
} & ({
    data: Data;
    metadata: Metadata;
    error: undefined;
} | {
    data: undefined;
    metadata: undefined;
    error: {
        code: number;
        message: string;
    };
});
declare class HttpClient {
    private url;
    private static id;
    private headers;
    constructor(url: URL, auth?: Auth);
    call<Data, Metadata = undefined>(request: {
        method: string;
        params?: any[];
        withMetadata?: boolean;
    }, options?: HttpOptions): Promise<CallResult<Data, Metadata>>;
}

interface ErrorStreamReturn {
    code: number;
    message: string;
}
interface Subscription<Data> {
    next: (callback: (data: MaybeStreamResponse<Data>) => void) => void;
    close: () => void;
    context: {
        headers: WebSocket.ClientOptions['headers'];
        body: {
            method: string;
            params: any[];
            id: number;
            jsonrpc: string;
        };
        timestamp: number;
        url: string;
    };
    getSubscriptionId: () => number;
}
declare const WS_DEFAULT_OPTIONS: StreamOptions<any>;
type MaybeStreamResponse<Data> = {
    error: ErrorStreamReturn;
    data: undefined;
    metadata: undefined;
} | {
    error: undefined;
    data: Data;
    metadata?: BlockchainState;
};
type FilterStreamFn<Data = any> = (data: Data) => boolean;
interface StreamOptions<Data> {
    once: boolean;
    filter?: FilterStreamFn<Data>;
}
declare class WebSocketClient {
    private url;
    private id;
    private headers;
    private textDecoder;
    constructor(url: URL, auth?: Auth);
    subscribe<Data, Request extends {
        method: string;
        params?: any[];
        withMetadata?: boolean;
    }>(request: Request, userOptions: StreamOptions<Data>): Promise<Subscription<Data>>;
}

interface GetBlockByHashParams {
    includeTransactions?: boolean;
}
interface GetBlockByBlockNumberParams {
    includeTransactions?: boolean;
}
interface GetLatestBlockParams {
    includeTransactions?: boolean;
}
interface GetSlotAtBlockParams {
    offsetOpt?: number;
    withMetadata?: boolean;
}
interface GetTransactionsByAddressParams {
    max?: number;
    justHashes?: boolean;
}
interface GetAccountByAddressParams {
    withMetadata?: boolean;
}
interface GetValidatorByAddressParams {
    address: Address;
}
interface GetStakersByAddressParams {
    address: Address;
}
interface GetStakerByAddressParams {
    address: Address;
}
interface SubscribeForHeadHashParams$1 {
    retrieve: 'HASH';
}
interface SubscribeForValidatorElectionByAddressParams$1 {
    address: Address;
}
interface SubscribeForLogsByAddressesAndTypesParams$1 {
    addresses?: Address[];
    types?: LogType[];
}
declare class BlockchainClient {
    private client;
    constructor(http: HttpClient);
    /**
     * Returns the block number for the current head.
     */
    getBlockNumber(options?: HttpOptions): Promise<CallResult<number, undefined>>;
    /**
     * Returns the batch number for the current head.
     */
    getBatchNumber(options?: HttpOptions): Promise<CallResult<number, undefined>>;
    /**
     * Returns the epoch number for the current head.
     */
    getEpochNumber(options?: HttpOptions): Promise<CallResult<number, undefined>>;
    /**
     * Tries to fetch a block given its hash. It has an option to include the transactions in the block, which defaults to false.
     */
    getBlockByHash<T extends GetBlockByHashParams>(hash: Hash, p?: T, options?: HttpOptions): Promise<CallResult<T["includeTransactions"] extends true ? Block : PartialBlock, undefined>>;
    /**
     * Tries to fetch a block given its number. It has an option to include the transactions in the block, which defaults to false.
     */
    getBlockByNumber<T extends GetBlockByBlockNumberParams>(blockNumber: BlockNumber, p?: T, options?: HttpOptions): Promise<CallResult<T["includeTransactions"] extends true ? Block : PartialBlock, undefined>>;
    /**
     * Returns the block at the head of the main chain. It has an option to include the
     * transactions in the block, which defaults to false.
     */
    getLatestBlock<T extends GetLatestBlockParams>(p?: T, options?: HttpOptions): Promise<CallResult<T["includeTransactions"] extends true ? Block : PartialBlock, undefined>>;
    /**
     * Returns the information for the slot owner at the given block height and offset. The
     * offset is optional, it will default to getting the offset for the existing block
     * at the given height.
     */
    getSlotAt<T extends GetSlotAtBlockParams>(blockNumber: BlockNumber, p?: T, options?: HttpOptions): Promise<CallResult<Slot, undefined>>;
    /**
     * Fetches the transaction(s) given the hash.
     */
    getTransactionByHash(hash: Hash, options?: HttpOptions): Promise<CallResult<Transaction, undefined>>;
    /**
     * Fetches the transaction(s) given the block number.
     */
    getTransactionsByBlockNumber(blockNumber: BlockNumber, options?: HttpOptions): Promise<CallResult<Transaction[], undefined>>;
    /**
     * Fetches the transaction(s) given the batch number.
     */
    getTransactionsByBatchNumber(batchIndex: BatchIndex, options?: HttpOptions): Promise<CallResult<Transaction[], undefined>>;
    /**
     * Fetches the transaction(s) given the address.
     *
     * It returns the latest transactions for a given address. All the transactions
     * where the given address is listed as a recipient or as a sender are considered. Reward
     * transactions are also returned. It has an option to specify the maximum number of transactions
     * to fetch, it defaults to 500.
     */
    getTransactionsByAddress<T extends GetTransactionsByAddressParams>(address: Address, p?: T, options?: HttpOptions): Promise<CallResult<T["justHashes"] extends true ? Transaction[] : string[], undefined>>;
    /**
     * Returns all the inherents (including reward inherents) give the block number. Note
     * that this only considers blocks in the main chain.
     */
    getInherentsByBlockNumber(blockNumber: BlockNumber, options?: HttpOptions): Promise<CallResult<Inherent[], undefined>>;
    /**
     * Returns all the inherents (including reward inherents) give the batch number. Note
     * that this only considers blocks in the main chain.
     */
    getInherentsByBatchNumber(batchIndex: BatchIndex, options?: HttpOptions): Promise<CallResult<Inherent[], undefined>>;
    /**
     * Tries to fetch the account at the given address.
     */
    getAccountByAddress<T extends {
        withMetadata: boolean;
    }>(address: Address, { withMetadata }: T, options?: HttpOptions): Promise<CallResult<Account, T["withMetadata"] extends true ? BlockchainState : undefined>>;
    /**
     * Fetches all accounts in the accounts tree.
     * IMPORTANT: This operation iterates over all accounts in the accounts tree
     * and thus is extremely computationally expensive.
     */
    getAccounts(options?: HttpOptions): Promise<CallResult<Account[], undefined>>;
    /**
     * Returns a collection of the currently active validator's addresses and balances.
     */
    getActiveValidators<T extends {
        withMetadata: boolean;
    }>({ withMetadata }?: T, options?: HttpOptions): Promise<CallResult<Validator[], T["withMetadata"] extends true ? BlockchainState : undefined>>;
    getCurrentPenalizedSlots<T extends {
        withMetadata: boolean;
    }>({ withMetadata }?: T, options?: HttpOptions): Promise<CallResult<PenalizedSlot[], undefined>>;
    getPreviousPenalizedSlots<T extends {
        withMetadata: boolean;
    }>({ withMetadata }?: T, options?: HttpOptions): Promise<CallResult<PenalizedSlot[], T["withMetadata"] extends true ? BlockchainState : undefined>>;
    /**
     * Tries to fetch a validator information given its address.
     */
    getValidatorByAddress(address: Address, options?: HttpOptions): Promise<CallResult<Validator, undefined>>;
    /**
     * Fetches all validators in the staking contract.
     * IMPORTANT: This operation iterates over all validators in the staking contract
     * and thus is extremely computationally expensive.
     */
    getValidators(options?: HttpOptions): Promise<CallResult<Validator[], undefined>>;
    /**
     * Fetches all stakers for a given validator.
     * IMPORTANT: This operation iterates over all stakers of the staking contract
     * and thus is extremely computationally expensive.
     */
    getStakersByValidatorAddress(address: Address, options?: HttpOptions): Promise<CallResult<Staker[], undefined>>;
    /**
     * Tries to fetch a staker information given its address.
     */
    getStakerByAddress(address: Address, options?: HttpOptions): Promise<CallResult<Staker, undefined>>;
}

type blockchain_BlockchainClient = BlockchainClient;
declare const blockchain_BlockchainClient: typeof BlockchainClient;
type blockchain_GetAccountByAddressParams = GetAccountByAddressParams;
type blockchain_GetBlockByBlockNumberParams = GetBlockByBlockNumberParams;
type blockchain_GetBlockByHashParams = GetBlockByHashParams;
type blockchain_GetLatestBlockParams = GetLatestBlockParams;
type blockchain_GetSlotAtBlockParams = GetSlotAtBlockParams;
type blockchain_GetStakerByAddressParams = GetStakerByAddressParams;
type blockchain_GetStakersByAddressParams = GetStakersByAddressParams;
type blockchain_GetTransactionsByAddressParams = GetTransactionsByAddressParams;
type blockchain_GetValidatorByAddressParams = GetValidatorByAddressParams;
declare namespace blockchain {
  export { blockchain_BlockchainClient as BlockchainClient, type blockchain_GetAccountByAddressParams as GetAccountByAddressParams, type blockchain_GetBlockByBlockNumberParams as GetBlockByBlockNumberParams, type blockchain_GetBlockByHashParams as GetBlockByHashParams, type blockchain_GetLatestBlockParams as GetLatestBlockParams, type blockchain_GetSlotAtBlockParams as GetSlotAtBlockParams, type blockchain_GetStakerByAddressParams as GetStakerByAddressParams, type blockchain_GetStakersByAddressParams as GetStakersByAddressParams, type blockchain_GetTransactionsByAddressParams as GetTransactionsByAddressParams, type blockchain_GetValidatorByAddressParams as GetValidatorByAddressParams, type SubscribeForHeadHashParams$1 as SubscribeForHeadHashParams, type SubscribeForLogsByAddressesAndTypesParams$1 as SubscribeForLogsByAddressesAndTypesParams, type SubscribeForValidatorElectionByAddressParams$1 as SubscribeForValidatorElectionByAddressParams };
}

declare enum BlockSubscriptionType {
    MACRO = "MACRO",
    MICRO = "MICRO",
    ELECTION = "ELECTION"
}
declare enum RetrieveBlock {
    FULL = "FULL",
    PARTIAL = "PARTIAL",
    HASH = "HASH"
}
interface SubscribeForHeadBlockParams {
    retrieve: RetrieveBlock.FULL | RetrieveBlock.PARTIAL;
    blockType?: BlockSubscriptionType;
}
interface SubscribeForHeadHashParams {
    retrieve: RetrieveBlock.HASH;
}
interface SubscribeForValidatorElectionByAddressParams {
    address: Address;
    withMetadata?: boolean;
}
interface SubscribeForLogsByAddressesAndTypesParams {
    addresses?: Address[];
    types?: LogType[];
    withMetadata?: boolean;
}
declare class BlockchainStream {
    ws: WebSocketClient;
    constructor(ws: WebSocketClient);
    /**
     * Subscribes to new block events.
     */
    subscribeForBlocks<T extends (SubscribeForHeadBlockParams | SubscribeForHeadHashParams), O extends StreamOptions<T extends SubscribeForHeadBlockParams ? Block | PartialBlock : Hash>>(params: T, userOptions?: Partial<O>): Promise<Subscription<any>>;
    /**
     * Subscribes to pre epoch validators events.
     */
    subscribeForValidatorElectionByAddress<T extends SubscribeForValidatorElectionByAddressParams, O extends StreamOptions<Validator>>(p: T, userOptions?: Partial<O>): Promise<Subscription<Validator>>;
    /**
     * Subscribes to log events related to a given list of addresses and of any of the log types provided.
     * If addresses is empty it does not filter by address. If log_types is empty it won't filter by log types.
     * Thus the behavior is to assume all addresses or log_types are to be provided if the corresponding vec is empty.
     */
    subscribeForLogsByAddressesAndTypes<T extends SubscribeForLogsByAddressesAndTypesParams, O extends StreamOptions<BlockLog>>(p: T, userOptions?: Partial<O>): Promise<Subscription<BlockLog>>;
}

type blockchainStreams_BlockSubscriptionType = BlockSubscriptionType;
declare const blockchainStreams_BlockSubscriptionType: typeof BlockSubscriptionType;
type blockchainStreams_BlockchainStream = BlockchainStream;
declare const blockchainStreams_BlockchainStream: typeof BlockchainStream;
type blockchainStreams_RetrieveBlock = RetrieveBlock;
declare const blockchainStreams_RetrieveBlock: typeof RetrieveBlock;
type blockchainStreams_SubscribeForHeadBlockParams = SubscribeForHeadBlockParams;
type blockchainStreams_SubscribeForHeadHashParams = SubscribeForHeadHashParams;
type blockchainStreams_SubscribeForLogsByAddressesAndTypesParams = SubscribeForLogsByAddressesAndTypesParams;
type blockchainStreams_SubscribeForValidatorElectionByAddressParams = SubscribeForValidatorElectionByAddressParams;
declare namespace blockchainStreams {
  export { blockchainStreams_BlockSubscriptionType as BlockSubscriptionType, blockchainStreams_BlockchainStream as BlockchainStream, blockchainStreams_RetrieveBlock as RetrieveBlock, type blockchainStreams_SubscribeForHeadBlockParams as SubscribeForHeadBlockParams, type blockchainStreams_SubscribeForHeadHashParams as SubscribeForHeadHashParams, type blockchainStreams_SubscribeForLogsByAddressesAndTypesParams as SubscribeForLogsByAddressesAndTypesParams, type blockchainStreams_SubscribeForValidatorElectionByAddressParams as SubscribeForValidatorElectionByAddressParams };
}

interface RawTransactionInfoParams {
    rawTransaction: string;
}
type TransactionParams = {
    wallet: Address;
    recipient: Address;
    value: Coin;
    fee: Coin;
    data?: string;
} & ValidityStartHeight;
type VestingTxParams = {
    wallet: Address;
    owner: Address;
    startTime: number;
    timeStep: number;
    numSteps: number;
    value: Coin;
    fee: Coin;
} & ValidityStartHeight;
type RedeemVestingTxParams = {
    wallet: Address;
    contractAddress: Address;
    recipient: Address;
    value: Coin;
    fee: Coin;
} & ValidityStartHeight;
type HtlcTransactionParams = {
    wallet: Address;
    htlcSender: Address;
    htlcRecipient: Address;
    hashRoot: string;
    hashCount: number;
    timeout: number;
    value: Coin;
    fee: Coin;
} & ValidityStartHeight;
type RedeemRegularHtlcTxParams = {
    wallet: Address;
    contractAddress: Address;
    recipient: Address;
    preImage: string;
    hashRoot: string;
    hashCount: number;
    value: Coin;
    fee: Coin;
} & ValidityStartHeight;
type RedeemTimeoutHtlcTxParams = {
    wallet: Address;
    contractAddress: Address;
    recipient: Address;
    value: Coin;
    fee: Coin;
} & ValidityStartHeight;
type RedeemEarlyHtlcTxParams = {
    wallet: Address;
    htlcAddress: Address;
    recipient: Address;
    htlcSenderSignature: string;
    htlcRecipientSignature: string;
    value: Coin;
    fee: Coin;
} & ValidityStartHeight;
type SignRedeemEarlyHtlcParams = {
    wallet: Address;
    htlcAddress: Address;
    recipient: Address;
    value: Coin;
    fee: Coin;
} & ValidityStartHeight;
type StakerTxParams = {
    senderWallet: Address;
    stakerWallet: string;
    delegation: Address | undefined;
    value: Coin;
    fee: Coin;
} & ValidityStartHeight;
type StakeTxParams = {
    senderWallet: Address;
    stakerWallet: string;
    value: Coin;
    fee: Coin;
} & ValidityStartHeight;
type UpdateStakerTxParams = {
    senderWallet: Address;
    stakerWallet: string;
    newDelegation: Address;
    reactivateAllStake: boolean;
    fee: Coin;
} & ValidityStartHeight;
type SetInactiveStakeTxParams = {
    senderWallet: Address;
    stakerWallet: string;
    value: Coin;
    fee: Coin;
} & ValidityStartHeight;
type UnstakeTxParams = {
    stakerWallet: string;
    recipient: Address;
    value: Coin;
    fee: Coin;
} & ValidityStartHeight;
type NewValidatorTxParams = {
    senderWallet: Address;
    validator: Address;
    signingSecretKey: string;
    votingSecretKey: string;
    rewardAddress: Address;
    signalData: string;
    fee: Coin;
} & ValidityStartHeight;
type UpdateValidatorTxParams = {
    senderWallet: Address;
    validator: Address;
    newSigningSecretKey: string;
    newVotingSecretKey: string;
    newRewardAddress: Address;
    newSignalData: string;
    fee: Coin;
} & ValidityStartHeight;
type DeactiveValidatorTxParams = {
    senderWallet: Address;
    validator: Address;
    signingSecretKey: string;
    fee: Coin;
} & ValidityStartHeight;
type ReactivateValidatorTxParams = {
    senderWallet: Address;
    validator: Address;
    signingSecretKey: string;
    fee: Coin;
} & ValidityStartHeight;
type RetireValidatorTxParams = {
    senderWallet: Address;
    validator: Address;
    fee: Coin;
} & ValidityStartHeight;
type DeleteValidatorTxParams = {
    validator: Address;
    recipient: Address;
    fee: Coin;
    value: Coin;
} & ValidityStartHeight;
interface TxLog {
    tx: Transaction;
    log?: BlockLog;
    hash: Hash;
}
declare class ConsensusClient {
    private client;
    private blockchainClient;
    private blockchainStream;
    constructor(client: HttpClient, blockchainClient: BlockchainClient, blockchainStream: BlockchainStream);
    private getValidityStartHeight;
    private waitForConfirmation;
    /**
     * Returns a boolean specifying if we have established consensus with the network
     */
    isConsensusEstablished(options?: HttpOptions): Promise<CallResult<boolean, undefined>>;
    /**
     * Given a serialized transaction, it will return the corresponding transaction struct
     */
    getRawTransactionInfo({ rawTransaction }: RawTransactionInfoParams, options?: HttpOptions): Promise<CallResult<Transaction, undefined>>;
    /**
     * Creates a serialized transaction
     */
    createTransaction(p: TransactionParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a transaction
     */
    sendTransaction(p: TransactionParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a transaction and waits for confirmation
     */
    sendSyncTransaction(p: TransactionParams, options: SendTxCallOptions): Promise<unknown>;
    /**
     * Returns a serialized transaction creating a new vesting contract
     */
    createNewVestingTransaction(p: VestingTxParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a transaction creating a new vesting contract to the network
     */
    sendNewVestingTransaction(p: VestingTxParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a transaction creating a new vesting contract to the network and waits for confirmation
     */
    sendSyncNewVestingTransaction(p: VestingTxParams, options: SendTxCallOptions): Promise<unknown>;
    /**
     * Returns a serialized transaction redeeming a vesting contract
     */
    createRedeemVestingTransaction(p: RedeemVestingTxParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a transaction redeeming a vesting contract
     */
    sendRedeemVestingTransaction(p: RedeemVestingTxParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a transaction redeeming a vesting contract and waits for confirmation
     */
    sendSyncRedeemVestingTransaction(p: RedeemVestingTxParams, options?: SendTxCallOptions): Promise<unknown>;
    /**
     * Returns a serialized transaction creating a new HTLC contract
     */
    createNewHtlcTransaction(p: HtlcTransactionParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a transaction creating a new HTLC contract
     */
    sendNewHtlcTransaction(p: HtlcTransactionParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a transaction creating a new HTLC contract and waits for confirmation
     */
    sendSyncNewHtlcTransaction(p: HtlcTransactionParams, options?: SendTxCallOptions): Promise<unknown>;
    /**
     * Returns a serialized transaction redeeming an HTLC contract
     */
    createRedeemRegularHtlcTransaction(p: RedeemRegularHtlcTxParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a transaction redeeming an HTLC contract
     */
    sendRedeemRegularHtlcTransaction(p: RedeemRegularHtlcTxParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a transaction redeeming a new HTLC contract and waits for confirmation
     */
    sendSyncRedeemRegularHtlcTransaction(p: RedeemRegularHtlcTxParams, options?: SendTxCallOptions): Promise<unknown>;
    /**
     * Returns a serialized transaction redeeming a HTLC contract using the `TimeoutResolve`
     * method
     */
    createRedeemTimeoutHtlcTransaction(p: RedeemTimeoutHtlcTxParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a transaction redeeming a HTLC contract using the `TimeoutResolve`
     * method to network
     */
    sendRedeemTimeoutHtlcTransaction(p: RedeemTimeoutHtlcTxParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a transaction redeeming a HTLC contract using the `TimeoutResolve`
     * method to network and waits for confirmation
     */
    sendSyncRedeemTimeoutHtlcTransaction(p: RedeemTimeoutHtlcTxParams, options?: SendTxCallOptions): Promise<unknown>;
    /**
     * Returns a serialized transaction redeeming a HTLC contract using the `EarlyResolve`
     * method.
     */
    createRedeemEarlyHtlcTransaction(p: RedeemEarlyHtlcTxParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a transaction redeeming a HTLC contract using the `EarlyResolve`
     * method.
     */
    sendRedeemEarlyHtlcTransaction(p: RedeemEarlyHtlcTxParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a transaction redeeming a HTLC contract using the `EarlyResolve`
     * method and waits for confirmation
     */
    sendSyncRedeemEarlyHtlcTransaction(p: RedeemEarlyHtlcTxParams, options?: SendTxCallOptions): Promise<unknown>;
    /**
     * Returns a serialized signature that can be used to redeem funds from a HTLC contract using
     * the `EarlyResolve` method.
     */
    signRedeemEarlyHtlcTransaction(p: SignRedeemEarlyHtlcParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Returns a serialized `new_staker` transaction. You need to provide the address of a basic
     * account (the sender wallet) to pay the transaction fee.
     */
    createNewStakerTransaction(p: StakerTxParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a `new_staker` transaction. You need to provide the address of a basic
     * account (the sender wallet) to pay the transaction fee.
     */
    sendNewStakerTransaction(p: StakerTxParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a `new_staker` transaction. You need to provide the address of a basic
     * account (the sender wallet) to pay the transaction fee and waits for confirmation.
     */
    sendSyncNewStakerTransaction(p: StakerTxParams, options?: SendTxCallOptions): Promise<unknown>;
    /**
     * Returns a serialized `stake` transaction. The funds to be staked and the transaction fee will
     * be paid from the `sender_wallet`.
     */
    createStakeTransaction(p: StakeTxParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a `stake` transaction. The funds to be staked and the transaction fee will
     * be paid from the `sender_wallet`.
     */
    sendStakeTransaction(p: StakeTxParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a `stake` transaction. The funds to be staked and the transaction fee will
     * be paid from the `sender_wallet` and waits for confirmation.
     */
    sendSyncStakeTransaction(p: StakeTxParams, options?: SendTxCallOptions): Promise<unknown>;
    /**
     * Returns a serialized `update_staker` transaction. You can pay the transaction fee from a basic
     * account (by providing the sender wallet) or from the staker account's balance (by not
     * providing a sender wallet).
     */
    createUpdateStakerTransaction(p: UpdateStakerTxParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a `update_staker` transaction. You can pay the transaction fee from a basic
     * account (by providing the sender wallet) or from the staker account's balance (by not
     * providing a sender wallet).
     */
    sendUpdateStakerTransaction(p: UpdateStakerTxParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a `update_staker` transaction. You can pay the transaction fee from a basic
     * account (by providing the sender wallet) or from the staker account's balance (by not
     * providing a sender wallet) and waits for confirmation.
     */
    sendSyncUpdateStakerTransaction(p: UpdateStakerTxParams, options?: SendTxCallOptions): Promise<unknown>;
    /**
     * Returns a serialized `set_inactive_stake` transaction. You can pay the transaction fee from a basic
     * account (by providing the sender wallet) or from the staker account's balance (by not
     * providing a sender wallet).
     */
    createSetInactiveStakeTransaction(p: SetInactiveStakeTxParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a `set_inactive_stake` transaction. You can pay the transaction fee from a basic
     * account (by providing the sender wallet) or from the staker account's balance (by not
     * providing a sender wallet).
     */
    sendSetInactiveStakeTransaction(p: SetInactiveStakeTxParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a `set_inactive_stake` transaction. You can pay the transaction fee from a basic
     * account (by providing the sender wallet) or from the staker account's balance (by not
     * providing a sender wallet) and waits for confirmation.
     */
    sendSyncSetInactiveStakeTransaction(p: SetInactiveStakeTxParams, options?: SendTxCallOptions): Promise<unknown>;
    /**
     * Returns a serialized `unstake` transaction. The transaction fee will be paid from the funds
     * being unstaked.
     */
    createUnstakeTransaction(p: UnstakeTxParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a `unstake` transaction. The transaction fee will be paid from the funds
     * being unstaked.
     */
    sendUnstakeTransaction(p: UnstakeTxParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a `unstake` transaction. The transaction fee will be paid from the funds
     * being unstaked and waits for confirmation.
     */
    sendSyncUnstakeTransaction(p: UnstakeTxParams, options?: SendTxCallOptions): Promise<unknown>;
    /**
     * Returns a serialized `new_validator` transaction. You need to provide the address of a basic
     * account (the sender wallet) to pay the transaction fee and the validator deposit.
     * Since JSON doesn't have a primitive for Option (it just has the null primitive), we can't
     * have a double Option. So we use the following work-around for the signal data:
     * "" = Set the signal data field to None.
     * "0x29a4b..." = Set the signal data field to Some(0x29a4b...).
     */
    createNewValidatorTransaction(p: NewValidatorTxParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a `new_validator` transaction. You need to provide the address of a basic
     * account (the sender wallet) to pay the transaction fee and the validator deposit.
     * Since JSON doesn't have a primitive for Option (it just has the null primitive), we can't
     * have a double Option. So we use the following work-around for the signal data:
     * "" = Set the signal data field to None.
     * "0x29a4b..." = Set the signal data field to Some(0x29a4b...).
     */
    sendNewValidatorTransaction(p: NewValidatorTxParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a `new_validator` transaction. You need to provide the address of a basic
     * account (the sender wallet) to pay the transaction fee and the validator deposit
     * and waits for confirmation.
     * Since JSON doesn't have a primitive for Option (it just has the null primitive), we can't
     * have a double Option. So we use the following work-around for the signal data:
     * "" = Set the signal data field to None.
     * "0x29a4b..." = Set the signal data field to Some(0x29a4b...).
     */
    sendSyncNewValidatorTransaction(p: NewValidatorTxParams, options?: SendTxCallOptions): Promise<unknown>;
    /**
     * Returns a serialized `update_validator` transaction. You need to provide the address of a basic
     * account (the sender wallet) to pay the transaction fee.
     * Since JSON doesn't have a primitive for Option (it just has the null primitive), we can't
     * have a double Option. So we use the following work-around for the signal data:
     * null = No change in the signal data field.
     * "" = Change the signal data field to None.
     * "0x29a4b..." = Change the signal data field to Some(0x29a4b...).
     */
    createUpdateValidatorTransaction(p: UpdateValidatorTxParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a `update_validator` transaction. You need to provide the address of a basic
     * account (the sender wallet) to pay the transaction fee.
     * Since JSON doesn't have a primitive for Option (it just has the null primitive), we can't
     * have a double Option. So we use the following work-around for the signal data:
     * null = No change in the signal data field.
     * "" = Change the signal data field to None.
     * "0x29a4b..." = Change the signal data field to Some(0x29a4b...).
     */
    sendUpdateValidatorTransaction(p: UpdateValidatorTxParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a `update_validator` transaction. You need to provide the address of a basic
     * account (the sender wallet) to pay the transaction fee and waits for confirmation.
     * Since JSON doesn't have a primitive for Option (it just has the null primitive), we can't
     * have a double Option. So we use the following work-around for the signal data:
     * null = No change in the signal data field.
     * "" = Change the signal data field to None.
     * "0x29a4b..." = Change the signal data field to Some(0x29a4b...).
     */
    sendSyncUpdateValidatorTransaction(p: UpdateValidatorTxParams, options?: SendTxCallOptions): Promise<unknown>;
    /**
     * Returns a serialized `inactivate_validator` transaction. You need to provide the address of a basic
     * account (the sender wallet) to pay the transaction fee.
     */
    createDeactivateValidatorTransaction(p: DeactiveValidatorTxParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a `inactivate_validator` transaction. You need to provide the address of a basic
     * account (the sender wallet) to pay the transaction fee.
     */
    sendDeactivateValidatorTransaction(p: DeactiveValidatorTxParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a `inactivate_validator` transaction and waits for confirmation.
     * You need to provide the address of a basic account (the sender wallet)
     * to pay the transaction fee.
     */
    sendSyncDeactivateValidatorTransaction(p: DeactiveValidatorTxParams, options?: SendTxCallOptions): Promise<unknown>;
    /**
     * Returns a serialized `reactivate_validator` transaction. You need to provide the address of a basic
     * account (the sender wallet) to pay the transaction fee.
     */
    createReactivateValidatorTransaction(p: ReactivateValidatorTxParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a `reactivate_validator` transaction. You need to provide the address of a basic
     * account (the sender wallet) to pay the transaction fee.
     */
    sendReactivateValidatorTransaction(p: ReactivateValidatorTxParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a `reactivate_validator` transaction and waits for confirmation.
     * You need to provide the address of a basic account (the sender wallet)
     * to pay the transaction fee.
     */
    sendSyncReactivateValidatorTransaction(p: ReactivateValidatorTxParams, options?: SendTxCallOptions): Promise<unknown>;
    /**
     * Returns a serialized `retire_validator` transaction. You need to provide the address of a basic
     * account (the sender wallet) to pay the transaction fee.
     */
    createRetireValidatorTransaction(p: RetireValidatorTxParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a `retire_validator` transaction. You need to provide the address of a basic
     * account (the sender wallet) to pay the transaction fee.
     */
    sendRetireValidatorTransaction(p: RetireValidatorTxParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a `retire_validator` transaction and waits for confirmation.
     * You need to provide the address of a basic account (the sender wallet)
     * to pay the transaction fee.
     */
    sendSyncRetireValidatorTransaction(p: RetireValidatorTxParams, options?: SendTxCallOptions): Promise<unknown>;
    /**
     * Returns a serialized `delete_validator` transaction. The transaction fee will be paid from the
     * validator deposit that is being returned.
     * Note in order for this transaction to be accepted fee + value should be equal to the validator deposit, which is not a fixed value:
     * Failed delete validator transactions can diminish the validator deposit
     */
    createDeleteValidatorTransaction(p: DeleteValidatorTxParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a `delete_validator` transaction. The transaction fee will be paid from the
     * validator deposit that is being returned.
     * Note in order for this transaction to be accepted fee + value should be equal to the validator deposit, which is not a fixed value:
     * Failed delete validator transactions can diminish the validator deposit
     */
    sendDeleteValidatorTransaction(p: DeleteValidatorTxParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Sends a `delete_validator` transaction and waits for confirmation.
     * The transaction fee will be paid from the validator deposit that is being returned.
     * Note in order for this transaction to be accepted fee + value should be equal to the validator deposit, which is not a fixed value:
     * Failed delete validator transactions can diminish the validator deposit
     */
    sendSyncDeleteValidatorTransaction(p: DeleteValidatorTxParams, options?: SendTxCallOptions): Promise<unknown>;
}

type consensus_ConsensusClient = ConsensusClient;
declare const consensus_ConsensusClient: typeof ConsensusClient;
type consensus_DeactiveValidatorTxParams = DeactiveValidatorTxParams;
type consensus_DeleteValidatorTxParams = DeleteValidatorTxParams;
type consensus_HtlcTransactionParams = HtlcTransactionParams;
type consensus_NewValidatorTxParams = NewValidatorTxParams;
type consensus_RawTransactionInfoParams = RawTransactionInfoParams;
type consensus_ReactivateValidatorTxParams = ReactivateValidatorTxParams;
type consensus_RedeemEarlyHtlcTxParams = RedeemEarlyHtlcTxParams;
type consensus_RedeemRegularHtlcTxParams = RedeemRegularHtlcTxParams;
type consensus_RedeemTimeoutHtlcTxParams = RedeemTimeoutHtlcTxParams;
type consensus_RedeemVestingTxParams = RedeemVestingTxParams;
type consensus_RetireValidatorTxParams = RetireValidatorTxParams;
type consensus_SetInactiveStakeTxParams = SetInactiveStakeTxParams;
type consensus_SignRedeemEarlyHtlcParams = SignRedeemEarlyHtlcParams;
type consensus_StakeTxParams = StakeTxParams;
type consensus_StakerTxParams = StakerTxParams;
type consensus_TransactionParams = TransactionParams;
type consensus_TxLog = TxLog;
type consensus_UnstakeTxParams = UnstakeTxParams;
type consensus_UpdateStakerTxParams = UpdateStakerTxParams;
type consensus_UpdateValidatorTxParams = UpdateValidatorTxParams;
type consensus_VestingTxParams = VestingTxParams;
declare namespace consensus {
  export { consensus_ConsensusClient as ConsensusClient, type consensus_DeactiveValidatorTxParams as DeactiveValidatorTxParams, type consensus_DeleteValidatorTxParams as DeleteValidatorTxParams, type consensus_HtlcTransactionParams as HtlcTransactionParams, type consensus_NewValidatorTxParams as NewValidatorTxParams, type consensus_RawTransactionInfoParams as RawTransactionInfoParams, type consensus_ReactivateValidatorTxParams as ReactivateValidatorTxParams, type consensus_RedeemEarlyHtlcTxParams as RedeemEarlyHtlcTxParams, type consensus_RedeemRegularHtlcTxParams as RedeemRegularHtlcTxParams, type consensus_RedeemTimeoutHtlcTxParams as RedeemTimeoutHtlcTxParams, type consensus_RedeemVestingTxParams as RedeemVestingTxParams, type consensus_RetireValidatorTxParams as RetireValidatorTxParams, type consensus_SetInactiveStakeTxParams as SetInactiveStakeTxParams, type consensus_SignRedeemEarlyHtlcParams as SignRedeemEarlyHtlcParams, type consensus_StakeTxParams as StakeTxParams, type consensus_StakerTxParams as StakerTxParams, type consensus_TransactionParams as TransactionParams, type consensus_TxLog as TxLog, type consensus_UnstakeTxParams as UnstakeTxParams, type consensus_UpdateStakerTxParams as UpdateStakerTxParams, type consensus_UpdateValidatorTxParams as UpdateValidatorTxParams, type consensus_VestingTxParams as VestingTxParams };
}

interface PushTransactionParams {
    transaction: RawTransaction;
    withHighPriority?: boolean;
}
interface MempoolContentParams {
    includeTransactions: boolean;
}
declare class MempoolClient {
    private client;
    constructor(http: HttpClient);
    /**
     * Pushes the given serialized transaction to the local mempool
     *
     * @param params
     * @param params.transaction Serialized transaction
     * @param params.withHighPriority Whether to push the transaction with high priority
     * @returns Transaction hash
     */
    pushTransaction({ transaction, withHighPriority }: PushTransactionParams, options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Content of the mempool
     *
     * @param params
     * @param params.includeTransactions
     * @returns includeTransactions ? Transaction[] : Hash[]
     */
    mempoolContent({ includeTransactions }?: MempoolContentParams, options?: HttpOptions): Promise<CallResult<(string | Transaction)[], undefined>>;
    /**
     * Obtains the mempool content in fee per byte buckets
     *
     * @params options
     * @returns Mempool content in fee per byte buckets
     */
    mempool(options?: HttpOptions): Promise<CallResult<MempoolInfo, undefined>>;
    /**
     * Obtains the minimum fee per byte as per mempool configuration
     *
     * @params options
     * @returns Minimum fee per byte
     */
    getMinFeePerByte(options?: HttpOptions): Promise<CallResult<number, undefined>>;
    /**
     * @param hash Transaction hash
     * @returns Transaction
     */
    getTransactionFromMempool(hash: Hash, options?: HttpOptions): Promise<CallResult<Transaction, undefined>>;
}

type mempool_MempoolClient = MempoolClient;
declare const mempool_MempoolClient: typeof MempoolClient;
type mempool_MempoolContentParams = MempoolContentParams;
type mempool_PushTransactionParams = PushTransactionParams;
declare namespace mempool {
  export { mempool_MempoolClient as MempoolClient, type mempool_MempoolContentParams as MempoolContentParams, type mempool_PushTransactionParams as PushTransactionParams };
}

declare class NetworkClient {
    private client;
    constructor(http: HttpClient);
    /**
     * The peer ID for our local peer.
     */
    getPeerId(options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Returns the number of peers.
     */
    getPeerCount(options?: HttpOptions): Promise<CallResult<number, undefined>>;
    /**
     * Returns a list with the IDs of all our peers.
     */
    getPeerList(options?: HttpOptions): Promise<CallResult<string[], undefined>>;
}

type network_NetworkClient = NetworkClient;
declare const network_NetworkClient: typeof NetworkClient;
declare namespace network {
  export { network_NetworkClient as NetworkClient };
}

interface SupplyAtParams {
    genesisSupply: number;
    genesisTime: number;
    currentTime: number;
}
declare class PolicyClient {
    private client;
    constructor(http: HttpClient);
    /**
     * Gets a bundle of policy constants
     *
     * RPC method name: "getPolicyConstants"
     *
     * @param options
     */
    getPolicyConstants(options?: HttpOptions): Promise<CallResult<PolicyConstants, undefined>>;
    /**
     * Returns the epoch number at a given block number (height).
     *
     * RPC method name: "getEpochAt"
     *
     * @param blockNumber
     * @param options
     */
    getEpochAt(blockNumber: BlockNumber, options?: HttpOptions): Promise<CallResult<number, undefined>>;
    /**
     *  Returns the epoch index at a given block number. The epoch index is the number of a block relative
     * to the epoch it is in. For example, the first block of any epoch always has an epoch index of 0.
     *
     * RPC method name: "getEpochIndexAt"
     *
     * @param blockNumber
     * @param options
     * @returns The epoch index at a given block number.
     */
    getEpochIndexAt(blockNumber: BlockNumber, options?: HttpOptions): Promise<CallResult<number, undefined>>;
    /**
     * Returns the batch number at a given `block_number` (height)
     *
     * RPC method name: "getBatchAt"
     *
     * @param blockNumber
     * @param options
     * @returns The batch number at a given `block_number` (height)
     */
    getBatchAt(blockNumber: BlockNumber, options?: HttpOptions): Promise<CallResult<number, undefined>>;
    /**
     * Returns the batch index at a given block number. The batch index is the number of a block relative
     * to the batch it is in. For example, the first block of any batch always has an batch index of 0.
     *
     * RPC method name: "getBatchIndexAt"
     *
     * @param blockNumber
     * @param options
     * @returns The batch index at a given block number.
     */
    getBatchIndexAt(blockNumber: BlockNumber, options?: HttpOptions): Promise<CallResult<number, undefined>>;
    /**
     * Gets the number (height) of the next election macro block after a given block number (height).
     *
     * RPC method name: "getElectionBlockAfter"
     *
     * @param blockNumber
     * @returns The number (height) of the next election macro block after a given block number (height).
     */
    getElectionBlockAfter(blockNumber: BlockNumber, options?: HttpOptions): Promise<CallResult<number, undefined>>;
    /**
     * Gets the block number (height) of the preceding election macro block before a given block number (height).
     * If the given block number is an election macro block, it returns the election macro block before it.
     *
     * RPC method name: "getElectionBlockBefore"
     *
     * @param blockNumber
     * @param options
     * @returns The block number (height) of the preceding election macro block before a given block number (height).
     */
    getElectionBlockBefore(blockNumber: BlockNumber, options?: HttpOptions): Promise<CallResult<number, undefined>>;
    /**
     * Gets the block number (height) of the last election macro block at a given block number (height).
     * If the given block number is an election macro block, then it returns that block number.
     *
     * RPC method name: "getLastElectionBlock"
     *
     * @param blockNumber
     * @param options
     * @returns The block number (height) of the last election macro block at a given block number (height).
     */
    getLastElectionBlock(blockNumber: BlockNumber, options?: HttpOptions): Promise<CallResult<number, undefined>>;
    /**
     * Gets a boolean expressing if the block at a given block number (height) is an election macro block.
     *
     * RPC method name: "getIsElectionBlockAt"
     *
     * @param blockNumber The block number (height) to query.
     * @parm options
     * @returns A boolean expressing if the block at a given block number (height) is an election macro block.
     */
    getIsElectionBlockAt(blockNumber: BlockNumber, options?: HttpOptions): Promise<CallResult<boolean, undefined>>;
    /**
     * Gets the block number (height) of the next macro block after a given block number (height).
     *
     * RPC method name: "getMacroBlockAfter"
     *
     * @param blockNumber The block number (height) to query.
     * @returns The block number (height) of the next macro block after a given block number (height).
     */
    getMacroBlockAfter(blockNumber: BlockNumber, options?: HttpOptions): Promise<CallResult<number, undefined>>;
    /**
     * Gets the block number (height) of the preceding macro block before a given block number (height).
     *
     * RPC method name: "getMacroBlockBefore"
     *
     * @param blockNumber The block number (height) to query.
     * @returns The block number (height) of the preceding macro block before a given block number (height).
     */
    getMacroBlockBefore(blockNumber: BlockNumber, options?: HttpOptions): Promise<CallResult<number, undefined>>;
    /**
     * Gets the block number (height) of the last macro block at a given block number (height).
     * If the given block number is a macro block, then it returns that block number.
     *
     * RPC method name: "getLastMacroBlock"
     *
     * @param blockNumber The block number (height) to query.
     * @returns The block number (height) of the last macro block at a given block number (height).
     */
    getLastMacroBlock(blockNumber: BlockNumber, options?: HttpOptions): Promise<CallResult<number, undefined>>;
    /**
     * Gets a boolean expressing if the block at a given block number (height) is a macro block.
     *
     * RPC method name: "getIsMacroBlockAt"
     *
     * @param blockNumber The block number (height) to query.
     * @returns A boolean expressing if the block at a given block number (height) is a macro block.
     */
    getIsMacroBlockAt(blockNumber: BlockNumber, options?: HttpOptions): Promise<CallResult<boolean, undefined>>;
    /**
     * Gets the block number (height) of the next micro block after a given block number (height).
     *
     * RPC method name: "getMicroBlockAfter"
     *
     * @param blockNumber
     * @param options
     * @returns The block number (height) of the next micro block after a given block number (height).
     */
    getIsMicroBlockAt(blockNumber: BlockNumber, options?: HttpOptions): Promise<CallResult<boolean, undefined>>;
    /**
     * Gets the block number (height) of the first block of the given epoch (which is always a micro block).
     *
     * RPC method name: "getFirstBlockOf"
     *
     * @param epochIndex
     * @param options
     * @returns The block number (height) of the first block of the given epoch (which is always a micro block).
     */
    getFirstBlockOfEpoch(epochIndex: EpochIndex, options?: HttpOptions): Promise<CallResult<number, undefined>>;
    /**
     * Gets the block number of the first block of the given batch (which is always a micro block).
     *
     * RPC method name: "getFirstBlockOfBatch"
     *
     * @param batchIndex
     * @param options
     * @returns The block number of the first block of the given batch (which is always a micro block).
     */
    getFirstBlockOfBatch(batchIndex: BatchIndex, options?: HttpOptions): Promise<CallResult<number, undefined>>;
    /**
     * Gets the block number of the election macro block of the given epoch (which is always the last block).
     *
     * RPC method name: "getElectionBlockOf"
     *
     * @param epochIndex
     * @param options
     * @returns The block number of the election macro block of the given epoch (which is always the last block).
     */
    getElectionBlockOfEpoch(epochIndex: EpochIndex, options?: HttpOptions): Promise<CallResult<number, undefined>>;
    /**
     * Gets the block number of the macro block (checkpoint or election) of the given batch (which is always the last block).
     *
     * RPC method name: "getMacroBlockOf"
     *
     * @param batchIndex
     * @param options
     * @returns The block number of the macro block (checkpoint or election) of the given batch (which is always the last block).
     */
    getMacroBlockOfBatch(batchIndex: BatchIndex, options?: HttpOptions): Promise<CallResult<number, undefined>>;
    /**
     * Gets a boolean expressing if the batch at a given block number (height) is the first batch
     * of the epoch.
     *
     * RPC method name: "getFirstBatchOfEpoch"
     *
     * @param blockNumber
     * @param options
     * @returns A boolean expressing if the batch at a given block number (height) is the first batch
     */
    getFirstBatchOfEpoch(blockNumber: BlockNumber, options?: HttpOptions): Promise<CallResult<number, undefined>>;
    /**
     * Gets the supply at a given time (as Unix time) in Lunas (1 NIM = 100,000 Lunas). It is
     * calculated using the following formula:
     * Supply (t) = Genesis_supply + Initial_supply_velocity / Supply_decay * (1 - e^(- Supply_decay * t))
     * Where e is the exponential function, t is the time in milliseconds since the genesis block and
     * Genesis_supply is the supply at the genesis of the Nimiq 2.0 chain.
     *
     * RPC method name: "getSupplyAt"
     *
     * @param params
     * @param params.genesisSupply supply at genesis
     * @param params.genesisTime timestamp of genesis block
     * @param params.currentTime timestamp to calculate supply at
     * @returns The supply at a given time (as Unix time) in Lunas (1 NIM = 100,000 Lunas).
     */
    getSupplyAt({ genesisSupply, genesisTime, currentTime }: SupplyAtParams, options?: HttpOptions): Promise<CallResult<number, undefined>>;
}

type policy_PolicyClient = PolicyClient;
declare const policy_PolicyClient: typeof PolicyClient;
type policy_SupplyAtParams = SupplyAtParams;
declare namespace policy {
  export { policy_PolicyClient as PolicyClient, type policy_SupplyAtParams as SupplyAtParams };
}

interface SetAutomaticReactivationParams {
    automaticReactivation: boolean;
}
declare class ValidatorClient {
    private client;
    constructor(http: HttpClient);
    /**
     * Returns our validator address.
     */
    getAddress(options?: HttpOptions): Promise<CallResult<`NQ${number} ${string}`, undefined>>;
    /**
     * Returns our validator signing key
     */
    getSigningKey(options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Returns our validator voting key
     */
    getVotingKey(options?: HttpOptions): Promise<CallResult<string, undefined>>;
    /**
     * Updates the configuration setting to automatically reactivate our validator
     */
    setAutomaticReactivation({ automaticReactivation }: SetAutomaticReactivationParams, options?: HttpOptions): Promise<CallResult<null, undefined>>;
}

type validator_SetAutomaticReactivationParams = SetAutomaticReactivationParams;
type validator_ValidatorClient = ValidatorClient;
declare const validator_ValidatorClient: typeof ValidatorClient;
declare namespace validator {
  export { type validator_SetAutomaticReactivationParams as SetAutomaticReactivationParams, validator_ValidatorClient as ValidatorClient };
}

interface ImportKeyParams {
    keyData: string;
    passphrase?: string;
}
interface UnlockAccountParams {
    passphrase?: string;
    duration?: number;
}
interface CreateAccountParams {
    passphrase?: string;
}
interface SignParams {
    message: string;
    address: Address;
    passphrase: string;
    isHex: boolean;
}
interface VerifySignatureParams {
    message: string;
    publicKey: string;
    signature: Signature;
    isHex: boolean;
}
declare class WalletClient {
    private client;
    constructor(http: HttpClient);
    importRawKey({ keyData, passphrase }: ImportKeyParams, options?: HttpOptions): Promise<CallResult<`NQ${number} ${string}`, undefined>>;
    isAccountImported(address: Address, options?: HttpOptions): Promise<CallResult<boolean, undefined>>;
    listAccounts(options?: HttpOptions): Promise<CallResult<boolean, undefined>>;
    lockAccount(address: Address, options?: HttpOptions): Promise<CallResult<null, undefined>>;
    createAccount(p?: CreateAccountParams, options?: HttpOptions): Promise<CallResult<WalletAccount, undefined>>;
    unlockAccount(address: Address, { passphrase, duration }: UnlockAccountParams, options?: HttpOptions): Promise<CallResult<boolean, undefined>>;
    isAccountLocked(address: Address, options?: HttpOptions): Promise<CallResult<boolean, undefined>>;
    sign({ message, address, passphrase, isHex }: SignParams, options?: HttpOptions): Promise<CallResult<Signature, undefined>>;
    verifySignature({ message, publicKey, signature, isHex }: VerifySignatureParams, options?: HttpOptions): Promise<CallResult<boolean, undefined>>;
}

type wallet_CreateAccountParams = CreateAccountParams;
type wallet_ImportKeyParams = ImportKeyParams;
type wallet_SignParams = SignParams;
type wallet_UnlockAccountParams = UnlockAccountParams;
type wallet_VerifySignatureParams = VerifySignatureParams;
type wallet_WalletClient = WalletClient;
declare const wallet_WalletClient: typeof WalletClient;
declare namespace wallet {
  export { type wallet_CreateAccountParams as CreateAccountParams, type wallet_ImportKeyParams as ImportKeyParams, type wallet_SignParams as SignParams, type wallet_UnlockAccountParams as UnlockAccountParams, type wallet_VerifySignatureParams as VerifySignatureParams, wallet_WalletClient as WalletClient };
}

declare class ZkpComponentClient {
    private client;
    constructor(http: HttpClient);
    /**
     * Returns the latest header number, block number and proof
     * @returns the latest header number, block number and proof
     */
    getZkpState(options?: HttpOptions): Promise<{
        error: {
            code: number;
            message: string;
        };
        data: undefined;
        context: Context;
        metadata?: undefined;
    } | {
        error: undefined;
        data: {
            latestHeaderHash: string;
            latestBlockNumber: number;
            latestProof: string | undefined;
        };
        context: Context;
        metadata: undefined;
    }>;
}

type zkpComponent_ZkpComponentClient = ZkpComponentClient;
declare const zkpComponent_ZkpComponentClient: typeof ZkpComponentClient;
declare namespace zkpComponent {
  export { zkpComponent_ZkpComponentClient as ZkpComponentClient };
}

declare class Client {
    http: HttpClient;
    ws: WebSocketClient;
    block: {
        /**
         * Returns the block number for the current head.
         */
        current: (options?: HttpOptions) => Promise<CallResult<number, undefined>>;
        /**
         * Tries to fetch a block given its hash. It has an option to include the transactions in
         * the block, which defaults to false.
         */
        getByHash: <T extends GetBlockByHashParams>(hash: string, p?: T | undefined, options?: HttpOptions) => Promise<CallResult<T["includeTransactions"] extends true ? Block : PartialBlock, undefined>>;
        /**
         * Tries to fetch a block given its number. It has an option to include the transactions in
         * the block, which defaults to false.
         */
        getByNumber: <T_1 extends GetBlockByBlockNumberParams>(blockNumber: number, p?: T_1 | undefined, options?: HttpOptions) => Promise<CallResult<T_1["includeTransactions"] extends true ? Block : PartialBlock, undefined>>;
        /**
         * Returns the block at the head of the main chain. It has an option to include the
         * transactions in the block, which defaults to false.
         */
        latest: <T_2 extends GetLatestBlockParams>(p?: T_2, options?: HttpOptions) => Promise<CallResult<T_2["includeTransactions"] extends true ? Block : PartialBlock, undefined>>;
        /**
         * Returns the index of the block in its batch. Starting from 0.
         */
        batchIndex: (blockNumber: number, options?: HttpOptions) => Promise<CallResult<number, undefined>>;
        /**
         * Returns the index of the block in its epoch. Starting from 0.
         */
        epochIndex: (blockNumber: number, options?: HttpOptions) => Promise<CallResult<number, undefined>>;
        /**
         * Election blocks are the first blocks of each epoch
         */
        election: {
            /**
             * Gets the number (height) of the next election macro block after a given block
             * number (height).
             *
             * @param blockNumber The block number (height) to query.
             * @returns The number (height) of the next election macro block after a given
             * block number (height).
             */
            after: (blockNumber: number, options?: HttpOptions) => Promise<CallResult<number, undefined>>;
            /**
             * Gets the block number (height) of the preceding election macro block before
             * a given block number (height). If the given block number is an election macro
             * block, it returns the election macro block before it.
             *
             * @param blockNumber The block number (height) to query.
             * @returns The block number (height) of the preceding election macro block before
             * a given block number (height).
             */
            before: (blockNumber: number, options?: HttpOptions) => Promise<CallResult<number, undefined>>;
            /**
             * Gets the block number (height) of the last election macro block at a given block
             * number (height). If the given block number is an election macro block, then it
             * returns that block number.
             *
             * @param blockNumber The block number (height) to query.
             * @returns
             */
            last: (blockNumber: number, options?: HttpOptions) => Promise<CallResult<number, undefined>>;
            /**
             * Gets the block number of the election macro block of the given epoch (which is
             * always the last block).
             *
             * @param epochIndex The epoch index to query.
             * @returns The block number of the election macro block of the given epoch (which
             * is always the last block).
             */
            getByEpoch: (epochIndex: number, options?: HttpOptions) => Promise<CallResult<number, undefined>>;
            /**
             * Subscribes to pre epoch validators events.
             */
            subscribe: <T_3 extends SubscribeForValidatorElectionByAddressParams, O extends StreamOptions<Validator>>(p: T_3, userOptions?: Partial<O> | undefined) => Promise<Subscription<Validator>>;
        };
        /**
         * Gets a boolean expressing if the block at a given block number (height) is an election macro block.
         *
         * @param blockNumber The block number (height) to query.
         * @returns A boolean expressing if the block at a given block number (height) is an election macro block.
         */
        isElection: (blockNumber: number, options?: HttpOptions) => Promise<CallResult<boolean, undefined>>;
        /**
         * Macro blocks are the first blocks of each batch
         */
        macro: {
            /**
             * Gets the block number (height) of the next macro block after a given block number (height).
             *
             * @param blockNumber The block number (height) to query.
             * @returns The block number (height) of the next macro block after a given block number (height).
             */
            after: (blockNumber: number, options?: HttpOptions) => Promise<CallResult<number, undefined>>;
            /**
             * Gets the block number (height) of the preceding macro block before a given block number
             * (height).
             *
             * @param blockNumber The block number (height) to query.
             * @returns The block number (height) of the preceding macro block before a given block
             * number (height).
             */
            before: (blockNumber: number, options?: HttpOptions) => Promise<CallResult<number, undefined>>;
            /**
             * Gets the block number (height) of the last macro block at a given block number (height).
             * If the given block number is a macro block, then it returns that block number.
             *
             * @param blockNumber The block number (height) to query.
             * @returns The block number (height) of the last macro block at a given block number (height).
             */
            last: (blockNumber: number, options?: HttpOptions) => Promise<CallResult<number, undefined>>;
            /**
             * Gets the block number of the macro block (checkpoint or election) of the given batch
             * (which
             * is always the last block).
             *
             * @param batchIndex The batch index to query.
             * @returns The block number of the macro block (checkpoint or election) of the given
             * batch (which
             * is always the last block).
             */
            getByBatch: (batchIndex: number, options?: HttpOptions) => Promise<CallResult<number, undefined>>;
        };
        /**
         * Gets a boolean expressing if the block at a given block number (height) is a macro block.
         *
         * @param blockNumber The block number (height) to query.
         * @returns A boolean expressing if the block at a given block number (height) is a macro block.
         */
        isMacro: (blockNumber: number, options?: HttpOptions) => Promise<CallResult<boolean, undefined>>;
        /**
         * Gets the block number (height) of the next micro block after a given block number (height).
         *
         * @param blockNumber The block number (height) to query.
         * @returns The block number (height) of the next micro block after a given block number (height).
         */
        isMicro: (blockNumber: number, options?: HttpOptions) => Promise<CallResult<boolean, undefined>>;
        /**
         * Subscribes to new block events.
         */
        subscribe: <T_4 extends SubscribeForHeadBlockParams | SubscribeForHeadHashParams, O_1 extends StreamOptions<T_4 extends SubscribeForHeadBlockParams ? Block | PartialBlock : string>>(params: T_4, userOptions?: Partial<O_1> | undefined) => Promise<Subscription<any>>;
    };
    batch: {
        /**
         * Returns the batch number for the current head.
         */
        current: (options?: HttpOptions) => Promise<CallResult<number, undefined>>;
        /**
         * Gets the batch number at a given `block_number` (height)
         *
         * @param blockNumber The block number (height) to query.
         * @param justIndex The batch index is the number of a block relative to the batch it is in.
         * For example, the first block of any batch always has an epoch index of 0.
         * @returns The epoch number at the given block number (height).
         */
        at: (blockNumber: number, options?: HttpOptions) => Promise<CallResult<number, undefined>>;
        /**
         * Gets the block number (height) of the first block of the given epoch (which is always
         * a micro block).
         *
         * @param epochIndex The epoch index to query.
         * @returns The block number (height) of the first block of the given epoch (which is always
         * a micro block).
         */
        firstBlock: (batchIndex: number, options?: HttpOptions) => Promise<CallResult<number, undefined>>;
    };
    epoch: {
        /**
         * Returns the epoch number for the current head.
         */
        current: (options?: HttpOptions) => Promise<CallResult<number, undefined>>;
        /**
         * Gets the epoch number at a given `block_number` (height)
         *
         * @param blockNumber The block number (height) to query.
         * @param justIndex The epoch index is the number of a block relative to the epoch it is in.
         * For example, the first block of any epoch always has an epoch index of 0.
         * @returns The epoch number at the given block number (height) or index
         */
        at: (blockNumber: number, options?: HttpOptions) => Promise<CallResult<number, undefined>>;
        /**
         * Gets the block number (height) of the first block of the given epoch (which is always a micro block).
         *
         * @param epochIndex The epoch index to query.
         * @returns The block number (height) of the first block of the given epoch (which is always a micro block).
         */
        firstBlock: (epochIndex: number, options?: HttpOptions) => Promise<CallResult<number, undefined>>;
        /**
         * Gets a boolean expressing if the batch at a given block number (height) is the first batch
         * of the epoch.
         *
         * @param blockNumber The block number (height) to query.
         * @returns A boolean expressing if the batch at a given block number (height) is the first batch
         */
        firstBatch: (blockNumber: number, options?: HttpOptions) => Promise<CallResult<number, undefined>>;
    };
    transaction: {
        /**
         * Fetches the transactions given the address.
         *
         * It returns the latest transactions for a given address. All the transactions
         * where the given address is listed as a recipient or as a sender are considered. Reward
         * transactions are also returned. It has an option to specify the maximum number of transactions
         * to fetch, it defaults to 500.
         */
        getByAddress: <T extends GetTransactionsByAddressParams>(address: `NQ${number} ${string}`, p?: T | undefined, options?: HttpOptions) => Promise<CallResult<T["justHashes"] extends true ? Transaction[] : string[], undefined>>;
        /**
         * Fetches the transactions given the batch number.
         */
        getByBatch: (batchIndex: number, options?: HttpOptions) => Promise<CallResult<Transaction[], undefined>>;
        /**
         * Fetches the transactions given the block number.
         */
        getByBlockNumber: (blockNumber: number, options?: HttpOptions) => Promise<CallResult<Transaction[], undefined>>;
        /**
         * Fetches the transaction given the hash.
         */
        getByHash: (hash: string, options?: HttpOptions) => Promise<CallResult<Transaction, undefined>>;
        /**
         * Pushes the given serialized transaction to the local mempool
         *
         * @param transaction Serialized transaction
         * @returns Transaction hash
         */
        push: ({ transaction, withHighPriority }: PushTransactionParams, options?: HttpOptions) => Promise<CallResult<string, undefined>>;
        /**
         * @returns
         */
        minFeePerByte: (options?: HttpOptions) => Promise<CallResult<number, undefined>>;
        /**
         * Creates a serialized transaction
         */
        create: (p: TransactionParams, options?: HttpOptions) => Promise<CallResult<string, undefined>>;
        /**
         * Sends a transaction
         */
        send: (p: TransactionParams, options?: HttpOptions) => Promise<CallResult<string, undefined>>;
        /**
         * Sends a transaction and waits for confirmation
         */
        sendSync: (p: TransactionParams, options: SendTxCallOptions) => Promise<unknown>;
    };
    inherent: {
        /**
         * Fetches the inherents given the batch number.
         */
        getByBatch: (batchIndex: number, options?: HttpOptions) => Promise<CallResult<Inherent[], undefined>>;
        /**
         * Fetches the inherents given the block number.
         */
        getByBlock: (blockNumber: number, options?: HttpOptions) => Promise<CallResult<Inherent[], undefined>>;
    };
    account: {
        /**
         * Tries to fetch the account at the given address.
         */
        getByAddress: <T extends {
            withMetadata: boolean;
        }>(address: `NQ${number} ${string}`, { withMetadata }: T, options?: HttpOptions) => Promise<CallResult<Account, T["withMetadata"] extends true ? BlockchainState : undefined>>;
        /**
         * Fetches the account given the address.
         */
        importRawKey: ({ keyData, passphrase }: ImportKeyParams, options?: HttpOptions) => Promise<CallResult<`NQ${number} ${string}`, undefined>>;
        /**
         * Fetches the account given the address.
         */
        new: (p?: CreateAccountParams | undefined, options?: HttpOptions) => Promise<CallResult<WalletAccount, undefined>>;
        /**
         * Returns a boolean indicating whether the account is imported or not.
         */
        isImported: (address: `NQ${number} ${string}`, options?: HttpOptions) => Promise<CallResult<boolean, undefined>>;
        /**
         * Returns a list of all accounts.
         */
        list: (options?: HttpOptions) => Promise<CallResult<boolean, undefined>>;
        /**
         * Locks the account at the given address.
         */
        lock: (address: `NQ${number} ${string}`, options?: HttpOptions) => Promise<CallResult<null, undefined>>;
        /**
         * Unlocks the account at the given address.
         */
        unlock: (address: `NQ${number} ${string}`, { passphrase, duration }: UnlockAccountParams, options?: HttpOptions) => Promise<CallResult<boolean, undefined>>;
        /**
         * Returns a boolean indicating whether the account is locked or not.
         */
        isLocked: (address: `NQ${number} ${string}`, options?: HttpOptions) => Promise<CallResult<boolean, undefined>>;
        /**
         * Signs the given data with the account at the given address.
         */
        sign: ({ message, address, passphrase, isHex }: SignParams, options?: HttpOptions) => Promise<CallResult<Signature, undefined>>;
        /**
         * Verifies the given signature with the account at the given address.
         */
        verify: ({ message, publicKey, signature, isHex }: VerifySignatureParams, options?: HttpOptions) => Promise<CallResult<boolean, undefined>>;
    };
    validator: {
        /**
         * Tries to fetch a validator information given its address. It has an option to include a map
         * containing the addresses and stakes of all the stakers that are delegating to the validator.
         */
        byAddress: (address: `NQ${number} ${string}`, options?: HttpOptions) => Promise<CallResult<Validator, undefined>>;
        /**
         * Updates the configuration setting to automatically reactivate our validator
         */
        setAutomaticReactivation: ({ automaticReactivation }: SetAutomaticReactivationParams, options?: HttpOptions) => Promise<CallResult<null, undefined>>;
        /**
         * Returns the information of the validator running on the node
         */
        selfNode: {
            /**
             * Returns our validator address.
             */
            address: (options?: HttpOptions) => Promise<CallResult<`NQ${number} ${string}`, undefined>>;
            /**
             * Returns our validator signing key.
             */
            signingKey: (options?: HttpOptions) => Promise<CallResult<string, undefined>>;
            /**
             * Returns our validator voting key.
             */
            votingKey: (options?: HttpOptions) => Promise<CallResult<string, undefined>>;
        };
        /**
         * Returns a collection of the currently active validator's addresses and balances.
         */
        activeList: <T extends {
            withMetadata: boolean;
        }>({ withMetadata }?: T, options?: HttpOptions) => Promise<CallResult<Validator[], T["withMetadata"] extends true ? BlockchainState : undefined>>;
        action: {
            new: {
                /**
                 * Returns a serialized `new_validator` transaction. You need to provide the address of a basic
                 * account (the sender wallet) to pay the transaction fee and the validator deposit.
                 * Since JSON doesn't have a primitive for Option (it just has the null primitive), we can't
                 * have a double Option. So we use the following work-around for the signal data:
                 * "" = Set the signal data field to None.
                 * "0x29a4b..." = Set the signal data field to Some(0x29a4b...).
                 */
                createTx: (p: NewValidatorTxParams, options?: HttpOptions) => Promise<CallResult<string, undefined>>;
                /**
                 * Sends a `new_validator` transaction. You need to provide the address of a basic
                 * account (the sender wallet) to pay the transaction fee and the validator deposit.
                 * Since JSON doesn't have a primitive for Option (it just has the null primitive), we can't
                 * have a double Option. So we use the following work-around for the signal data:
                 * "" = Set the signal data field to None.
                 * "0x29a4b..." = Set the signal data field to Some(0x29a4b...).
                 */
                sendTx: (p: NewValidatorTxParams, options?: HttpOptions) => Promise<CallResult<string, undefined>>;
                /**
                 * Sends a `new_validator` transaction. You need to provide the address of a basic
                 * account (the sender wallet) to pay the transaction fee and the validator deposit
                 * and waits for confirmation.
                 * Since JSON doesn't have a primitive for Option (it just has the null primitive), we can't
                 * have a double Option. So we use the following work-around for the signal data:
                 * "" = Set the signal data field to None.
                 * "0x29a4b..." = Set the signal data field to Some(0x29a4b...).
                 */
                sendSyncTx: (p: NewValidatorTxParams, options?: SendTxCallOptions) => Promise<unknown>;
            };
            update: {
                /**
                 * Returns a serialized `update_validator` transaction. You need to provide the address of a basic
                 * account (the sender wallet) to pay the transaction fee.
                 * Since JSON doesn't have a primitive for Option (it just has the null primitive), we can't
                 * have a double Option. So we use the following work-around for the signal data:
                 * null = No change in the signal data field.
                 * "" = Change the signal data field to None.
                 * "0x29a4b..." = Change the signal data field to Some(0x29a4b...).
                 */
                createTx: (p: UpdateValidatorTxParams, options?: HttpOptions) => Promise<CallResult<string, undefined>>;
                /**
                 * Sends a `update_validator` transaction. You need to provide the address of a basic
                 * account (the sender wallet) to pay the transaction fee.
                 * Since JSON doesn't have a primitive for Option (it just has the null primitive), we can't
                 * have a double Option. So we use the following work-around for the signal data:
                 * null = No change in the signal data field.
                 * "" = Change the signal data field to None.
                 * "0x29a4b..." = Change the signal data field to Some(0x29a4b...).
                 */
                sendTx: (p: UpdateValidatorTxParams, options?: HttpOptions) => Promise<CallResult<string, undefined>>;
                /**
                 * Sends a `update_validator` transaction. You need to provide the address of a basic
                 * account (the sender wallet) to pay the transaction fee and waits for confirmation.
                 * Since JSON doesn't have a primitive for Option (it just has the null primitive), we can't
                 * have a double Option. So we use the following work-around for the signal data:
                 * null = No change in the signal data field.
                 * "" = Change the signal data field to None.
                 * "0x29a4b..." = Change the signal data field to Some(0x29a4b...).
                 */
                sendSyncTx: (p: UpdateValidatorTxParams, options?: SendTxCallOptions) => Promise<unknown>;
            };
            deactivate: {
                /**
                 * Returns a serialized `inactivate_validator` transaction. You need to provide the address of a basic
                 * account (the sender wallet) to pay the transaction fee.
                 */
                createTx: (p: DeactiveValidatorTxParams, options?: HttpOptions) => Promise<CallResult<string, undefined>>;
                /**
                 * Sends a `inactivate_validator` transaction. You need to provide the address of a basic
                 * account (the sender wallet) to pay the transaction fee.
                 */
                sendTx: (p: DeactiveValidatorTxParams, options?: HttpOptions) => Promise<CallResult<string, undefined>>;
                /**
                 * Sends a `inactivate_validator` transaction and waits for confirmation.
                 * You need to provide the address of a basic account (the sender wallet)
                 * to pay the transaction fee.
                 */
                sendSyncTx: (p: DeactiveValidatorTxParams, options?: SendTxCallOptions) => Promise<unknown>;
            };
            reactivate: {
                /**
                 * Returns a serialized `reactivate_validator` transaction. You need to provide the address of a basic
                 * account (the sender wallet) to pay the transaction fee.
                 */
                createTx: (p: ReactivateValidatorTxParams, options?: HttpOptions) => Promise<CallResult<string, undefined>>;
                /**
                 * Sends a `reactivate_validator` transaction. You need to provide the address of a basic
                 * account (the sender wallet) to pay the transaction fee.
                 */
                sendTx: (p: ReactivateValidatorTxParams, options?: HttpOptions) => Promise<CallResult<string, undefined>>;
                /**
                 * Sends a `reactivate_validator` transaction and waits for confirmation.
                 * You need to provide the address of a basic account (the sender wallet)
                 * to pay the transaction fee.
                 */
                sendSyncTx: (p: ReactivateValidatorTxParams, options?: SendTxCallOptions) => Promise<unknown>;
            };
            unpark: {
                /**
                 * Returns a serialized `set_inactive_stake` transaction. You can pay the transaction fee from a basic
                 * account (by providing the sender wallet) or from the staker account's balance (by not
                 * providing a sender wallet).
                 */
                createTx: (p: SetInactiveStakeTxParams, options?: HttpOptions) => Promise<CallResult<string, undefined>>;
                /**
                 * Sends a `set_inactive_stake` transaction. You can pay the transaction fee from a basic
                 * account (by providing the sender wallet) or from the staker account's balance (by not
                 * providing a sender wallet).
                 */
                sendTx: (p: SetInactiveStakeTxParams, options?: HttpOptions) => Promise<CallResult<string, undefined>>;
                /**
                 *  Sends a `set_inactive_stake` transaction. You can pay the transaction fee from a basic
                 * account (by providing the sender wallet) or from the staker account's balance (by not
                 * providing a sender wallet) and waits for confirmation.
                 */
                sendSyncTx: (p: SetInactiveStakeTxParams, options?: SendTxCallOptions) => Promise<unknown>;
            };
            retire: {
                /**
                 * Returns a serialized `retire_validator` transaction. You need to provide the address of a basic
                 * account (the sender wallet) to pay the transaction fee.
                 */
                createTx: (p: RetireValidatorTxParams, options?: HttpOptions) => Promise<CallResult<string, undefined>>;
                /**
                 * Sends a `retire_validator` transaction. You need to provide the address of a basic
                 * account (the sender wallet) to pay the transaction fee.
                 */
                sendTx: (p: RetireValidatorTxParams, options?: HttpOptions) => Promise<CallResult<string, undefined>>;
                /**
                 * Sends a `retire_validator` transaction and waits for confirmation.
                 * You need to provide the address of a basic account (the sender wallet)
                 * to pay the transaction fee.
                 */
                sendSyncTx: (p: RetireValidatorTxParams, options?: SendTxCallOptions) => Promise<unknown>;
            };
            delete: {
                /**
                 * Returns a serialized `delete_validator` transaction. The transaction fee will be paid from the
                 * validator deposit that is being returned.
                 * Note in order for this transaction to be accepted fee + value should be equal to the validator deposit, which is not a fixed value:
                 * Failed delete validator transactions can diminish the validator deposit
                 */
                createTx: (p: DeleteValidatorTxParams, options?: HttpOptions) => Promise<CallResult<string, undefined>>;
                /**
                 * Sends a `delete_validator` transaction. The transaction fee will be paid from the
                 * validator deposit that is being returned.
                 * Note in order for this transaction to be accepted fee + value should be equal to the validator deposit, which is not a fixed value:
                 * Failed delete validator transactions can diminish the validator deposit
                 */
                sendTx: (p: DeleteValidatorTxParams, options?: HttpOptions) => Promise<CallResult<string, undefined>>;
                /**
                 * Sends a `delete_validator` transaction and waits for confirmation.
                 * The transaction fee will be paid from the validator deposit that is being returned.
                 * Note in order for this transaction to be accepted fee + value should be equal to the validator deposit, which is not a fixed value:
                 * Failed delete validator transactions can diminish the validator deposit
                 */
                sendSyncTx: (p: DeleteValidatorTxParams, options?: SendTxCallOptions) => Promise<unknown>;
            };
        };
    };
    slots: {
        /**
         * Returns the information for the slot owner at the given block height and offset. The
         * offset is optional, it will default to getting the offset for the existing block
         * at the given height.
         */
        at: <T extends GetSlotAtBlockParams>(blockNumber: number, p?: T | undefined, options?: HttpOptions) => Promise<CallResult<Slot, undefined>>;
        penalized: {
            /**
             * Returns information about the currently penalized slots. This includes slots that lost rewards
             * and that were disabled.
             */
            current: <T_1 extends {
                withMetadata: boolean;
            }>({ withMetadata }?: T_1, options?: HttpOptions) => Promise<CallResult<PenalizedSlot[], undefined>>;
            /**
             * Returns information about the penalized slots of the previous batch. This includes slots that
             * lost rewards and that were disabled.
             */
            previous: <T_2 extends {
                withMetadata: boolean;
            }>({ withMetadata }?: T_2, options?: HttpOptions) => Promise<CallResult<PenalizedSlot[], T_2["withMetadata"] extends true ? BlockchainState : undefined>>;
        };
    };
    mempool: {
        /**
         * @returns
         */
        info: (options?: HttpOptions) => Promise<CallResult<MempoolInfo, undefined>>;
        /**
         * Content of the mempool
         *
         * @param includeTransactions
         * @returns
         */
        content: ({ includeTransactions }?: MempoolContentParams, options?: HttpOptions) => Promise<CallResult<(string | Transaction)[], undefined>>;
    };
    stakes: {
        new: {
            /**
             * Returns a serialized transaction creating a new stake contract
             */
            createTx: (p: StakeTxParams, options?: HttpOptions) => Promise<CallResult<string, undefined>>;
            /**
             * Sends a transaction creating a new stake contract to the network
             */
            sendTx: (p: StakeTxParams, options?: HttpOptions) => Promise<CallResult<string, undefined>>;
            /**
             * Sends a transaction creating a new stake contract to the network and waits for confirmation
             */
            sendSyncTx: (p: StakeTxParams, options?: SendTxCallOptions) => Promise<unknown>;
        };
    };
    staker: {
        /**
         * Fetches the stakers given the batch number.
         */
        fromValidator: (address: `NQ${number} ${string}`, options?: HttpOptions) => Promise<CallResult<Validator, undefined>>;
        /**
         * Fetches the staker given the address.
         */
        getByAddress: (address: `NQ${number} ${string}`, options?: HttpOptions) => Promise<CallResult<Staker, undefined>>;
        new: {
            /**
             * Creates a new staker transaction
             */
            createTx: (p: StakerTxParams, options?: HttpOptions) => Promise<CallResult<string, undefined>>;
            /**
             * Sends a new staker transaction
             */
            sendTx: (p: StakerTxParams, options?: HttpOptions) => Promise<CallResult<string, undefined>>;
            /**
             * Sends a new staker transaction and waits for confirmation
             */
            sendSyncTx: (p: StakerTxParams, options?: SendTxCallOptions) => Promise<unknown>;
        };
        update: {
            /**
             * Creates a new staker transaction
             */
            createTx: (p: UpdateStakerTxParams, options?: HttpOptions) => Promise<CallResult<string, undefined>>;
            /**
             * Sends a new staker transaction
             */
            sendTx: (p: UpdateStakerTxParams, options?: HttpOptions) => Promise<CallResult<string, undefined>>;
            /**
             * Sends a new staker transaction and waits for confirmation
             */
            sendSyncTx: (p: UpdateStakerTxParams, options?: SendTxCallOptions) => Promise<unknown>;
        };
    };
    peers: {
        /**
         * The peer ID for our local peer.
         */
        id: (options?: HttpOptions) => Promise<CallResult<string, undefined>>;
        /**
         * Returns the number of peers.
         */
        count: (options?: HttpOptions) => Promise<CallResult<number, undefined>>;
        /**
         * Returns a list with the IDs of all our peers.
         */
        peers: (options?: HttpOptions) => Promise<CallResult<string[], undefined>>;
        /**
         * Returns a boolean specifying if we have established consensus with the network
         */
        consensusEstablished: (options?: HttpOptions) => Promise<CallResult<boolean, undefined>>;
    };
    supply_at: ({ genesisSupply, genesisTime, currentTime }: SupplyAtParams, options?: HttpOptions) => Promise<CallResult<number, undefined>>;
    htlc: {
        new: {
            /**
             * Returns a serialized transaction creating a new HTLC contract
             */
            createTx: (p: HtlcTransactionParams, options?: HttpOptions) => Promise<CallResult<string, undefined>>;
            /**
             * Creates a serialized transaction creating a new HTLC contract
             */
            sendTx: (p: HtlcTransactionParams, options?: HttpOptions) => Promise<CallResult<string, undefined>>;
            /**
             * Sends a transaction creating a new HTLC contract to the network and waits for confirmation
             */
            sendSyncTx: (p: HtlcTransactionParams, options?: SendTxCallOptions) => Promise<unknown>;
        };
        redeem: {
            regular: {
                /**
                 * Returns a serialized transaction redeeming a regular HTLC contract
                 */
                createTx: (p: RedeemRegularHtlcTxParams, options?: HttpOptions) => Promise<CallResult<string, undefined>>;
                /**
                 * Sends a transaction redeeming a regular HTLC contract to the network
                 */
                sendTx: (p: RedeemRegularHtlcTxParams, options?: HttpOptions) => Promise<CallResult<string, undefined>>;
                /**
                 * Sends a transaction redeeming a regular HTLC contract to the network and waits for confirmation
                 */
                sendSyncTx: (p: RedeemRegularHtlcTxParams, options?: SendTxCallOptions) => Promise<unknown>;
            };
            timeoutTx: {
                /**
                 * Returns a serialized transaction redeeming a timeout HTLC contract
                 */
                createTx: (p: RedeemTimeoutHtlcTxParams, options?: HttpOptions) => Promise<CallResult<string, undefined>>;
                /**
                 * Sends a transaction redeeming a timeout HTLC contract to the network
                 */
                sendTx: (p: RedeemTimeoutHtlcTxParams, options?: HttpOptions) => Promise<CallResult<string, undefined>>;
                /**
                 * Sends a transaction redeeming a timeout HTLC contract to the network and waits for confirmation
                 */
                sendSyncTx: (p: RedeemTimeoutHtlcTxParams, options?: SendTxCallOptions) => Promise<unknown>;
            };
            earlyTx: {
                /**
                 * Returns a serialized transaction redeeming an early HTLC contract
                 */
                createTx: (p: RedeemEarlyHtlcTxParams, options?: HttpOptions) => Promise<CallResult<string, undefined>>;
                /**
                 * Sends a transaction redeeming an early HTLC contract to the network
                 */
                sendTx: (p: RedeemEarlyHtlcTxParams, options?: HttpOptions) => Promise<CallResult<string, undefined>>;
                /**
                 * Sends a transaction redeeming an early HTLC contract to the network and waits for confirmation
                 */
                sendSyncTx: (p: RedeemEarlyHtlcTxParams, options?: SendTxCallOptions) => Promise<unknown>;
            };
        };
    };
    vesting: {
        new: {
            /**
             * Returns a serialized transaction creating a new vesting contract
             */
            createTx: (p: VestingTxParams, options?: HttpOptions) => Promise<CallResult<string, undefined>>;
            /**
             * Sends a transaction creating a new vesting contract to the network
             */
            sendTx: (p: VestingTxParams, options?: HttpOptions) => Promise<CallResult<string, undefined>>;
            /**
             * Sends a transaction creating a new vesting contract to the network and waits for confirmation
             */
            sendSyncTx: (p: VestingTxParams, options: SendTxCallOptions) => Promise<unknown>;
        };
        redeem: {
            /**
             * Returns a serialized transaction redeeming a vesting contract
             */
            createTx: (p: RedeemVestingTxParams, options?: HttpOptions) => Promise<CallResult<string, undefined>>;
            /**
             * Sends a transaction redeeming a vesting contract to the network
             */
            sendTx: (p: RedeemVestingTxParams, options?: HttpOptions) => Promise<CallResult<string, undefined>>;
            /**
             * Sends a transaction redeeming a vesting contract to the network and waits for confirmation
             */
            sendSyncTx: (p: RedeemVestingTxParams, options?: SendTxCallOptions) => Promise<unknown>;
        };
    };
    zeroKnowledgeProof: {
        /**
         * Returns the latest header number, block number and proof
         * @returns
         */
        state: (options?: HttpOptions) => Promise<{
            error: {
                code: number;
                message: string;
            };
            data: undefined;
            context: Context;
            metadata?: undefined;
        } | {
            error: undefined;
            data: {
                latestHeaderHash: string;
                latestBlockNumber: number;
                latestProof: string | undefined;
            };
            context: Context;
            metadata: undefined;
        }>;
    };
    logs: {
        /**
         * Subscribes to log events related to a given list of addresses and of any of the log types
         * provided. If addresses is empty it does not filter by address. If log_types is empty it
         * won't filter by log types.
         *
         * Thus the behavior is to assume all addresses or log_types are to be provided if the
         * corresponding vec is empty.
         */
        subscribe: <T extends SubscribeForLogsByAddressesAndTypesParams, O extends StreamOptions<BlockLog>>(p: T, userOptions?: Partial<O> | undefined) => Promise<Subscription<BlockLog>>;
    };
    modules: {
        blockchain: BlockchainClient;
        blockchainStreams: BlockchainStream;
        consensus: ConsensusClient;
        mempool: MempoolClient;
        network: NetworkClient;
        policy: PolicyClient;
        validator: ValidatorClient;
        wallet: WalletClient;
        zkpComponent: ZkpComponentClient;
    };
    /**
     * Policy constants. Make sure to call `await client.init()` before using them.
     */
    static policy: PolicyConstants;
    /**
     * @param url Node URL [?secret=secret]
     * @param auth { username, password }
     */
    constructor(url: URL, auth?: Auth);
    init(): Promise<boolean | any>;
    /**
     * Make a raw call to the Albatross Node.
     *
     * @param request - The request object containing the following properties:
     * @param request.method - The name of the method to call.
     * @param request.params - The parameters to pass with the call, if any.
     * @param request.withMetadata - Flag indicating whether metadata should be included in the response.
     * @param options - The HTTP options for the call. Defaults to DEFAULT_OPTIONS if not provided.
     * @returns A promise that resolves with the result of the call, which includes data and optionally metadata.
     */
    call<Data, Metadata = undefined>(request: {
        method: string;
        params?: any[];
        withMetadata?: boolean;
    }, options?: HttpOptions): Promise<CallResult<Data, Metadata>>;
    /**
     * Make a raw streaming call to the Albatross Node.
     *
     * @param request
     * @param userOptions
     * @returns A promise that resolves with a Subscription object.
     */
    subscribe<Data, Request extends {
        method: string;
        params?: any[];
        withMetadata?: boolean;
    }>(request: Request, userOptions: StreamOptions<Data>): Promise<Subscription<Data>>;
}

export { type Account, AccountType, type Address, type AppliedBlockLog, type Auth, type BasicAccount, type BatchIndex, type Block, type BlockLog, type BlockNumber, BlockType, blockchain as BlockchainClient, type BlockchainState, blockchainStreams as BlockchainStream, type CallResult, Client, type Coin, consensus as ConsensusClient, type Context, type CreateStakerLog, type CreateValidatorLog, type CurrentTime, DEFAULT_OPTIONS, DEFAULT_OPTIONS_SEND_TX, DEFAULT_TIMEOUT_CONFIRMATION, type DeactivateValidatorLog, type DeleteValidatorLog, type ElectionMacroBlock, type EpochIndex, type ErrorStreamReturn, type FailedTransactionLog, type FilterStreamFn, type GenesisSupply, type GenesisTime, type HTLCEarlyResolve, type HTLCRegularTransfer, type HTLCTimeoutResolve, type Hash, type HtlcAccount, type HtlcCreateLog, HttpClient, type HttpOptions, type Inherent, type Log, LogType, type MacroBlock, type MaybeStreamResponse, mempool as MempoolClient, type MempoolInfo, type MicroBlock, network as NetworkClient, type ParkLog, type PartialBlock, type PartialMacroBlock, type PartialMicroBlock, type PayFeeLog, type PayoutRewardLog, type PenalizedSlot, policy as PolicyClient, type PolicyConstants, type RawTransaction, type ReactivateValidatorLog, type RetireValidatorLog, type RevertContractLog, type RevertedBlockLog, type SendTxCallOptions, type SetInactiveStakeLog, type Signature, type SlashLog, type Slot, type StakeLog, type Staker, type StakerFeeDeductionLog, type StreamOptions, type Subscription, type Transaction, type TransactionLog, type TransferLog, type UnstakeLog, type UpdateStakerLog, type UpdateValidatorLog, type Validator, validator as ValidatorClient, type ValidatorFeeDeductionLog, type ValidityStartHeight, type VestingAccount, type VestingCreateLog, WS_DEFAULT_OPTIONS, type WalletAccount, wallet as WalletClient, WebSocketClient, type ZKPState, zkpComponent as ZkpComponentClient };
