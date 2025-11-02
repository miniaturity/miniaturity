import React, { useEffect, useRef, useState } from "react";

type TooltipState = {
  visible: boolean;
  content: string; 
  x: number;
  y: number;
};


export default function Tooltip(): React.JSX.Element {
  const [state, setState] = useState<TooltipState>({
    visible: false,
    content: "",
    x: 0,
    y: 0,
  });

  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const activeTargetRef = useRef<HTMLElement | null>(null);

  const OFFSET_X = 12;
  const OFFSET_Y = 18;

  useEffect(() => {
    function findDataTitleTarget(e: Event): HTMLElement | null {

      let el = e.target as HTMLElement | null;
      while (el) {
        if (el.dataset && typeof el.dataset.title !== "undefined") return el;
        el = el.parentElement;
      }
      return null;
    }

    function onMouseOver(e: MouseEvent) {
      const target = findDataTitleTarget(e);
      if (!target) return;
      activeTargetRef.current = target;
      const html = target.dataset.title ?? "";
      setState((s) => ({ ...s, visible: true, content: html }));
    }

    function onMouseOut(e: MouseEvent) {
      const related = e.relatedTarget as Node | null;
      if (!activeTargetRef.current) return;
      if (related && activeTargetRef.current.contains(related)) return;
      activeTargetRef.current = null;
      setState((s) => ({ ...s, visible: false }));
    }

    function onMouseMove(e: MouseEvent) {
      if (!activeTargetRef.current) return;
      updatePosition(e.clientX, e.clientY);
    }

    function onFocus(e: FocusEvent) {
      const target = findDataTitleTarget(e);
      if (!target) return;
      activeTargetRef.current = target;
      const html = target.dataset.title ?? "";
      const rect = target.getBoundingClientRect();
      updatePosition(rect.left + rect.width / 2, rect.top);
      setState((s) => ({ ...s, visible: true, content: html }));
    }

    function onBlur() {
      activeTargetRef.current = null;
      setState((s) => ({ ...s, visible: false }));
    }

    function updatePosition(clientX: number, clientY: number) {
      const el = tooltipRef.current;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let x = clientX + OFFSET_X;
      let y = clientY + OFFSET_Y;

      if (el) {
        const rect = el.getBoundingClientRect();
        if (x + rect.width > vw - 8) {
          x = Math.max(8, clientX - rect.width - OFFSET_X);
        }
        if (y + rect.height > vh - 8) {
          y = Math.max(8, clientY - rect.height - OFFSET_Y);
        }
      }

      setState((s) => ({ ...s, x, y }));
    }

    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("focus", onFocus, true);
    document.addEventListener("blur", onBlur, true);

    return () => {
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("focus", onFocus, true);
      document.removeEventListener("blur", onBlur, true);
    };
  }, []);

  useEffect(() => {
    if (!state.visible) return;
    if (activeTargetRef.current && !("clientX" in (window as any))) {
      const rect = activeTargetRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const topY = rect.top;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let x = centerX + OFFSET_X;
      let y = topY + OFFSET_Y;
      x = Math.max(8, Math.min(x, vw - 8));
      y = Math.max(8, Math.min(y, vh - 8));
      setState((s) => ({ ...s, x, y }));
    }
  }, [state.visible]);


  return (
    <div
      ref={tooltipRef}
      role="tooltip"
      aria-hidden={!state.visible}
      className="tooltip"
      style={{
        left: state.x,
        top: state.y,
        opacity: state.visible ? "1" : "0"
      }}
      dangerouslySetInnerHTML={{ __html: state.content }}
    />
  );
}

