import { Typography } from '@mui/material';
import React, { Fragment } from 'react';

type TError = {
  message: string;
};

const ErrorHandle: React.FC<TError> = (props) => {
  return (
    <Fragment>
      <Typography
        sx={{ marginTop: '4rem', fontSize: '1.6rem', textAlign: 'center' }}
      >
        😱😱😱
      </Typography>
      <Typography sx={{ color: 'red', fontSize: '2rem', textAlign: 'center' }}>
        {`${props.message}`}
      </Typography>
    </Fragment>
  );
};

export default ErrorHandle;
