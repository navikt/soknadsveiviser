import React from "react";
import { link } from "../../../../utils/serializers";
import { LocaleBlockText } from "../../../../typer/sprak";
import Modal from "nav-frontend-modal";
import BlockContent from "@sanity/block-content-to-react";
import { localeBlockTekst } from "../../../../utils/sprak";
import { InjectedIntlProps, injectIntl } from "react-intl";

interface Props {
  display: boolean;
  content?: LocaleBlockText;
  onRequestClose: () => void;
}

const VedleggModal = (props: Props & InjectedIntlProps) => {
  return (
    <Modal
      isOpen={props.display}
      onRequestClose={props.onRequestClose}
      closeButton={true}
      contentLabel="Modal"
    >
      {props.content && (
        <div className="dinevedlegg__modal">
          <BlockContent
            blocks={localeBlockTekst(props.content, props.intl.locale)}
            serializers={{ marks: { link } }}
          />
        </div>
      )}
    </Modal>
  );
};
export default injectIntl(VedleggModal);
