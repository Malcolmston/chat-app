
		async function getMarkdown() {
			let info = $.ajax({
				method: 'get',
				url: './README.md'
			})

			console.log(info)
			return info
		}

		function getMarkdownText(arg) {
			return marked(arg, { sanitize: true });
		}
