/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState, useRef, EffectCallback, ReactElement } from "react";
//import Swal from "../constants/swal";

interface IProps {
  show?: boolean,
  onHide?: () => void,
  title?: string | null,
  children: ReactElement,
  className?: string | null,
  id?: string | null,
  direction?: string | null,
  scroll?: boolean,
  size?: string | null,
}

const Modal: React.FC<IProps> = (props: IProps): JSX.Element | null => {
  let { show, onHide, children, className, id, title, direction, scroll, size } = props;
  const [showModel, setShowModel] = useState<Boolean>(show || false);

  onHide = onHide ? onHide : () => null;

  size = size ? `modal-${size}` : "";

  const modelRef = useRef<HTMLDivElement>(null);

  const hide = () => {
    document.body.style.overflowY = "auto";
    if (modelRef.current) {
      modelRef.current.style.transform = "translateY(-120%)";
    }
    setTimeout(() => setShowModel(false), 100);
    if (typeof onHide === "function") {
      onHide();
    }
  };

  useEffect((): ReturnType<EffectCallback> => {
    let isMounted = true;
    if (isMounted) {
      if (show) {
        document.body.style.overflowY = "hidden";
        setShowModel(show);
        setTimeout(() => {
          if (modelRef.current) {
            modelRef.current.style.transform = "translateY(0)";
          }
        }, 100);
      } else {
        hide();
      }
    }
    return (): any => isMounted = false;
  }, [show]);

  return showModel ? (
    <Fragment>
      <div
        dir={direction || "ltr"}
        className={`modal fade show d-block ${className || ""}`}
        id={id || ""}
      >
        <div
          ref={modelRef}
          style={{ transform: "translateY(-120%)" }}
          className={`modal-dialog modal-dialog-centered ${size} ${scroll ? "modal-dialog-scrollable" : ""
            }`}
        >
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title h4">{title || ""}</div>
              <div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={hide}
                ></button>
              </div>
            </div>
            <div className={`modal-body ${scroll ? "scroll" : ""}`}>
              <div>{children}</div>
            </div>
          </div>
        </div>
      </div>
      <div onClick={hide} className={`modal-backdrop show d-block`}></div>
    </Fragment>
  ) : null;
};

Modal.defaultProps = {
  show: false,
  onHide: () => null,
  title: null,
  className: null,
  id: null,
  direction: null,
  scroll: false,
  size: null
};

export default Modal;
