import { AbstractFormField } from '../core';
import React, { PropsWithChildren } from 'react';

export const ControlAdaptor = (props: PropsWithChildren<{ field: AbstractFormField<unknown> }>) => {
  const { children } = props;
  return React.cloneElement(children as React.ReactElement, {});
};
