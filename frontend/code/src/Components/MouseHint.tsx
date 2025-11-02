import { useClientPoint, useDismiss, useFloating, useHover, useInteractions } from '@floating-ui/react';
import React from 'react';

interface Props {
  children: React.ReactElement;
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
}

export const MouseHint = ({ children, isOpen, setIsOpen }: Props) => {

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    strategy: 'fixed'
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context),
    useDismiss(context),
    useClientPoint(context)
  ]);

  //  @TODO : the first div is to provide a reference, but useless otherwise
  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps({ className: 'Popover' })}></div >
      {isOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          {children}
        </div>
      )
      }
    </>
  );
};
