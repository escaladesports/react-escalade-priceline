import React, { Component } from 'react'
import { Price, Stock, PriceAndStock, PrefetchPriceAndStock } from '../module'

export default class Test extends Component {
	constructor(props) {
		super(props)
		this.state = {
			id: `b6101w-fake`,
		}
	}
	componentDidMount() {
		setTimeout(() => {
			this.setState({
				id: `b8301w`,
			})
		}, 2 * 1000)
	}
	render() {
		return (
			<div>
				<PriceAndStock site='goalrilla' id={this.state.id}>
					{({ stock, price, loading }) => {
						if (loading) return <div>loading</div>
						return (
							<div>
								<div>Price: {price ? price : `No price found`}</div>
								<div>Stock: {stock}</div>
							</div>
						)
					}}
				</PriceAndStock>
			</div>
		)
	}
}