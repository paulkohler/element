import { step, Until, By, TestSettings } from '@flood/element'
import assert from 'assert'

export const settings: TestSettings = {
	clearCache: false,
	disableCache: false,
	clearCookies: false,
	loopCount: 1,
	duration: 1,
	actionDelay: 2,
	stepDelay: 2,
	waitTimeout: 60,
	screenshotOnFailure: true,
}

const URL = 'https://the-internet.herokuapp.com'

export default () => {
	step('Test: Go to the Data Tables page', async (browser) => {
		await browser.visit(`${URL}/tables`)
		// Until.titleIs example
		await browser.wait(Until.titleIs('The Internet'))
	})

	step('Test: findElements example', async (browser) => {
		// ElementHandle.findElements(locator: Locator) example
		const tables = await browser.findElements(By.css('.tablesorter'))
		const table1Id = await tables[0].getProperty('id')
		const table2Id = await tables[1].getProperty('id')
		assert(table1Id === 'table1', 'The id of table 1 must be correct')
		assert(table2Id === 'table2', 'The id of table 2 must be correct')
	})

	step('Test: Do some sort action with tablesorter', async (browser) => {
		const table = By.id('table2')
		const tableEl = await browser.findElement(table)
		const headers = await tableEl.findElements(By.css('.header'))

		const rows = await tableEl.findElements(By.css('tbody tr'))
		const cellsOfFirstRow = await rows[0].findElements(By.tagName('td'))
		const lastName = await cellsOfFirstRow[0].text()
		const firstActionEdit = await rows[0].findElement(By.partialLinkText('edit'))
		const firstActionDelete = await rows[0].findElement(By.partialLinkText('delete'))

		await firstActionEdit.click()
		await browser.wait(Until.urlIs(`${URL}/tables#edit`))

		await firstActionDelete.click()
		await browser.wait(Until.urlIs(`${URL}/tables#delete`))

		await headers[0].click()

		// By.js() example
		const newFirstCell = await browser.findElement(
			By.js(() => {
				return document
					.getElementById('table2')
					.getElementsByTagName('tbody')[0]
					.getElementsByClassName('last-name')[0]
			})
		)

		// Until.elementTextDoesNotMatch example
		await browser.wait(Until.elementTextDoesNotMatch(newFirstCell, new RegExp(lastName)))
		const newLastName = await newFirstCell.text()

		assert(newLastName !== lastName, 'The new last name must be different from the old one.')
	})
}
