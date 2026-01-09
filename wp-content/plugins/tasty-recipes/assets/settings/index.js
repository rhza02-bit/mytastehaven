import { addFilter } from '@wordpress/hooks';
import { Design } from './tabs/Design';
import { InstacartButton } from './partials/InstacartButton';
import '../scss/settings.scss';

// Set pro mode.
addFilter( 'tasty_lock_is_pro', 'tasty-framework/is-pro', () => {
	return true;
} );

addFilter( 'tasty_recipes_is_pro', 'tasty-recipes/is-pro', () => {
	return true;
} );

// Add social footer to preview.
addFilter(
	'tasty_recipes_design_example_includes',
	'tasty-recipes/settings/design-example-includes',
	( includes, settings ) => {
		const settingsKeys = Object.keys( settings );

		if ( settingsKeys.includes( 'footer_social_platform' ) ) {
			includes.push( 'footer_social_platform' );
		}

		return includes;
	}
);

// Social Footer.
addFilter(
	'tasty_recipes_design_social_footer',
	'tasty-recipes/settings/social-footer',
	Design
);

// Default Template Colors.
addFilter(
	'tasty_recipes_default_template_colors',
	'tasty-recipes/settings/default-template-colors',
	( colors, template ) => {
		if ( 'bold' === template ) {
			return {
				...colors,
				primary_color: '#666677',
				icon_color: '#FFFFFF',
				detail_label_color: '#B7BBC6',
				detail_value_color: '#FFFFFF',
				h2_color: '#FFFFFF',
				h3_color: '#979599',
				footer_heading_color: '#FFFFFF',
				footer_description_color: '#FFFFFF',
				footer_icon_color: '#FFFFFF',
			};
		}
		const isWhite = template === 'bold' || template === 'snap';

		return {
			...colors,
			secondary_color:
				template === 'modern-compact'
					? '#EDEDED'
					: colors.secondary_color,
			footer_heading_color: isWhite ? '#FFFFFF' : '#000000',
			footer_description_color: isWhite ? '#FFFFFF' : '#000000',
			footer_icon_color: isWhite ? '#FFFFFF' : '#000000',
		};
	}
);

addFilter(
	'tasty_recipes_instacart_button',
	'tasty-recipes-pro/settings/instacart-button',
	InstacartButton
);
