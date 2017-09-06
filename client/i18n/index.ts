import { defineMessages } from "react-intl";
import ptBRMessages from "./pt-BR";
import enMessages from "./en";
import esBRMessages from "./es";
import frBRMessages from "./fr";

type locales = {};

const locales: locales = {
    "pt-BR": {
        data: { ...ptBRMessages }
    },
    en: {
        data: { ...enMessages }
    },
    es: {
        data: { ...enMessages }
    },
    fr: {
        data: { ...enMessages }
    }
};

export default locales;
