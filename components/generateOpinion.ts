import { debounce } from 'lodash';

/**
 * 원하는 미래와 탄핵 사유를 바탕으로 의견을 생성합니다.
 * @param wannabe 원하는 미래
 * @param reason 탄핵 사유
 * @returns 의견
 */
export const generateOpinion = async (
    wannabe: string,
    reason: string,
    name: string,
    address: string,
    birth: string,
    gender: string,
  ) => {
    const response = await fetch('/api/generate-opinion', {
      method: 'POST',
      body: JSON.stringify({ id: 1, name, address, birth, gender, wannabe, reason }),
    });

    const data = await response.json();
    return data.response;
  }