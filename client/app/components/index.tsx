import * as React from "react";
import { connect } from "react-redux";
import { appActions } from "./../actions";
import { appStateTypings } from "./../../reducers/index";
import { FormattedMessage } from "react-intl";
import { exchangeStoresPointsArray, exchangeStoresTax } from "./../app";
import InvestimentChart from "./investimentChart";
var { Chart } = require("react-google-charts");

interface Appprops {
    upDateApplication: Function;
    fetchExchangeStoresPointsArray: Function;
    fetchExchangeStoresTaxData: Function;
    changeInvestValue: Function;
    exchangeStoresPointsArray: exchangeStoresPointsArray;
    exchangeStoresTax: exchangeStoresTax;
    investValue: string;
    period: string;
}

class App extends React.Component<Appprops, {}> {
    constructor(props, context) {
        super(props, context);
    }
    wow;
    componentWillMount() {
        this.props.upDateApplication(this.props.period);
        this.props.fetchExchangeStoresTaxData();
        this.props.fetchExchangeStoresPointsArray("1h");
    }
    render() {
        //const sellPrice = key.pointsArray[key.pointsArray.length - 1]* 100 / key.pointsArray[0]
        return (
            <div>
                <div className=" col-md-0 col-sm-0" />
                <div className=" col-md-12 col-sm-12">
                    <div className="panel panel-default">
                        <div className="panel-body">
                            <div>
                                <div className="row">
                                    <div className="col-md-8 col-sm-8 col-xs-8 pb2" />
                                    <div className="col-md-4 col-sm-4 col-xs-4">
                                        <div className="form-group">
                                            <label for="usr">Valor do investimento:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                defaultValue={this.props.investValue}
                                                onChange={e => this.props.changeInvestValue(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {this.props.exchangeStoresPointsArray.map((key1, index1) =>
                                        this.props.exchangeStoresPointsArray.map((key2, index2) => {
                                            const currentPoint1 = key1.pointsArray[key1.pointsArray.length - 1];
                                            const currentPoint2 = key2.pointsArray[key2.pointsArray.length - 1];
                                            if (key1.name == key2.name) return <span />;
                                            return (
                                                <div className="col-md-6 col-sm-6 col-xs-6">
                                                    <InvestimentChart
                                                        exchangeStorename1={key1.name}
                                                        exchangeStorename2={key2.name}
                                                        exchangeStoreAskPrice={currentPoint1[2]}
                                                        exchangeStoreBidPrice={currentPoint2[1]}
                                                        exchangeStoresTax={this.props.exchangeStoresTax}
                                                        investValue={this.props.investValue}
                                                    />
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                <div className="btn-group" data-toggle="buttons">
                                    <label className="btn btn-primary">
                                        <input
                                            onClick={() => this.props.fetchExchangeStoresPointsArray("24h")}
                                            type="checkbox"
                                            autocomplete="off"
                                        />{" "}
                                        24 horas
                                    </label>
                                    <label className="btn btn-primary">
                                        <input
                                            onClick={() => this.props.fetchExchangeStoresPointsArray("12h")}
                                            type="checkbox"
                                            autocomplete="off"
                                        />{" "}
                                        12 hora
                                    </label>
                                    <label className="btn btn-primary">
                                        <input
                                            onClick={() => this.props.fetchExchangeStoresPointsArray("6h")}
                                            type="checkbox"
                                            autocomplete="off"
                                        />{" "}
                                        6h
                                    </label>
                                    <label className="btn btn-primary">
                                        <input
                                            onClick={() => this.props.fetchExchangeStoresPointsArray("1h")}
                                            type="checkbox"
                                            autocomplete="off"
                                        />{" "}
                                        1 h
                                    </label>
                                    <label className="btn btn-primary">
                                        <input
                                            onClick={() => this.props.fetchExchangeStoresPointsArray("10m")}
                                            type="checkbox"
                                            autocomplete="off"
                                        />{" "}
                                        10 min
                                    </label>
                                </div>

                                {this.props.exchangeStoresPointsArray.map((key, index) => {
                                    return (
                                        <div className="row">
                                            <div className="col-md-8 col-sm-8 col-xs-8">
                                                <div className="pt1">
                                                    <p>{key.name}</p>
                                                    <div className="ba ">
                                                        <Chart
                                                            chartType="LineChart"
                                                            columns={[
                                                                {
                                                                    label: "time",
                                                                    type: "string"
                                                                },
                                                                {
                                                                    label: "pra vender",
                                                                    type: "number"
                                                                },
                                                                {
                                                                    label: "pra comprar",
                                                                    type: "number"
                                                                }
                                                            ]}
                                                            rows={key.pointsArray}
                                                            options={{
                                                                legend: true,
                                                                hAxis: { title: "Time" },
                                                                vAxis: { title: "Air Passengers" }
                                                            }}
                                                            width="100%"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-2 col-sm-2 col-xs-2">
                                                <p> Valor para Vender: {key.pointsArray[key.pointsArray.length - 1][1]} </p>
                                                {key.pointsArray[key.pointsArray.length - 1][1] * 100 / key.pointsArray[0][1] - 100 > 0 && (
                                                    <p className="green">
                                                        {(key.pointsArray[key.pointsArray.length - 1][1] * 100 / key.pointsArray[0][1] -
                                                            100).toFixed(2)}%
                                                    </p>
                                                )}
                                                {key.pointsArray[key.pointsArray.length - 1][1] * 100 / key.pointsArray[0][1] - 100 <=
                                                    0 && (
                                                    <p className="red">
                                                        {(key.pointsArray[key.pointsArray.length - 1][1] * 100 / key.pointsArray[0][1] -
                                                            100).toFixed(2)}%
                                                    </p>
                                                )}
                                                <p> Valor para Comprar: {key.pointsArray[key.pointsArray.length - 1][2]} </p>
                                                {key.pointsArray[key.pointsArray.length - 1][2] * 100 / key.pointsArray[0][2] - 100 > 0 && (
                                                    <p className="green">
                                                        {(key.pointsArray[key.pointsArray.length - 1][2] * 100 / key.pointsArray[0][2] -
                                                            100).toFixed(2)}%
                                                    </p>
                                                )}
                                                {key.pointsArray[key.pointsArray.length - 1][2] * 100 / key.pointsArray[0][2] - 100 <=
                                                    0 && (
                                                    <p className="red">
                                                        {(key.pointsArray[key.pointsArray.length - 1][2] * 100 / key.pointsArray[0][2] -
                                                            100).toFixed(2)}%
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: appStateTypings, ownProps) => ({
    exchangeStoresPointsArray: state.app.exchangeStoresPointsArray,
    exchangeStoresTax: state.app.exchangeStoresTax,
    investValue: state.app.investValue,
    period: state.app.period
});

const mapDispatchToProps = dispatch => ({
    upDateApplication: (value: boolean) => dispatch(new appActions.upDateApplication(value)),
    fetchExchangeStoresPointsArray: period => dispatch(new appActions.fetchExchangeStoresPointsArray(period)),
    fetchExchangeStoresTaxData: () => dispatch(new appActions.fetchExchangeStoresTaxData()),
    changeInvestValue: (value: string) => dispatch(new appActions.changeInvestValue(value))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
