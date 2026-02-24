import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Checkbox, CheckboxProps, FormControlLabel, styled } from '@mui/material';
import { ReactNode } from 'react';

const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
    color: '#ffffff',
    '&.Mui-checked': {
        color: '#ffffff'
    },
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
    }
}));

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
    color: '#ffffff',
    '& .MuiFormControlLabel-label': {
        fontSize: '0.9rem'
    }
}));

type OmegaCheckboxProps = CheckboxProps & {
    label?: ReactNode;
};

export default function OmegaCheckbox({ label, ...props }: OmegaCheckboxProps) {
    return (
        <StyledFormControlLabel
            control={
                <StyledCheckbox
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<CheckCircleIcon />}
                    {...props}
                />
            }
            label={label ?? ''}
        />
    );
}