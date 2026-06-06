import { useEffect } from 'react';
import { COMPANY_NAME } from '@/lib/constants';

const usePageTitle = (title?: string) => {
  useEffect(() => {
    document.title = title ? `${title} | ${COMPANY_NAME}` : COMPANY_NAME;
    return () => { document.title = COMPANY_NAME; };
  }, [title]);
};

export default usePageTitle;
