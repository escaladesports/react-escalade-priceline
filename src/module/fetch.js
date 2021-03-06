import fetch from 'isomorphic-fetch'

async function fetchMethod(options) {
	if (!options.site) {
		console.log(`Warning: No site option set.`)
	}
	let ids = []
	if (options.ids) {
		ids.push(...options.ids)
	}
	if (options.id) {
		ids.push(options.id)
	}
	if (!ids.length) {
		return
	}
	// Fetch data
	let body = JSON.stringify({
		skus: ids,
	})

	const fetchObj = {
		headers: {
			'ESC-API-Context': options.site,
		},
		method: `POST`,
		body,
	}

	if(options.debug){
		console.log(`Options sent through priceline: `, JSON.stringify(options, null, 2))
		console.log(`Ids being sent: `, JSON.stringify(ids, null, 2))
		console.log(`Fetch Object: `, JSON.stringify(fetchObj, null, 2))
	}

	let res = await fetch(options.endpoint, fetchObj)

	try {
		res = await res.json()
	} catch(e){
		console.log(`res.json() error: `, e, await res.text())
	}

	if(options.debug){
		console.log(`fetch response from priceline: `, res)
	}

	if (`inventory` in res) {
		res = extractStock(res, ids)
	}
	if(`prices` in res){
		res = extractPrices(res, ids)
	}
	this.setState(res)

	// Repoll interval
	if (typeof window === `object`) {
		clearTimeout(this.timeout)
		this.timeout = setTimeout(() => {
			this.fetch({
				...options,
				ids: Object.keys(this.state),
			})
		}, 60 * 1000)
	}
}

function extractStock(res, ids) {
	let newRes = {}
	res = res.inventory || {}
	for(let i = ids.length; i--;){
		const id = ids[i].toUpperCase()
		if (id in res) {
			newRes[id.toLowerCase()] = res[id].stock
		}
		else{
			newRes[id.toLowerCase()] = 0
		}
	}
	return newRes
}
function extractPrices(res, ids) {
	let newRes = {}
	res = res.prices || {}
	for (let i = ids.length; i--;) {
		const id = ids[i].toUpperCase()
		if (id in res) {
			newRes[id.toLowerCase()] = Number(res[id].price)
		}
		else {
			newRes[id.toLowerCase()] = false
		}
	}
	return newRes
}

export default fetchMethod
