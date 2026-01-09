import { addFilter } from '@wordpress/hooks';

addFilter( 'tasty_recipes_is_pro', 'tasty-recipes-pro/recipe-explorer', () => {
	return true;
} );
