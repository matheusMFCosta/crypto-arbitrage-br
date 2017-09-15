import * as React from "react";
import { connect } from "react-redux";
import { appActions } from "./../actions";
import { appStateTypings } from "./../../reducers/index";
import { exchangeStoresPointsArray, exchangeStoresTax, exchangeStoreTax, taxPrice } from "./../app";
var { Chart } = require("react-google-charts");

interface investimentChartprops {
    exchangeStorename1: string;
    exchangeStorename2: string;
    exchangeStoreBidPrice: number;
    exchangeStoreAskPrice: number;
    investValue: string;
    exchangeStoresTax: exchangeStoresTax;
}

class investimentChart extends React.Component<investimentChartprops, {}> {
    constructor(props, context) {
        super(props, context);
    }

    getExchangeStoreTaxData(exchangeStore): exchangeStoreTax {
        for (let key in this.props.exchangeStoresTax) {
            if (this.props.exchangeStoresTax[key].name == exchangeStore) return this.props.exchangeStoresTax[key];
        }
        return this.props.exchangeStoresTax[0];
    }

    calculateTaxOverInvestment(investValue: number, taxPrices: Array<taxPrice>, exchangeStoreTaxData1: number) {
        let totalTax = 0;
        for (let key in taxPrices) {
            const currentTax = taxPrices[key];
            console.log(currentTax);
            if (currentTax.type == "real") {
                totalTax = totalTax + currentTax.value;
            }
            if (currentTax.type == "percent") {
                totalTax = totalTax + investValue * currentTax.value;
            }
            if (currentTax.type == "bitcoin") {
                console.log(currentTax.value, exchangeStoreTaxData1);
                totalTax = totalTax + currentTax.value * exchangeStoreTaxData1;
            }
        }
        console.log("TAX", totalTax);
        return totalTax;
    }

    buildInvestmentValues(
        investValue: number,
        exchangeStoreBidPrice: number,
        exchangeStoreAskPrice: number,
        exchangeStoreTaxData1: exchangeStoreTax,
        exchangeStoreTaxData2: exchangeStoreTax
    ) {
        console.log("precos");
        console.log(exchangeStoreTaxData1, exchangeStoreTaxData2);
        console.log("investimento", investValue);

        let investmentFinalValue = investValue;
        const difFPorcentage = exchangeStoreBidPrice * 100 / exchangeStoreAskPrice - 100;

        const costWithBuyOfBt = this.calculateTaxOverInvestment(
            investmentFinalValue,
            exchangeStoreTaxData1.passiveOrderExecution,
            exchangeStoreBidPrice
        );
        investmentFinalValue = investmentFinalValue - costWithBuyOfBt;
        console.log("custo de compra bitcoin", costWithBuyOfBt);
        console.log("investmentFinalValue = ", investmentFinalValue);

        const costWithWithDraw = this.calculateTaxOverInvestment(
            investmentFinalValue,
            exchangeStoreTaxData1.bitWithDraw,
            exchangeStoreBidPrice
        );
        investmentFinalValue = investmentFinalValue - costWithWithDraw;
        console.log("custo de saque de bitcoins", costWithWithDraw);
        console.log("investmentFinalValue = ", investmentFinalValue);

        const costWithBitDeposit = this.calculateTaxOverInvestment(
            investmentFinalValue,
            exchangeStoreTaxData2.bitDeposit,
            exchangeStoreAskPrice
        );
        investmentFinalValue = investmentFinalValue - costWithBitDeposit;
        console.log("custo de deposito de bitcoins", costWithBitDeposit);
        console.log("investmentFinalValue = ", investmentFinalValue);

        const costWithSellBT = this.calculateTaxOverInvestment(
            investmentFinalValue,
            exchangeStoreTaxData2.passiveOrderExecution,
            exchangeStoreBidPrice
        );
        investmentFinalValue = investmentFinalValue - costWithSellBT;
        console.log("custo de venda de bitcoins ", costWithSellBT);
        console.log("investmentFinalValue = ", investmentFinalValue);

        const valueAfterTaxes = investmentFinalValue;
        //const difFPorcentage = investmentFinalValue * 100 / investValue;
        investmentFinalValue = investmentFinalValue * (1 + difFPorcentage / 100);

        console.log("ddd ", investmentFinalValue);
        const profit = investmentFinalValue - investValue;
        const profitPercentage = investmentFinalValue * 100 / investValue - 100;
        //const investmentFinalValue = investValue + profit;

        return {
            difFPorcentage,
            costWithWithDraw,
            costWithBitDeposit,
            profit,
            investmentFinalValue,
            valueAfterTaxes,
            profitPercentage
        };
    }

    render() {
        const exchangeStoreTaxData1 = this.getExchangeStoreTaxData(this.props.exchangeStorename1);
        const exchangeStoreTaxData2 = this.getExchangeStoreTaxData(this.props.exchangeStorename2);
        const investValue = parseFloat(this.props.investValue);
        const taxValues = this.buildInvestmentValues(
            investValue,
            this.props.exchangeStoreBidPrice,
            this.props.exchangeStoreAskPrice,
            exchangeStoreTaxData1,
            exchangeStoreTaxData2
        );
        //taxValues.profit
        return (
            <div>
                {taxValues.profit > 0 && (
                    <div className=" col-md-12 col-sm-12">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <div>
                                    {this.props.exchangeStorename1} <i className="fa fa-arrow-right" aria-hidden="true" />{" "}
                                    {this.props.exchangeStorename2}
                                    <div className="pull-right">
                                        <i className="fa fa-check-circle-o green " aria-hidden="true" />
                                    </div>
                                </div>
                            </div>
                            <div className="panel-body">
                                <p>
                                    {" "}
                                    Ask: R${this.props.exchangeStoreAskPrice.toFixed(2)} Bid: R${this.props.exchangeStoreBidPrice.toFixed(2)}
                                </p>
                                <p>Valor depois das taxas {taxValues.valueAfterTaxes.toFixed(2)}</p>
                                <p>Porcentagem de aumento {taxValues.difFPorcentage.toFixed(2)}%</p>
                                <p>lucro R${taxValues.profit.toFixed(2)} </p>
                                <p>Porcentagem de lucro {taxValues.profitPercentage.toFixed(2)}%</p>
                                <p>valor final R${taxValues.investmentFinalValue.toFixed(2)} </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state: appStateTypings, ownProps) => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(investimentChart);
