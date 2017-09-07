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
            if (currentTax.type == "real") {
                totalTax = totalTax + currentTax.value;
            }
            if (currentTax.type == "percent") {
                totalTax = totalTax + investValue * currentTax.value;
            }
            if (currentTax.type == "bitcoin") {
                totalTax = totalTax + currentTax.value * exchangeStoreTaxData1;
            }
        }
        return totalTax;
    }

    buildInvestmentValues(
        investValue: number,
        exchangeStoreBidPrice: number,
        exchangeStoreAskPrice: number,
        exchangeStoreTaxData1: exchangeStoreTax,
        exchangeStoreTaxData2: exchangeStoreTax
    ) {
        const difFPorcentage = 100 - exchangeStoreAskPrice * 100 / exchangeStoreBidPrice;
        //const diffPorcentageInvetiment = difFPorcentage / 100 * investValue;
        const costWithWithDraw = this.calculateTaxOverInvestment(investValue, exchangeStoreTaxData1.bitWithDraw, exchangeStoreBidPrice);
        const costWithBitDeposit = this.calculateTaxOverInvestment(investValue, exchangeStoreTaxData2.bitDeposit, exchangeStoreAskPrice);
        const investmentFinalValue = (difFPorcentage / 100 + 1) * (investValue - costWithWithDraw - costWithBitDeposit);
        const profit = investmentFinalValue - investValue;
        //const investmentFinalValue = investValue + profit;

        return {
            difFPorcentage,
            costWithWithDraw,
            costWithBitDeposit,
            profit,
            investmentFinalValue
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
        console.log(this.props);
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
                                <p>Porcentagem de diferenca {taxValues.difFPorcentage.toFixed(2)}%</p>
                                <p>lucro R${taxValues.profit.toFixed(2)} </p>
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
