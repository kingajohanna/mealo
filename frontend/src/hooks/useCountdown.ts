import moment from 'moment';
import { useEffect, useState } from 'react';

const useCountdown = (targetDate: moment.Moment) => {
  if (!targetDate) return [0];
  const [countDown, setCountDown] = useState(targetDate.diff(moment(), 'seconds'));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(targetDate.diff(moment(), 'seconds'));
    }, 1000);

    return () => clearInterval(interval);
  }, [countDown]);

  return [countDown];
};

export { useCountdown };
