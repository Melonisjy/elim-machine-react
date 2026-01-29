import { useSearchParams } from "next/navigation";
import { InputFieldType } from "../types";
import useUpdateParams from "./searchParams/useUpdateParams";
import { useCallback, useMemo } from "react";

// 새 훅 예시 (개념 코드)
export default function useFilterChips<T extends Record<string, any>>({
    filterInfo,
    extraTextFilters,          // 예: [{ key: 'name', label: '이름' }, { key: 'placeName', label: '건물명' }]
    paramKeyMapper,            // 예: (k) => k === 'licenseName' ? 'licenseSeq' : k === 'engineerName' ? 'engineerSeq' : k
}: {
    filterInfo: Record<keyof T, InputFieldType>;
    extraTextFilters?: { key: string; label: string }[];
    paramKeyMapper?: (filterKey: string) => string;
}) {
    const searchParams = useSearchParams();
    const updateParams = useUpdateParams();

    const getParamKey = (filterKey: string) =>
        paramKeyMapper ? paramKeyMapper(filterKey) : filterKey;

    const activeFilters = useMemo(() => {
        const params = new URLSearchParams(searchParams);
        const result: Array<{ key: string; label: string; value: string; displayValue: string }> = [];

        Object.keys(filterInfo).forEach(filterKey => {
            const paramKey = getParamKey(filterKey);
            const filterValue = params.get(paramKey);
            if (!filterValue) return;

            const info = filterInfo[filterKey as keyof T];
            const label = info.label;

            if (info.type === 'multi') {
                filterValue.split(',').forEach(v => {
                    const option = info.options?.find(o => String(o.value) === v);
                    result.push({
                        key: filterKey,
                        label,
                        value: v,
                        displayValue: option ? option.label : v,
                    });
                });
            }
        });

        extraTextFilters?.forEach(({ key, label }) => {
            const v = params.get(key);
            if (v) {
                result.push({ key, label, value: v, displayValue: v });
            }
        });

        return result;
    }, [searchParams, filterInfo, extraTextFilters]);

    const removeFilter = useCallback(
        (filterKey: string, filterValue: string) => {
            updateParams(params => {
                // extra 텍스트 필터는 그대로 key 사용
                const isExtra = extraTextFilters?.some(e => e.key === filterKey);
                if (isExtra) {
                    params.delete(filterKey);
                    params.delete('page');
                    return;
                }

                const paramKey = getParamKey(filterKey);
                const currentValue = params.get(paramKey);
                if (!currentValue) return;

                const info = filterInfo[filterKey as keyof T];

                if (info?.type === 'multi') {
                    const values = currentValue.split(',').filter(v => v !== filterValue);
                    values.length > 0 ? params.set(paramKey, values.join(',')) : params.delete(paramKey);
                } else {
                    params.delete(paramKey);
                }

                params.delete('page');
            });
        },
        [updateParams, filterInfo, extraTextFilters]
    );

    return { activeFilters, removeFilter };
}