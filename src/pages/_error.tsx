import React from 'react';
import { NextPage, NextPageContext } from 'next';
import { Custom404 } from './custom404';
interface Props {
    statusCode: number;
}
const Error: NextPage<Props> = ({ statusCode }) => {
  return (
    <Custom404 statusCode={statusCode} />
  )
};

Error.getInitialProps = async ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode ?? 500 : 404;
  return { statusCode };
};

export default Error
