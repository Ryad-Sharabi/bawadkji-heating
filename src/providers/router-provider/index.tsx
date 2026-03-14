"use client";

import NextLink from "next/link";
import React, { forwardRef } from "react";
import { default as baseRouterProvider } from "@refinedev/nextjs-router";

/**
 * Custom Link that does not pass replace={false} to the DOM (avoids React warning).
 * Only pass replace to NextLink when it is true.
 */
type RefineLinkProps = { to: string; replace?: boolean } & Omit<
  React.ComponentProps<typeof NextLink>,
  "href"
>;

const SafeLink = forwardRef<HTMLAnchorElement, RefineLinkProps>(function SafeLink(
  { to, replace, ...props },
  ref
) {
  return (
    <NextLink ref={ref} href={to} {...props} {...(replace === true ? { replace: true } : {})} />
  );
});

export const routerProvider = {
  ...baseRouterProvider,
  Link: SafeLink,
};
