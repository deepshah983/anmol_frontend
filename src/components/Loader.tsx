import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { DollarSign } from 'lucide-react';

const useStyles = makeStyles((theme) => ({
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
  loaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1000,
  },
  loader: {
    position: 'relative',
    width: 80,
    height: 80,
  },
  circle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    border: '4px solid transparent',
    borderTopColor: '#FFD700',
    borderRadius: '50%',
    animation: '$spin 1s linear infinite',
  },
  icon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#FFD700',
  },
}));

interface LoaderProps {
  size?: number;
}

const GoldenTradingLoader: React.FC<LoaderProps> = ({ size = 80 }) => {
  const classes = useStyles();

  return (
    <div className={classes.loaderContainer}>
      <div className={classes.loader} style={{ width: size, height: size }}>
        <div className={classes.circle} />
        <DollarSign className={classes.icon} size={size / 2} />
      </div>
    </div>
  );
};

export default GoldenTradingLoader;