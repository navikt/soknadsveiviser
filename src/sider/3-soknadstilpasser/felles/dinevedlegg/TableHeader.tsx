import React from "react";
import { FormattedMessage } from "react-intl";

const TableHeader = () => {
  return (
    <div className="dinevedlegg__header">
      <div className="dinevedlegg__tittel" />
      <div className="dinevedlegg__checkbox">
        <FormattedMessage id="dinevedlegg.sender.na" />
      </div>
      <div className="dinevedlegg__checkbox">
        <FormattedMessage id="dinevedlegg.sender.senere" />
      </div>
    </div>
  );
};

export default TableHeader;
