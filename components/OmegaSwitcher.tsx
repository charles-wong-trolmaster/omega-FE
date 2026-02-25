import { ToggleButton, ToggleButtonGroup, ToggleButtonGroupProps } from '@mui/material';

interface SwitcherOption<T extends string> {
	label: string;
	value: T;
}

interface OmegaSwitcherProps<T extends string> extends Omit<ToggleButtonGroupProps, 'value' | 'onChange'> {
	options: SwitcherOption<T>[];
	value: T;
	onChange: (value: T) => void;
}

const OmegaSwitcher = <T extends string>({ options, value, onChange, ...rest }: OmegaSwitcherProps<T>) => {
	const handleChange = (_: React.MouseEvent<HTMLElement>, newValue: T) => {
		if (newValue !== null) onChange(newValue); 
	};

	return (
		<ToggleButtonGroup
			value={value}
			exclusive
			onChange={handleChange}
			{...rest}
			sx={{
				backgroundColor: '#1e2a38',
				borderRadius: '999px',
				padding: '4px',
				width: '100%',
				'& .MuiToggleButton-root': {
					border: 'none',
					borderRadius: '999px !important',
					color: '#fff',
					padding: '6px 24px',
					textTransform: 'none',
					flex: 1,
					'&.Mui-selected': {
						backgroundColor: '#2dd4bf',
						color: '#fff',
						'&:hover': {
							backgroundColor: '#2dd4bf'
						}
					}
				},
				...rest.sx
			}}
		>
			{options.map((option) => (
				<ToggleButton key={option.value} value={option.value}>
					{option.label}
				</ToggleButton>
			))}
		</ToggleButtonGroup>
	);
};

export default OmegaSwitcher;
