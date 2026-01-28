/**
 * 숫자를 소수점 2자리까지 포맷팅합니다.
 * @param value 포맷팅할 숫자
 * @returns 포맷팅된 문자열 (예: "1,234.56")
 */
export const formatNumber = (value: number) =>
    new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value)