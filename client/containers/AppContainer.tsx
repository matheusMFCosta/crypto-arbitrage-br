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
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
