// tslint:disable:custom-no-magic-numbers
// tslint:disable:no-empty
// tslint:disable:max-file-line-count

import { MarketOperation } from '@0x/asset-swapper';
import { ethSignHashWithKey, OtcOrder } from '@0x/protocol-utils';
import { SignRequest } from '@0x/quote-server';
import { Fee } from '@0x/quote-server/lib/src/types';
import { BigNumber, NULL_ADDRESS } from '@0x/utils';
import Axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';
import * as HttpStatus from 'http-status-codes';

import { Integrator } from '../../src/config';
import { QuoteServerPriceParams } from '../../src/types';
import { QuoteServerClient } from '../../src/utils/quote_server_client';
import { CHAIN_ID, CONTRACT_ADDRESSES } from '../constants';

const makerUri = 'https://some-market-maker.xyz';
const integrator: Integrator = {
    integratorId: 'some-integrator-id',
    apiKeys: [],
    allowedChainIds: [],
    label: 'integrator',
    plp: false,
    rfqm: true,
    rfqt: true,
};

// Maker
const makerAddress = '0xFDbEf5C1Ad7d173D191D565c14E28eBd5b50470e';
const makerPrivateKey = '0xf4559ca5152145f5e0b9762f12213c2e74020a4481953fb940413273051a89d3';

// Taker
const takerAddress = '0xdA9AC423442169588DE6b4305f4E820D708d0cE5';
const takerPrivateKey = '0x653fa328df81be180b58e42737bc4cef037a19a3b9673b15d20ee2eebb2e509d';

// Some tokens and amounts
const takerToken = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
const makerToken = '0x6b175474e89094c44da98b954eedeac495271d0f';
const takerAmount = new BigNumber(100);
const makerAmount = new BigNumber(100_000);

// An OtcOrder
const order = new OtcOrder({
    maker: makerAddress,
    taker: takerAddress,
    makerAmount,
    takerAmount,
    makerToken,
    takerToken,
    expiryAndNonce: OtcOrder.encodeExpiryAndNonce(
        new BigNumber(2634330177),
        new BigNumber(1),
        new BigNumber(1634330177),
    ),
});
const orderHash = order.getHash();

// Signatures
const takerSignature = ethSignHashWithKey(orderHash, takerPrivateKey);
const makerSignature = ethSignHashWithKey(orderHash, makerPrivateKey);

