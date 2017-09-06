import * as React from "react";
import { IntlProvider, addLocaleData } from "react-intl";

const en = require("react-intl/locale-data/en");
const es = require("react-intl/locale-data/es");
const pt = require("react-intl/locale-data/pt");
const fr = require("react-intl/locale-data/fr");

import translations from "./../i18n/index";

addLocaleData([...en, ...es, ...pt, ...fr]);

class IntlContainer extends React.Component<{}, {}> {
    constructor(props) {
        super(props);
    }

    render() {
        const localeFromBrowser = (navigator.languages && navigator.languages[0]) || navigator.language;
        const locale = localeFromBrowser || "pt-BR";
        const messages = translations[locale].data;

        return (
            <div>
                <IntlProvider locale={locale} messages={messages}>
                    {this.props.children}
                </IntlProvider>
            </div>
        );
    }
}

export default IntlContainer;
