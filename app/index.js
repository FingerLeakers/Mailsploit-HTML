// Load application styles
import 'styles/index.scss';

// JS Libs
import anime from 'animejs';

// Polyfills
import 'whatwg-fetch';
import 'url-search-params';
import 'formdata-polyfill';

class DemoForm {
	constructor(form) {
		this.form = form;
		this.locked = false;
	}

	animationToComplete(options) {
		return new Promise(resolve => {
			anime({
				...options,
				complete: () => resolve(),
			});
		});
	}

	async submit(event) {
		event.preventDefault();
		event.stopPropagation();

		if (this.locked) {
			return;
		}
		this.locked = true;

		// Get datas out of it
		const data = new URLSearchParams();
		for (const pair of new FormData(this.form)) {
		    data.append(pair[0], pair[1]);
		}

		this.form.parentNode.style.display = 'block';
		this.animationToComplete({
			targets: this.form.parentNode,
			scale: .95,
			opacity: .7,
			duration: 1000,
		});

		let response;
		try {
			response = await fetch(this.form.action, {
				method: 'POST',
				body: data,
			});
		} catch (error) {
			return await this.finished({status: -1});
		}

		await this.finished(response);
	}

	async finished(response) {
		switch(response.status) {
			case 429:
			case -1:
				// Rate limited
				await this.showMessage('rate-limit');
				break;

			case 200:
				// Good!
				this.form.reset();
				await this.showMessage('success');
				break;

			default: // 500, 503, 403...
				// Unknown error
				await this.showMessage('error');
				break;
		}

		this.locked = false;
	}

	async showMessage(type) {
		const typeSelector = document.querySelector(`span.message.${type}`);

		typeSelector.style.display = 'block';
		await this.animationToComplete({
			targets: typeSelector,
			scale: [.75, 1],
			opacity: [0, 1],
			duration: 1000,
			translateX: ['-50%', '-50%'],
			translateY: ['-50%', '-50%'],
		});
		this.animationToComplete({
			targets: typeSelector,
			scale: [.75, 1].reverse(),
			opacity: [0, 1].reverse(),
			delay: 3000,
			duration: 500,
			translateX: ['-50%', '-50%'],
			translateY: ['-50%', '-50%'],
		});

		this.form.parentNode.style.display = 'block';
		await this.animationToComplete({
			targets: this.form.parentNode,
			scale: 1,
			opacity: 1,
			delay: 3000,
			duration: 1000,
		});

		typeSelector.style.display = 'none';
	}

	listen() {
		if (this.form.addEventListener) {
		    // Modern browsers
		    this.form.addEventListener('submit', (e) => this.submit(e), false);
		} else if(this.form.attachEvent) {
			// Old IE
		    this.form.attachEvent('onsubmit', (e) => this.submit(e));
		}
	}
}

new DemoForm(document.querySelector('form#demo-form')).listen();