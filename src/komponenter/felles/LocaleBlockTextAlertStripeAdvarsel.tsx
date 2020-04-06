import React from 'react';
import {ingenTekstForBlock, localeBlockTextWithFallback} from "../../utils/sprak";
import {AlertStripeAdvarsel} from "nav-frontend-alertstriper";
import BlockContent from "@sanity/block-content-to-react";
import {link} from "../../utils/serializers";
import {LocaleBlockText} from "../../typer/sprak";

const LocaleBlockTextAlertStripeAdvarsel = ({blockText, locale}: {blockText: LocaleBlockText | undefined, locale: string}) => {
  const varseltekstBlock = localeBlockTextWithFallback(blockText, locale);
  if (varseltekstBlock === ingenTekstForBlock) {
    return null;
  }
  return (
    <div className="varselboks">
      <AlertStripeAdvarsel>
        <div className="varseltekst_innhold">
          <BlockContent
            blocks={varseltekstBlock}
            serializers={{ marks: { link } }}
          />
        </div>
      </AlertStripeAdvarsel>
    </div>
    )
};

export default LocaleBlockTextAlertStripeAdvarsel;