import { useRef, useEffect } from "react";

interface RefObject<T> {
  current: T | null;
}

interface Props {
  [s: string]: string;
}

export const usePrevious = (props: Props) => {
  const ref: RefObject<any> = useRef();
  useEffect(() => {
    ref.current = props;
  });
  return ref.current;
};
