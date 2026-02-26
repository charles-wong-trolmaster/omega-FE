import { ToggleButton, ToggleButtonGroup, ToggleButtonGroupProps } from '@mui/material';

interface ToggleButtonGroupOption<T extends string> {
	label: string;
	value: T;
}

interface OmegaSwitcherProps<T extends string> extends Omit<ToggleButtonGroupProps, 'value' | 'onChange'> {
	options: ToggleButtonGroupOption<T>[];
	value: T;
	onChange: (value: T) => void;
}

const OmegaToggleButtonGroup = <T extends string>({ options, value, onChange, ...rest }: OmegaSwitcherProps<T>) => {
	const handleChange = (_: React.MouseEvent<HTMLElement>, newValue: T) => {
		if (newValue !== null) onChange(newValue);
	};

	return (
		<ToggleButtonGroup value={value} onChange={handleChange} {...rest}>
			{options.map((option) => (
				<ToggleButton key={option.value} value={option.value}>
					{option.label}
				</ToggleButton>
			))}
		</ToggleButtonGroup>
	);
};

export default OmegaToggleButtonGroup;
