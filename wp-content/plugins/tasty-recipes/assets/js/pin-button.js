const sharePinButtons = document.getElementsByClassName( 'share-pin button' );

Array.from( sharePinButtons ).forEach( ( sharePinButton ) => {
	sharePinButton.addEventListener( 'click', ( e ) => {
		// If the SVG was clicked, we need to get the href from the parent element.
		const href =
			e.target.dataset.href ??
			e.target.parentNode.parentNode.dataset.href;

		try {
			window.open(
				href,
				'targetWindow',
				'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=500,height=500'
			);
		} catch ( error ) {
			window.location.href = href;
		}
	} );
} );
