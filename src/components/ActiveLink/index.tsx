import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { cloneElement, ReactElement } from "react";

interface ActiveLinkProps extends LinkProps {
  activeClassName: string;
}

export const ActiveLink: React.FC<ActiveLinkProps> = ({
  children,
  activeClassName,
  ...rest
}) => {
  const { asPath } = useRouter();
  const className = asPath === rest.href ? activeClassName : "";
  return (
    <Link {...rest}>
      {cloneElement(children as ReactElement, {
        className,
      })}
    </Link>
  );
};
