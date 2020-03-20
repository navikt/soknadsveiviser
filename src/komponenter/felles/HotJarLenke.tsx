import React from 'react';
import PropTypes from 'prop-types';
import Lenke from "nav-frontend-lenker";

interface MyWindow extends Window {
  hj: any;
}
declare var window: MyWindow;

function sendHotJarTrigger(triggerName: string) {
  window.hj('trigger', triggerName);
}

const HotJarLenke = ({trigger, ...rest}: {[key:string]: any}) => {
  return (
    <Lenke {...rest} onClick={(event) => {
      event.preventDefault();
      sendHotJarTrigger(trigger);
    }} href="#"/>
  );
};

HotJarLenke.propTypes = {
  trigger: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default HotJarLenke;

