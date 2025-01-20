'use client'

import { useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
/**
 * session storage에 userId를 초기화하는 컴포넌트
 * @returns null - 실제 렌더링되는 요소 없음
 */
const UserIdInitializer = () => {
  useEffect(() => {
    // session storage에 user id가 없는 경우에만 생성
    if (!sessionStorage.getItem('userId')) {
      const userId = uuidv4();
      sessionStorage.setItem('userId', userId);
    }

    // URL에서 ref parameter 확인
    const urlParams = new URLSearchParams(window.location.search);
    const refParam = urlParams.get('ref');
    
    // ref parameter가 있는 경우 referral 저장
    if (refParam) {
      sessionStorage.setItem('referral', refParam);
    }
  }, []);

  return null;
};

export default UserIdInitializer; 