import React, { cloneElement, HTMLProps } from 'react';
import {
  offset,
  flip,
  shift,
  autoUpdate,
  useFloating,
  useInteractions,
  useRole,
  useDismiss,
  useId,
  useClick,
  FloatingFocusManager,
} from '@floating-ui/react-dom-interactions';

interface Props {
  render: (data: { close: () => void; labelId: string; descriptionId: string }) => React.ReactNode;
  children: JSX.Element;
  isOpen: boolean;
  openClose: (state: boolean) => void;
}

export const Popover = ({ children, render, isOpen, openClose }: Props) => {
  const { x, y, reference, floating, strategy, context } = useFloating({
    open: isOpen,
    onOpenChange: openClose,
    middleware: [offset(5), flip(), shift()],
    whileElementsMounted: autoUpdate,
    strategy: 'fixed',
  });

  const id = useId();
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useRole(context),
    useDismiss(context),
  ]);

  const props = { ref: reference, ...children.props } as HTMLProps<Element>;

  return (
    <>
      {cloneElement(children, getReferenceProps(props))}
      {isOpen && (
        <FloatingFocusManager context={context} modal={false} order={['reference', 'content']} returnFocus={false}>
          <div
            {...getFloatingProps({
              className: 'Popover',
              ref: floating,
              style: {
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                zIndex: 10000,
              },
              'aria-labelledby': labelId,
              'aria-describedby': descriptionId,
            })}
          >
            {render({
              labelId,
              descriptionId,
              close: () => {
                openClose(false);
              },
            })}
          </div>
        </FloatingFocusManager>
      )}
    </>
  );
};
