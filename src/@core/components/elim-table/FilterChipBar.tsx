import { Button, Chip } from "@mui/material";
import { Box } from "@mui/system";
import { IconReload } from "@tabler/icons-react";

type FilterChipBarProps = {
    activeFilters: Array<{ key: string; label: string; value: string; displayValue: string }>;
    removeFilter: (key: string, value: string) => void;
    onReset: () => void;  // 페이지마다 다른 resetQueryParams를 그대로 넘김
    disabled?: boolean;
};

export default function FilterChipBar({ activeFilters, removeFilter, onReset, disabled }: FilterChipBarProps) {
    if (activeFilters.length === 0) return null;

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 6, pb: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {activeFilters.map((filter, index) => (
                    <Chip
                        key={`${filter.key}-${filter.value}-${index}`}
                        label={`${filter.label}: ${filter.displayValue}`}
                        onDelete={() => removeFilter(filter.key, filter.value)}
                        color='primary'
                        variant='outlined'
                        size='small'
                    />
                ))}
            </Box>
            <Button
                startIcon={<IconReload />}
                onClick={onReset}
                size='small'
                disabled={disabled}
            >
                필터 초기화
            </Button>
        </Box>
    );
}