import { BigNumber } from '@0x/utils';
import { linearBuckets } from 'prom-client';

// tslint:disable:custom-no-magic-numbers

export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
export const NULL_BYTES = '0x';
export const ZERO = new BigNumber(0);
export const DEFAULT_LOCAL_POSTGRES_URI = 'postgres://api:api@localhost/api';
export const DEFAULT_SENTRY_ENVIRONMENT = 'development';
export const DEFAULT_LOCAL_REDIS_URI = 'redis://localhost';
export const DEFAULT_LOGGER_INCLUDE_TIMESTAMP = true;
export const ONE_SECOND_MS = 1000;
export const ONE_MINUTE_S = 60;
export const ONE_HOUR_S = ONE_MINUTE_S * 60;
export const ONE_MINUTE_MS = ONE_SECOND_MS * 60;
export const TEN_MINUTES_MS = ONE_MINUTE_MS * 10;
export const HEX_BASE = 16;

// Constant to convert number of bps to ratio. E.g. 5 bps = 5 * 0.0001
export const BPS_TO_RATIO = 0.0001;

// Gasless OtcOrder constants
export const GASLESS_OTC_ORDER_NUM_BUCKETS = 1000;

// RFQM Service
export const KEEP_ALIVE_TTL = ONE_MINUTE_MS * 5;
export const DEFAULT_WORKER_TRANSACTION_WATCHER_SLEEP_TIME_MS = ONE_SECOND_MS * 15;

// API namespaces
export const METRICS_PATH = '/metrics';
export const RFQM_PATH = '/rfqm/v1';
export const RFQT_V1_PATH = '/rfqt/v1'; // RFQt should be internal in general, but as v1 will be deprecated soon we won't update it.
export const RFQT_V2_PATH = '/internal/rfqt/v2';
export const ZERO_G_ALIAS_PATH = '/zero-gas/swap/v1';
export const ZERO_G_PATH = '/zero-g/swap/v1';
export const TX_RELAY_V1_PATH = '/tx-relay/v1/swap';
export const RFQ_MAKER_PATH = '/maker/v1';
export const RFQ_MAKER_API_KEY_HEADER = '0x-maker-api-key';
export const HEALTHCHECK_PATH = '/healthz';
export const ADMIN_PATH = '/admin/v1';

// Meta Transactions
export const DEFAULT_ETH_GAS_STATION_API_URL = 'https://ethgasstation.api.0x.org/api/ethgasAPI.json';

// TransactionWatcher
// The expected time of a transaction to be mined according to ETHGasStation
// "Fast" gas price estimations multiplied by a safety margin.
export const DEFAULT_EXPECTED_MINED_SEC = 120 * 1.5;
export const ETH_DECIMALS = 18;
export const GWEI_DECIMALS = 9;

// RFQ quote expiry
export const DEFAULT_MIN_EXPIRY_DURATION_MS = ONE_MINUTE_MS;
export const GASLESS_RFQT_QUOTE_EXPIRY_DURATION_MS = ONE_SECOND_MS * 30;

// MetaTransactionClient endpoint timeouts
export const META_TRANSACTION_V1_CLIENT_TIMEOUT_MS = 10000;
export const META_TRANSACTION_V2_CLIENT_TIMEOUT_MS = 10000;

export const RFQ_ALLOWANCE_TARGET = '0xdef1c0ded9bec7f1a1670819833240f027b25eff';
export const RFQM_TX_GAS_ESTIMATE = 165e3;
export const RFQM_TX_OTC_ORDER_GAS_ESTIMATE = 100e3;
export const ZEROG_METATX_GAS_ESTIMATE = 500e3;
export const RFQT_GAS_IMPROVEMENT = 8e3;
export const RFQT_GAS_IMPROVEMENT_FALLBACK_GAS_PRICE = new BigNumber(10e9);

// SQS Client
export const LONG_POLLING_WAIT_TIME_SECONDS = 20;
export const SINGLE_MESSAGE = 1;

// Prometheus shared metrics
export const PROMETHEUS_REQUEST_BUCKETS = linearBuckets(0, 0.25, 25); // [ 0,  0.25,  0.5,  0.75, ... 5 ]

// Redis Client
export const MAKER_TOKEN_BALANCE_EXPIRY_SECONDS = 30;

// Default list of background jobs that the processor would execute
export const DEFAULT_BACKGROUND_JOB_TYPES = 'no_op';

export const EXECUTE_META_TRANSACTION_EIP_712_TYPES = {
    MetaTransaction: [
        { name: 'nonce', type: 'uint256' },
        { name: 'from', type: 'address' },
        { name: 'functionSignature', type: 'bytes' },
    ],
};

export const PERMIT_EIP_712_TYPES = {
    Permit: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
    ],
};

export const META_TRANSACTION_V1_EIP_712_TYPES = {
    MetaTransactionData: [
        { name: 'signer', type: 'address' },
        { name: 'sender', type: 'address' },
        { name: 'minGasPrice', type: 'uint256' },
        { name: 'maxGasPrice', type: 'uint256' },
        { name: 'expirationTimeSeconds', type: 'uint256' },
        { name: 'salt', type: 'uint256' },
        { name: 'callData', type: 'bytes' },
        { name: 'value', type: 'uint256' },
        { name: 'feeToken', type: 'address' },
        { name: 'feeAmount', type: 'uint256' },
    ],
};

export const META_TRANSACTION_V2_EIP_712_TYPES = {
    MetaTransactionDataV2: [
        { name: 'signer', type: 'address' },
        { name: 'sender', type: 'address' },
        { name: 'expirationTimeSeconds', type: 'uint256' },
        { name: 'salt', type: 'uint256' },
        { name: 'callData', type: 'bytes' },
        { name: 'feeToken', type: 'address' },
        { name: 'fees', type: 'MetaTransactionFeeData[]' },
    ],
    MetaTransactionFeeData: [
        { name: 'recipient', type: 'address' },
        { name: 'amount', type: 'uint256' },
    ],
};

// Default buffer for gas estimation returned by `eth_estimateGas`. For example, 0.5 means to
// add a 50% buffer.
export const GAS_ESTIMATE_BUFFER = 0.5;

// Time window to apply last look rejections (LLRs) cooldown, in seconds. Any LLRs for quotes
// submited within the window are considered as `bad` LLRs, and the maker will be cooldown.
export const LLR_COOLDOWN_WINDOW_SECONDS = 30;