describe('QuoteServerClient', () => {
    const axiosInstance = Axios.create();
    const axiosMock = new AxiosMockAdapter(axiosInstance);

    afterEach(() => {
        axiosMock.reset();
    });

    describe('makeQueryParameters', () => {
        it('should make RFQt request parameters', () => {
            // Given
            const marketOperation = MarketOperation.Sell;
            const input = {
                txOrigin: takerAddress,
                takerAddress: NULL_ADDRESS,
                marketOperation,
                buyTokenAddress: makerToken,
                sellTokenAddress: takerToken,
                comparisonPrice: new BigNumber('42'),
                assetFillAmount: new BigNumber('100000'),
            };

            // When
            const params = QuoteServerClient.makeQueryParameters(input);

            // Then
            expect(params).to.deep.eq({
                buyTokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
                protocolVersion: '4',
                sellAmountBaseUnits: '100000',
                sellTokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
                takerAddress: '0x0000000000000000000000000000000000000000',
                txOrigin: '0xdA9AC423442169588DE6b4305f4E820D708d0cE5',
                comparisonPrice: '42',
            });
        });

        it('should make RFQm request parameters', () => {
            // Given
            const txOrigin = '0x335e51687677C4f1389f3dEcA259af983529e82D';
            const feeAmount = '100';
            const otcOrderFee: Fee = {
                amount: new BigNumber(feeAmount),
                token: CONTRACT_ADDRESSES.etherToken,
                type: 'fixed',
            };
            const marketOperation = MarketOperation.Sell;

            // When
            const params = QuoteServerClient.makeQueryParameters({
                txOrigin,
                takerAddress,
                marketOperation,
                buyTokenAddress: makerToken,
                sellTokenAddress: takerToken,
                assetFillAmount: new BigNumber('100000'),
                isLastLook: true,
                fee: otcOrderFee,
            });

            // Then
            expect(params).to.deep.eq({
                buyTokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
                feeAmount: '100',
                feeToken: '0x0b1ba0af832d7c05fd64161e0db78e85978e8082',
                feeType: 'fixed',
                isLastLook: 'true',
                protocolVersion: '4',
                sellAmountBaseUnits: '100000',
                sellTokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
                takerAddress: '0xdA9AC423442169588DE6b4305f4E820D708d0cE5',
                txOrigin: '0x335e51687677C4f1389f3dEcA259af983529e82D',
            });
        });

        it('should make RFQm request parameters with chain id', () => {
            // Given
            const txOrigin = '0x335e51687677C4f1389f3dEcA259af983529e82D';
            const feeAmount = '100';
            const otcOrderFee: Fee = {
                amount: new BigNumber(feeAmount),
                token: CONTRACT_ADDRESSES.etherToken,
                type: 'fixed',
            };
            const marketOperation = MarketOperation.Sell;

            // When
            const params = QuoteServerClient.makeQueryParameters({
                chainId: 10,
                txOrigin,
                takerAddress,
                marketOperation,
                buyTokenAddress: makerToken,
                sellTokenAddress: takerToken,
                assetFillAmount: new BigNumber('100000'),
                isLastLook: true,
                fee: otcOrderFee,
            });

            // Then
            expect(params).to.deep.eq({
                chainId: '10',
                buyTokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
                feeAmount: '100',
                feeToken: '0x0b1ba0af832d7c05fd64161e0db78e85978e8082',
                feeType: 'fixed',
                isLastLook: 'true',
                protocolVersion: '4',
                sellAmountBaseUnits: '100000',
                sellTokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
                takerAddress: '0xdA9AC423442169588DE6b4305f4E820D708d0cE5',
                txOrigin: '0x335e51687677C4f1389f3dEcA259af983529e82D',
            });
        });
    });

    describe('OtcOrder', () => {
        describe('getPriceV2Async', () => {
            it('should return a valid indicative quote', async () => {
                // Given
                const client = new QuoteServerClient(axiosInstance);
                const request: QuoteServerPriceParams = {
                    chainId: CHAIN_ID.toString(),
                    sellTokenAddress: takerToken,
                    buyTokenAddress: makerToken,
                    takerAddress,
                    sellAmountBaseUnits: takerAmount.toString(),
                    protocolVersion: '4',
                    txOrigin: takerAddress,
                    isLastLook: 'true',
                    feeAmount: '100',
                    feeType: 'fixed',
                    feeToken: CONTRACT_ADDRESSES.etherToken,
                    nonce: '1634322835',
                    nonceBucket: '1',
                };

                const response = {
                    maker: makerAddress,
                    makerAmount,
                    takerAmount,
                    makerToken,
                    takerToken,
                    expiry: new BigNumber(9934322972),
                };

                axiosMock.onGet(`${makerUri}/rfqm/v2/price`).replyOnce(HttpStatus.OK, response);

                // When
                const indicativeQuote = await client.getPriceV2Async(makerUri, integrator, request);

                // Then
                const expectedResponse = {
                    ...response,
                    makerUri,
                };
                expect(indicativeQuote).to.deep.eq(expectedResponse);
            });

            it('should throw an error for a malformed response', async () => {
                // Given
                const client = new QuoteServerClient(axiosInstance);
                const request: QuoteServerPriceParams = {
                    chainId: CHAIN_ID.toString(),
                    sellTokenAddress: takerToken,
                    buyTokenAddress: makerToken,
                    takerAddress,
                    sellAmountBaseUnits: takerAmount.toString(),
                    protocolVersion: '4',
                    txOrigin: takerAddress,
                    isLastLook: 'true',
                    feeAmount: '100',
                    feeType: 'fixed',
                    feeToken: CONTRACT_ADDRESSES.etherToken,
                    nonce: '1634322835',
                    nonceBucket: '1',
                };

                const response = {
                    asdf: 'malformed response',
                };

                axiosMock.onGet(`${makerUri}/rfqm/v2/price`).replyOnce(HttpStatus.OK, response);

                try {
                    // When
                    await client.getPriceV2Async(makerUri, integrator, request);
                    expect.fail('Should not succeed');
                } catch (err) {
                    // Then
                    expect(err).to.not.equal(undefined);
                }
            });
        });

        describe('batchGetPriceV2Async', () => {
            it('should return the valid indicative qutoes and filter out errors', async () => {
                // Given
                const makerUri1 = 'https://some-market-maker1.xyz';
                const makerUri2 = 'https://some-market-maker2.xyz';
                const makerUri3 = 'https://some-market-maker3.xyz';
                const client = new QuoteServerClient(axiosInstance);
                const request: QuoteServerPriceParams = {
                    chainId: CHAIN_ID.toString(),
                    sellTokenAddress: takerToken,
                    buyTokenAddress: makerToken,
                    takerAddress,
                    sellAmountBaseUnits: takerAmount.toString(),
                    protocolVersion: '4',
                    txOrigin: takerAddress,
                    isLastLook: 'true',
                    feeAmount: '100',
                    feeType: 'fixed',
                    feeToken: CONTRACT_ADDRESSES.etherToken,
                    nonce: '1634322835',
                    nonceBucket: '1',
                };

                const response = {
                    maker: makerAddress,
                    makerAmount,
                    takerAmount,
                    makerToken,
                    takerToken,
                    expiry: new BigNumber(9934322972),
                };

                axiosMock.onGet(`${makerUri1}/rfqm/v2/price`).replyOnce(HttpStatus.OK, response);
                axiosMock.onGet(`${makerUri2}/rfqm/v2/price`).replyOnce(HttpStatus.NO_CONTENT, {});
                axiosMock.onGet(`${makerUri3}/rfqm/v2/price`).replyOnce(HttpStatus.BAD_GATEWAY, {});

                // When
                const indicativeQuotes = await client.batchGetPriceV2Async(
                    [makerUri1, makerUri2, makerUri3],
                    integrator,
                    request,
                );

                // Then
                expect(indicativeQuotes!.length).to.equal(1);
                expect(indicativeQuotes[0].makerAmount.toNumber()).to.equal(response.makerAmount.toNumber());
                expect(indicativeQuotes[0].maker).to.equal(makerAddress);
            });
        });

        describe('signV2Async', () => {
            it('should return a signature for valid response', async () => {
                // Given
                const client = new QuoteServerClient(axiosInstance);
                const request: SignRequest = {
                    order,
                    orderHash,
                    fee: {
                        amount: new BigNumber('100'),
                        type: 'fixed',
                        token: CONTRACT_ADDRESSES.etherToken,
                    },
                    expiry: order.expiry,
                    takerSignature,
                };

                const actualRequest = {
                    order,
                    orderHash,
                    feeAmount: '100',
                    feeToken: CONTRACT_ADDRESSES.etherToken,
                    expiry: order.expiry,
                    takerSignature,
                };

                const response = {
                    feeAmount: '100',
                    proceedWithFill: true,
                    makerSignature,
                };

                axiosMock
                    .onPost(`${makerUri}/rfqm/v2/sign`, JSON.parse(JSON.stringify(actualRequest)))
                    .replyOnce(HttpStatus.OK, response);

                // When
                const signature = await client.signV2Async(makerUri, 'dummy-integrator-id', request);

                // Then
                expect(signature).to.deep.eq(makerSignature);
            });

            it('should return a signature for valid response even if the fee is higher than requested', async () => {
                // Given
                const client = new QuoteServerClient(axiosInstance);
                const request: SignRequest = {
                    order,
                    orderHash,
                    fee: {
                        amount: new BigNumber('100'),
                        type: 'fixed',
                        token: CONTRACT_ADDRESSES.etherToken,
                    },
                    expiry: order.expiry,
                    takerSignature,
                };

                const actualRequest = {
                    order,
                    orderHash,
                    feeAmount: '100',
                    feeToken: CONTRACT_ADDRESSES.etherToken,
                    expiry: order.expiry,
                    takerSignature,
                };

                const response = {
                    feeAmount: '101', // higher than requested
                    proceedWithFill: true,
                    makerSignature,
                };

                axiosMock
                    .onPost(`${makerUri}/rfqm/v2/sign`, JSON.parse(JSON.stringify(actualRequest)))
                    .replyOnce(HttpStatus.OK, response);

                // When
                const signature = await client.signV2Async(makerUri, 'dummy-integrator-id', request);

                // Then
                expect(signature).to.deep.eq(makerSignature);
            });

            it('should throw an error for a malformed response', async () => {
                // Given
                const client = new QuoteServerClient(axiosInstance);
                const request: SignRequest = {
                    order,
                    orderHash,
                    fee: {
                        amount: new BigNumber('100'),
                        type: 'fixed',
                        token: CONTRACT_ADDRESSES.etherToken,
                    },
                    expiry: order.expiry,
                    takerSignature,
                };

                const response = {
                    asdf: 'I am broken',
                };

                axiosMock
                    .onPost(`${makerUri}/rfqm/v2/sign`, JSON.parse(JSON.stringify(request)))
                    .replyOnce(HttpStatus.OK, response);

                try {
                    // When
                    await client.signV2Async(makerUri, 'dummy-integrator-id', request);
                    expect.fail('Should not succeed');
                } catch (err) {
                    // Then
                    expect(err).to.be.an.instanceof(Error);
                }
            });

            it('should return undefined for an incorrect fee acknowledgement', async () => {
                // Given
                const client = new QuoteServerClient(axiosInstance);
                const request: SignRequest = {
                    order,
                    orderHash,
                    fee: {
                        amount: new BigNumber('100'),
                        type: 'fixed',
                        token: CONTRACT_ADDRESSES.etherToken,
                    },
                    expiry: order.expiry,
                    takerSignature,
                };

                const actualRequest = {
                    order,
                    orderHash,
                    feeAmount: '100',
                    feeToken: CONTRACT_ADDRESSES.etherToken,
                    expiry: order.expiry,
                    takerSignature,
                };

                const response = {
                    feeAmount: '10', // Not the right fee
                    proceedWithFill: true,
                    makerSignature,
                };

                axiosMock
                    .onPost(`${makerUri}/rfqm/v2/sign`, JSON.parse(JSON.stringify(actualRequest)))
                    .replyOnce(HttpStatus.OK, response);

                // When
                const signature = await client.signV2Async(makerUri, 'dummy-integrator-id', request);

                // Then
                expect(signature).to.equal(undefined);
            });

            it('should return undefined for explicitly rejected responses', async () => {
                // Given
                const client = new QuoteServerClient(axiosInstance);
                const request: SignRequest = {
                    order,
                    orderHash,
                    fee: {
                        amount: new BigNumber('100'),
                        type: 'fixed',
                        token: CONTRACT_ADDRESSES.etherToken,
                    },
                    expiry: order.expiry,
                    takerSignature,
                };

                const actualRequest = {
                    order,
                    orderHash,
                    feeAmount: '100',
                    feeToken: CONTRACT_ADDRESSES.etherToken,
                    expiry: order.expiry,
                    takerSignature,
                };

                const response = {
                    proceedWithFill: false,
                };

                axiosMock
                    .onPost(`${makerUri}/rfqm/v2/sign`, JSON.parse(JSON.stringify(actualRequest)))
                    .replyOnce(HttpStatus.OK, response);

                // When
                const signature = await client.signV2Async(makerUri, 'dummy-integrator-id', request);

                // Then
                expect(signature).to.equal(undefined);
            });
        });
    });
});
