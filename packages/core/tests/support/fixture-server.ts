import express from 'express'
import { resolve } from 'path'
import { createServer } from 'http'
import listen from 'test-listen'

const dogfoodRoot = resolve(__dirname, '../../../../extern/dogfood')

export async function serve(filename: string): Promise<string> {
	const srv = express()
	srv.use(express.static(resolve(dogfoodRoot, 'dockerfiles/watirspec/html')))
	const url = await listen(createServer(srv))

	return `${url}/${filename}`
}
