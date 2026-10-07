import { createPortal } from "react-dom";
import cn from "classnames";
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { RemoveScroll } from "react-remove-scroll";

import { Icon } from "../Icon/Icon";
import styles from "./Sheet.module.scss";

export type SheetComponentMap = Record<string, React.ComponentType>;

interface SheetProps {
  sheets: SheetComponentMap;
  activeSheet: string | null;
  opened: boolean;
  onClose: () => void;
  transitionDuration?: number;
}

const DEFAULT_TRANSITION_DURATION = 280;
const DRAG_CLOSE_THRESHOLD = 96;

export function Sheet({
  sheets,
  activeSheet,
  opened,
  onClose,
  transitionDuration = DEFAULT_TRANSITION_DURATION,
}: SheetProps) {
  const [hostActive, setHostActive] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [displayedName, setDisplayedName] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);

  const sheetRef = useRef<HTMLDivElement | null>(null);
  const dragStartY = useRef<number | null>(null);
  const dragPointerId = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const prevNameRef = useRef<string | null>(null);
  const prevOpenedRef = useRef<boolean>(false);

  const ActiveComponent = useMemo(() => {
    if (!displayedName) return null;
    return sheets[displayedName];
  }, [displayedName, sheets]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const clearRaf = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  useEffect(() => {
    const prevName = prevNameRef.current;
    const prevOpened = prevOpenedRef.current;
    const nextName = activeSheet;

    if (!prevOpened && opened) {
      clearTimer();
      clearRaf();
      setDragOffset(0);
      setDisplayedName(nextName);
      setHostActive(true);
      setPanelOpen(false);
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => {
          setPanelOpen(true);
          clearRaf();
        });
      });
    }

    if (prevOpened && !opened) {
      clearTimer();
      clearRaf();
      setDragOffset(0);
      setPanelOpen(false);
      timerRef.current = setTimeout(() => {
        setHostActive(false);
        setDisplayedName(null);
        clearTimer();
      }, transitionDuration);
    }

    if (prevOpened && opened && prevName && nextName && prevName !== nextName) {
      clearTimer();
      clearRaf();
      setPanelOpen(false);
      timerRef.current = setTimeout(() => {
        setDisplayedName(nextName);
        rafRef.current = requestAnimationFrame(() => {
          setPanelOpen(true);
          clearRaf();
        });
        clearTimer();
      }, transitionDuration);
    }

    if (!opened && prevName !== nextName) {
      setDisplayedName(nextName);
    }

    prevNameRef.current = nextName;
    prevOpenedRef.current = opened;

    return () => {
      clearTimer();
      clearRaf();
    };
  }, [activeSheet, opened, transitionDuration]);

  const canStartDrag = (target: EventTarget | null) => {
    if (!(target instanceof Element)) return false;
    if (!target.closest("[data-sheet-drag-handle], [data-sheet-drag-header]")) return false;
    return !target.closest("button, a, input, textarea, select, label");
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (!opened || !canStartDrag(event.target)) return;

    const sheet = sheetRef.current;
    if (!sheet || sheet.scrollTop > 0) return;

    document.getSelection?.()?.removeAllRanges();
    document.documentElement.style.userSelect = "none";
    document.body.style.userSelect = "none";
    dragStartY.current = event.clientY;
    dragPointerId.current = event.pointerId;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging || dragStartY.current === null) return;

    const delta = event.clientY - dragStartY.current;
    if (delta <= 0) {
      setDragOffset(0);
      return;
    }

    // Rubber-band the sheet slightly so accidental drags do not feel stuck.
    setDragOffset(Math.min(delta, window.innerHeight * 0.86));
  };

  const finishDrag = (event?: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging) return;

    const shouldClose = dragOffset >= DRAG_CLOSE_THRESHOLD;
    dragStartY.current = null;
    dragPointerId.current = null;
    setDragging(false);
    document.documentElement.style.userSelect = "";
    document.body.style.userSelect = "";

    if (event && event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (shouldClose) {
      setDragOffset(0);
      onClose();
      return;
    }

    setDragOffset(0);
  };

  const handlePointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    dragStartY.current = null;
    dragPointerId.current = null;
    setDragging(false);
    document.documentElement.style.userSelect = "";
    document.body.style.userSelect = "";
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragOffset(0);
  };

  if (!hostActive) return null;

  return createPortal(
    <RemoveScroll enabled={opened}>
      <div
        className={cn(styles.root, (panelOpen || opened) && styles.rootActive)}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={sheetRef}
        className={cn(styles.sheet, panelOpen && styles.sheetActive, dragging && styles.sheetDragging)}
        role="dialog"
        aria-modal="true"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={handlePointerCancel}
        style={dragging || dragOffset ? { transform: `translateY(${dragOffset}px)` } : undefined}
      >
        <button
          type="button"
          className={styles.cross}
          onClick={onClose}
          aria-label="Close"
        >
          <Icon name="cross" width="16px" height="16px" color="primary" />
        </button>

        <div className={styles.content}>
          {ActiveComponent ? <ActiveComponent /> : null}
        </div>
      </div>
    </RemoveScroll>,
    document.body,
  );
}
