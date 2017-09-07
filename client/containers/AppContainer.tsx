import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import * as classNames from "classnames";

import "./style.css";

interface AppContainerProps {
    main: any;
    showTopBarStatus: boolean;
    screenSize: number;
    changeScreenSize: Function;
    toogleTopBarStatus: Function;
}

interface AppContainerState {
    multiLevelDropdownCollapsed: boolean;
}

class AppContainer extends React.Component<AppContainerProps, AppContainerState> {
    constructor(props) {
        super(props);
        this.state = {
            multiLevelDropdownCollapsed: true
        };
    }

    render() {
        return (
            <div>
                <div className="pull-right" />
                <div>
                    <div id="appContainer">
                        <div className="row">
                            <div className="col-md-2 col-sm-2 col-xs-2">
                                <a href="#" className="list-group-item disabled">
                                    APP
                                </a>
                                <a href="#" className="list-group-item list-group-item-action">
                                    Dapibus ac facilisis in
                                </a>
                                <a href="#" className="list-group-item list-group-item-action">
                                    Morbi leo risus
                                </a>
                                <a href="#" className="list-group-item list-group-item-action">
                                    Porta ac consectetur ac
                                </a>
                                <a href="#" className="list-group-item list-group-item-action ">
                                    Vestibulum at eros
                                </a>
                            </div>
                            <div className="col-md-10 col-sm-10 col-xs-10">{this.props.children}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
