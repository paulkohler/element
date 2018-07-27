import { Locator } from '../Locator'
import { EvaluateFn } from 'puppeteer'

export class VisibleTextLocator extends Locator {
	constructor(public linkText: string, public partial: boolean = false) {
		super()
	}

	get pageFuncArgs(): any[] {
		return [this.linkText, this.partial]
	}

	get pageFunc(): EvaluateFn {
		return (targetText: string, partial: boolean = true) => {
			// TODO: Switch expressions if not partial
			let expression = `//*[contains(text(), '${targetText}')]`
			let node = document.evaluate(
				expression,
				document,
				null,
				XPathResult.FIRST_ORDERED_NODE_TYPE,
				null,
			).singleNodeValue

			if (node && node.nodeType === Node.ELEMENT_NODE) {
				let element: HTMLElement = node as HTMLElement
				const style = window.getComputedStyle(element)
				const isVisible = style && style.visibility !== 'hidden' && hasVisibleBoundingBox()

				if (isVisible) return node

				function hasVisibleBoundingBox() {
					const rect = element.getBoundingClientRect()
					return !!(rect.top || rect.bottom || rect.width || rect.height)
				}
			} else {
				return null
			}
		}
	}

	// TODO: Switch this to use Xpath
	get pageFuncMany(): EvaluateFn {
		return (targetText: string, partial: boolean) => {
			let elements = Array.from(document.querySelectorAll('*'))
			return elements
				.filter(link => {
					if (!link.textContent) return false
					let text = link.textContent.trim()
					return (partial && text.indexOf(targetText) !== -1) || text === targetText
				})
				.filter(node => {
					const style = window.getComputedStyle(node)
					const isVisible = style && style.visibility !== 'hidden' && hasVisibleBoundingBox()
					return isVisible

					function hasVisibleBoundingBox() {
						const rect = node.getBoundingClientRect()
						return !!(rect.top || rect.bottom || rect.width || rect.height)
					}
				})
		}
	}

	toString() {
		return `visible text "${this.linkText}"`
	}
}